import React from "react";
import Logo from "../assets/Logo.svg";
import Image from "next/image";
import Link from "next/link";

const headerItems = ["MARKETPLACE", "MY ACCOUNT", "COLLECTION", "SWAP"];

const Navbar = () => {
	return (
		<div className="w-[98%] rounded-3xl h-20 bg-[#f6f6f7] text-center flex justify-center items-center absolute top-5 z-10 shadow-[1px_1px_17px_1px]">
			{/* logo container */}
			<div className="bg-[#242424] w-[10%] h-full rounded-xl flex justify-center items-center absolute left-0 logoContainer">
				<Image src={Logo} alt="logo" height="60px" />
				<p className="uppercase text-xl text-white font-bold mr-10">ylg</p>
			</div>

			{/* Navbar Links */}
			<div className="w-[40%] flex justify-between items-center">
				{headerItems.map((item, index) => {
					return (
						<Link href={`/${item.toLowerCase()}`} key={index}>
							<a className="text-lg text-[#242424] underline underline-offset-8 underline-color decoration-[#90E040]">
								{item}
							</a>
						</Link>
					);
				})}
			</div>

			{/* Subscribe button */}
			<button
				type="button"
				className="bg-[#3985F5] py-4 px-6 rounded-lg ml-20 text-white uppercase"
			>
				authenticate
			</button>

			{/* User Account */}
			<div></div>
		</div>
	);
};

export default Navbar;
