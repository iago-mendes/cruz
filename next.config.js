const withImages = require('next-images')
const withPWA = require('next-pwa')

module.exports = withImages(withPWA(
{
	esModule: true,
	pwa:
	{
		dest: 'public',
		disable: process.env.NODE_ENV === 'development'
	}
}))