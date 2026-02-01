import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	compiler: {
		styledComponents: true
	},

	turbopack: {
		rules: {
			'*.svg': {
				loaders: [
					{
						loader: '@svgr/webpack',
						options: {
							icon: true,
							svgo: true,
							svgoConfig: {
								plugins: [
									{
										name: 'preset-default',
										params: {
											overrides: { removeViewBox: false }
										}
									}
								]
							}
						}
					}
				],
				as: '*.js'
			}
		}
	},
	// тестовое
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'api.test.chat.ktsf.ru',
				port: '',
				pathname: '/media/**'
			},
			{
				protocol: 'https',
				hostname: 'interesnyefakty.org',
				port: '',
				pathname: '/wp-content/uploads/**'
			}
			// ← можно добавить другие хосты при необходимости
		]
	}
};

export default nextConfig;
