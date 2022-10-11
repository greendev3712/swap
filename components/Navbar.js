import React, { useEffect, useState, useRef } from "react";
import Logo from "../assets/Logoemblem.svg";
import Image from "next/image";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import LINKS from "../constants/menu";
import userDefaultAvatar from '../assets/user.png';
import Burger from '../assets/burger.svg';
import Cross from '../assets/cross.svg';
import useOutsideClick from './../hooks/useOutsideClick';

const Navbar = () => {
	const ref = useRef(null);
	const [openMobileMenu, setOpenMobileMenu] = useState(false);
	const { authenticate, user } = useMoralis();
	const address = user?.attributes?.ethAddress;
	const profile_picture = user?.attributes?.profile_picture;

	useEffect(() => {
		if (!user) {
			authenticate();
		}
	}, []);

	const openMobileMenuHandler = () => {
		setOpenMobileMenu(true);
	}

	const closeMobileMenuHandler = () => {
		setOpenMobileMenu(false);
	}

	return (
		<div className="w-full px-3 h-20 text-center relative flex shrink-0 items-center z-10">
			{/* logo container */}
			<div className="bg-[#242424] mr-[70px] w-[120px] relative h-full rounded-l-xl flex justify-center items-center with-triangle triangle">
				<Logo className="w-10 h-10 fill-white" />
				{/* <Image src={Logo} alt="logo" width={60} height={60} objectFit="contain" /> */}
				{/* <p className="uppercase text-xl text-white font-bold mr-10">ylg</p> */}
			</div>

			{/* Navbar Links */}
			<div className="flex h-full w-full pr-4 bg-[#f6f6f7] rounded-r-xl items-center justify-between sm:justify-end white-triangle-reverted with-triangle">
				<button className="sm:hidden" onClick={openMobileMenuHandler}>
					<Burger className="w-10 h-2" />
				</button>
				<div className="hidden sm:flex">
					{LINKS.map((link) => (
						<Link key={link.id} href={link.url}>
							<a className="text-md text-[#242424] uppercase underline underline-offset-8 underline-color decoration-[#90E040] mr-4">
								{link.title}
							</a>
						</Link>
					))}
				</div>
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
						<p className="ml-3 hidden sm:block">
							{address?.slice(0, 6)}...{address?.slice(-4)}
						</p>
					</div>
				)}
			</div>

			{/* Mobile menu */}
			{openMobileMenu && (
				<div ref={ref} className="flex absolute top-full items-start mt-3 right-3 left-3 justify-between px-4 py-5 rounded-xl bg-[#242424]">
					<div className="flex flex-col items-start">
						{LINKS.map((link) => (
							<Link key={link.id} href={link.url}>
								<a className="text-md text-white uppercase underline underline-offset-8 underline-color decoration-[#90E040] mb-4">
									{link.title}
								</a>
							</Link>
						))}
					</div>
					<button onClick={closeMobileMenuHandler}>
						<Cross className="w-5 h-5" />
					</button>
				</div>
			)}

			{/* User Account */}
			<div></div>
		</div>
	);
};

export default Navbar;
