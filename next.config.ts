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
		remotePatterns: [new URL('https://interesnyefakty.org/**')]
	}
};

export default nextConfig;
