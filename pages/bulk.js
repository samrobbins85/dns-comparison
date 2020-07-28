import React, { useState, useEffect } from "react";
import Head from "next/head";
import NavBar from "../components/navbar";
import Table from "../components/table";
import axios from "axios";
import { Bar } from "react-chartjs-2";

export default function Bulk() {
	const [file, setFile] = useState([""]);
	const [cf, setCF] = useState([""]);
	const [chart, setChart] = useState({
		labels: ["Cloudflare", "Google", "Quad9"],

		datasets: [
			{
				label: "Blocks",
				backgroundColor: "rgba(255,99,132,0.2)",
				borderColor: "rgba(255,99,132,1)",
				borderWidth: 1,
				hoverBackgroundColor: "rgba(255,99,132,0.4)",
				hoverBorderColor: "rgba(255,99,132,1)",
				data: [0, 0, 0],
			},
		],
	});

	useEffect(() => {
		var requests = [];
		file.forEach((domain) => {
			requests.push(
				axios.get(
					`https://Cloudflare-dns.com/dns-query?ct=application/dns-json&type=AAAA&name=${domain}`
				),
				axios.get(`https://dns.google/resolve?name=${domain}`),
				axios.get(`https://dns.quad9.net:5053/dns-query?name=${domain}`)
			);
		});
		const fetchData = async () => {
			axios
				.all(requests)
				.then(
					axios.spread((...responses) => {
						var data = [];
						var i;
						var quad1 = 0;
						var quad8 = 0;
						var quad9 = 0;
						// let output = responses.map(function (response) {
						// 	if (response.data.Status === 0) {
						// 		return "Resolved";
						// 	} else {
						// 		return "Blocked";
						// 	}
						// });
						let img_output = responses.map(function (response) {
							if (response.data.Status === 0) {
								return (
									<img src="/available.svg" alt="Available" />
								);
							} else {
								return (
									<img
										src="/not_available.svg"
										alt="Not Available"
									/>
								);
							}
						});
						for (i = 0; i < responses.length; i += 3) {
							if (responses[i].data.Status !== 0) {
								quad1++;
							}
							if (responses[i + 1].data.Status !== 0) {
								quad8++;
							}
							if (responses[i + 2].data.Status !== 0) {
								quad9++;
							}
							data.push({
								domain: file[i / 3],
								cloudflare: img_output[i],
								google: img_output[i + 1],
								Quad9: img_output[i + 2],
							});
						}
						setCF(data);
						let old = { ...chart };
						old.datasets[0].data = [quad1, quad8, quad9];
						setChart(old);
					})
				)
				.catch(() => {
					setCF([]);
				});
		};
		console.log("Start fetching data");
		fetchData();
		console.log(cf);
	}, [file]);

	const columns = React.useMemo(
		() => [
			{
				Header: "Domain",

				accessor: "domain", // accessor is the "key" in the data
			},

			{
				Header: "Cloudflare",

				accessor: "cloudflare",
			},

			{
				Header: "Google",

				accessor: "google",
			},

			{
				Header: "Quad9",

				accessor: "Quad9",
			},
		],

		[]
	);

	function FileChange(event) {
		var file = event.target.files[0];
		var reader = new FileReader();
		reader.onload = function (event) {
			setFile(
				event.target.result.split(/r?\n/).filter(function (e) {
					return e;
				})
			);
			console.log(event.target.result.split(/r?\n/));
		};
		reader.readAsText(file);
	}

	const scale = {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	};
	return (
		<>
			<Head>
				<title>Bulk Upload | DNS Comparison</title>
				<link
					rel="icon"
					href="https://www.globalcyberalliance.org/wp-content/uploads/favicon.png"
				/>
			</Head>
			<div className="flex flex-col h-screen bg-white">
				<NavBar />
				<main className="flex-grow p-8">
					<h1 className="text-5xl font-bold text-center title">
						DNS Comparison
					</h1>

					<p className="mb-6 text-xl text-center text-gray-700 description">
						Upload a File using the button below
					</p>
					<form className="flex justify-center text-center">
						<input type="file" id="input" onChange={FileChange} />
					</form>
					<div className="flex justify-center">
						<div className="container">
							<h2>Number of blocks comparison</h2>
							<Bar
								data={chart}
								width={100}
								height={20}
								options={scale}
							/>
						</div>
					</div>
					<Table columns={columns} data={cf} />
				</main>
			</div>
		</>
	);
}
