import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";

const APP_ID = "wi3vmn7KB9vehixK5lZ2vOuAfgbJzJNSjum3AkUp";
const SERVER_URL = "https://b3o7m8vdspy1.usemoralis.com:2053/server";

function MyApp({ Component, pageProps }) {
	return (
		<MoralisProvider
			appId={process.env.NEXT_PUBLIC_APP_ID}
			serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}
		>
			<Component {...pageProps} />
		</MoralisProvider>
	);
}

export default MyApp;
