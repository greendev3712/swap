import React, { useState, useRef, useEffect } from "react";
import Logo from "../assets/Logoemblem.svg";
import Link from "next/link";
import Account from "./Account";
import Burger from '../assets/burger.svg';
import Cross from '../assets/cross.svg';
import EventsModal from "./EventsModal";
import { useMoralis } from "react-moralis";

const navLinks = [
	{
		id: 1,
		title: "Marketplace",
		url: "https://nft.yourlifegames.com/",
		icon: <MarketPlaceSVG />,
	},
	{
		id: 2,
		title: "My account",
		url: "https://nft.yourlifegames.com/myaccount",
	},
	{
		id: 3,
		title: "Collections",
		url: "https://nft.yourlifegames.com/collections",
	},
	{
		id: 4,
		title: "Chat",
		url: "https://nft.yourlifegames.com/chat",
	},
];

const Navbar = ({ setIsLoading }) => {
	const ref = useRef(null);
	const [openMobileMenu, setOpenMobileMenu] = useState(false);
	const [eventsModalOpen, setEventsModalOpen] = useState(false);
	const [tokenURI, setTokenURI] = useState("")
	const { authenticate, isAuthenticated, user } = useMoralis();

	const authUser = async () => {
		await authenticate({
			provider: 'web3Auth',
			chainId: '0x61',
			theme: 'light',
			clientId: 'BKNZR_vNmy3w-Ni4p2q1-RX-xq00yFvutjahw_TuAQJps7Xd-2d_dV9AlRO_Mz7tSWgjMjdcbfhrQ9QNXXouWNI',
		});
	}

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

	useEffect(() => {
		setTokenURI(`?token=${user?.id}`)
	}, [isAuthenticated])

	return (
		<div className="w-full px-3 h-20 text-center relative flex shrink-0 items-center">
			{/* logo container */}
			<div className="bg-[#242424] mr-[70px] min-w-[120px] relative h-full rounded-l-xl flex justify-center items-center with-triangle triangle">
				<Logo className="w-10 h-10 fill-white" />
				{/* <Image src={Logo} alt="logo" width={60} height={60} objectFit="contain" /> */}
				{/* <p className="uppercase text-xl text-white font-bold mr-10">ylg</p> */}
			</div>

			{/* Navbar Links */}
			<div className="flex h-full w-full pr-6 sm:pr-12 bg-[#ffffff] rounded-r-xl items-center justify-between white-triangle-reverted with-triangle">
				<button className="sm: hidden" onClick={openMobileMenuHandler}>
					<Burger className="w-10 h-2" />
				</button>
				<div className="flex">
					{navLinks.map((link) => (
						<Link key={link.id} href={`${link.url}${tokenURI}`}>
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
					<Account
						setIsLoading={setIsLoading}
						openEventsModal={eventsModalOpenHandler}
						onAuth={authUser}
					/>
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
						<button
							onClick={authUser}
							type="button"
							className="flex items-center bg-[#3985F5] py-2 px-6 rounded-lg sm:ml-20 text-white uppercase h-10"
						>
							authenticate
						</button>
					</div>
					<button onClick={closeMobileMenuHandler}>
						<Cross className="w-5 h-5" />
					</button>
				</div>
			)}
			{/*	events modal*/}
			{eventsModalOpen && (
				<EventsModal onClose={eventsModalCloseHandler} />
			)}
		</div>
	);
};

export default Navbar;
