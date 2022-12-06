import { Scrolling } from "../components/Scrolling";
import "react-dropdown/style.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader/Preloader";
import LiquidityForm from "../components/LiquidityForm";
import {useEffect, useState} from "react";
import Link from "next/link";
import {useMoralis} from "react-moralis";
import {useRouter} from "next/router";

export default function Liquidity() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useMoralis();

	useEffect(() => {
		if (!user || !user.attributes.isSuperAdmin) {
			router.push('/');
		}
	}, []);

	return (
		<>
			{isLoading && <Preloader />}
			<Scrolling />
			<div className="min-h-screen w-full relative overflow-x-hidden mx-auto flex flex-col justify-between pt-6 items-center">
				{/* Main Container */}

				<Navbar setIsLoading={setIsLoading} />

				{user && user.attributes.isSuperAdmin && (
					<div className="flex bg-gray-300 rounded my-10">
						<Link href="/">
							<a className="flex items-center justify-center h-8 px-4 rounded">
								Swap
							</a>
						</Link>
						<Link href="liquidity">
							<a className="flex items-center justify-center h-8 px-4 bg-[#90E040] rounded">
								Liquidity
							</a>
						</Link>
					</div>
				)}

				<LiquidityForm />

				{/* Footer */}
				<Footer />
			</div>
		</>
	);
}
