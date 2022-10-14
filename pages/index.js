import { useState, useRef } from "react";
import { Scrolling } from "../components/Scrolling";
import CurrencyDropdown from "../components/CurrencyDropdown";
import "react-dropdown/style.css";
import WAValidator from "multicoin-address-validator";
import { rates } from "../utils/helperFunction";
import Navbar from "../components/Navbar";
import { useMoralis } from "react-moralis";
import USDTLogo from '../assets/usdt.png';
import USDLogo from '../assets/usd.png';
import Footer from "../components/Footer";
import Logo from "../assets/Logoemblem.svg"
import {
	ChainId,
	Fetcher,
	Route,
	Trade,
	TokenAmount,
	TradeType,
	Percent,
} from "pancakeswap-v2-testnet-sdk";
import { ethers } from "ethers";
import Router from "next/router";



const currencies = [
	{id: 1, title: "USDT", image: USDTLogo},
	{id: 2, title: "USD", image: USDLogo},
];

export default function Home() {
	const validateClassNameRef = useRef('');
	const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
	const [usdAmount, setUsdAmount] = useState("");
	const [walletAddress, setWalletAddress] = useState("");
	const [email, setEmail] = useState("");
	const [rate, setRate] = useState(rates[0]);
	const [ylt, setYlt] = useState(0);
	const [reverted, setReverted] = useState(false);
	const { user } = useMoralis();

	async function initSwap() {
		const chainId = ChainId.TESTNET;
		const provider = new ethers.providers.JsonRpcProvider(
		"https://bsctestapi.terminet.io/rpc",
			{ name: "binance", chainId: chainId }
		);

		const YLTtokenAddress = "0x8e0B7Ced8867D512C75335883805cD564c343cB9";
		const USDTtokenAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
		const YLT = await Fetcher.fetchTokenData(
			chainId,
			YLTtokenAddress,
			provider
		);
		const USDT = await Fetcher.fetchTokenData(
			chainId,
			USDTtokenAddress,
			provider
		);
		const pair = await Fetcher.fetchPairData(YLT, USDT, provider);
		const route = new Route([pair], USDT);
		const trade = new Trade(
			route,
			new TokenAmount(USDT, "1000000000000000"),
			TradeType.EXACT_INPUT
		);
		const slippageTolerance = new Percent("50", "1000");
		const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
		const amountIn = 1e9;
		const path = [USDT.address, YLT.address];
		// const to = "0x463B083cDefE93214b9398fEEf29C4f3C3730185";
		const to = "0xafA47c538074BE61F955D2ff30B9B09783B4B234";
		const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
		const value = trade.inputAmount.raw;

		let metaSigner = provider.getSigner(to);
		// const address = await metaSigner.getAddress()
		// console.log(
		// 	signer,
		// 	"--signer",
		// 	metaSigner,
		// 	"--metaSigner",
		// 	account,
		// 	"--account",
		// 	metaAccount,
		// 	"--metaAccount"
		// );

		// contract and its abi
		const pancakeswap = new ethers.Contract(
			"0xCc7aDc94F3D80127849D2b41b6439b7CF1eB4Ae0",
			[
				"function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)",
			],
			metaSigner
		);

		// transaction to carry
		const tx = await pancakeswap.swapExactTokensForTokens(amountIn,amountOutMin[1], path,to, deadline, { gasPrice: 20e9, gasLimit: 50000 })
		console.log(tx, tx.hash);

		// MetaMask requires requesting permission to connect users accounts

		// The MetaMask plugin also allows signing transactions to
		// send ether and pay to change state within the blockchain.
		// For this, you need the account signer...
	}
	const changeRate = () => {
		const randomIndex = Math.floor(Math.random() * rates.length);
		const item = rates[randomIndex];
		setRate(item);
		setUsdAmount("");
		setYlt(0);
	};

	const validateWalletAddress = (e) => {
		setWalletAddress(e.target.value);

		const valid = WAValidator.validate(e.target.value, "BNB");

		if (valid) {
			validateClassNameRef.current = 'border-2 border-green-500';
		} else {
			validateClassNameRef.current = 'border-2 border-red-500';
		}
	};

	const changeCurrentCurrency = (id) => {
		const found = currencies.find((currency) => currency.id === id);

		setSelectedCurrency(found);
	};

	const revertInputsHandler = () => {
		setReverted(!reverted);
	}

	// stripe payment initiator
	const stripePaymentInit = (e) => {
		console.log("initiated", process.env.NEXT_PUBLIC_SERVER_URL);
		fetch(`/api/create-checkout-session`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				quantity: usdAmount,
			}),
		})
			.then(async (res) => {
				console.log(res);
				if (res.ok) return res.json();
				const json = await res.json();
				return await Promise.reject(json);
			})
			.then(({ url }) => {
				console.log(url);
				window.location = url;
			})
			.catch((e) => {
				console.error(e.error);
			});
	};

	return (
		// Layout
		<div className="bg-[#f6f6f7] h-screen w-full relative overflow-x-hidden mx-auto flex flex-col justify-between pt-6 items-center">
			{/* Main Container */}
			<Scrolling />

			<Navbar />

			{/* Input Container */}
			<div className="max-w-screen-sm w-full bg-white relative flex flex-col border-2 border-[#90e040] rounded-2xl pt-3 pb-5 px-2.5">
				<button
					type="button"
					className="h-4 bg-transparent self-end mb-4"
					onClick={changeRate}
				>
					{rate.rate} - update rate{" "}
					<span className="text-blue-500">&#8635;</span>
				</button>
				{/* Inner Container */}
				<div className="relative text-5xl flex flex-col mb-7">
					<div className="w-full relative">
						<CurrencyDropdown 
							options={currencies}
							selected={selectedCurrency}
							onChange={changeCurrentCurrency}
							className="absolute top-3 right-5"
						/>
						<input
							type="number"
							placeholder="Enter amount"
							value={usdAmount}
							onChange={(e) => {
								setUsdAmount(e.target.value);
								setYlt(e.target.value * rate.ylt);
							}}
							className="form-input h-[100px] text-2xl sm:text-5xl"
						/>
					</div>
					{/* Swap Icon */}
					<button
						onClick={revertInputsHandler}
						className="w-14 h-14 z-[1] text-[#90e040] bg-[#f6f6f7] -translate-x-2/4 -translate-y-2/4 text-2xl border border-white rounded-full absolute top-2/4 left-2/4"
					>
						&#8645;
					</button>
					{/* Rest Inputs */}
					<div className={`w-full relative ${reverted ? 'order-first' : ''}`}>
						<Logo className="absolute right-5 h-12 w-12 top-2/4 -translate-y-2/4 fill-black" />
						<input
							type="number"
							placeholder="YLT Token Amount"
							value={ylt}
							onChange={(e) => {
								setYlt(e.target.value);
								setUsdAmount(e.target.value / rate.ylt);
							}}
							className="form-input mt-2 w-full h-[100px] text-2xl sm:text-5xl"
						/>
					</div>
				</div>

				<label
					htmlFor="walletAddress"
					className="mt-5 w-[97%] mx-auto text-gray-500 text-xs"
				>
					Your wallet must be BEP-20 compatible
				</label>
				<input
					id="walletAddress"
					type="text"
					placeholder="Enter your crypto wallet address"
					value={walletAddress}
					onChange={(e) => validateWalletAddress(e)}
					className={`form-input font-normal text-lg ${
						walletAddress.length > 0 ? validateClassNameRef.current : ''
					}`}
				/>
				{!user && (
					<input
						type="email"
						placeholder="Enter your email address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="form-input text-lg font-normal"
					/>
				)}
				{selectedCurrency.id === 1 ? (
					<button
						onClick={initSwap}
						type="submit"
						className="w-full h-16 rounded-3xl bg-[#90e040] border-none text-4xl text-white uppercase mx-auto mt-7"
					>
						swap
					</button>

				) : (
					<button
						onClick={stripePaymentInit}
						type="submit"
						className="w-full h-16 rounded-3xl bg-[#546ADA] border-none text-4xl text-white uppercase mx-auto mt-7"
					>
						Stripe
					</button>
				)}
				{/* End Input Container */}
			</div>

			{/* Footer */}
			<Footer />
		</div>
	);
}
