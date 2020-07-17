import React, { useState } from "react";
import useSWR from "swr";
import Head from "next/head";
import NavBar from "../components/navbar";
import Table from "../components/table";
function FetchDomain(props) {
  if (props.domain === "") {
    return "";
  }
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(props.resolver + props.domain, fetcher);
  if (!data || error) return "Loading";
  if (data.Status === 0) {
    return "Available";
  } else {
    return "Not Available";
  }
}

export default function Bulk() {
  const [file, setFile] = useState([""]);

  function fetchDomains() {
    var output = [];
    file.forEach((element) => {
      output.push({
        domain: element,
        cloudflare: (
          <FetchDomain
            domain={element}
            resolver={
              "https://Cloudflare-dns.com/dns-query?ct=application/dns-json&type=AAAA&name="
            }
          />
        ),
        google: (
          <FetchDomain
            domain={element}
            resolver={"https://dns.google/resolve?name="}
          />
        ),
        Quad9: (
          <FetchDomain
            domain={element}
            resolver={"https://dns.quad9.net:5053/dns-query?name="}
          />
        ),
      });
    });
    console.log(output);

    return output;
  }

  const data = React.useMemo(() => fetchDomains());

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

  return (
    <>
      <Head>
        <title>Bulk Upload | DNS Comparison</title>
        <link
          rel="icon"
          href="https://www.globalcyberalliance.org/wp-content/uploads/favicon.png"
        />
      </Head>
      <div className="bg-white flex flex-col h-screen">
        <NavBar />
        <main className="flex-grow p-8">
          <h1 className="title text-center text-5xl font-bold">
            DNS Comparison
          </h1>

          <p className="description text-center text-xl text-gray-700 mb-6">
            Upload a File using the button below
          </p>
          <form className="text-center flex justify-center">
            <input type="file" id="input" onChange={FileChange} />
          </form>
          <Table columns={columns} data={data} />
        </main>
      </div>
    </>
  );
}
