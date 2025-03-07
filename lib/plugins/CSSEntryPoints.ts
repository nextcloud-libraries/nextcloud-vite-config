/**
 * SPDX-FileCopyrightText: 2024 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: MIT
 */

// eslint-disable-next-line n/no-extraneous-import
import type { OutputOptions, PreRenderedAsset } from 'rollup'
import type { Plugin } from 'vite'

import { basename, dirname, join, normalize, extname } from 'path'

interface CSSEntryPointsPluginOptions {
	/**
	 * Also create empty CSS entry points for JS entry points without styles
	 * @default false
	 */
	createEmptyEntryPoints?: boolean
}

/**
 * A vite plugin to properly extract synchronously imported CSS from JS entry points
 *
 * @param options Configuration for the plugin
 */
export function CSSEntryPointsPlugin(options?: CSSEntryPointsPluginOptions) {
	const pluginOptions = {
		createEmptyEntryPoints: false,
		...options,
	}

	return {
		name: 'css-entry-points-plugin',

		// We use this to adjust the asset file names for CSS files so we ensure entry points are unique
		config(config) {
			/**
			 * Create a wrapper function to rename non entry css assets
			 * @param config Original assets file name config
			 */
			function fixupAssetFileNames(config: Required<OutputOptions['assetFileNames']>) {
				// Return a wrapper function
				return (info: PreRenderedAsset) => {
					// If the original assets name option is a function we need to call it otherwise just use the template string
					const name = typeof config === 'function' ? config(info) : config
					// Only handle CSS files not extracted by this plugin
					if (info.name.endsWith('.css') && !String(info.source).startsWith('/* extracted by css-entry-points-plugin */')) {
						// The new name should have the same path but instead of the .css extension it is .chunk.css
						return name.replace(/(.css|.\[ext\]|\[extname\])$/, '.chunk.css')
					}
					return name
				}
			}

			// If there is any output option we need to fix the assetFileNames
			if (config.build?.rollupOptions?.output) {
				for (const output of [config.build.rollupOptions.output].flat()) {
					if (output.assetFileNames === undefined) {
						continue
					}
					output.assetFileNames = fixupAssetFileNames(output.assetFileNames)
				}
			}
		},

		generateBundle(options, bundle) {
			for (const [chunkName, chunk] of Object.entries(bundle)) {
				// Only handle entry points
				if (chunk.type !== 'chunk' || !chunk.isEntry) {
					continue
				}

				// Set of all synchronously imported CSS of this entry point
				const importedCSS = new Set<string>(chunk.viteMetadata?.importedCss ?? [])
				const visitedChunks = new Set<string>()
				const getImportedCSS = (importedNames: string[]) => {
					for (const importedName of importedNames) {
						// skip if already extracted
						if (visitedChunks.has(importedName)) {
							continue
						}
						visitedChunks.add(importedName)

						const importedChunk = bundle[importedName]
						// Skip non chunks
						if (importedChunk.type !== 'chunk') {
							continue
						}
						// First add the css modules imported by imports
						getImportedCSS(importedChunk.imports ?? [])
						// Now merge the imported CSS into the list
						;(importedChunk.viteMetadata?.importedCss ?? [])
							.forEach((name: string) => importedCSS.add(name))
					}
				}
				getImportedCSS([chunkName])

				// Skip empty entries if not configured to output empty CSS
				if (importedCSS.size === 0 && !pluginOptions.createEmptyEntryPoints) {
					continue
				}

				const source = [...importedCSS.values()]
					.map((css) => `@import './${basename(css)}';`)
					.join('\n')

				// Name new CSS entry same as the entry
				const entryName = basename(chunk.fileName).slice(0, -1 * extname(chunk.fileName).length)
				const cssName = `${entryName}.css`

				// Keep original path
				const path = dirname(
					typeof options.assetFileNames === 'string'
						? options.assetFileNames
						: options.assetFileNames({
							type: 'asset',
							source: '',
							name: 'name.css',
							names: ['name.css'],
							originalFileName: null,
							originalFileNames: [],
						}),
				)

				this.emitFile({
					type: 'asset',
					name: `\0${cssName}`,
					fileName: normalize(join(path, cssName)),
					needsCodeReference: false,
					source: `/* extracted by css-entry-points-plugin */\n${source}`,
				})
			}
		},
	} as Plugin
}
