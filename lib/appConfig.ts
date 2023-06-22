/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { UserConfig } from 'vite'
import type { BaseOptions } from './baseConfig.js'

import { mergeConfig } from 'vite'
import { appName, appNameSanitized, appVersion, createBaseConfig } from './baseConfig.js'

import EmptyJSDirPlugin from './EmptyJSDirPlugin.js'

interface AppOptions extends BaseOptions {
    /**
     * Whether to empty the output directory (`js/`)
     * @default true
     */
    emptyOutputDirectory?: boolean
}

/**
 * Create a vite config for your nextcloud app
 *
 * @param entries Entry points of your app
 * @param options App related options for the vite config
 * @return {UserConfig} The vite config
 * @example
 * export default nextcloudViteConfig({
 *   main: path.resolve(path.join('src', 'main.js')),
 *   settings: path.resolve(path.join('src', 'settings.js')),
 * })
 */
export const createAppConfig = (entries: { [entryAlias: string]: string }, options: AppOptions): UserConfig => {
	const defines = {
		appName: JSON.stringify(appName),
		appVersion: JSON.stringify(appVersion),
		...(options.defines || {}),
	}
	const plugins = []
	// defaults to true so only not adding if explicitly set to false
	if (options?.emptyOutputDirectory !== false) {
		// Ensure `js/` is empty as we can not use the build in option (see below)
		plugins.push(EmptyJSDirPlugin())
	}

	return mergeConfig(createBaseConfig({ ...options, defines }), {
		build: {
			lib: {
				entry: {
					...entries,
				},
			},
			/* Output dir is the project root to allow main style to be generated within `/css` */
			outDir: '',
			emptyOutDir: false, // ensure project root is NOT emptied!
			rollupOptions: {
				output: {
					assetFileNames: (assetInfo) => {
						const extType = assetInfo.name.split('.').pop()
						if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
							return 'img/[name][extname]'
						} else if (/css/i.test(extType)) {
							return `css/${appNameSanitized}-[name].css`
						}
						return 'dist/[name]-[hash][extname]'
					},
					entryFileNames: () => {
						return `js/${appNameSanitized}-[name].mjs`
					},
					chunkFileNames: () => {
						return 'js/[name]-[hash].mjs'
					},
					manualChunks: {
						polyfill: ['core-js'],
					},
				},
			},
		},
	})
}
