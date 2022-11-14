const Moralis = require("moralis-v1/node");
const CryptoJS = require('crypto-js');
import { ethers } from "ethers";

import YLTABI from '../../../contracts/abi/YLT.json';

const YLTtokenAddress = "0x7246E5D5c4368896F0dd07794380F7e627e9AF78";


export default async function handle(req, res) {
  const env = {
    APP_ID: "wi3vmn7KB9vehixK5lZ2vOuAfgbJzJNSjum3AkUp",
    APP_SERVER_URL: "https://b3o7m8vdspy1.usemoralis.com:2053/server"
  }

  if (req.method === 'POST') {
    let { status, timestamp } = req.body;
    timestamp = timestamp.replace(/ /g, '+');
    res.status(500).json({ msg: timestamp });
    if (status != "success" || timestamp.length < 100)
      res.status(500).json({ msg: "Internal Server Error!!!" });

    const passphrase = 'iorioumioucv34oucf90u9d824h89';
    const bytes = CryptoJS.AES.decrypt(timestamp, passphrase);
    const decode = bytes.toString(CryptoJS.enc.Utf8);

    let token = decode.substr(32, 64);
    res.status(500).json({ msg: token });
    Moralis.start({ serverUrl: env.APP_SERVER_URL, appId: env.APP_ID }).then(() => {
      let id,
        address,
        amount;
      Moralis.Cloud.run("getTempFile", { token }).then(async res => {
        console.log(res);
        id = res.id;
        address = res.attributes.address;
        amount = res.attributes.token_amount;
        console.log(address);

        if (id == null || id == undefined || address == null || address == undefined || amount == null || amount == undefined)
          res.status(500).json({ msg: 'Internal Server Error!!!' });



        console.log('Success!!!!!!!!!!!!!');

        Moralis.Cloud.run("deleteTempFile", { id: id }).then(res => { }).catch(err => console.log(err));

        const privateKey = 'e426d7cb74727e7c4d743c8b081bb1f3af6d280e6ab2fb10cb27581eda12387d';

        let wallet = new ethers.Wallet(privateKey);

        // Connect a wallet to mainnet
        let provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s3.binance.org:8545");

        let walletWithProvider = new ethers.Wallet(privateKey, provider);

        const YLTContract = new ethers.Contract(YLTtokenAddress, YLTABI, walletWithProvider);
        console.log('Contracyt0');
        let tx = await YLTContract.transfer(address, ethers.utils.parseUnits(Number(amount).toString(), 18));
        await tx.wait();
        console.log(tx.hash);

      }).catch(err => console.log(err));

    }).catch(err => console.log(err));

    res.status(200).json({ msg: 'success' });
  }
}
