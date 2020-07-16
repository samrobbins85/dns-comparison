import Head from "next/head";
import useSWR from "swr";
import React, { useState } from "react";
import NavBar from "../components/navbar";
const isValidDomain = require("is-valid-domain");
export default function Home() {
  const [url, setURL] = useState("");
  const [domain, setDomain] = useState("");
  const [textbox, setTextbox] = useState(false);

  function handleChange(event) {
    setURL(event.target.value);
  }

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  function Profile(props) {
    try {
      setDomain(new URL(url).hostname);
    } catch {
      try {
        setDomain(new URL("https://" + url).hostname);
      } catch {
        setDomain(url);
      }
    }

    if (!isValidDomain(domain)) {
      if (domain === "") {
        setTextbox(false);
      } else {
        setTextbox(true);
      }
      return (
        <>
          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="flex justify-center">
              <img className="h-12" src={props.logo} alt="Company Logo" />
            </div>
            <div className="text-center flex items-center"></div>
          </div>
          <hr className="mt-4" />
        </>
      );
    } else {
      setTextbox(false);
    }

    const { data, error } = useSWR(props.resolver + domain, fetcher);

    if (!data || error)
      return (
        <>
          <div class="grid grid-cols-2 gap-4 pt-6">
            <div className="flex justify-center">
              <img className="h-12" src={props.logo} alt="Company Logo" />
            </div>
            <div className="text-center flex justify-center">
              <img src="./loading.svg" alt="Status" />
            </div>
          </div>
          <hr className="mt-4" />
        </>
      );
    // render data
    var icon = "/not_available.svg";
    if (data.Status === 0) {
      icon = "/available.svg";
    }
    console.log(data);
    return (
      <>
        <div class="grid grid-cols-2 gap-4 pt-6">
          <div className="flex justify-center">
            <img className="h-12" src={props.logo} alt="Company Logo" />
          </div>
          <div className="text-center flex justify-center">
            <img src={icon} alt="Status" />
          </div>
        </div>
        <hr className="mt-4" />
      </>
    );
  }

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
        <Profile
          resolver="https://Cloudflare-dns.com/dns-query?ct=application/dns-json&type=AAAA&name="
          logo="./cloudflare.svg"
        />
        <Profile
          resolver="https://dns.google/resolve?name="
          logo="./google.svg"
        />
        <Profile
          resolver="https://dns.quad9.net:5053/dns-query?name="
          logo="./quad9.svg"
        />
      </main>
      <hr className="pb-2" />
      <div className="flex justify-center text-2xl font-bold">Key</div>
      <div className="grid grid-cols-2">
        <div className="text-gray-700 text-center px-4 m-2  flex justify-end">
          <img src="./loading.svg" alt="Loading" />
        </div>
        <div className="text-gray-700 text-center px-4  m-2 flex justify-start items-center">
          Loading
        </div>

        <div className="text-gray-700 text-center px-4 m-2 flex justify-end">
          <img src="./available.svg" alt="Resolved" />
        </div>
        <div className="text-gray-700 text-center px-4  m-2 flex justify-start items-center">
          Resolved
        </div>

        <div className="text-gray-700 text-center px-4 m-2 flex justify-end">
          <img src="./not_available.svg" alt="Can't Resolve" />
        </div>
        <div className="text-gray-700 text-center px-4  m-2 flex justify-start items-center">
          Can't resolve
        </div>
      </div>
    </div>
  );
}
