/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { ESBuildOptions, resolveConfig } from 'vite'
import { describe, it, expect } from 'vitest'
import { LibraryOptions, createLibConfig } from '../lib/libConfig'

describe('library config', () => {
	describe('workaround vite#14515 minify bug', () => {
		it('minifies using esbuild by default', async () => {
			const resolved = await createConfig('build')

			// there is no minify plugin
			expect(resolved.plugins.filter((plugin) => plugin.name === 'esbuild-minify').length).toBe(0)
			// but minify enabled
			expect(resolved.build.minify).toBe('esbuild')
			expect(typeof resolved.esbuild).toBe('object')
			expect((resolved.esbuild as ESBuildOptions).minifyIdentifiers).toBe(true)
			expect((resolved.esbuild as ESBuildOptions).minifySyntax).toBe(true)
			// but no whitespace minify
			expect((resolved.esbuild as ESBuildOptions).minifyWhitespace).toBe(false)
		})

		it('minifies using esbuild on development when configured', async () => {
			const resolved = await createConfig('build', 'development', { minify: true })

			// there is no minify plugin
			expect(resolved.plugins.filter((plugin) => plugin.name === 'esbuild-minify').length).toBe(0)
			// but minify enabled
			expect(resolved.build.minify).toBe('esbuild')
			expect(typeof resolved.esbuild).toBe('object')
			expect((resolved.esbuild as ESBuildOptions).minifyIdentifiers).toBe(true)
			expect((resolved.esbuild as ESBuildOptions).minifySyntax).toBe(true)
			// but no whitespace minify
			expect((resolved.esbuild as ESBuildOptions).minifyWhitespace).toBe(false)
		})

		it('does not minify on development by default', async () => {
			const resolved = await createConfig('build', 'development')

			// there is no minify plugin
			expect(resolved.plugins.filter((plugin) => plugin.name === 'esbuild-minify').length).toBe(0)
			// and minify disabled
			expect(resolved.build.minify).toBe(false)
		})
	})

	const createConfig = async (command: 'build' | 'serve' = 'build', mode: 'development' | 'production' = 'production', options?: LibraryOptions) => await resolveConfig(await createLibConfig({
		main: 'src/main.js',
	}, options)({ command, mode, ssrBuild: false }), command)
})
