import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="w-full">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
