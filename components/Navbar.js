import React from "react";
import Logo from "../assets/yourlife_white.png";
import Image from "next/image";
import Link from "next/link";

const headerItems = [
	{ id: 1, title: "MARKETPLACE", url: "https://nft.yourlifegames.com/" },
	{
		id: 2,
		title: "MY ACCOUNT",
		url: "https://nft.yourlifegames.com/myaccount",
	},
];

const Navbar = () => {
	return (
		<div className="w-[98%] rounded-3xl h-20 bg-[#f6f6f7] text-center flex justify-center items-center absolute top-5 z-10 shadow-[1px_1px_17px_1px]">
			{/* logo container */}
			<div className="bg-[#242424] w-[10%] h-full rounded-xl flex justify-center items-center absolute left-0 logoContainer">
				<Image
					src={Logo}
					alt="logo"
					height="90%"
					width="100%"
					objectFit="contain"
				/>
				{/* <p className="uppercase text-xl text-white font-bold mr-10">ylg</p> */}
			</div>

			{/* Navbar Links */}
			<div className="w-[40%] flex justify-between items-center">
				{headerItems.map((item) => {
					return (
						<Link href={`${item.url}`} key={item.id}>
							<a className="text-lg text-[#242424] underline underline-offset-8 underline-color decoration-[#90E040]">
								{item.title}
							</a>
						</Link>
					);
				})}
			</div>

			{/* User Account */}
			<div></div>
		</div>
	);
};

export default Navbar;
