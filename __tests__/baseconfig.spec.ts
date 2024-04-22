/**
 * SPDX-FileCopyrightText: 2024 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { BaseOptions, createBaseConfig } from '../lib/baseConfig'
import { resolveConfig } from 'vite'

const createConfig = async (
	command: 'build' | 'serve' = 'build',
	mode: 'development' | 'production' = 'production',
	options?: BaseOptions,
) =>
	await resolveConfig(
		await createBaseConfig(
			options,
		)({ command, mode, isSsrBuild: false }),
		command,
	)

describe('baseconfig', () => {
	it('Correctly set minify option to false', async () => {
		const config = await createConfig('build', 'production', { minify: false })
		expect(config.build.minify).toBe(false)
		expect(config.plugins.find(({ name }) => name === 'esbuild-minify')).toBeUndefined()
	})

	it('Correctly set minify option to true', async () => {
		const config = await createConfig('build', 'production', { minify: true })
		expect(config.build.minify).toBe('esbuild')
		expect(config.plugins.findIndex(({ name }) => name === 'esbuild-minify')).toBeGreaterThanOrEqual(0)
	})
})
