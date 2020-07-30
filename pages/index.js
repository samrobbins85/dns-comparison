import Head from "next/head";
import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import axios from "axios";
import PropTypes from "prop-types";
export default function Home() {
	const [domain, setDomain] = useState("");
	const [result, setResult] = useState("");
	function handleChange(event) {
		var domain;
		try {
			domain = new URL(event.target.value).hostname;
		} catch {
			try {
				domain = new URL("https://" + event.target.value).hostname;
			} catch {
				domain = event.target.value;
			}
		}
		setDomain(domain);
	}

	function Provider(props) {
		var icon;
		if (result[props.index] === 0) {
			icon = "/available.svg";
		} else {
			icon = "/not_available.svg";
		}
		return (
			<>
				<div className="grid grid-cols-2 gap-4 pt-6">
					<div className="flex justify-center">
						<img
							className="h-12"
							src={props.logo}
							alt="Company Logo"
						/>
					</div>
					<div className="flex justify-center text-center">
						<img src={icon} alt="status" />
					</div>
				</div>
				<hr className="mt-4" />
			</>
		);
	}
	Provider.propTypes = {
		index: PropTypes.string.isRequired,
		logo: PropTypes.string.isRequired,
	};

	useEffect(() => {
		const cloudflare = axios.get(
			`https://Cloudflare-dns.com/dns-query?ct=application/dns-json&type=AAAA&name=${domain}`
		);
		const google = axios.get(`https://dns.google/resolve?name=${domain}`);
		const quad9 = axios.get(
			`https://dns.quad9.net:5053/dns-query?name=${domain}`
		);
		const fetchData = async () => {
			axios
				.all([cloudflare, google, quad9])
				.then(
					axios.spread((...responses) => {
						const responseOne = responses[0];
						const responseTwo = responses[1];
						const responesThree = responses[2];
						setResult([
							responseOne.data.Status,
							responseTwo.data.Status,
							responesThree.data.Status,
						]);
					})
				)
				.catch(() => {
					setResult([-1, -1, -1]);
				});
		};

		fetchData();
	}, [domain]);

	return (
		<div className="flex flex-col h-screen bg-white">
			<NavBar />
			<Head>
				<title>DNS Comparison</title>
				<link
					rel="icon"
					href="https://www.globalcyberalliance.org/wp-content/uploads/favicon.png"
				/>
				<meta
					name="Description"
					content="A tool to compare DNS Services"
				/>
			</Head>

			<main className="flex-grow p-8 mx-auto">
				<h1 className="text-5xl font-bold text-center title">
					DNS Comparison
				</h1>

				<p className="mb-6 text-xl text-center text-gray-700 description">
					Enter a domain in the textbox below to compare it on
					different DNS providers
				</p>

				<form className="text-center">
					<input
						className={
							"bg-gray-200 appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white "
						}
						type="text"
						aria-label="Enter a domain to compare"
						onChange={handleChange}
					/>
				</form>

				<Provider index="0" logo="./cloudflare.svg" />
				<Provider index="1" logo="./google.svg" />
				<Provider index="2" logo="./quad9.svg" />
			</main>
		</div>
	);
}
