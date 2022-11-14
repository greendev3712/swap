import { useState, useRef, useEffect } from "react";
import "react-dropdown/style.css";
import WAValidator from "multicoin-address-validator";
import { useMoralis } from "react-moralis";
import Logo from "../assets/Logoemblem.svg"
import { ChainId } from "pancakeswap-v2-testnet-sdk";
import { ethers } from "ethers";
import { useRouter } from "next/router";

import BEP40TokenABI from '../contracts/abi/BEP40Token.json';
import IPancakeSwapPairABI from '../contracts/abi/IPancakeSwapPair.json';
import IUniswapV2Router02ABI from '../contracts/abi/IUniswapV2Router02.json';
import PancakeFactoryABI from '../contracts/abi/PancakeFactory.json';
import YLTABI from '../contracts/abi/YLT.json';

const YLTtokenAddress = "0x7246E5D5c4368896F0dd07794380F7e627e9AF78";
const USDTtokenAddress = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
const RouterAddress = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";

const chainId = ChainId.TESTNET;
const isBrowser = () => typeof window !== 'undefined';

let web3provider;

if (isBrowser()) {
    web3provider = new ethers.providers.Web3Provider(window.ethereum, {
        name: 'binance',
        chainId
    })
}

export default function LiquidityForm({ setIsLoading }) {
    const validateClassNameRef = useRef('');
    const router = useRouter();
    const [token_A_value, setToken_A_value] = useState(0.0)
    const [token_B_value, setToken_B_value] = useState("")
    const [token_A_address, setToken_A_address] = useState(YLTtokenAddress)
    const [token_B_address, setToken_B_address] = useState(USDTtokenAddress);
    const [YLT_balance, setYltBalance] = useState(0.0);

    const { user, isAuthenticated } = useMoralis();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated]);
    /*------------------------------ */
    async function addLiquidity() {
        setIsLoading(true)
        try {
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            console.log(accounts)
            const to = accounts[0]

            const web3provider = new ethers.providers.Web3Provider(window.ethereum, {
                name: "binance",
                chainId
            });
            let metaSigner = web3provider.getSigner(to);
            console.log(metaSigner)

            // token 1
            const token1 = new ethers.Contract(
                token_A_address,
                YLTABI,
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
                RouterAddress,
                IUniswapV2Router02ABI.abi,
                metaSigner
            );

            const factoryAddress = await router.factory();
            const PancakeFactoryContract = new ethers.Contract(factoryAddress, PancakeFactoryABI, metaSigner);
            const pairAddress = await PancakeFactoryContract.getPair(token_A_address, token_B_address);

            let value_A = ethers.utils.parseUnits(Number(token_A_value).toString(), 18);
            let value_B = ethers.utils.parseUnits(Number(token_B_value).toString(), 18);
            let a = await token1.approve(router.address, value_A);
            let b = await token2.approve(router.address, value_B);

            let liq = await router.addLiquidity(
                token_A_address,
                token_B_address,
                value_A,
                value_B,
                0,
                0,
                pairAddress,
                Math.floor(Date.now() / 1000) + 60 * 10
            );
            console.log(liq);
            setTimeout(() => {
                setIsLoading(false)
                location.reload()
            }, 1000)
        } catch (err) {
            console.log(err)
        }
    }

    // ----
    const isTransactionMined = async (transactionHash) => {
        const txReceipt = await web3provider.getTransactionReceipt(transactionHash);
        if (txReceipt && txReceipt.blockNumber) {
            return txReceipt;
        }
    }
    // --------------------------------
    useEffect(() => {
        const fetchPariAsync = async () => {
            await fetchPair();
            await getBalance();
        }
        if (isAuthenticated) {
            fetchPariAsync();
            getBalance();
        }
    }, [token_A_value])

    const getBalance = async () => {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

        const YLTContract = new ethers.Contract(YLTtokenAddress, YLTABI, web3provider);

        let balance = await YLTContract.balanceOf(accounts[0]);
        balance = ethers.utils.formatEther(balance)
        setYltBalance(parseFloat(balance).toFixed(2));
    };

    async function fetchPair() {
        const accounts = await ethereum.request({
            method: 'eth_requestAccounts',
        });
        console.log(accounts)
        const to = accounts[0]
        await web3provider.send('eth_requestAccounts', []);
        let metaSigner = web3provider.getSigner(to);
        // router 
        const router = new ethers.Contract(
            RouterAddress,
            IUniswapV2Router02ABI.abi,
            metaSigner
        );
        if (token_A_value && token_B_address != "") {
            const factoryAddress = await router.factory();
            const PancakeFactoryContract = new ethers.Contract(factoryAddress, PancakeFactoryABI, metaSigner);
            const pairAddress = await PancakeFactoryContract.getPair(token_A_address, token_B_address);
            const PairContract = new ethers.Contract(pairAddress, IPancakeSwapPairABI.abi, metaSigner);
            let reserves = await PairContract.getReserves();
            console.log(ethers.utils.formatEther(reserves[0]), ethers.utils.formatEther(reserves[1]));
            let yourNumber0 = ethers.utils.formatEther(reserves[0]);
            let yourNumber1 = ethers.utils.formatEther(reserves[1]);
            let token2Value = token_A_value * yourNumber0 / yourNumber1;
            setToken_B_value(token2Value);
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

    return (
        <div
            className="max-w-screen-sm w-full bg-white relative flex flex-col border-2 border-[#90e040] rounded-2xl pt-3 pb-5 px-2.5 mb-10">
            {/* Inner Container */}
            <div className="relative flex flex-col mb-7">
                <div className="w-full relative mb-4">
                    <div className="absolute right-5 top-2/4 -translate-y-2/4 flex flex-col items-end">
                        <div className=" py-1.5 px-2.5 w-[134px] flex items-center rounded-3xl bg-[#C3EB9B]">
                            <Logo className="h-6 w-6 mr-1.5" />
                            <span className="text-2xl">YLT</span>
                        </div>
                        {isAuthenticated && (
                            <p className="text-sm mt-4">
                                Balance: {YLT_balance}
                            </p>
                        )}
                    </div>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={token_A_value}
                        onChange={(e) => {
                            if (e.target.value <= 0) {
                                e.target.value = 0;
                                return;
                            }
                            setToken_A_value(e.target.value)
                        }}
                        className="form-input h-[100px] text-2xl sm:text-3xl"
                    />
                </div>
                <div className="w-full relative">
                    <input
                        onChange={(e) => {
                            setToken_B_address(e.target.value)
                        }}
                        placeholder="Enter token2 address"
                        className="form-input h-[100px] text-2xl sm:text-3xl"
                        value={token_B_address} />
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={token_B_value}
                        onChange={(e) => {
                            if (e.target.value <= 0) {
                                e.target.value = 0;
                                return;
                            }
                            setToken_B_value(e.target.value)
                        }}
                        className="form-input h-[100px] text-2xl sm:text-3xl"
                    />
                </div>
            </div>
            {token_A_value > 0 && token_B_value > 0 && (
                <div>
                    YLT per USDT - {token_A_value / token_B_value}
                </div>
            )}
            <button
                onClick={addLiquidity}
                type="submit"
                className="w-full h-16 rounded-3xl bg-[#90e040] border-none text-4xl text-white uppercase mx-auto mt-7"
            >
                add liquidity
            </button>
        </div>
    );
}
