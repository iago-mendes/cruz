const withImages = require('next-images')
module.exports = withImages(
{
	esModule: true,
	publicRuntimeConfig:
	{
		apiUrl: process.env.API_URL,
		apiKey: process.env.API_KEY
	}
})