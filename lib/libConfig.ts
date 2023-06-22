/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { UserConfig } from 'vite'
import type { BaseOptions } from './baseConfig.js'

import { mergeConfig } from 'vite'
import { createBaseConfig } from './baseConfig.js'

interface LibraryOptions extends BaseOptions {
	/**
	 * Dependencies to keep as external
	 *
	 * Strings must fully match the import, e.g. 'foo' does not match 'foo/bar',
	 * in this case use a RegExp like /^foo/
	 */
	externalDependencies: (RegExp | string)[]
}

/**
 * Create a vite config for your nextcloud libraries
 *
 * @param entries Entry points of your app
 * @param options Options to use
 * @return The vite config
 */
export const createLibConfig = (entries: { [entryAlias: string]: string }, options: LibraryOptions): UserConfig => {
	options = { externalDependencies: [], ...options }
	return mergeConfig(createBaseConfig(options), {
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
	})
}
