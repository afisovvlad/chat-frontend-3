import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import prettier from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	eslintConfigPrettier,
	globalIgnores(['.next/', 'out/', 'build/', 'next-env.d.ts']),
	{
		plugins: {
			prettier
		},
		rules: {
			...prettier.configs.recommended.rules,
			'prettier/prettier': ['warn', { endOfLine: 'auto' }],
			endOfLine: 'auto',
			'no-var': 'error',
			'prefer-const': 'warn',
			'no-console': 'warn',
			eqeqeq: 'warn',
			curly: 'warn',
			'import/no-anonymous-default-export': 'off'
		}
	}
]);

export default eslintConfig;
