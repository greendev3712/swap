import { useState, useRef, useEffect } from "react";
import "react-dropdown/style.css";
import WAValidator from "multicoin-address-validator";
import { useMoralis } from "react-moralis";
import Logo from "../assets/Logoemblem.svg"
import { ChainId } from "pancakeswap-v2-testnet-sdk";
import { ethers } from "ethers";
import { useRouter } from "next/router";


const chainId = ChainId.TESTNET;
const isBrowser = () => typeof window !== 'undefined';

let web3provider;

if (isBrowser()) {
    web3provider = new ethers.providers.Web3Provider(window.ethereum, {
        name: 'binance',
        chainId
    })
}

export default function LiquidityForm() {
    const validateClassNameRef = useRef('');
    const router = useRouter();
    const [token_A_value, setToken_A_value] = useState(0)
    const [token_B_value, setToken_B_value] = useState("")
    const [token_A_address, setToken_A_address] = useState("0x8e0B7Ced8867D512C75335883805cD564c343cB9")
    const [token_B_address, setToken_B_address] = useState('')

    const { user, isAuthenticated } = useMoralis();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated]);
    /*------------------------------ */
    async function addLiquidity() {
        try {
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            console.log(accounts)
            const to = accounts[0]
            await web3provider.send('eth_requestAccounts', []);
            let metaSigner = web3provider.getSigner(to);
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
            if (pairAddress != "0x0000000000000000000000000000000000000000") {
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

            }
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
        if (isAuthenticated) {
            fetchPair()
        }
    }, [token_A_value])

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
                                {/*Balance: {yltBalance.toFixed(2)}*/}
                                Balance: 1231
                            </p>
                        )}
                    </div>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={token_A_value}
                        onChange={(e) => {
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
                        className="form-input h-[100px] text-2xl sm:text-3xl" />
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={token_B_value}
                        onChange={(e) => {
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
