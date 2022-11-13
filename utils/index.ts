import BEP40TokenABI from '../contracts/abi/BEP40Token.json';
import PancakeRouterABI from '../contracts/abi/PancakeRouter.json';
import YLTABI from '../contracts/abi/YLT.json';

interface ContractInfo {
  address: string,
  abi: any
}

export const Networks = {
  MainNet: 56,
  Testnet: 97
};

export const CONTRACTS_BY_NETWORK: {
  [key: number]: { [key: string]: ContractInfo };
} = {
  [Networks.MainNet]: {
    BUSDToken: {
      address: "",
      abi: ""
    },
    USDToken: {
      address: "",
      abi: ""
    },
    YLTToken: {
      address: "",
      abi: ""
    },
    PancakeRouter: {
      address: "",
      abi: ""
    }
  },
  [Networks.Testnet]: {
    BUSDToken: {
      address: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee";
      abi: ""
    },
    USDToken: {
      address: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
      abi: BEP40TokenABI
    },
    YLTToken: {
      address: "0x8e0B7Ced8867D512C75335883805cD564c343cB9",
      abi: ""
    },
    PancakeRouter: {
      address: "0xCc7aDc94F3D80127849D2b41b6439b7CF1eB4Ae0",
      abi: PancakeRouterABI
    }
  }
}

export const currentNetwork: number = parseInt(process.env.NEXT_APP_NETWORK_TEST_ID);

export function getContractInfo(
  name: string,
  chainId: number | undefined = undefined
) {
  if (!chainId) chainId = currentNetwork;

  const contracts = CONTRACTS_BY_NETWORK?.[chainId]
  if (contracts) {
    return contracts?.[name];
  } else {
    return null;
  }
}

export const getContract = async (
  name: string,
  chainId: number | undefined,
  signer: any
) => {
  const info = getContractInfo(name, chainId);
  return new ethers.Contract(info.address, info.abi, signer);
}