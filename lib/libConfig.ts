/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { UserConfigFn } from 'vite'
import type { BaseOptions } from './baseConfig.js'

import { mergeConfig } from 'vite'
import { createBaseConfig } from './baseConfig.js'

import DTSPlugin, { type PluginOptions as DTSOptions } from 'vite-plugin-dts'

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
	options = { config: {}, externalDependencies: [], ...options }

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
						output: {
							assetFileNames: (assetInfo) => {
								const extType = assetInfo.name.split('.').pop()
								if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
									return 'img/[name][extname]'
								} else if (/css/i.test(extType)) {
									return '[name].css'
								}
								return '[name]-[hash][extname]'
							},
							entryFileNames: () => {
								return '[name].mjs'
							},
							chunkFileNames: () => {
								return 'chunks/[name]-[hash].mjs'
							},
						},
					},
				},
			}, userConfig)
		},
	})
}
