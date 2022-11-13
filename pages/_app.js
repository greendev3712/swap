import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Head from "next/head";
import "antd/dist/antd.css";

const APP_ID = "wi3vmn7KB9vehixK5lZ2vOuAfgbJzJNSjum3AkUp";
const SERVER_URL = "https://b3o7m8vdspy1.usemoralis.com:2053/server";

function MyApp({ Component, pageProps }) {
	return (
		<>
		<MoralisProvider
			appId={APP_ID}
			serverUrl={SERVER_URL}
		>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{/* <!-- HTML Meta Tags --> */}
				<meta
					name="description"
					content="PUT THE FUTURE IN YOUR HANDS - Money from the Player NFT sales is transferred to real teams to help support and develop youth sports leagues! Live YourLIfe and Earn!"
				/>

				{/* <!-- Google / Search Engine Tags --> */}
				<meta itemProp="name" content="Your Life Games" />
				<meta
					itemProp="description"
					content="PUT THE FUTURE IN YOUR HANDS - Money from the Player NFT sales is transferred to real teams to help support and develop youth sports leagues! Live YourLife and Earn!"
				/>
				<meta
					itemProp="image"
					content="https://nft.yourlifegames.com/static/media/yourlife_white.605e26de.png"
				/>

				{/* <!-- Facebook Meta Tags --> */}
				<meta property="og:url" content="https://www.yourlifegames.com" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Your Life Games" />
				<meta
					property="og:description"
					content="PUT THE FUTURE IN YOUR HANDS - Money from the Player NFT sales is transferred to real teams to help support and develop youth sports leagues! Live YourLife and Earn!"
				/>
				<meta
					property="og:image"
					content="https://nft.yourlifegames.com/static/media/yourlife_white.605e26de.png"
				/>

				{/* <!-- Twitter Meta Tags --> */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Your Life Games" />
				<meta
					name="twitter:description"
					content="PUT THE FUTURE IN YOUR HANDS - Money from the Player NFT sales is transferred to real teams to help support and develop youth sports leagues - This unique opportunity provides both Fun & Finances at the same time! Live YourLife and Earn!"
				/>
				<meta
					name="twitter:image"
					content="https://nft.yourlifegames.com/static/media/yourlife_white.605e26de.png"
				/>
			</Head>
			<Component {...pageProps} />
		</MoralisProvider>
		</>
	);
}

export default MyApp;
