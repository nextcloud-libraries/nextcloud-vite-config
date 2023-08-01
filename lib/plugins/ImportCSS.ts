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
		renderChunk(code, chunk) {
			if (!chunk.viteMetadata) return
			const { importedCss } = chunk.viteMetadata
			if (!importedCss.size) return

			/**
			 * Inject the referenced style files at the top of the chunk.
			 */
			const ms = new MagicString(code)
			for (const cssFileName of importedCss) {
				let cssFilePath = relative(dirname(chunk.fileName), cssFileName)
				cssFilePath = cssFilePath.startsWith('.') ? cssFilePath : `./${cssFilePath}`
				ms.prepend(`import '${cssFilePath}';\n`)
			}
			return {
				code: ms.toString(),
				map: ms.generateMap(),
			}
		},
	}
}
