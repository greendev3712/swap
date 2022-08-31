import React from "react";

export const Input = ({
	value,
	placeholder,
	type,
	setValue,
	wallet,
	amount,
	token,
}) => (
	<input
		type={type}
		placeholder={placeholder}
		value={value}
		onChange={(e) => setValue(e.target.value)}
		className={`w-[98%] h-[3rem] rounded-2xl bg-[#f6f6f7] border-none text-2xl font-bold text-[#242424] mx-auto text-left p-8 pl-4 mb-2 outline-none ${
			wallet && "text-base font-normal p-4"
		} ${amount && "w-[100%]"}
      ${token && "mt-2 mb-10"}
    `}
	/>
);
