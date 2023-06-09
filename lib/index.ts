/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { existsSync, readFileSync, rmSync } from 'fs'
import { corejsPlugin } from 'rollup-plugin-corejs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { minify as minifyPlugin } from 'rollup-plugin-esbuild-minify/lib/index.js'
import { defineConfig, mergeConfig } from 'vite'
import type { Plugin, UserConfigExport } from 'vite'
import replace from '@rollup/plugin-replace'
import vue2 from '@vitejs/plugin-vue2'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import * as path from 'path'
import license from 'rollup-plugin-license'

const appName = process.env.npm_package_name
const appVersion = process.env.npm_package_version
const appNameSanitized = appName.replace('/', '-')

const buildMode = process.env.NODE_ENV
const isDev = buildMode === 'development'

/**
 * Vite plugin to clear the `js/` directory before emitting files
 */
const emptyJSDir = () => {
	let emptyJSDir = false

	return {
		name: 'nextcloud-empty-js',
		generateBundle() {
			if (emptyJSDir !== true) {
				if (existsSync(path.resolve('js/'))) {
					rmSync(path.resolve('js/'), { recursive: true })
				}
				emptyJSDir = true
			}
		},
	} as Plugin
}

/**
 *
 * @param minify Whether to minify the output (default: production true, false otherwise)
 * @param defines Records to replace within your code
 */
export function createBaseConfig(minify = !isDev, defines: Record<string, unknown>) {
	const replaceValues = {
		appName: JSON.stringify(appName),
		appVersion: JSON.stringify(appVersion),
		...defines,
	}
	return defineConfig({
		plugins: [
		// Ensure `js/` is empty as we can not use the build in option (see below)
			emptyJSDir(),
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
			// Replace global variables, built-in `define` option does not work (replaces also strings in 'node_modules/`)
			replace({
				preventAssignment: true,
				delimiters: ['\\b', '\\b'],
				include: 'src/**/*',
				values: replaceValues,
			}),
			// Add node polyfills
			/* nodePolyfills({
				protocolImports: false,
			}), */
			// Add required polyfills, by default browserslist config is used
			corejsPlugin({ usage: true }),
			// Remove unneeded whitespace
			minify ? minifyPlugin() : undefined,
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

/**
 * Create a vite config for your nextcloud app
 *
 * @param entries Entry points of your app
 * @param defines Record of values to replace
 * @return {UserConfigExport} The vite config
 * @example
 * export default nextcloudViteConfig({
 *   main: path.resolve(path.join('src', 'main.js')),
 *   settings: path.resolve(path.join('src', 'settings.js')),
 * })
 */
export const createAppConfig = (entries: { [entryAlias: string]: string }, defines: Record<string, unknown> = {}): UserConfigExport => mergeConfig(createBaseConfig(!isDev, defines), {
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

/**
 * Create a vite config for your nextcloud libraries
 *
 * @param entries Entry points of your app
 * @param externalDeps List of dependencies to keep external
 * @param minify Whether to minify the output (default true for production)
 * @param defines Record of values to replace
 * @return {UserConfigExport} The vite config
 */
export const createLibConfig = (entries: { [entryAlias: string]: string }, externalDeps: string[] = [], minify = !isDev, defines: Record<string, unknown> = {}): UserConfigExport => mergeConfig(createBaseConfig(minify, defines), {
	build: {
		lib: {
			entry: {
				...entries,
			},
		},
		outDir: 'dist',
		emptyOutDir: true,
		rollupOptions: {
			external: externalDeps,
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
				manualChunks: {
					polyfill: ['core-js'],
				},
			},
		},
	},
})
