import Head from "next/head";
import useSWR from "swr";
import React, { useState } from "react";

export default function Home() {
  const [url, setURL] = useState("");
  function handleSubmit() {
    return "Hello World";
  }

  function handleChange(event) {
    setURL(event.target.value);
  }

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  function Profile(props) {
    const { data, error } = useSWR(props.resolver + url, fetcher);
    if (!data || error)
      return (
        <div class="grid grid-cols-2 gap-4 pt-6">
          <div>
            <img className="h-12" src={props.logo} alt="Vercel Logo" />
          </div>
          <div className="text-center flex items-center">
            <img src="./loading.svg" alt="Vercel Logo" className="logo" />
          </div>
        </div>
      );
    // render data
    var icon = "/not_available.svg";
    if (data.Status === 0) {
      icon = "/available.svg";
    }
    console.log(data);
    return (
      <div class="grid grid-cols-2 gap-4 pt-6">
        <div>
          <img className="h-12" src={props.logo} alt="Vercel Logo" />
        </div>
        <div className="text-center flex items-center">
          <img src={icon} alt="Vercel Logo" className="logo" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col h-screen">
      <Head>
        <title>DNS Comparison</title>
        <link
          rel="icon"
          href="https://www.globalcyberalliance.org/wp-content/uploads/favicon.png"
        />
      </Head>

      <main className="flex-grow mx-auto p-8">
        <h1 className="title text-center text-5xl">DNS Comparison</h1>

        <p className="description text-center text-xl text-gray-700 mb-6">
          Enter a URL in the textbox below to compare it on different DNS
          providers
        </p>

        <form className="text-center">
          <input
            className="form-input"
            type="text"
            size="50"
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
    </div>
  );
}
