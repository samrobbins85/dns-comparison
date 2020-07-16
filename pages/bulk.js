import React, { useState } from "react";
import useSWR from "swr";
import Head from "next/head";
import NavBar from "../components/navbar";
import { useTable } from "react-table";
function FetchDomain(props) {
  if (props.domain === "") {
    return "";
  }
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(props.resolver + props.domain, fetcher);
  if (!data || error)
    return <img src="./loading.svg" alt="Loading" className="logo" />;
  if (data.Status === 0) {
    return <img src="./available.svg" alt="Available" className="logo" />;
  } else {
    return (
      <img src="./not_available.svg" alt="Not Available" className="logo" />
    );
  }
}

function DomainResult(props) {
  return (
    <>
      <div>{props.domain}</div>
      <div>
        <FetchDomain
          resolver="https://Cloudflare-dns.com/dns-query?ct=application/dns-json&type=A&name="
          domain={props.domain}
        />
      </div>
      <div>
        <FetchDomain
          resolver="https://dns.google/resolve?name="
          domain={props.domain}
        />
      </div>
      <div>
        <FetchDomain
          resolver="https://dns.quad9.net:5053/dns-query?name="
          domain={props.domain}
        />
      </div>
    </>
  );
}

export default function Bulk() {
  const data = React.useMemo(
    () => [
      {
        domain: "Hello",

        cloudflare: "World",
      },

      {
        domain: "react-table",

        cloudflare: "rocks",
      },

      {
        domain: "whatever",

        cloudflare: "you want",
      },
    ],

    []
  );

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

  const {
    getTableProps,

    getTableBodyProps,

    headerGroups,

    rows,

    prepareRow,
  } = useTable({ columns, data });

  const [file, setFile] = useState([""]);

  function FileChange(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      console.log("First log");
      setFile(
        event.target.result.split(/r?\n/).filter(function (e) {
          return e;
        })
      );
      console.log(event.target.result.split(/r?\n/));
    };
    // console.log("Second log");
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
          <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-4 pt-4 container">
              <div>Domain</div>
              <div>Cloudflare</div>
              <div>Google</div>
              <div>Quad9</div>
              {file.map((domain) => (
                <DomainResult domain={domain} key={domain} />
              ))}
            </div>
          </div>
          <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      style={{
                        borderBottom: "solid 3px red",

                        background: "aliceblue",

                        color: "black",

                        fontWeight: "bold",
                      }}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);

                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            padding: "10px",

                            border: "solid 1px gray",

                            background: "papayawhip",
                          }}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
      </div>
    </>
  );
}
