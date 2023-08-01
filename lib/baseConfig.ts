/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { readFileSync } from 'node:fs'
import { type CoreJSPluginOptions, corejsPlugin } from 'rollup-plugin-corejs'
import { minify as minifyPlugin } from 'rollup-plugin-esbuild-minify/lib/index.js'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig, mergeConfig, type UserConfigExport, type UserConfigFn } from 'vite'
import { RemoveEnsureWatchPlugin } from './plugins/RemoveEnsureWatch.js'

import replace from '@rollup/plugin-replace'
import vue2 from '@vitejs/plugin-vue2'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import license from 'rollup-plugin-license'

export type NodePolyfillsOptions = Parameters<typeof nodePolyfills>[0]

export interface BaseOptions {
	/** Strings to replace within your code */
	replace?: Record<string, string>
	/**
	 * Inject all styles inside the javascript bundle instead of emitting a .css file
	 * @default false
	 */
	inlineCSS?: boolean
	/**
	 * Whether to minify the output
	 * @default isProduction Minify on production, do not on development
	 */
	minify?: boolean
	/**
	 * Inject polyfills for node packages
	 * @default false Disabled to reduce buildtime
	 */
	nodePolyfills?: boolean | NodePolyfillsOptions
	/**
	 * Enable and adjust settings for core-js polyfills
	 *
	 * By default disabled as Nextcloud core already includes the `core-js/stable` polyfills globally
	 */
	coreJS?: CoreJSPluginOptions
	/**
	 * Vite config to override or extend the base config
	 */
	config?: UserConfigExport
}

/**
 * Create a basic configuration
 * @param options Options to use
 */
export function createBaseConfig(options: BaseOptions = {}): UserConfigFn {
	return async (env) => {
		// get current build mode which is not necessary the same as the current `process.env`
		const { mode } = env
		const isDev = mode === 'development'
		// Set default values for optional options
		options = { minify: !isDev, replace: {}, config: {}, ...options }

		// This config is used to extend or override our base config
		// Make sure we get a user config and not a promise or a user config function
		const userConfig = await Promise.resolve(typeof options.config === 'function' ? options.config(env) : options.config)

		const plugins = []
		if (options?.nodePolyfills) {
		// Add polyfills for node packages
			plugins.push(nodePolyfills(typeof options.nodePolyfills === 'object' ? options.nodePolyfills : {}))
		}
		if (Object.keys(options.replace).length > 0) {
		// Replace global variables, built-in `define` option does not work (replaces also strings in 'node_modules/`)
			plugins.push(replace({
				preventAssignment: true,
				delimiters: ['\\b', '\\b'],
				include: ['src/**/*', 'lib/**/*', 'node_modules/@nextcloud/vue/**/*'],
				values: options.replace,
			}))
		}
		if (options.coreJS !== undefined) {
		// Add required polyfills, by default browserslist config is used
			plugins.push(corejsPlugin(options.coreJS))
		}

		return mergeConfig(defineConfig({
			plugins: [
				// Fix build in watch mode with commonjs files
				RemoveEnsureWatchPlugin,
				// Add vue2 support
				vue2({
					isProduction: !isDev,
					style: {
						trim: true,
					},
					template: {
						compilerOptions: {
							comments: isDev,
						},
					},
				}),
				// Add custom plugins
				...plugins,
				// Remove unneeded whitespace
				options?.minify ? minifyPlugin() : undefined,
				// Add license header with all dependencies
				license({
					sourcemap: true,
					banner: {
						commentStyle: 'regular',
						content: () => {
							const template = new URL('../banner-template.txt', import.meta.url)
							return readFileSync(template, 'utf-8')
						},
					},
				}),
			],
			define: {
				// process env replacement (keep order of this rules)
				'globalThis.process.env.NODE_ENV': JSON.stringify(mode),
				'globalThis.process.env.': '({}).',
				'global.process.env.NODE_ENV': JSON.stringify(mode),
				'global.process.env.': '({}).',
				'process.env.NODE_ENV': JSON.stringify(mode),
				'process.env.': '({}).',
			},
			esbuild: {
				legalComments: 'inline',
				target: browserslistToEsbuild(),
			},
			build: {
				cssTarget: browserslistToEsbuild(),
				lib: {
					formats: ['es'],
					entry: {},
				},
				sourcemap: isDev || 'hidden',
				target: browserslistToEsbuild(),
			},
		}),
		// Add overrides from user config
		userConfig)
	}
}
