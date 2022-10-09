import React, { useEffect } from "react";
import Logo from "../assets/Logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import LINKS from "../constants/menu";
import userDefaultAvatar from '../assets/user.png';

const Navbar = () => {
	const { authenticate, user } = useMoralis();
	const address = user?.attributes?.ethAddress;
	const profile_picture = user?.attributes?.profile_picture;
	useEffect(() => {
		if (!user) {
			authenticate();
		}
	}, []);

	return (
		<div className="w-full px-3 h-20 text-center flex shrink-0 items-center z-10">
			{/* logo container */}
			<div className="bg-[#242424] mr-[70px] w-[120px] relative h-full rounded-l-xl flex justify-center items-center with-triangle triangle">
				<Logo className="w-10 h-10" />
				{/* <Image src={Logo} alt="logo" width={60} height={60} objectFit="contain" /> */}
				{/* <p className="uppercase text-xl text-white font-bold mr-10">ylg</p> */}
			</div>

			{/* Navbar Links */}
			<div className="sm:flex hidden h-full w-full pr-4 bg-[#f6f6f7] relative rounded-r-xl justify-end items-center white-triangle-reverted with-triangle">
				{LINKS.map((link) => (
					<Link key={link.id} href={link.url}>
						<a className="text-md text-[#242424] uppercase underline underline-offset-8 underline-color decoration-[#90E040] mr-4">
							{link.title}
						</a>
					</Link>
				))}
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
							src={profile_picture ?? userDefaultAvatar}
							width="40px"
							height="40px"
							className="rounded-full bg-[#90e040]"
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
