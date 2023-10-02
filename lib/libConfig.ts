/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { LibraryFormats, UserConfig, UserConfigFn, BuildOptions, Plugin } from 'vite'
import type { BaseOptions } from './baseConfig.js'

import { mergeConfig } from 'vite'
import { createBaseConfig } from './baseConfig.js'

import DTSPlugin, { type PluginOptions as DTSOptions } from 'vite-plugin-dts'
import { nodeExternals, type ExternalsOptions } from 'rollup-plugin-node-externals'
import { ImportCSSPlugin } from './plugins/ImportCSS.js'

type OutputOptions = BuildOptions['rollupOptions']['output']

export interface LibraryOptions extends BaseOptions {
	/**
	 * Options for the rollup node externals plugin
	 *
	 * By default all `dependencies` and `peerDependencies` are marked as external.
	 * And node builtins prefix (`node:`) is stripped to make the library compatible with webpack and `node-polyfill-webpack-plugin`.
	 *
	 * Note: If you use dependencies `@nextcloud/vue/dist/Components/NcButton.js` and what them to be externalized too,
	 * you need to set an include pattern: `{ include: [ /^@nextcloud\/vue/ ]}`
	 */
	nodeExternalsOptions?: ExternalsOptions

	/**
	 * Options for the Vite DTS plugin
	 *
	 * This plugin allows to create .d.ts files for your library including the .vue files
	 * Pass `false` to disable the plugin
	 */
	DTSPluginOptions?: DTSOptions | false

	/**
	 * Formats you like your library to be built
	 * @default ['es']
	 */
	libraryFormats?: LibraryFormats[]
}

/**
 * Create a vite config for your nextcloud libraries
 *
 * @param entries Entry points of your app
 * @param options Options to use
 * @return {UserConfigFn} The vite config
 */
export const createLibConfig = (entries: { [entryAlias: string]: string }, options: LibraryOptions = {}): UserConfigFn => {
	// Add default values for options
	options = { config: {}, nodeExternalsOptions: {}, libraryFormats: ['es'], ...options }

	const node = nodeExternals({
		builtins: true, // Mark all node core modules, like `path` as external
		builtinsPrefix: 'strip', // Strip off `node:` prefix to make packages work with webpack (webpack/webpack#14166 and Richienb/node-polyfill-webpack-plugin#19)
		devDeps: false, // Development dependencies should not be included in the bundle
		peerDeps: true, // Peer dependencies should be by definition external
		deps: true, // Runtime dependencies: Same as with peer dependencies
		...options.nodeExternalsOptions,
	});

	// Order is important, run the plugin first
	(node as Plugin).enforce = 'pre'
	const plugins = [
		// Make dependencies external
		node,
	]

	// Handle inline CSS, this is different on library than on app mode, because app will have a DOM env so styles can injected in the document while libraries might run in node
	if (options.inlineCSS) {
		plugins.push(ImportCSSPlugin())
	}

	// Handle the DTS plugin
	if (options?.DTSPluginOptions !== false) {
		plugins.push(DTSPlugin(options.DTSPluginOptions))
	}

	return createBaseConfig({
		...options,
		// Workaround https://github.com/vitejs/vite/issues/14515
		minify: false,
		config: async (env) => {
			// This config is used to extend or override our base config
			// Make sure we get a user config and not a promise or a user config function
			const userConfig = await Promise.resolve(typeof options.config === 'function' ? options.config(env) : options.config)

			const assetFileNames = (assetInfo) => {
				const extType = assetInfo.name.split('.').pop()
				if (!options.inlineCSS && /css/i.test(extType)) {
					return '[name].css'
				}
				return 'assets/[name]-[hash][extname]'
			}

			// Manually define output options for file extensions
			const outputOptions: OutputOptions = options.libraryFormats.map(format => {
				const extension = format === 'es' ? 'mjs' : (format === 'cjs' ? 'cjs' : `${format}.js`)
				return {
					format,
					hoistTransitiveImports: false, // For libraries this might otherwise introduce side effects
					preserveModules: false,
					assetFileNames,
					entryFileNames: `[name].${extension}`,
					chunkFileNames: `chunks/[name]-[hash].${extension}`,
				}
			})

			return mergeConfig({
				plugins,
				// workaround, see above (https://github.com/vitejs/vite/issues/14515)
				esbuild: {
					minifyIdentifiers: true,
					minifySyntax: true,
					minifyWhitespace: false,
					legalComments: options.minify ? 'none' : 'inline',
					target: undefined,
				},
				build: {
					lib: {
						entry: {
							...entries,
						},
						formats: options.libraryFormats,
					},
					// workaround, see above
					minify: options.minify ?? env.mode === 'production' ? 'esbuild' : false,
					cssCodeSplit: true,
					outDir: 'dist',
					rollupOptions: {
						external: [/^core-js\//],
						output: outputOptions,
					},
				},
			} as UserConfig, userConfig)
		},
	})
}
