import Head from "next/head";
import Home from "./Home";

export default function index() {
  return (
    <div className="">
      {/* Head */}
      <Head>
        <title>React Next.js - Google Colab</title>
      </Head>

      {/* Main Content */}
      <main>
        <Home />
      </main>
    </div>
  );
}
