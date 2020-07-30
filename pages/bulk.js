import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import NavBar from "../components/navbar";
const Table = dynamic(() => import("../components/table"));
import axios from "axios";
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar));

export default function Bulk() {
	const [file, setFile] = useState(false);
	const [filepresent, setFilepresent] = useState(false);
	const [cf, setCF] = useState([""]);
	const [fileName, setFileName] = useState(false);
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
		console.log(file);
		if (file) {
			var requests = [];
			file.forEach((domain) => {
				requests.push(
					axios.get(
						`https://Cloudflare-dns.com/dns-query?ct=application/dns-json&type=AAAA&name=${domain}`
					),
					axios.get(`https://dns.google/resolve?name=${domain}`),
					axios.get(
						`https://dns.quad9.net:5053/dns-query?name=${domain}`
					)
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
							let img_output = responses.map(function (response) {
								if (response.data.Status === 0) {
									return (
										<img
											src="/available.svg"
											className="block ml-auto mr-auto"
											alt="Available"
										/>
									);
								} else {
									return (
										<img
											src="/not_available.svg"
											className="block ml-auto mr-auto"
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
			fetchData();
		}
	}, [file]);

	const columns = React.useMemo(
		() => [
			{
				Header: "Domain",
				className: "w-1/4 p-2 border border-gray-500 border-solid",
				accessor: "domain", // accessor is the "key" in the data
			},

			{
				Header: "Cloudflare",
				className: "w-1/12 p-2 border border-gray-500 border-solid",
				accessor: "cloudflare",
			},

			{
				Header: "Google",
				className: "w-1/12 p-2 border border-gray-500 border-solid",
				accessor: "google",
			},

			{
				Header: "Quad9",
				className: "w-1/12 p-2 border border-gray-500 border-solid",
				accessor: "Quad9",
			},
		],

		[]
	);

	function FileChange(event) {
		setFilepresent(true);
		var file = event.target.files[0];
		console.log(file.name);
		setFileName(file.name);
		var reader = new FileReader();
		reader.onload = function (event) {
			setFile(
				event.target.result.split(/r?\n/).filter(function (e) {
					return e;
				})
			);
		};
		reader.readAsText(file);
	}

	const scale = {
		maintainAspectRatio: true,
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
				<meta
					name="Description"
					content="A tool to compare DNS Services"
				/>
			</Head>
			<div className="flex flex-col h-screen bg-white">
				<NavBar />
				<main className="flex-grow p-8">
					<h1 className="text-5xl font-bold text-center title">
						Bulk Comparison
					</h1>

					<p className="text-xl text-center text-gray-700 description">
						Process a File using the button below
					</p>
					<p className="text-center text-gray-700 mb-6">
						These files are not uploaded, they stay on your computer
						and are processed in the browser
					</p>
					{/* <form className="flex justify-center text-center">
						<input type="file" id="input" onChange={FileChange} />
					</form> */}
					<div className="flex justify-center">
						<label class="w-64 flex flex-col items-center px-2 py-2 bg-white text-gray-800 rounded-lg shadow  border border-gray-300 cursor-pointer hover:bg-gray-200">
							<svg
								class="w-8 h-8"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
							>
								<path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
							</svg>
							<span class="mt-2 text-base leading-normal">
								{fileName ? fileName : "Select a file"}
							</span>
							<input
								type="file"
								class="hidden"
								onChange={FileChange}
							/>
						</label>
					</div>
					{filepresent && (
						<>
							<div className="flex justify-center overflow-auto">
								<div className="container">
									<h2>Number of blocks comparison</h2>
									<Bar data={chart} options={scale} />
								</div>
							</div>
							<Table columns={columns} data={cf} />{" "}
						</>
					)}
				</main>
			</div>
		</>
	);
}
