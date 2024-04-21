/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin, UserConfig, UserConfigFn } from 'vite'
import type { BaseOptions, NodePolyfillsOptions } from './baseConfig.js'

import { relative } from 'node:path'
import { mergeConfig } from 'vite'
import { createBaseConfig } from './baseConfig.js'

import EmptyJSDirPlugin from './plugins/EmptyJSDir.js'
import replace from '@rollup/plugin-replace'
import injectCSSPlugin from 'vite-plugin-css-injected-by-js'

type VitePluginInjectCSSOptions = Parameters<typeof injectCSSPlugin>[0]

export const appName = process.env.npm_package_name
export const appVersion = process.env.npm_package_version
export const appNameSanitized = appName.replace(/[/\\]/, '-')

export interface AppOptions extends Omit<BaseOptions, 'inlineCSS'> {
	/**
	 * Inject all styles inside the javascript bundle instead of emitting a .css file
	 * @default false
	 */
	inlineCSS?: boolean | VitePluginInjectCSSOptions,

	/**
	 * Whether to empty the output directory (`js/`)
	 * @default true
	 */
	emptyOutputDirectory?: boolean

	/**
	 * Inject polyfills for node packages
	 * By default all node core modules are polyfilled, including prefixed with `node:` protocol
	 *
	 * @default {protocolImports: true}
	 */
	nodePolyfills?: boolean | NodePolyfillsOptions

	/**
	 * Location of license summary file of third party dependencies
	 * Pass `false` to disable generating a license file.
	 *
	 * @default 'js/vendor.LICENSE.txt'
	 */
	thirdPartyLicense?: false | string
}

/**
 * Create a vite config for your nextcloud app
 *
 * @param entries Entry points of your app
 * @param options App related options for the vite config
 * @return {UserConfigFn} The vite config
 * @example
 * export default createAppConfig({
 *   main: path.resolve(path.join('src', 'main.js')),
 *   settings: path.resolve(path.join('src', 'settings.js')),
 * })
 */
export const createAppConfig = (entries: { [entryAlias: string]: string }, options: AppOptions = {}): UserConfigFn => {
	// Add default options
	options = {
		config: {},
		nodePolyfills: {
			protocolImports: true,
		},
		thirdPartyLicense: options.thirdPartyLicense === undefined ? 'js/vendor.LICENSE.txt' : options.thirdPartyLicense,
		...options,
	}

	return createBaseConfig({
		...(options as BaseOptions),
		config: async (env) => {
			console.info(`Building ${appName} for ${env.mode}`)

			// This config is used to extend or override our base config
			// Make sure we get a user config and not a promise or a user config function
			const userConfig = await Promise.resolve(typeof options.config === 'function' ? options.config(env) : options.config)

			const plugins = [] as Plugin[]
			// Inject all imported styles into the javascript bundle by creating dynamic styles on the document
			if (options.inlineCSS) {
				const plugin = injectCSSPlugin({
					dev: {
						enableDev: env.mode === 'development',
					},
					...(typeof options.inlineCSS === 'object' ? options.inlineCSS : {}),
				})
				plugins.push(...[plugin].flat())
			}

			// defaults to true so only not adding if explicitly set to false
			if (options?.emptyOutputDirectory !== false) {
				// Ensure `js/` is empty as we can not use the build in option (see below)
				plugins.push(EmptyJSDirPlugin())
			}

			// When building in serve mode (e.g. unit tests with vite) the intro option below will be ignored, so we must replace that values
			if (env.command === 'serve') {
				plugins.push(replace({
					delimiters: ['\\b', '\\b'],
					include: ['src/**'],
					preventAssignment: true,
					values: {
						appName: JSON.stringify(appName),
						appVersion: JSON.stringify(appVersion),
					},
				}))
			}

			// Extended config for apps
			const overrides: UserConfig = {
				plugins,
				// we need to set the base path, so module preloading works correctly
				// currently this is hidden behind the `experimental` options.
				experimental: {
					renderBuiltUrl(filename, { hostType }) {
						if (hostType === 'css') {
							// CSS `url()` does not support any dynamic path, so we use relative path to the css files
							return relative('../css', `../${filename}`)
						}
						return {
							// already contains the "js/" prefix as it is our output file configuration
							runtime: `OC.filePath('${appName}', '', '${filename}')`,
						}
					},
				},
				build: {
					// Output dir is the project root to allow main style to be generated within `/css`
					outDir: '',
					emptyOutDir: false, // ensure project root is NOT emptied!
					rollupOptions: {
						input: {
							...entries,
						},
						output: {
							// global variables for appName and appVersion
							intro: `const appName = ${JSON.stringify(appName)}; const appVersion = ${JSON.stringify(appVersion)};`,
							assetFileNames: (assetInfo) => {
								// Allow to customize the asset file names
								if (options.assetFileNames) {
									const customName = options.assetFileNames(assetInfo)
									if (customName) {
										return customName
									}
								}

								const extType = assetInfo.name.split('.').pop()
								if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
									return 'img/[name][extname]'
								} else if (/css/i.test(extType)) {
									return `css/${appNameSanitized}-[name].css`
								} else if (/woff2?|ttf|otf/i.test(extType)) {
									return 'css/fonts/[name][extname]'
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
								...(options?.coreJS ? { polyfill: ['core-js'] } : {}),
							},
						},
					},
				},
			}

			return mergeConfig(overrides, userConfig)
		},
	})
}
