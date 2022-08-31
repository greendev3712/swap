import Marquee from "react-fast-marquee";

export const Scrolling = () => {
	return (
		<Marquee
			direction="right"
			speed={50}
			gradient={false}
			style={{
				position: "absolute",
				opacity: 0.7,
				overflow: "hidden",
				width: "100%",
				height: "100%",
			}}
		>
			<div className="flex justify-between items-center flex-col w-full h-full -rotate-12">
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
			</div>
			<div className="flex justify-between items-center flex-col w-full h-full -rotate-12">
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
			</div>
			<div className="flex justify-between items-center flex-col w-full h-full -rotate-12">
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
				<p className="text-[9rem] mr-[2rem] drop-shadow-5xl">swap</p>
			</div>
		</Marquee>
	);
};
