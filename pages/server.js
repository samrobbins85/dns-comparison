import Head from "next/head";
import NavBar from "../components/navbar";
import Papa from "papaparse";
import { useState } from "react";
export default function Server() {
	const [fileName, setFileName] = useState("Select a File");
	function FileChange(event) {
		setFileName(event.target.files[0].name);
		Papa.parse(event.target.files[0], {
			complete: function (results) {
				console.log(results);
			},
		});
	}
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
					<label class="w-64 flex flex-col items-center px-2 py-2 bg-white text-gray-800 rounded-lg shadow  border border-gray-300 cursor-pointer hover:bg-gray-200">
						<svg
							className="w-8 h-8"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
						>
							<path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
						</svg>
						<span class="mt-2 text-base leading-normal">
							{fileName}
						</span>
						<input
							type="file"
							class="hidden"
							onChange={FileChange}
						/>
					</label>
				</div>
			</div>
		</>
	);
}
