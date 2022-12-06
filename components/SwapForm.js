import { useEffect, useRef, useState } from "react";
import { useMoralis } from "react-moralis";

import { ethers } from "ethers";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from 'next/router';

import { emailValidate } from "../utils/emailValidation";
import CurrencyDropdown from "./CurrencyDropdown";
import USDTLogo from '../assets/usdt.png'
import USDLogo from '../assets/usd.png'
import Logo from '../assets/Logoemblem.svg';

import BEP40TokenABI from '../contracts/abi/BEP40Token.json';
import YLTABI from '../contracts/abi/YLT.json';
import IUniswapV2Router02ABI from '../contracts/abi/IUniswapV2Router02.json';

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID;
const YLTtokenAddress = process.env.NEXT_PUBLIC_YLTtokenAddress;
const USDTtokenAddress = process.env.NEXT_PUBLIC_USDTtokenAddress;
const BUSDtokenAddress = process.env.NEXT_PUBLIC_BUSDtokenAddress;
const RouterAddress = process.env.NEXT_PUBLIC_RouterAddress;

const currencies = [
  {
    id: 1,
    title: "USDT",
    image: USDTLogo
  }, {
    id: 2,
    title: "USD",
    image: USDLogo
  },
];

export default function SwapForm({ setIsLoading }) {
  const validateClassNameRef = useRef("");
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [usdAmount, setUsdAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [email, setEmail] = useState("");
  const [rate, setRate] = useState("");
  const [ylt, setYlt] = useState(0);
  const [yltBalance, setYltBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const chainNetworkId = useRef(0)
  const { user, isAuthenticated, Moralis } = useMoralis();
  const isBrowser = () => typeof window !== 'undefined';
  const router = useRouter();

  useEffect(() => {
    if (!isBrowser()) return;
    if (isBrowser()) init();
  }, [chainNetworkId.current])

  const init = async () => {
    const web3provider = new ethers.providers.Web3Provider(window.ethereum)
    const { chainId } = await web3provider.getNetwork()
    chainNetworkId.current = chainId
  }

  useEffect(() => {
    const { status, token, timestamp } = router.query;
    if (status == "success" && token?.length > 100 && timestamp?.length > 20) {
      axios.post('api/posts/stripeSuccess', {
        status: status,
        timestamp: token
      }).then(res => {
        setTimeout(() => {
          if (timestamp?.length > 20) {
            if (localStorage.getItem(process.env.NEXT_PUBLIC_localStorage) == undefined) {
              Moralis.Cloud.run("getUserById", { id: timestamp }).then((result) => {
                localStorage.setItem(process.env.NEXT_PUBLIC_localStorage, JSON.stringify(result))
                setEmail(result?.attributes.email)
                router.push('/')
                location.reload()
              });
            }
          }
        }, 1000);
      }).catch(err => console.log(err));
    }
    else if (token?.length > 20) {
      if (localStorage.getItem(process.env.NEXT_PUBLIC_localStorage) == undefined) {
        Moralis.Cloud.run("getUserById", { id: token }).then((result) => {
          localStorage.setItem(process.env.NEXT_PUBLIC_localStorage, JSON.stringify(result))
          setEmail(result?.attributes.email)
          location.reload()
        });
      }
    }
  }, [router.isReady])

  async function checkAllowance() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const to = accounts[0];
    let metaSigner = web3provider.getSigner(to);
    // < beta
    const USDTContract = new ethers.Contract(USDTtokenAddress, BEP40TokenABI, metaSigner);

    const allowance = await USDTContract.allowance(to, RouterAddress)

    let ans = parseInt(allowance, 16);
    return ans
  }

  const addEmail = async () => {
    const { id } = user;
    await Moralis.Cloud.run("addEmail", { id, email });
  };

  const canSwap = () => {
    let hasError = false;
    
    if (selectedCurrency.id == 2 && usdAmount < 0.6)
    {
      hasError = true;
      return hasError;
    }

    if (ylt <= 0 && usdAmount <= 0)
    {
      hasError = true;
      return hasError;
    }

    if (!ylt && !usdAmount) {
      hasError = true;
      return hasError;
    }

    if (user && !user?.attributes.email && !email) {
      hasError = true;
      return hasError;
    }
    if (email && !emailValidate(email)) {
      hasError = true;
      return hasError;
    }

    if (user && !user?.attributes.ethAddress && !walletAddress) {
      hasError = true;
      return hasError;
    }

    return hasError;
  };

  async function initSwap() {
    if (chainNetworkId.current != process.env.NEXT_PUBLIC_CHAIN_ID) return;

    const web3provider = new ethers.providers.Web3Provider(window.ethereum, {
      name: "binance",
      chainId: Number(chainId)
    });

    setIsLoading(true);
    if (isAuthenticated && email) {
      await addEmail();
    }

    const amountOutMin = 0;
    const amountIn = usdAmount;
    const path = [USDTtokenAddress, YLTtokenAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const to = accounts[0];
    let metaSigner = web3provider.getSigner(to);

    // contract and its abi
    const RouterContract = new ethers.Contract(RouterAddress, IUniswapV2Router02ABI.abi, metaSigner);
    const USDTContract = new ethers.Contract(USDTtokenAddress, BEP40TokenABI, metaSigner);

    let tx = await USDTContract.approve(RouterAddress, ethers.utils.parseUnits(Number(amountIn).toString(), 18))
    await tx.wait();

    // transaction to carry
    tx = await RouterContract.swapExactTokensForTokens(ethers.utils.parseUnits(Number(amountIn).toString(), 18), amountOutMin, path, to, deadline);
    await tx.wait();

    await getBalance();
    setIsLoading(false);
    // MetaMask requires requesting permission to connect users accounts
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
  }
  async function secondSwap() {
    const web3provider = new ethers.providers.Web3Provider(window.ethereum, {
      name: "binance",
      chainId: Number(chainId)
    });

    setIsLoading(true);
    if (isAuthenticated && email) {
      await addEmail();
    }

    const amountOutMin = 0;
    const amountIn = ylt;
    const path = [YLTtokenAddress, USDTtokenAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const to = accounts[0];
    let metaSigner = web3provider.getSigner(to);

    // contract and its abi
    const RouterContract = new ethers.Contract(RouterAddress, IUniswapV2Router02ABI.abi, metaSigner);
    const YLTContract = new ethers.Contract(YLTtokenAddress, YLTABI, metaSigner);
    let tx = await YLTContract.approve(RouterAddress, ethers.utils.parseUnits(Number(amountIn).toString(), 18))
    await tx.wait();

    // transaction to carry
    tx = await RouterContract.swapExactTokensForTokens(ethers.utils.parseUnits(Number(amountIn).toString(), 18), amountOutMin, path, to, deadline);
    await tx.wait();
    await getBalance();
    setIsLoading(false);
    // MetaMask requires requesting permission to connect users accounts
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
  }

  const changeRate = async () => {
    try {
      if (!isBrowser()) return;
      if (chainNetworkId.current != process.env.NEXT_PUBLIC_CHAIN_ID) return;

      const web3provider = new ethers.providers.Web3Provider(window.ethereum, {
        name: "binance",
        chainId: Number(chainId)
      });
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const to = accounts[0]
      let metaSigner = web3provider.getSigner(to);

      let routerContract = new ethers.Contract(RouterAddress, IUniswapV2Router02ABI.abi, metaSigner);
      let swapAmount = ethers.utils.parseUnits('1', 18);
      let amountsOut = await routerContract.getAmountsOut(swapAmount.toString(), [USDTtokenAddress, YLTtokenAddress]);
      let currentRate = ethers.utils.formatEther(amountsOut[1]);

      setRate(Number.parseFloat(currentRate).toFixed(6));
    } catch (error) {
      console.log(error);
    }

  };

  const validateWalletAddress = (address) => {
    const valid = WAValidator.validate(address, "BNB");

    if (valid) {
      validateClassNameRef.current = "border-2 border-green-500";
    } else {
      validateClassNameRef.current = "border-2 border-red-500";
    }
  };

  const changeWalletValue = (value) => {
    setWalletAddress(value);
    validateWalletAddress(value);
  };

  const changeCurrentCurrency = (id) => {
    const found = currencies.find((currency) => currency.id === id);

    setSelectedCurrency(found);
  };

  const getBalance = async () => {
    if (chainNetworkId.current != process.env.NEXT_PUBLIC_CHAIN_ID) return;

    const web3provider = new ethers.providers.Web3Provider(window.ethereum, {
      name: "binance",
      chainId: Number(chainId)
    });

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    const YLTContract = new ethers.Contract(YLTtokenAddress, YLTABI, web3provider);
    const balance = await YLTContract.balanceOf(accounts[0]);
    setYltBalance(balance.toString() / 10 ** 18);

    const USDTContract = new ethers.Contract(USDTtokenAddress, BEP40TokenABI, web3provider);
    const usdtBalance = await USDTContract.balanceOf(accounts[0]);
    setUsdtBalance(usdtBalance.toString() / 10 ** 18);
  };

  useEffect(() => {
    if (isBrowser()) init()
    const getBalanceAsync = async () => {
      await getBalance();
    }
    if (isAuthenticated) {
      getBalanceAsync();
    }
  }, [isAuthenticated, chainNetworkId.current]);

  useEffect(() => {
    if (isBrowser()) init()
    changeRate();
  }, [chainNetworkId.current]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const [item, setItem] = useState({
    name: 'YL Token',
    description: 'Latest Apple AirPods.',
    image: appUrl + '/assets/LogoYLGWhite.png',
    quantity: 1,
    price: 9,
    email: '',
    address: '',
    amount: '',
    token: ''
  });
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(publishableKey);

  const createCheckoutSession = async () => {
    if (isBrowser()) init()
    if (chainNetworkId.current != process.env.NEXT_PUBLIC_CHAIN_ID) return;
    
    setIsLoading(true);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const to = accounts[0];
    stripePromise.then(stripe => {
      item.price = usdAmount;
      item.address = to;
      item.amount = ylt;
      item.email = !user?.attributes.email ? email : user?.attributes.email;
      item.token = user?.id;
      axios.post('api/posts/create-checkout-session', { item: item }).then(checkoutSession => {
        stripe.redirectToCheckout({ sessionId: checkoutSession.data.id }).then(result => {
          if (result.error) {
            alert(result.error.message);
          }
        });
      }).catch(err => {
        setIsLoading(false);
        console.log(err)
      });

    });
  }
  
  return (<div className="sm:max-w-screen-sm sm:w-full bg-white relative mx-3 flex flex-col border-2 border-[#90e040] rounded-2xl pt-3 pb-5 px-2.5 my-10"> {/* Inner Container */}
    <div className="relative text-5xl flex flex-col mb-7">
      <div className="w-full relative">
        <div className="absolute right-5 top-2/4 -translate-y-2/4 flex flex-col items-end">
          <CurrencyDropdown options={currencies}
            selected={selectedCurrency}
            onChange={changeCurrentCurrency} /> {
            isAuthenticated && selectedCurrency.id !== 2 && (<p className="text-sm mt-4">
              Balance: {
                usdtBalance.toFixed(2)
              } </p>)
          } </div>
        <input type="number" placeholder="Enter amount"
          value={usdAmount}
          onChange={
            (e) => {
              if (e.target.value < 0) {
                e.target.value = 0;
                return;
              }
              setUsdAmount(e.target.value);
              setYlt(e.target.value * rate);
            }
          }
          className="form-input h-[100px] text-2xl sm:text-3xl" />
      </div>
      {/* Rest Inputs */}
      <div className="w-full relative">
        <div className="absolute right-5 top-2/4 -translate-y-2/4 flex flex-col items-end">
          <div className=" py-1.5 px-2.5 w-[134px] flex items-center rounded-3xl bg-[#C3EB9B]">
            <Logo className="h-6 w-6 mr-1.5" />
            <span className="text-2xl">YLT</span>
          </div>
          {
            isAuthenticated && (<p className="text-sm mt-4">
              Balance: {
                yltBalance.toFixed(2)
              } </p>)
          } </div>
        <input type="number" placeholder="YLT Token Amount"
          value={ylt}
          onChange={
            (e) => {
              if (e.target.value < 0) {
                e.target.value = 0;
                return;
              }
              setYlt(e.target.value);
              setUsdAmount(e.target.value / rate);
            }
          }
          className="form-input mt-2 w-full h-[100px] text-2xl sm:text-3xl" />
      </div>
    </div>

    {
      !user?.attributes.ethAddress && (<>
        <label htmlFor="walletAddress" className="mt-5 w-[97%] mx-auto text-gray-500 text-xs">
          Your wallet must be BEP-20 compatible
        </label>
        <input id="walletAddress" type="text" placeholder="Enter your crypto wallet address"
          value={walletAddress}
          onChange={
            (e) => changeWalletValue(e.target.value)
          }
          className={
            `form-input font-normal text-lg ${walletAddress.length > 0 ? validateClassNameRef.current : ""
            }`
          } />
      </>)}
    {
      !user?.attributes.email && (<input type="email" placeholder="Enter your email address"
        value={email}
        onChange={
          (e) => setEmail(e.target.value)
        }
        className="form-input text-lg font-normal" />)}
    {
      rate > 0 && (<button type="button" className="bg-transparent self-end mt-4"
        onClick={changeRate}>
        1$/{rate}
        - update rate{" "}
        <span className="text-blue-500">&#8635;</span>
      </button>)}
    {
      selectedCurrency.id === 1 ? (<>
        <button onClick={initSwap}
          type="submit"
          className="w-full h-16 rounded-3xl bg-[#90e040] border-none text-4xl text-white uppercase mx-auto mt-7 disabled:bg-gray-300 disabled:text-gray-200"
          disabled={
            canSwap()
          }>
          Swap from CRYPTO( USDT)
        </button>
        {/* <button onClick={secondSwap}
          type="submit"
          className="w-full h-16 rounded-3xl bg-[#90e040] border-none text-4xl text-white uppercase mx-auto mt-7 disabled:bg-gray-300 disabled:text-gray-200"
          disabled={
            canSwap()
          }>
          swap from ylt
        </button> */}
      </>)
        : (<button onClick={createCheckoutSession}

          type="submit"
          className="w-full h-16 rounded-3xl bg-[#546ADA] border-none text-4xl text-white uppercase mx-auto mt-7 disabled:bg-gray-300 disabled:text-gray-200"
          disabled={
            canSwap()
          }>
          Swap From Fiat
        </button>)} </div>)
}
