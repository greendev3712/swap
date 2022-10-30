
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY)

export default async function handler(req, res) {
    console.log(req.body, stripe.checkout);
    if (req.method == "POST") {
        const { quantity, email } = req.body
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                customer_email: email,
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'YLT'
                        },
                        unit_amount: '100'
                    },
                    quantity,
                }],
                success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
                cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`
            })
            console.log(session);
            res.json({ url: session.url })
        } catch (e) {
            res.status(500).json({ error: e.message })

        }
    }
}
