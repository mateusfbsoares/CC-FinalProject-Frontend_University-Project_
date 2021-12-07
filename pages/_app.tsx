import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="w-full">
      <meta
        http-equiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      />

      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
