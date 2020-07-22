import Head from "next/head";
import useSWR from "swr";
import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import axios from 'axios';
const isValidDomain = require("is-valid-domain");
export default function Home() {
  const [url, setURL] = useState("");
  const [domain, setDomain] = useState("");
  const [textbox, setTextbox] = useState(false);
  const [showstatus, setShowstatus] = useState(false);
  const [result, setResult] = useState("");

  function handleChange(event) {
    setURL(event.target.value);
  }

  // const fetcher = (...args) => fetch(...args).then((res) => res.json());
  // async function Profile(props) {
  //   try {
  //     setDomain(new URL(url).hostname);
  //   } catch {
  //     try {
  //       setDomain(new URL("https://" + url).hostname);
  //     } catch {
  //       setDomain(url);
  //     }
  //   }

  //   var icon = "./loading.svg";
  //   if (!isValidDomain(domain)) {
  //     setShowstatus(false);
  //     if (domain === "") {
  //       setTextbox(false);
  //     } else {
  //       setTextbox(true);
  //     }
  //   } else {
  //     setTextbox(false);

  //       // const { data, error } = useSWR(props.resolver + domain, fetcher);

  //     const data = await fetch(props.resolver+domain)
  //     if (!data) {
  //       setShowstatus(true);
  //     }

  //     if (data && !error) {
  //       setShowstatus(true);
  //       if (data.Status === 0) {
  //         icon = "/available.svg";
  //       } else {
  //         icon = "/not_available.svg";
  //       }
  //     }
  //   }

  //   return (
  //     <>
  //       <div className="grid grid-cols-2 gap-4 pt-6">
  //         <div className="flex justify-center">
  //           <img className="h-12" src={props.logo} alt="Company Logo" />
  //         </div>
  //         <div className="text-center flex justify-center">
  //           {showstatus ? <img src={icon} alt="Status" /> : ""}
  //         </div>
  //       </div>
  //       <hr className="mt-4" />
  //     </>
  //   );
  // }


 

  useEffect(() => {
    const cloudflare = axios.get(`https://Cloudflare-dns.com/dns-query?ct=application/dns-json&type=AAAA&name=${url}`)
    const google = axios.get(`https://dns.google/resolve?name=${url}`)
    const quad9 = axios.get(`https://dns.quad9.net:5053/dns-query?name=${url}`)
    const fetchData = async () => {
      axios.all([cloudflare, google, quad9]).then(axios.spread((...responses) => {
        const responseOne = responses[0]
        const responseTwo = responses[1]
        const responesThree = responses[2]
        setResult([responseOne.data.Status,responseTwo.data.Status, responesThree.data.Status])
        // use/access the results 
      })).catch(errors => {
        setResult[1,1,1]
      })

    };
 

    fetchData();
  }, [url]);



  return (
    <div className="bg-white flex flex-col h-screen">
      <NavBar />
      <Head>
        <title>DNS Comparison</title>
        <link
          rel="icon"
          href="https://www.globalcyberalliance.org/wp-content/uploads/favicon.png"
        />
      </Head>

      <main className="flex-grow mx-auto p-8">
        <h1 className="title text-center text-5xl font-bold">DNS Comparison</h1>

        <p className="description text-center text-xl text-gray-700 mb-6">
          Enter a domain in the textbox below to compare it on different DNS
          providers
        </p>

        <form className="text-center">
          <input
            className={`bg-gray-200 appearance-none border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white ${
              textbox ? "focus:border-red-500" : "focus:border-green-500"
            }`}
            type="text"
            onChange={handleChange}
            value={url}
          />
        </form>
          <div>{result}</div>
        {/* <Profile
          resolver="https://dns.google/resolve?name="
          logo="./google.svg"
        />
        <Profile
          resolver="https://dns.quad9.net:5053/dns-query?name="
          logo="./quad9.svg"
        /> */}

      </main>

    </div>
  );
}
