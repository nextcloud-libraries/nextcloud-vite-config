/*!
 * SPDX-License-Identifier: CC0-1.0
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'

/**
 * This test should ensure that entry points for all JS modules are build.
 */
test('CSS entry points for all JS entry points are created', () => {
	expect(existsSync(resolve(import.meta.dirname, './css/test-css-entry-points-first.css')))
		.toBe(true)
	expect(existsSync(resolve(import.meta.dirname, './css/test-css-entry-points-second.css')))
		.toBe(true)

	expect(readFileSync(resolve(import.meta.dirname, './css/test-css-entry-points-first.css')).toString('utf-8'))
		.toMatch(/@import '\.\/[^.]+\.chunk\.css'/)
	expect(readFileSync(resolve(import.meta.dirname, './css/test-css-entry-points-second.css')).toString('utf-8'))
		.toMatch(/@import '\.\/[^.]+\.chunk\.css'/)
})
