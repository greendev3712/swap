import { ethers } from "ethers";
import { useState } from "react";

const useSwap = () => {
  const { account, chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchSwap = async (amount, direction) => {
    try {
      setIsLoading(true);
      let amountIn = ethers.utils.parseUnits(Number(amount).toString(), 18);
      const busdContract = await getContract('BUSDToken', chainId);
    }
  }
}