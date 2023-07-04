/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { LibraryFormats, UserConfig, UserConfigFn, BuildOptions } from 'vite'
import type { BaseOptions } from './baseConfig.js'

import { mergeConfig } from 'vite'
import { createBaseConfig } from './baseConfig.js'

import DTSPlugin, { type PluginOptions as DTSOptions } from 'vite-plugin-dts'

type OutputOptions = BuildOptions['rollupOptions']['output']

interface LibraryOptions extends BaseOptions {
	/**
	 * Dependencies to keep as external
	 *
	 * Strings must fully match the import, e.g. 'foo' does not match 'foo/bar',
	 * in this case use a RegExp like /^foo/
	 */
	externalDependencies?: (RegExp | string)[]

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
	options = { config: {}, externalDependencies: [], libraryFormats: ['es'], ...options }

	const plugins = []

	// Handle the DTS plugin
	if (options?.DTSPluginOptions !== false) {
		plugins.push(DTSPlugin(options.DTSPluginOptions))
	}

	return createBaseConfig({
		...options,
		config: async (env) => {
			// This config is used to extend or override our base config
			// Make sure we get a user config and not a promise or a user config function
			const userConfig = await Promise.resolve(typeof options.config === 'function' ? options.config(env) : options.config)

			const assetFileNames = (assetInfo) => {
				const extType = assetInfo.name.split('.').pop()
				if (/css/i.test(extType)) {
					return '[name].css'
				}
				return '[name]-[hash][extname]'
			}

			// Manually define output options for file extensions
			const outputOptions: OutputOptions = options.libraryFormats.map(format => {
				const extension = format === 'es' ? 'mjs' : (format === 'cjs' ? 'cjs' : `${format}.js`)
				return {
					format,
					assetFileNames,
					entryFileNames: () => {
						return `[name].${extension}`
					},
					chunkFileNames: () => {
						return `chunks/[name]-[hash].${extension}`
					},
				}
			})

			return mergeConfig({
				plugins,
				build: {
					lib: {
						entry: {
							...entries,
						},
					},
					outDir: 'dist',
					rollupOptions: {
						external: [/^core-js\//, ...options.externalDependencies],
						output: outputOptions,
					},
				},
			} as UserConfig, userConfig)
		},
	})
}
