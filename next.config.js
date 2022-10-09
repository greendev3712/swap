/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["ipfs.moralis.io"],
	},
};

module.exports = {
	...nextConfig,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: {
				and: [/\.(js|ts)x?$/],
			},
			use: ['@svgr/webpack'],
		})

		return config;
	},

}
