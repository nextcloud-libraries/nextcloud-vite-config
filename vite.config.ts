import type { Plugin } from 'vite'
import { nodeExternals } from 'rollup-plugin-node-externals'
import { defineConfig } from 'vite'

import dtsPlugin from 'vite-plugin-dts'

const nodePlugin = nodeExternals({ include: [/vite-plugin-css-injected-by-js/] }) as Plugin
nodePlugin.enforce = 'pre'

export default defineConfig({
	plugins: [
		nodePlugin,
		dtsPlugin({ rollupTypes: true }),
	],
	build: {
		minify: false,
		lib: {
			entry: {
				index: 'lib/index.ts',
			},
			formats: ['es'],
		},
	},
})
