import React, { useState, useEffect } from "react";
import Head from "next/head";
import NavBar from "../components/navbar";
import Table from "../components/table";
import axios from "axios";
import { Bar } from "react-chartjs-2";

export default function Bulk() {
  const [file, setFile] = useState([""]);
  const [cf, setCF] = useState([""]);

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
            for (i = 0; i < responses.length; i += 3) {
              data.push({
                domain: file[i / 3],
                cloudflare: responses[i].data.Status,
                google: responses[i + 1].data.Status,
                Quad9: responses[i + 2].data.Status,
              });
            }
            setCF(data);
          })
        )
        .catch((errors) => {
          setCF([]);
        });
    };

    fetchData();
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

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
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
          <div>
            <h2>Bar Example (custom size)</h2>
            <Bar
              data={data}
              width={100}
              height={20}
              options={{
                maintainAspectRatio: true,
              }}
            />
          </div>
          <Table columns={columns} data={cf} />
        </main>
      </div>
    </>
  );
}
