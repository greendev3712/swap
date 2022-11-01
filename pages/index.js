import { useState, useRef, useEffect } from "react";
import { Scrolling } from "../components/Scrolling";
import CurrencyDropdown from "../components/CurrencyDropdown";
import "react-dropdown/style.css";
import WAValidator from "multicoin-address-validator";
import { rates } from "../utils/helperFunction";
import Navbar from "../components/Navbar";
import { useMoralis } from "react-moralis";
import USDTLogo from "../assets/usdt.png";
import USDLogo from "../assets/usd.png";
import Footer from "../components/Footer";
import Logo from "../assets/Logoemblem.svg";
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
import { emailValidate } from "../utils/emailValidation";
import Preloader from "../components/Preloader/Preloader";

const chainId = ChainId.TESTNET;
console.log(chainId);

const web3provider = new ethers.providers.JsonRpcProvider(
	"https://bsctestapi.terminet.io/rpc",
	{ name: "binance", chainId: chainId }
);

const YLTtokenAddress = "0x8e0B7Ced8867D512C75335883805cD564c343cB9";
const USDTtokenAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";

const currencies = [
	{ id: 1, title: "USDT", image: USDTLogo },
	{ id: 2, title: "USD", image: USDLogo },
];

export default function Home() {
	const validateClassNameRef = useRef("");
	const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
	const [usdAmount, setUsdAmount] = useState("");
	const [walletAddress, setWalletAddress] = useState("");
	const [email, setEmail] = useState("");
	const [rate, setRate] = useState("");
	const [ylt, setYlt] = useState(0);
	const [yltBalance, setYltBalance] = useState(0);
	const [usdtBalance, setUsdtBalance] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const { user, isAuthenticated, Moralis, account } = useMoralis();

	const addEmail = async () => {
		const { id } = user;
		await Moralis.Cloud.run("addEmail", {
			id,
			email,
		});
	};

	const canSwap = () => {
		let hasError = false;

		if (user && !user?.attributes.email && !email) {
			console.log("email");
			hasError = true;
		}

		if (email && !emailValidate(email)) {
			hasError = true;
		}

		if (user && !user?.attributes.ethAddress && !walletAddress) {
			console.log("wallet");
			hasError = true;
		}

		if (!ylt && !usdAmount) {
			// console.log('amount')
			hasError = true;
		}

		return hasError;
	};

	async function initSwap() {
		const web3provider = new ethers.providers.Web3Provider(window.ethereum, {
			name: "binance",
			chainId,
		});
		console.log(web3provider);

		setIsLoading(true);
		if (isAuthenticated && email) {
			await addEmail();
		}

		// const web3provider = new ethers.providers.Web3Provider(window.ethereum, { name: 'binance', chainId })
		const YLT = await Fetcher.fetchTokenData(
			chainId,
			YLTtokenAddress,
			web3provider
		);
		const USDT = await Fetcher.fetchTokenData(
			chainId,
			USDTtokenAddress,
			web3provider
		);
		const pair = await Fetcher.fetchPairData(YLT, USDT, web3provider);
		const route = new Route([pair], USDT);
		const trade = new Trade(
			route,
			new TokenAmount(USDT, 10e17 * usdAmount),
			TradeType.EXACT_INPUT
		);
		const slippageTolerance = new Percent("50", "1000");
		const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
		// console.log(trade.executionPrice.toSignificant(6), "execution price")
		// console.log(amountOutMin)
		const amountIn = usdAmount;
		const path = [USDT.address, YLT.address];
		const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
		const accounts = await ethereum.request({
			method: "eth_requestAccounts",
		});
		const to = accounts[0];

		let metaSigner = web3provider.getSigner(to);

		// contract and its abi
		const pancakeswap = new ethers.Contract(
			"0xCc7aDc94F3D80127849D2b41b6439b7CF1eB4Ae0",
			[
				"function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)",
			],
			metaSigner
		);

		console.log(pancakeswap);
		console.log(BigInt(amountIn * 10e17), amountOutMin[2], path, to, deadline);
		// transaction to carry
		const tx = await pancakeswap.swapExactTokensForTokens(
			BigInt(amountIn * 10e17),
			amountOutMin[2],
			path,
			to,
			deadline
		);
		console.log(tx, tx.hash);
		await tx.wait();
		await getBalance();
		setIsLoading(false);
		// MetaMask requires requesting permission to connect users accounts
		// The MetaMask plugin also allows signing transactions to
		// send ether and pay to change state within the blockchain.
		// For this, you need the account signer...
	}
	const changeRate = async () => {
		const chainId = 97;
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
			new TokenAmount(USDT, 10e17 * 1),
			TradeType.EXACT_INPUT
		);

		const currentRate = route.midPrice.toSignificant(2);
		setRate(currentRate);
	};

	const validateWalletAddress = (address) => {
		const valid = WAValidator.validate(address, "BNB");

		if (valid) {
			validateClassNameRef.current = "border-2 border-green-500";
		} else {
			validateClassNameRef.current = "border-2 border-red-500";
		}
	};

	const changeWalletValue = (value) => {
		setWalletAddress(value);
		validateWalletAddress(value);
	};

	const changeCurrentCurrency = (id) => {
		const found = currencies.find((currency) => currency.id === id);

		setSelectedCurrency(found);
	};

	const getBalance = async () => {
		const YLTContract = new ethers.Contract(
			YLTtokenAddress,
			["function balanceOf(address tokenOwner) external view returns (uint)"],
			web3provider
		);
		const balance = await YLTContract.balanceOf(account);
		setYltBalance(balance.toString() / 10 ** 18);

		const USDTContract = new ethers.Contract(
			USDTtokenAddress,
			["function balanceOf(address account) external view returns (uint256)"],
			web3provider
		);
		const usdtBalance = await USDTContract.balanceOf(account);
		setUsdtBalance(usdtBalance.toString() / 10 ** 18);
	};

	useEffect(() => {
		if (isAuthenticated) {
			getBalance();
		}
	}, [isAuthenticated]);

	useEffect(() => {
		changeRate();
	}, []);

	// stripe payment initiator
	const stripePaymentInit = () => {
		console.log("initiated", process.env.NEXT_PUBLIC_SERVER_URL);
		setIsLoading(true);
		fetch(`/api/create-checkout-session`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				quantity: usdAmount,
				email: user?.attributes.email ?? email,
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
		<>
			{isLoading && <Preloader />}
			<Scrolling />
			<div className="min-h-screen w-full relative overflow-x-hidden mx-auto flex flex-col justify-between pt-6 items-center">
				{/* Main Container */}

				<Navbar setIsLoading={setIsLoading} />
				{/* Input Container */}
				<div className="sm:max-w-screen-sm sm:w-full bg-white relative mx-3 flex flex-col border-2 border-[#90e040] rounded-2xl pt-3 pb-5 px-2.5 my-10">
					{/* Inner Container */}
					<div className="relative text-5xl flex flex-col mb-7">
						<div className="w-full relative">
							<div className="absolute right-5 top-2/4 -translate-y-2/4 flex flex-col items-end">
								<CurrencyDropdown
									options={currencies}
									selected={selectedCurrency}
									onChange={changeCurrentCurrency}
								/>
								{isAuthenticated && selectedCurrency.id !== 2 && (
									<p className="text-sm mt-4">
										Balance: {usdtBalance.toFixed(2)}
									</p>
								)}
							</div>
							<input
								type="number"
								placeholder="Enter amount"
								value={usdAmount}
								onChange={(e) => {
									setUsdAmount(e.target.value);
									setYlt(e.target.value * rate);
								}}
								className="form-input h-[100px] text-2xl sm:text-3xl"
							/>
						</div>
						{/* Rest Inputs */}
						<div className="w-full relative">
							<div className="absolute right-5 top-2/4 -translate-y-2/4 flex flex-col items-end">
								<div className=" py-1.5 px-2.5 w-[134px] flex items-center rounded-3xl bg-[#C3EB9B]">
									<Logo className="h-6 w-6 mr-1.5" />
									<span className="text-2xl">YLT</span>
								</div>
								{isAuthenticated && (
									<p className="text-sm mt-4">
										Balance: {yltBalance.toFixed(2)}
									</p>
								)}
							</div>
							<input
								type="number"
								placeholder="YLT Token Amount"
								value={ylt}
								onChange={(e) => {
									setYlt(e.target.value);
									setUsdAmount(e.target.value / rate);
								}}
								className="form-input mt-2 w-full h-[100px] text-2xl sm:text-3xl"
							/>
						</div>
					</div>

					{!user?.attributes.ethAddress && (
						<>
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
								onChange={(e) => changeWalletValue(e.target.value)}
								className={`form-input font-normal text-lg ${
									walletAddress.length > 0 ? validateClassNameRef.current : ""
								}`}
							/>
						</>
					)}
					{!user?.attributes.email && (
						<input
							type="email"
							placeholder="Enter your email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="form-input text-lg font-normal"
						/>
					)}
					{rate > 0 && (
						<button
							type="button"
							className="h-4 bg-transparent self-end mt-4"
							onClick={changeRate}
						>
							1$/{rate} - update rate{" "}
							<span className="text-blue-500">&#8635;</span>
						</button>
					)}
					{selectedCurrency.id === 1 ? (
						<button
							onClick={initSwap}
							type="submit"
							className="w-full h-16 rounded-3xl bg-[#90e040] border-none text-4xl text-white uppercase mx-auto mt-7 disabled:bg-gray-300 disabled:text-gray-200"
							disabled={canSwap()}
						>
							swap
						</button>
					) : (
						<button
							onClick={stripePaymentInit}
							type="submit"
							className="w-full h-16 rounded-3xl bg-[#546ADA] border-none text-4xl text-white uppercase mx-auto mt-7 disabled:bg-gray-300 disabled:text-gray-200"
							disabled={canSwap()}
						>
							Stripe
						</button>
					)}
					{/* End Input Container */}
				</div>

				{/* Footer */}
				<Footer />
			</div>
		</>
	);
}
