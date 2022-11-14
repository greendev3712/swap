const Moralis = require("moralis-v1/node");
const CryptoJS = require('crypto-js');
import { ethers } from "ethers";

import YLTABI from '../../../contracts/abi/YLT.json';

const YLTtokenAddress = "0x7246E5D5c4368896F0dd07794380F7e627e9AF78";


export default async function handle(req, res) {
  const env = {
    APP_ID: "wi3vmn7KB9vehixK5lZ2vOuAfgbJzJNSjum3AkUp",
    APP_SERVER_URL: "https://b3o7m8vdspy1.usemoralis.com:2053/server",
    APP_MASTER_KEY: "zW1oIZN0Muq2OW5bBsAwsbm7pn22IJz1DJtHj2Tb"
  }

  if (req.method === 'POST') {
    let { status, timestamp } = req.body;
    timestamp = timestamp.replace(/ /g, '+');
    await Moralis?.start({ serverUrl: env.APP_SERVER_URL, appId: env.APP_ID, masterKey: env.APP_MASTER_KEY })
    if (status != "success" || timestamp.length < 100)
      res.status(500).json({ msg: "Internal Server Error!!!" });

    const passphrase = 'iorioumioucv34oucf90u9d824h89';
    const bytes = CryptoJS.AES.decrypt(timestamp, passphrase);
    const decode = bytes.toString(CryptoJS.enc.Utf8);

    let token = decode.substr(32, 64);

    let id,
      address,
      amount;
    const res = await Moralis.Cloud.run("getTempFile", { token })
    id = res.id;
    address = res.attributes.address;
    amount = res.attributes.token_amount;

    if (id == null || id == undefined || address == null || address == undefined || amount == null || amount == undefined)
      res.status(500).json({ msg: 'Internal Server Error!!!' });

    console.log('Success!!!!!!!!!!!!!');

    await Moralis.Cloud.run("deleteTempFile", { id: id });

    const privateKey = 'e426d7cb74727e7c4d743c8b081bb1f3af6d280e6ab2fb10cb27581eda12387d';

    let wallet = new ethers.Wallet(privateKey);

    // Connect a wallet to mainnet
    let provider = new ethers.providers.JsonRpcProvider("https://bsctestapi.terminet.io/rpc");

    let walletWithProvider = new ethers.Wallet(privateKey, provider);

    const YLTContract = new ethers.Contract(YLTtokenAddress, YLTABI, walletWithProvider);
    let tx = await YLTContract.transfer(address, ethers.utils.parseUnits(Number(amount).toString(), 18));
    await tx.wait();
    console.log(tx.hash);

    res.status(200).json({ msg: 'success' });
  }
}
