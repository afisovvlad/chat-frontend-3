import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
	compiler: {
		styledComponents: true
	},

	// Отключите Turbopack для статики или настройте правильно
	experimental: {
		turbo: {
			resolveAlias: {
				'@': path.resolve(__dirname, 'src'),
				'~': path.resolve(__dirname, 'node_modules')
			}
		}
	},

	// Самый важный параметр для CSS URL
	sassOptions: {
		includePaths: [path.join(__dirname, 'src')],
		// Это позволит использовать относительные пути
		prependData: `@use "sass:math";`
	},

	// Или используйте кастомный webpack
	webpack: config => {
		// Алиасы
		config.resolve.alias = {
			...config.resolve.alias,
			'@': path.resolve(__dirname, 'src'),
			'@/shared': path.resolve(__dirname, 'src/shared')
		};

		return config;
	}
};

export default nextConfig;

// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
// 	compiler: {
// 		styledComponents: true
// 	},

// 	turbopack: {
// 		rules: {
// 			'*.svg': {
// 				loaders: [
// 					{
// 						loader: '@svgr/webpack',
// 						options: {
// 							icon: true,
// 							svgo: true,
// 							svgoConfig: {
// 								plugins: [
// 									{
// 										name: 'preset-default',
// 										params: {
// 											overrides: { removeViewBox: false }
// 										}
// 									}
// 								]
// 							}
// 						}
// 					}
// 				],
// 				as: '*.js'
// 			}
// 		}
// 	}
// };

// export default nextConfig;
