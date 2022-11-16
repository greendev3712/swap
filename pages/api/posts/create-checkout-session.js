const PRIVATE_KEY = process.env.NEXT_STRIPE_PRIVATE_KEY;
const stripe = require("stripe")(PRIVATE_KEY);
const Moralis = require("moralis-v1/node");
const crypto = require('crypto');
const CryptoJS = require('crypto-js');

export default async function CreateStripeSession(req, res) {
  const env = {
    APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    APP_SERVER_URL: process.env.NECT_PUBLIC_APP_SERVER_URL,
    APP_MASTER_KEY: process.env.NEXT_PRIVATE_APP_MASTER_KEY
  }

  if (req.method === 'POST') {
    const { item } = req.body;
    const redirectURL = "https://swap.yourlifegames.com";
    await Moralis?.start({ serverUrl: env.APP_SERVER_URL, appId: env.APP_ID, masterKey: env.APP_MASTER_KEY })
    if (item.address.length < 10 || item.email.length < 3 || item.price.length == 0 || item.amount <= 0)
      res.status(500).json({ msg: "Internal Server Error!!!" });

    const transformedItem = {
      price_data: {
        currency: 'usd', product_data: {
          images: [item.image], name: item.name
        }, unit_amount: item.price * 100
      }, description: 'description', quantity: item.quantity
    }

    const hash_0 = crypto.createHash('md5').update((item.email + Date.now()).toString()).digest('hex');
    const hash_1 = crypto.createHash('sha256').update((Date.now().toString() + item.amount + Math.random().toString() + item.price).toString()).digest('hex');
    const hash_2 = crypto.createHash('md4').update((Math.random() + Date.now()).toString()).digest('hex');

    const str = hash_0 + hash_1 + hash_2;

    const passphrase = 'iorioumioucv34oucf90u9d824h89';

    let encode = CryptoJS.AES.encrypt(str, passphrase).toString();

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], line_items: [transformedItem], mode: 'payment', success_url: redirectURL + '?status=success&token=' + encode, cancel_url: redirectURL + '?status=cancel', metadata: {
          images: item.image
        }
      });

      const data = {
        email: item.email,
        address: item.address,
        amount: item.price,
        token_amount: item.amount + "",
        token: hash_1
      }
      await Moralis?.Cloud.run("saveTempFile", data);
      res.status(200).json({ id: session.id });
    } catch (err) {
      res.status(500).json({ msg: err });
    }
  }
}
