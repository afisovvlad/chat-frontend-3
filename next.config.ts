import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: true,

	compiler: {
		styledComponents: true
	},

	// Турбопак включён по умолчанию — просто добавляем пустой объект,
	// чтобы убрать ошибки о "webpack config detected".
	turbopack: {}
};

export default nextConfig;

// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
// 	compiler: {
// 		styledComponents: true
// 	},
// 	reactStrictMode: true,

// 	turbopack: {
// 	rules: {
// 		'*.svg': {
// 			loaders: [
// 				{
// 					loader: '@svgr/webpack',
// 					options: {
// 						icon: true,
// 						svgo: true,
// 						svgoConfig: {
// 							plugins: [
// 								{
// 									name: 'preset-default',
// 									params: {
// 										overrides: { removeViewBox: false }
// 									}
// 								}
// 							]
// 						}
// 					}
// 				}
// 			],
// 			as: '*.js'
// 		}
// 	}
// }
// };

// export default nextConfig;
