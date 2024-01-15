import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			prependData: `
      @use "src/styles/root/_variables" as *;
			@import "src/styles/root/_mixins.scss";
			`
		},
		postcss: {
			plugins: [autoprefixer()]
		}
	}),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'$components/*': 'src/components/*',
			'$lib/*': 'src/lib/*',
			'$directive/*': 'src/directive/*',
			'$db/*': 'src/db/*',
			'$store/*': 'src/store/*'
		}
	}
};

export default config;
