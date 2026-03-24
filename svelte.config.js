import adapter from '@sveltejs/adapter-static';
import process from 'node:process';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		})
	},
	paths: {
		base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
	}
};

export default config;
