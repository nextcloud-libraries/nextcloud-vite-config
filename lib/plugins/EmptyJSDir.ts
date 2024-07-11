/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Plugin } from 'vite'

import { existsSync, rmSync } from 'node:fs'
import * as path from 'node:path'

export interface EmptyJSDirPluginOptions {
	/**
	 * Additional directories to clear (e.g. 'css')
	 * @default []
	 */
	additionalDirectories?: string[]
}

/**
 * Vite plugin to clear the `js/` directory before emitting files
 *
 * @param options Options to pass to the plugin
 */
function EmptyJSDirPlugin(options?: EmptyJSDirPluginOptions) {
	let emptyJSDir = false

	return {
		name: 'nextcloud-empty-js',
		generateBundle() {
			if (emptyJSDir !== true) {
				const dirs = [
					...(options?.additionalDirectories ?? []),
					'js',
				]
				for (const dir of dirs) {
					if (existsSync(path.resolve(dir))) {
						rmSync(path.resolve(dir), { recursive: true })
					}
				}
				emptyJSDir = true
			}
		},
	} as Plugin
}

export default EmptyJSDirPlugin
