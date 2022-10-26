import React, { useEffect, useState, useRef } from "react";
import Logo from "../assets/Logoemblem.svg";
import Link from "next/link";
import Account from "./Account";
import LINKS from "../constants/menu";
import Burger from '../assets/burger.svg';
import Cross from '../assets/cross.svg';
import Bell from '../assets/bell.svg';
import Search from '../assets/search.svg'


const Navbar = () => {
	const ref = useRef(null);
	const [openMobileMenu, setOpenMobileMenu] = useState(false);
	const [eventsModalOpen, setEventsModalOpen] = useState(false);

	const openMobileMenuHandler = () => {
		setOpenMobileMenu(true);
	}

	const closeMobileMenuHandler = () => {
		setOpenMobileMenu(false);
	}

	const eventsModalOpenHandler = () => {
		setEventsModalOpen(true);
	}

	const eventsModalCloseHandler = () => {
		setEventsModalOpen(false);
	}

	return (
		<div className="w-full px-3 h-20 text-center relative flex shrink-0 items-center">
			{/* logo container */}
			<div className="bg-[#242424] mr-[70px] w-[120px] relative h-full rounded-l-xl flex justify-center items-center with-triangle triangle">
				<Logo className="w-10 h-10 fill-white" />
				{/* <Image src={Logo} alt="logo" width={60} height={60} objectFit="contain" /> */}
				{/* <p className="uppercase text-xl text-white font-bold mr-10">ylg</p> */}
			</div>

			{/* Navbar Links */}
			<div className="flex h-full w-full pr-12 bg-[#ffffff] rounded-r-xl items-center justify-between white-triangle-reverted with-triangle">
				<button className="sm:hidden" onClick={openMobileMenuHandler}>
					<Burger className="w-10 h-2" />
				</button>
				<div className="hidden sm:flex">
					{LINKS.map((link) => (
						<Link key={link.id} href={link.url}>
							<a className="flex text-md text-[#242424] uppercase underline underline-offset-8 underline-color decoration-[#90E040] mr-4">
								{link.icon && (
									<span className="mr-2">
										{link.icon}
									</span>
								)}
									{link.title}
							</a>
						</Link>
					))}
				</div>
				{/* user account*/}
				<div className=" relative flex items-center">
					<Account />
					<div className="h-12 w-[1px] bg-[#242424] mx-4 opacity-30"></div>
					<button
						className="h-8 w-8 rounded-full bg-[#F3F4F6] shrink-0 flex justify-center items-center"
						onClick={eventsModalOpenHandler}
					>
						<Bell />
					</button>
				</div>
			</div>


			{/* Mobile menu */}
			{openMobileMenu && (
				<div ref={ref} className="flex absolute top-full items-start mt-3 right-3 left-3 justify-between px-4 py-5 rounded-xl bg-[#242424] z-10">
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
			{/*	events modal*/}
			{eventsModalOpen && (
				<div className="fixed w-screen h-screen bg-[#242424] top-0 left-0 bg-opacity-50 z-10 flex justify-end">
					<button
						className="hidden md:flex w-10 h-10 bg-[#f2f3f5] rounded-full justify-center items-center mr-8 mt-20"
						onClick={eventsModalCloseHandler}
					>
						<Cross className="w-5 h-5 stroke-[#242424]" />
					</button>
					<div className="max-w-2xl w-full h-screen bg-[#F2F3F5] opacity-100 shrink-0 pt-10 md:pt-20 px-10">
						<button
							className="flex md:hidden w-10 h-10 ml-auto bg-[#f2f3f5] rounded-full justify-center items-center mb-8"
							onClick={eventsModalCloseHandler}
						>
							<Cross className="w-5 h-5 stroke-[#242424]" />
						</button>
						<div className="flex justify-between items-end mb-8">
							<h2 className="text-5xl uppercase font-bold">Events</h2>
							<Link href="/">
								<a className="uppercase underline underline-offset-8 underline-color decoration-[#d9d9db] text-[#737373]">
									Read all
								</a>
							</Link>
						</div>
						<div className="relative h-14 mb-8">
							<input className="bg-[#dedede] bg-opacity-50 pl-4 border-none focus:focus-visible:outline-none appearance-none w-full h-full rounded-lg" type="text" placeholder="Find a notice"/>
							<Search className="absolute right-4 top-[50%] -translate-y-1/2" />
						</div>
						<div className="flex justify-between">
							<span>1 new notice</span>
							<span>Total notifications 2</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Navbar;
