/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'vite'
import MagicString from 'magic-string'
import { dirname, relative } from 'node:path'

/**
 * Plugin that imports splitted CSS assets used by current entry point
 *
 * Basically this automatically imports all splitted CSS so that the users build system can decide what to do with the styles.
 * Because injecting is only possible with a DOM environement (not on SSR).
 */
export const ImportCSSPlugin: () => Plugin = () => {
	return {
		name: 'vite-import-css-libmode',
		enforce: 'post',
		/**
		 * Add imports for all splitted CSS assets back to the places where the CSS is used.
		 *
		 * We must use `generateBundle` as Vite removes "empty css chunks" (chunks that only import css)
		 * in its `generateBundle` hook and merged the `importedCss` property down to the really emitted chunks.
		 * Otherwise we will loose CSS imports!
		 *
		 * @param options Output options
		 * @param bundle The output bundle
		 */
		generateBundle(options, bundle) {
			for (const filename in bundle) {
				const chunk = bundle[filename]
				// Make sure chunk is an output chunk with meta data
				if (!('viteMetadata' in chunk) || !chunk.viteMetadata) {
					continue
				}

				// Check if the chunk imported CSS, if not we can skip
				const { importedCss } = chunk.viteMetadata
				if (!importedCss.size) {
					continue
				}

				// Inject the referenced style files at the top of the chunk.
				const ms = new MagicString(chunk.code)
				for (const cssFileName of importedCss) {
					let cssFilePath = relative(dirname(chunk.fileName), cssFileName)
					cssFilePath = cssFilePath.startsWith('.') ? cssFilePath : `./${cssFilePath}`
					if (options.format === 'es') {
						ms.prepend(`import '${cssFilePath}';\n`)
					} else {
						ms.prepend(`require('${cssFilePath}');\n`)
					}
				}
				chunk.code = ms.toString()
				chunk.map = ms.generateMap()
			}
		},
	}
}
