/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { readFileSync } from 'fs'
import { corejsPlugin } from 'rollup-plugin-corejs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { minify as minifyPlugin } from 'rollup-plugin-esbuild-minify/lib/index.js'
import { defineConfig } from 'vite'
import replace from '@rollup/plugin-replace'
import vue2 from '@vitejs/plugin-vue2'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import license from 'rollup-plugin-license'
import injectCSSPlugin from 'vite-plugin-css-injected-by-js'

export const buildMode = process.env.NODE_ENV
export const isDev = buildMode === 'development'

type NodePolyfillsOptions = Parameters<typeof nodePolyfills>[0]

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
}

/**
 * Create a basic configuration
 * @param options Options to use
 */
export function createBaseConfig(options: BaseOptions = {}) {
	options = { minify: !isDev, replace: {}, ...options }

	const plugins = []
	if (options?.inlineCSS !== false) {
		// Inject all imported styles into the javascript bundle
		plugins.push(injectCSSPlugin())
	}
	if (options?.nodePolyfills) {
		// Add polyfills for node packages
		plugins.push(nodePolyfills(typeof options.nodePolyfills === 'object' ? options.nodePolyfills : {}))
	}
	if (Object.keys(options.replace).length > 0) {
		// Replace global variables, built-in `define` option does not work (replaces also strings in 'node_modules/`)
		plugins.push(replace({
			preventAssignment: true,
			delimiters: ['\\b', '\\b'],
			include: ['src/**/*', 'node_modules/@nextcloud/vue/**/*'],
			values: options.replace,
		}))
	}

	return defineConfig({
		plugins: [
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
			...plugins,
			// Add node polyfills
			/* nodePolyfills({
				protocolImports: false,
			}), */
			// Add required polyfills, by default browserslist config is used
			corejsPlugin({ usage: true }),
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
			// process env
			'process.env.': '({}).',
			'global.process.env.': '({}).',
			'globalThis.process.env.': '({}).',
			'process.env.NODE_ENV': JSON.stringify(buildMode),
			'global.process.env.NODE_ENV': JSON.stringify(buildMode),
			'globalThis.process.env.NODE_ENV': JSON.stringify(buildMode),
		},
		esbuild: {
			legalComments: 'inline',
			target: browserslistToEsbuild(),
		},
		build: {
			lib: {
				formats: ['es'],
				entry: {},
			},
			target: browserslistToEsbuild(),
			sourcemap: isDev || 'hidden',
		},
	})
}
