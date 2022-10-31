import { useState, useRef, useEffect } from "react";
import { Scrolling } from "../components/Scrolling";
import CurrencyDropdown from "../components/CurrencyDropdown";
import "react-dropdown/style.css";
import WAValidator from "multicoin-address-validator";
import { rates } from "../utils/helperFunction";
import Navbar from "../components/Navbar";
import { useMoralis } from "react-moralis";
import USDTLogo from '../assets/usdt.png';
import USDLogo from '../assets/usd.png';
import Footer from "../components/Footer";
import Logo from "../assets/Logoemblem.svg"
import {
    ChainId,
    Fetcher,
    Route,
    Trade,
    TokenAmount,
    TradeType,
    Percent,
    Currency, currencyEquals, ETHER, WETH
} from "pancakeswap-v2-testnet-sdk";
import { BigNumber, ethers } from "ethers";

/*--------------strat-----------------*/
// import { BigNumber } from '@ethersproject/bignumber'
// import { TransactionResponse } from '@ethersproject/providers'
// // import { Currency, currencyEquals, ETHER, TokenAmount, WETH } from '@pancakeswap-libs/sdk'

// import { useActiveWeb3React } from '../hooks'
// import { useCurrency } from '../hooks/Tokens'
// import { ApprovalState, useApproveCallback } from '../hooks/useApproveCallback'
// import { Field } from '../state/mint/actions'
// import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../state/mint/hooks'
// import { useTransactionAdder } from '../state/transactions/hooks'
// import { useIsExpertMode, useUserDeadline, useUserSlippageTolerance } from '../state/user/hooks'
// import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../utils_copy'
// import { wrappedCurrency } from '../utils_copy/wrappedCurrency'
// import useI18n from '../hooks/useI18n'
// import { ROUTER_ADDRESS } from '../../constants'
/*-----end-------*/


const chainId = ChainId.TESTNET;
const provider = new ethers.providers.Web3Provider(window.ethereum, { name: 'binance', chainId })

const currencies = [
    { id: 1, title: "USDT", image: USDTLogo },
    { id: 2, title: "USD", image: USDLogo },
];

export default function Home() {
    const validateClassNameRef = useRef('');
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
    const [token_A_value, setToken_A_value] = useState(0)
    const [token_B_value, setToken_B_value] = useState("")
    const [walletAddress, setWalletAddress] = useState("");
    const [email, setEmail] = useState("");
    const [rate, setRate] = useState(rates[0]);
    const [ylt, setYlt] = useState(0);
    const [reverted, setReverted] = useState(false);
    const { user } = useMoralis();
    const [token_A_address, setToken_A_address] = useState("0x8e0B7Ced8867D512C75335883805cD564c343cB9")
    const [token_B_address, setToken_B_address] = useState('')

    /*------------------------------ */
    async function addLiquidity() {
        try {
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            console.log(accounts)
            const to = accounts[0]
            await provider.send('eth_requestAccounts', []);
            let metaSigner = provider.getSigner(to);
            console.log(metaSigner)

            // factory contract
            const factory = new ethers.Contract(
                "0x5Fe5cC0122403f06abE2A75DBba1860Edb762985",
                [
                    "function createPair(address tokenA, address tokenB) external returns (address pair)", "function getPair(address tokenA, address tokenB) external view returns (address pair)"
                ],
                metaSigner
            );

            // token 1
            const token1 = new ethers.Contract(
                token_A_address,
                [
                    "function approve(address spender, uint256 amount) external returns(bool isApprove)",
                ],
                metaSigner
            );

            // token 2
            const token2 = new ethers.Contract(
                token_B_address,
                [
                    "function approve(address spender, uint256 amount) external returns(bool isApprove)",
                ],
                metaSigner
            );

            // router 
            const router = new ethers.Contract(
                "0xCc7aDc94F3D80127849D2b41b6439b7CF1eB4Ae0",
                [
                    "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
                    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"
                ],
                metaSigner
            );
            const pairAddress = await factory.getPair(token_A_address, token_B_address)
            // const Pair = new ethers.Contract(pairAddress,
            //     [
            //         "function balanceOf(address owner) external view returns (uint)"
            //     ]
            // )
            console.log(token_A_address, token_B_address, "-------token address")
            console.log(factory, token1, token2, router)

            // const pairAddress = await factory.createPair.call(token_A_address, token_B_address);
            console.log("pairAddress")
            console.log("hello")
            // console.log(Pair)
            if (pairAddress == "0x0000000000000000000000000000000000000000") {
                // pair doesnt exist
                // create pair and
                // const pairAddress = await factory.createPair.call(token1.address, token2.address);
                // const tx = await factory.createPair(token_A_address, token_B_address);
                // console.log(tx,pairAddress)
                console.log(typeof Pair)

            } else {
                console.log("first")

                let a = await token1.approve(router.address, token_A_value);
                console.log(a.hash)
                let txT_A = await isTransactionMined(a.hash)
                console.log(a, txT_A)
                let b = await token2.approve(router.address, token_B_value);
                let txT_B = await isTransactionMined(b.hash)
                console.log(b, txT_B)
                let liq = await router.addLiquidity(
                    token_A_address,
                    token_B_address,
                    token_A_value,
                    token_B_value,
                    token_A_value,
                    token_B_value,
                    to,
                    Math.floor(Date.now() / 1000) + 60 * 10
                );
                console.log(liq)
                // console.log(Pair.balanceOf(to))

            }


            // console.log(tx)
            // await token1.approve(router.address, 10000);
            // await token2.approve(router.address, 10000);
            // let lqdt = await router.addLiquidity(
            //     token_A_address,
            //     token_B_address,
            //     10000,
            //     10000,
            //     10000,
            //     10000,
            //     to,
            //     Math.floor(Date.now() / 1000) + 60 * 10
            // );
            // console.log(lqdt)
            // const pair = await Pair.at(pairAddress);
            // const balance = await pair.balanceOf(admin);




        } catch (err) {
            console.log(err)
        }
    }

    // ----
    const isTransactionMined = async (transactionHash) => {
        const txReceipt = await provider.getTransactionReceipt(transactionHash);
        if (txReceipt && txReceipt.blockNumber) {
            return txReceipt;
        }
    }

    // --------------------------------
    useEffect(() => {
        fetchPair()
    }, [token_A_value])

    async function fetchPair() {
        const provider = new ethers.providers.Web3Provider(window.ethereum, { name: 'binance', chainId })
        const accounts = await ethereum.request({
            method: 'eth_requestAccounts',
        });
        console.log(accounts)
        const to = accounts[0]
        await provider.send('eth_requestAccounts', []);
        let metaSigner = provider.getSigner(to);
        // router 
        const router = new ethers.Contract(
            "0xCc7aDc94F3D80127849D2b41b6439b7CF1eB4Ae0",
            [
                "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
                "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"
            ],
            metaSigner
        );
        if (token_A_value && token_B_address != "") {
            console.log(token_A_value, [token_A_address, token_B_address])
            let amountOut = await router.getAmountsOut(token_A_value, [token_A_address, token_B_address])
            let yourNumber0 = parseInt(amountOut[0]._hex, 16);
            let yourNumber1 = parseInt(amountOut[1]._hex, 16);
            console.log(amountOut)
            console.log(yourNumber0, yourNumber1)
            setToken_B_value(yourNumber1)

        }
    }
    /*------------------------------ */

    const validateWalletAddress = (e) => {
        setWalletAddress(e.target.value);

        const valid = WAValidator.validate(e.target.value, "BNB");

        if (valid) {
            validateClassNameRef.current = 'border-2 border-green-500';
        } else {
            validateClassNameRef.current = 'border-2 border-red-500';
        }
    };



    // stripe payment initiator


    return (
        // Layout
        <div className="bg-[#f6f6f7] h-screen w-full relative overflow-x-hidden mx-auto flex flex-col justify-between pt-6 items-center">
            {/* Main Container */}
            <Scrolling />

            <Navbar />

            {/* Input Container */}
            <div className="max-w-screen-sm w-full bg-white relative flex flex-col border-2 border-[#90e040] rounded-2xl pt-3 pb-5 px-2.5">

                {/* Inner Container */}
                <div className="relative text-5xl flex flex-col mb-7">
                    <div className="w-full relative">
                        <input
                            onChange={(e) => {
                                setToken_A_address(e.target.value)
                            }}
                            value={token_A_address}
                            placeholder="Enter token1 address"
                            className="form-input h-[90px] text-2xl sm:text-5xl" />
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={token_A_value}
                            onChange={(e) => {
                                setToken_A_value(e.target.value)

                            }}
                            className="form-input h-[100px] text-2xl sm:text-5xl"
                        />
                    </div>
                    <div className="w-full relative">
                        <input
                            onChange={(e) => {
                                setToken_B_address(e.target.value)
                            }}
                            placeholder="Enter token2 address"
                            className="form-input h-[100px] text-2xl sm:text-5xl" />
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={token_B_value}
                            onChange={(e) => {
                                setToken_B_value(e.target.value)
                            }}
                            className="form-input h-[100px] text-2xl sm:text-5xl"
                        />
                    </div>
                    {/* Swap Icon */}
                    <button

                        className="w-14 h-14 z-[1] text-[#90e040] bg-[#f6f6f7] -translate-x-2/4 -translate-y-2/4 text-2xl border border-white rounded-full absolute top-2/4 left-2/4"
                    >
                        &#8645;
                    </button>
                    {/* Rest Inputs */}

                </div>

                <label
                    htmlFor="walletAddress"
                    className="mt-5 w-[97%] mx-auto text-gray-500 text-xs"
                >
                    Your wallet must be BEP-20 compatible
                </label>
                <input
                    id="walletAddress"
                    type="text"
                    placeholder="Enter your crypto wallet address"
                    value={walletAddress}
                    onChange={(e) => validateWalletAddress(e)}
                    className={`form-input font-normal text-lg ${walletAddress.length > 0 ? validateClassNameRef.current : ''
                        }`}
                />
                {!user && (
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input text-lg font-normal"
                    />
                )}
                <button
                    onClick={addLiquidity}
                    type="submit"
                    className="w-full h-16 rounded-3xl bg-[#90e040] border-none text-4xl text-white uppercase mx-auto mt-7"
                >
                    add liquidity
                </button>


                {/* End Input Container */}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
