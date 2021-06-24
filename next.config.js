const withImages = require('next-images')
const withPWA = require('next-pwa')

module.exports = withImages(withPWA(
{
	esModule: true,
	publicRuntimeConfig:
	{
		apiUrl: process.env.API_URL,
		apiKey: process.env.API_KEY
	},
	pwa:
	{
		dest: 'public',
		disable: process.env.NODE_ENV === 'development'
	},
	eslint: {
		ignoreDuringBuilds: true
	}
}))