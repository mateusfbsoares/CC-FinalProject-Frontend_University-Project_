import Head from "next/head";
import Home from "./Home";

export default function index() {
  return (
    <div className="w-full h-screen">
      {/* Head */}
      <Head>
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />

        <title>Geração de capas de álbum e vídeoclipes - Grupo 3</title>
      </Head>

      {/* Main Content */}
      <main>
        <Home />
      </main>
    </div>
  );
}
