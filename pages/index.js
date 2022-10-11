import { useState, useRef } from "react";
import { Scrolling } from "../components/Scrolling";
import CurrencyDropdown from "../components/CurrencyDropdown";
import "react-dropdown/style.css";
import WAValidator from "multicoin-address-validator";
import { rates } from "../utils/helperFunction";
import Navbar from "../components/Navbar";
import { useMoralis } from "react-moralis";
import USDT from '../assets/usdt.png';
import USD from '../assets/usd.png';
import Footer from "../components/Footer";
import Logo from "../assets/Logoemblem.svg"

const currencies = [
	{id: 1, title: "USDT", image: USDT},
	{id: 2, title: "USD", image: USD},
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
				<button
					type="submit"
					className="w-full h-16 rounded-3xl bg-[#90e040] border-none text-4xl text-white uppercase mx-auto mt-7"
				>
					swap
				</button>
				{/* End Input Container */}
			</div>

			{/* Footer */}
			<Footer />
		</div>
	);
}
