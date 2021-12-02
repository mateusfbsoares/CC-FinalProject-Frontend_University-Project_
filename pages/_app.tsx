import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
