/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { build } from 'vite'
// ok as this is just for tests
// eslint-disable-next-line n/no-extraneous-import
import type { RollupOutput, OutputChunk } from 'rollup'
import { describe, it, expect } from 'vitest'
import { createAppConfig } from '../lib/appConfig'
import { fileURLToPath } from 'url'
import { resolve } from 'path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

describe('app config', () => {
	it('replaces process.env', async () => {
		const root = resolve(__dirname, '../__fixtures__/app_process_env')

		const resolved = await createAppConfig({
			main: resolve(root, 'main.js'),
		})({ command: 'build', mode: 'production' })

		const result = await build({
			...resolved,
			root,
		})
		const { output } = result as RollupOutput
		const code = (output[0] as OutputChunk).code
		expect(code.includes('process.env')).toBe(false)
		expect(code).toMatchSnapshot()
	})
})
