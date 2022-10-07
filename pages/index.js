import { Scrolling } from "../components/Scrolling";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useEffect, useState } from "react";
import WAValidator, { validate } from "multicoin-address-validator";
import { Input } from "../components/Input";
import { rates } from "../utils/helperFunction";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";

const options = ["USD", "USDT"];

const defaultOption = options[0];

export default function Home() {
	const [usdAmount, setUsdAmount] = useState("");
	const [walletAddress, setWalletAddress] = useState("");
	const [validWalletAddress, setValidWalletAddress] = useState("");
	const [email, setEmail] = useState("");
	const [rate, setRate] = useState(rates[0]);
	const [ylt, setYlt] = useState(0);
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
			setValidWalletAddress(e.target.value);
		}
	};

	return (
		// Layout
		<div className="bg-[#f6f6f7] h-[100vh] w-full max-w-[1440px] relative overflow-x-hidden mx-auto flex justify-center items-center">
			<Navbar />
			{/* Main Container */}
			<Scrolling />

			{/* Input Container */}
			<div className="w-[40%] h-[55%] bg-white relative flex flex-col border-2 border-[#90e040] rounded-2xl pt-4">
				<button
					type="button"
					className="w-[40%] h-4 bg-transparent self-end mb-4"
					onClick={changeRate}
				>
					{rate.rate} - update rate{" "}
					<span className="text-blue-500">&#8635;</span>
				</button>
				{/* Inner Container */}
				<div className="w-[98%] relative mx-auto">
					<Dropdown
						options={options}
						defaultOption={defaultOption}
						className="dropdown"
						placeholder={defaultOption}
						menuClassName="dropdown-menu"
					/>
					<input
						type="number"
						placeholder="Enter amount"
						value={usdAmount}
						onChange={(e) => {
							setUsdAmount(e.target.value);
							setYlt(e.target.value * rate.ylt);
						}}
						className="form-input"
					/>
				</div>
				{/* Swap Icon */}
				<p className="w-12 h-12 text-[#90e040] bg-[#f6f6f7] text-center  rounded-full absolute left-[47%] top-[17%] mx-auto cursor-pointer flex justify-center items-center pointer-events-none">
					&#8645;
				</p>
				{/* Rest Inputs */}
				<input
					type="number"
					placeholder="YLT Token Amount"
					value={ylt}
					onChange={(e) => {
						setYlt(e.target.value);
						setUsdAmount(e.target.value / rate.ylt);
					}}
					className="form-input mt-2 mb-10"
				/>
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
						validWalletAddress.length > 0
							? "border-2 border-green-500"
							: "border-2 border-red-500"
					}`}
				/>
				<input
					type="email"
					placeholder="Enter your email address"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="form-input text-lg font-normal"
				/>
				<button
					type="submit"
					className="w-[98%] h-16 rounded-3xl bg-[#90e040] border-none text-4xl text-white uppercase mx-auto mt-20"
				>
					swap
				</button>
				{/* End Input Container */}
			</div>
		</div>
	);
}
