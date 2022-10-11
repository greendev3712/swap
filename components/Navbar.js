import React, { useEffect } from "react";
import Logo from "../assets/yourlife_white.png";
import Image from "next/image";
import Link from "next/link";
import { useMoralis } from "react-moralis";

const Navbar = () => {
	const { authenticate, user } = useMoralis();
	const address = user?.attributes?.ethAddress;
	const profile_picture = user?.attributes?.profile_picture;

	useEffect(() => {
		if (!user) {
			authenticate();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return (
		<div className="w-[98%] rounded-3xl h-20 bg-[#f6f6f7] text-center flex justify-center items-center absolute top-5 z-10 shadow-[1px_1px_17px_1px]">
			{/* logo container */}
			<div className="bg-[#242424] w-[8%] h-full rounded-xl flex justify-items-center items-center absolute left-0 logoContainer">
				<Image src={Logo} alt="logo" width="90%" objectFit="contain" />
				{/* <p className="uppercase text-xl text-white font-bold mr-10">ylg</p> */}
			</div>

			{/* Navbar Links */}
			<div className="w-[40%] flex justify-between items-center">
				<Link href="https://nft.yourlifegames.com">
					<a className="text-md text-[#242424] uppercase underline underline-offset-8 underline-color decoration-[#90E040]">
						marketplace
					</a>
				</Link>
				<Link href="https://nft.yourlifegames.com">
					<a className="text-md text-[#242424] uppercase underline underline-offset-8 underline-color decoration-[#90E040]">
						my account
					</a>
				</Link>
				{!user ? (
					<button
						className="text-[#242424] text-md uppercase underline underline-offset-8 underline-color decoration-[#90E040]"
						onClick={authenticate}
					>
						authenticate
					</button>
				) : (
					<div className="flex items-center justify-center">
						<Image
							src={profile_picture}
							width="40px"
							height="40px"
							className="rounded-full"
							alt="profile picture"
						/>
						<p className="ml-3">
							{address?.slice(0, 6)}...{address?.slice(-4)}
						</p>
					</div>
				)}
			</div>

			{/* User Account */}
			<div></div>
		</div>
	);
};

export default Navbar;
