/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { existsSync, rmSync } from 'node:fs'
import * as path from 'node:path'

import type { Plugin } from 'vite'

/**
 * Vite plugin to clear the `js/` directory before emitting files
 */
const EmptyJSDirPlugin = () => {
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

export default EmptyJSDirPlugin
