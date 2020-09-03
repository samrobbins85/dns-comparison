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

	useEffect(() => {
		if (fileOutput) {
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
				<div className="text-center pt-10 text-lg">
					<h2>Total number of domains:</h2>
					<span className="font-semibold text-xl">
						{fileOutput && fileOutput.data[0][1]}
					</span>
					{fileOutput && (
						<div className="container mx-auto">
							<Bar data={chart} options={scale} height={100} />
						</div>
					)}
				</div>
			</div>
		</>
	);
}
