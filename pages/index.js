import Head from "next/head";
import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());
function Profile(props) {
  const { data, error } = useSWR(
    "https://dns.quad9.net:5053/dns-query?name=" + props.url,
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  // render data
  console.log(data);
  return <div>Status code is {data.Status}</div>;
}

export default function Home() {
  return (
    <div className="bg-white flex flex-col h-screen">
      <Head>
        <title>Quad9 Compare</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow mx-auto p-8">
        <h1 className="title text-center text-5xl">
          Welcome to the Quad9 Comparator
        </h1>

        <p className="description text-center text-xl text-gray-700">
          This is just a test to see what kind of user interface I can generate
        </p>
        <Profile url="google.com" />
      </main>

      <footer className="w-full text-center border-t border-grey p-4 absolute bottom-0">
        <div>Created by GCA</div>
      </footer>
    </div>
  );
}
