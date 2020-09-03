import Head from "next/head";
import NavBar from "../components/navbar";
import Papa from "papaparse";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar));

export default function Server() {
	const [fileName, setFileName] = useState("Select a File");
	const [fileOutput, setFileOutput] = useState(false);
	const [sources, setSources] = useState(false);
	const [source, setSource] = useState(0);
	const [tlds, setTlds] = useState(false);
	const [tld, setTld] = useState(0);
	const [chart, setChart] = useState({
		labels: [
			"Quad 9",
			"Quad 9 Noblock",
			"Google",
			"Cloudflare Safe",
			"Cloudflare",
			"OpenDNS",
			"Ultra Recursive",
		],

		datasets: [
			{
				label: "Blocks",
				backgroundColor: "rgba(255,99,132,0.2)",
				borderColor: "rgba(255,99,132,1)",
				borderWidth: 1,
				hoverBackgroundColor: "rgba(255,99,132,0.4)",
				hoverBorderColor: "rgba(255,99,132,1)",
				data: [0, 0, 0, 0, 0, 0, 0],
			},
		],
	});

	const [sourcechart, setSourceChart] = useState({
		labels: [
			"Quad 9",
			"Quad 9 Noblock",
			"Google",
			"Cloudflare Safe",
			"Cloudflare",
			"OpenDNS",
			"Ultra Recursive",
		],

		datasets: [
			{
				label: "Blocks",
				backgroundColor: "rgba(79,209,197,0.3)",
				borderColor: "rgba(79,209,197,1)",
				borderWidth: 1,
				hoverBackgroundColor: "rgba(79,209,197,0.4)",
				hoverBorderColor: "rgba(79,209,197,1)",
				data: [0, 0, 0, 0, 0, 0, 0],
			},
		],
	});
	const [tldchart, setTldChart] = useState({
		labels: [
			"Quad 9",
			"Quad 9 Noblock",
			"Google",
			"Cloudflare Safe",
			"Cloudflare",
			"OpenDNS",
			"Ultra Recursive",
		],

		datasets: [
			{
				label: "Blocks",
				backgroundColor: "rgba(183,148,244,0.3)",
				borderColor: "rgba(183,148,244,1)",
				borderWidth: 1,
				hoverBackgroundColor: "rgba(183,148,244,0.4)",
				hoverBorderColor: "rgba(183,148,244,1)",
				data: [0, 0, 0, 0, 0, 0, 0],
			},
		],
	});

	useEffect(() => {
		if (sources) {
			let initial = { ...sourcechart };
			initial.datasets[0].data = sources[source].slice(2);
			setSourceChart(initial);
		}
	}, [source]);

	useEffect(() => {
		if (tlds) {
			let initial = { ...tldchart };
			initial.datasets[0].data = tlds[tld].slice(2);
			setTldChart(initial);
		}
	}, [tld]);

	useEffect(() => {
		if (fileOutput) {
			console.log(fileOutput);
			var indexes = fileOutput.data.reduce(
				(m, e, i) => (e[0] === "" && m.push(i), m),
				[]
			);
			const allsources = fileOutput.data.slice(
				indexes[0] + 3,
				indexes[1]
			);
			setSources(allsources);
			let initial_sources = { ...sourcechart };
			initial_sources.datasets[0].data = allsources[0].slice(2);
			setSourceChart(initial_sources);

			const alltlds = fileOutput.data.slice(indexes[1] + 3, indexes[2]);
			setTlds(alltlds);
			let initial_tlds = { ...tldchart };
			initial_tlds.datasets[0].data = alltlds[0].slice(2);
			setTldChart(initial_tlds);

			let base = { ...chart };
			base.datasets[0].data = [
				fileOutput.data[1][1],
				fileOutput.data[2][1],
				fileOutput.data[3][1],
				fileOutput.data[4][1],
				fileOutput.data[5][1],
				fileOutput.data[6][1],
				fileOutput.data[7][1],
			];
			setChart(base);
		}
	}, [fileOutput]);

	function FileChange(event) {
		setFileName(event.target.files[0].name);
		Papa.parse(event.target.files[0], {
			complete: function (results) {
				setFileOutput(results);
			},
		});
	}

	function test_files() {
		setTld(0);
		setSource(0);
		Papa.parse("/output_results_31_08.csv", {
			download: true,
			complete: function (results) {
				setFileOutput(results);
			},
		});
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
				<title>Server Generated Results| DNS Comparison</title>
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
				<h1 className="text-center text-4xl font-semibold pt-10">
					Server Generated Results
				</h1>
				<div className="flex justify-center">
					<label className="w-64 flex flex-col items-center px-2 py-2 bg-white text-gray-800 rounded-lg shadow  border border-gray-300 cursor-pointer hover:bg-gray-200">
						<svg
							className="w-8 h-8"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
						>
							<path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
						</svg>
						<span className="mt-2 text-base leading-normal">
							{fileName}
						</span>
						<input
							type="file"
							className="hidden"
							onChange={FileChange}
						/>
					</label>
				</div>
				<div className="flex justify-center pt-4">
					<button
						className="p-2 border border-gray-300 w-1/6"
						onClick={test_files}
					>
						Get generated sample
					</button>
				</div>
				{fileOutput && (
					<div className="text-center pt-10 text-lg">
						<h2>Total number of domains:</h2>
						<span className="font-semibold text-xl">
							{fileOutput && fileOutput.data[0][1]}
						</span>

						{sources && (
							<>
								<h2 className="text-xl py-5 font-semibold">
									Comparison by data source:
								</h2>
								<select
									className="form-select"
									value={source}
									onChange={(event) =>
										setSource(event.target.value)
									}
								>
									{sources.map((source, index) => (
										<option value={index}>
											{source[0]}
										</option>
									))}
								</select>
								<h3 className="py-2">
									Total number of sources:{" "}
									{sources[source][1]}
								</h3>
								<div className="container mx-auto">
									<Bar
										data={sourcechart}
										options={scale}
										height={100}
									/>
								</div>
							</>
						)}
						{tlds && (
							<>
								<h2 className="text-xl py-5 font-semibold">
									Comparison by TLD:
								</h2>
								<select
									className="form-select"
									value={tld}
									onChange={(event) =>
										setTld(event.target.value)
									}
								>
									{tlds.map((tld, index) => (
										<option value={index}>{tld[0]}</option>
									))}
								</select>
								<h3 className="py-2">
									Total number of domains: {tlds[tld][1]}
								</h3>

								<div className="container mx-auto">
									<Bar
										data={tldchart}
										options={scale}
										height={100}
									/>
								</div>
							</>
						)}
					</div>
				)}
			</div>
		</>
	);
}
