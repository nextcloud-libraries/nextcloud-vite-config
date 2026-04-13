/*!
 * SPDX-License-Identifier: CC0-1.0
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 */

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'

test('CSS styles are placed into css/', () => {
	expect(existsSync(resolve(import.meta.dirname, './css/test-filesystem-app.css'))).toBe(true)
})

test('Images are placed into img/', () => {
	expect(existsSync(resolve(import.meta.dirname, './img/background.webp'))).toBe(true)
})

test('Scripts are placed into js/', () => {
	expect(existsSync(resolve(import.meta.dirname, './js/test-filesystem-app.mjs'))).toBe(true)
})
