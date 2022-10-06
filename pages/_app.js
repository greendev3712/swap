import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";

const APP_ID = "4Fx2JqqD8VL7AmLrSVtkAXxfWbjDEBuFCRhBR52k";
const SERVER_URL = "https://ihmsvytaqkdp.usemoralis.com:2053/server";

function MyApp({ Component, pageProps }) {
	return (
		<MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
			<Component {...pageProps} />
		</MoralisProvider>
	);
}

export default MyApp;
