/*!
 * SPDX-License-Identifier: CC0-1.0
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'

const dist = (file: string) => resolve(import.meta.dirname, 'dist', file)

test('every source module is emitted as its own file', () => {
	for (const file of ['index', 'sub', 'utils/math', 'utils/greet']) {
		expect(existsSync(dist(`${file}.mjs`))).toBe(true)
		expect(existsSync(dist(`${file}.cjs`))).toBe(true)
	}
	expect(existsSync(dist('chunks'))).toBe(false)
})

test('entry points import the shared modules instead of inlining them', () => {
	const index = readFileSync(dist('index.mjs'), 'utf-8')
	expect(index).toMatch(/from "\.\/utils\/math\.mjs"/)
	expect(index).not.toMatch(/function add/)

	const sub = readFileSync(dist('sub.mjs'), 'utf-8')
	expect(sub).toMatch(/from "\.\/utils\/math\.mjs"/)
	expect(sub).not.toMatch(/function greet/)
})
