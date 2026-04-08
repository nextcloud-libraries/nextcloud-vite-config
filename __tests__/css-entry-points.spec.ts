/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2024 Ferdinand Thiessen <opensource@fthiessen.de>
 * SPDX-License-Identifier: MIT
 */

import type { OutputAsset, RollupOutput } from 'rollup'

import { resolve } from 'path'
import { build } from 'vite'
import { describe, expect, it } from 'vitest'
import { CSSEntryPointsPlugin } from '../lib/plugins/CSSEntryPoints.ts'

const root = resolve(import.meta.dirname, '../__fixtures__/css-entry-points')

describe('CSS entry point plugin', () => {
	it('minifies using esbuild by default', async () => {
		const { output } = await build({
			configFile: false,
			root,
			appType: 'custom',
			plugins: [CSSEntryPointsPlugin()],
			build: {
				cssCodeSplit: true,
				rollupOptions: {
					input: {
						first: resolve(root, './first.js'),
						second: resolve(root, './second.js'),
					},
					output: {
						assetFileNames: 'assets/[name].[ext]',
						chunkFileNames: 'chunks/[name].js',
						entryFileNames: '[name].js',
					},
				},
			},
		}) as RollupOutput

		// Has correct first entry
		const firstCSS = output.find(({ fileName }) => fileName === 'assets/first.css') as OutputAsset
		expect(firstCSS.source).toMatch(/@import '\.\/[^.]+\.chunk\.css'/)
		// Has correct second entry
		const secondCSS = output.find(({ fileName }) => fileName === 'assets/second.css') as OutputAsset
		expect(secondCSS.source).toMatch(/@import '\.\/[^.]+\.chunk\.css'/)
	})
})
