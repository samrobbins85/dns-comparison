import React, { useState } from "react";

export default function Bulk() {
  const [file, setFile] = useState([""]);

  function FileChange(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      console.log("First log");
      setFile(event.target.result.split(/r?\n/));
      console.log(event.target.result.split(/r?\n/));
    };
    // console.log("Second log");
    reader.readAsText(file);
  }

  return (
    <div className="bg-white flex flex-col h-screen">
      <main className="flex-grow mx-auto p-8">
        <h1 className="title text-center text-5xl font-bold">DNS Comparison</h1>

        <p className="description text-center text-xl text-gray-700 mb-6">
          Upload a URL using the button below
        </p>
        <form className="text-center flex justify-center">
          <input type="file" id="input" onChange={FileChange} />
        </form>
        <ul>
          {file.map((domain) => (
            <li key={domain}>{domain}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}
