import { Scrolling } from "../components/Scrolling";
import "react-dropdown/style.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader/Preloader";
import SwapForm from "../components/SwapForm";
import { useState } from "react";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import "antd/dist/antd.css";
import { Radio } from 'antd';
import LiquidityForm from "../components/LiquidityForm";

const options = [
	{ label: 'Swap', value: 'swap' },
	{ label: 'Liquidity', value: 'liquidity' },
];

export default function Home() {
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useMoralis();

	const [val_radioButtonGroup, setValRadioButtonGroup] = useState('swap');

	return (
		<>
			{isLoading && <Preloader />}
			<Scrolling />
			<div className="min-h-screen w-full relative overflow-x-hidden mx-auto flex flex-col justify-between pt-6 items-center">
				{/* Main Container */}
				<Navbar setIsLoading={setIsLoading} />

				{user && user.attributes.isSuperAdmin && (
					<div className="flex bg-gray-300 rounded mt-10">
						<Link href="/">
							<a className="flex items-center justify-center h-8 px-4 bg-[#90E040] rounded">
								Swap
							</a>
						</Link>
						<Link href="liquidity">
							<a className="flex items-center justify-center h-8 px-4 rounded">
								Liquidity
							</a>
						</Link>
					</div>
				)}

				{val_radioButtonGroup == 'swap' && <SwapForm setIsLoading={setIsLoading} />}
				{val_radioButtonGroup == 'liquidity' && <LiquidityForm setIsLoading={setIsLoading} />}

				{/* Footer */}
				<Footer />
			</div>
		</>
	);
}
