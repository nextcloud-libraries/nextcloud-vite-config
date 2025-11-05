/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later OR MIT
 */

import type { Plugin } from 'vite'

import { access, constants, readFile } from 'fs/promises'
import { dirname, isAbsolute, parse } from 'path'
import { cwd } from 'process'
import parseExpression from 'spdx-expression-parse'
import { fileURLToPath } from 'url'

interface PackageJSON {
	author?: string | { name?: string, mail?: string }
	name?: string
	version?: string
	license?: string
	licenses?: ({ type: string } | string)[]
}

export interface REUSELicensesPluginOptions {
	/**
	 * Optional mapping of package names and licenses to allow overwriting when packages do not set the license in the package.json correctly
	 * @example
	 * ```js
	 * {
	 *   foo: 'MIT',
	 *   'bar@3.0.0': 'ISC',
	 * }
	 * ```
	 */
	overwriteLicenses?: Record<string, string>
	/**
	 * Enable license validation (checking that the license is a valid SPDX identifier)
	 * @default false
	 */
	validateLicenses?: boolean
	/**
	 * Enable `.license` files also for sourcemap files
	 * @default false
	 */
	includeSourceMaps?: boolean
}

/**
 * Plugin to extract `.license` files for every built chunk
 * @param options Options to pass to the plugin
 */
export function REUSELicensesPlugin(options: REUSELicensesPluginOptions = {}): Plugin {

	options = {
		overwriteLicenses: {},
		...options,
	}

	let onError = console.error

	const licenseCache = new Map<string, string>()

	/**
	 * Implementation of `verifyLicense`
	 * @param license The license to verify
	 * @param name The package name
	 * @param version The package version
	 */
	function verifyLicenseImpl(license: string, name?: string, version?: string) {
		if (name && name in options.overwriteLicenses) {
			return options.overwriteLicenses[name]
		}
		if (name && version && `${name}@${version}` in options.overwriteLicenses) {
			return options.overwriteLicenses[`${name}@${version}`]
		}
		if (!license) {
			onError(`No license information for package ${name} @ ${version}, consider using 'overwriteLicenses' option.`)
			return 'unkown'
		} else if (options.validateLicenses) {
			try {
				parseExpression(license)
			} catch (e) {
				onError(`Invalid license information "${license}" for package ${name} @ ${version}`)
			}
		}
		return license
	}

	/**
	 * Verify a license of a specific package
	 * This will also handle overwriting licenses
	 * @param license The license to verify
	 * @param name Package name
	 * @param version Version
	 */
	function verifyLicense(license: string, name?: string, version?: string) {
		if (licenseCache.has(`${name}@${version}`)) {
			return licenseCache.get(`${name}@${version}`)
		}
		const value = verifyLicenseImpl(license, name, version)
		licenseCache.set(`${name}@${version}`, value)
		return value
	}

	/**
	 * Get the needed fields of the package JSON data
	 * @param data package JSON data
	 */
	function neededFields(data: PackageJSON) {
		// Handle legacy packages
		let license = data.license ?? (
			Array.isArray(data.licenses)
				? data.licenses.map((entry) => typeof entry === 'object' ? (entry.type ?? entry) : entry).join(' OR ')
				: String(data.licenses)
		)
		license = license.trim()
		license = license.includes(' ') && !license.startsWith('(') ? `(${license})` : license

		license = verifyLicense(license, data.name, data.version)

		// Handle both object style and string style author
		const author = typeof data.author === 'object'
			? `${data.author.name}` + (data.author.mail ? ` <${data.author.mail}>` : '')
			: data.author ?? `${data.name} developers`

		return {
			author,
			license,
			name: data.name,
			version: data.version,
		}
	}

	const packageCache = new Map<string, ReturnType<typeof neededFields>>()

	/**
	 * Find the nearest package.json
	 * @param dir Directory to start checking
	 */
	async function findPackage(dir: string) {
		// check cache first
		if (packageCache.has(dir)) {
			return packageCache.get(dir)
		}

		// invalid directories
		if (!dir || dir === '/' || dir === '.' || dir === dirname(cwd())) {
			return null
		}

		const packageJson = `${dir}/package.json`
		try {
			await access(packageJson, constants.F_OK)
		} catch (e) {
			// There is no package.json in this directory so check the one below
			packageCache.set(dir, await findPackage(dirname(dir)))
			return packageCache.get(dir)
		}

		let packageInfo = JSON.parse((await readFile(packageJson)).toString())
		// "private" is set in internal package.json which should not be resolved but the parent package.json
		// Same if no name is set in package.json
		if (packageInfo.private === true || !packageInfo.name) {
			packageInfo = await findPackage(dirname(dir)) ?? packageInfo
		}
		packageCache.set(dir, neededFields(packageInfo))
		return packageCache.get(dir)
	}

	/**
	 * Get the module path from a module name (handle internal vite modules)
	 * @param name Raw module name
	 */
	function sanitizeName(name: string): string {
		if (name.startsWith('\0')) {
			name = name.slice(1)
			// try to resolve the name itself
			name = tryResolve(name, name)
			// try root module
			name = tryResolve(name, name.split('/')[0])
			// special handling of plugins
			if (name.includes(':')) {
				name = tryResolve(name, `@vitejs/${name.split(':')[0]}`)
			}
			// internal vite modules
			name = tryResolve(name, 'vite')
		}
		return parse(name).dir
	}

	/**
	 * Try to resolve a name if the current is not a absolute path.
	 * If resolving failed the current name is returned.
	 *
	 * @param name - Current name
	 * @param alternative - Alternative name to try to resolve
	 */
	function tryResolve(name: string, alternative: string): string {
		if (isAbsolute(name)) {
			return name
		}

		try {
			name = import.meta.resolve(alternative)
			if (name.startsWith('file:')) {
				return fileURLToPath(name)
			}
		} catch {
			// nop
		}
		return name
	}

	return {
		name: 'reuse-licenses',

		async generateBundle(outputOptions, bundle) {
			onError = this.error

			for (const chunk of Object.values(bundle)) {
				if (chunk.type === 'asset') {
					continue
				}

				const modules = new Set<string>()
				for (const [moduleName, module] of Object.entries(chunk.modules)) {
					if (module.renderedLength > 0) {
						modules.add(moduleName)
					}
				}

				// if there are no modules then no modules are rendered in this chunk
				// this can happen if this is only a fascade chunk so the code is generated by rollup / rolldown itself
				if (modules.size === 0) {
					// @ts-expect-error - currently not typed as its still in beta
					if (this.meta.rolldownVersion) {
						modules.add(fileURLToPath(import.meta.resolve('rolldown')))
					} else {
						modules.add(fileURLToPath(import.meta.resolve('rollup')))
					}
				}

				// Get all package license data of the modules
				const allPackages = (await Promise.all(
					[...modules.values()]
						.map(sanitizeName)
						.map(findPackage),
				)).filter(Boolean)

				// Remove duplicates by serialized package license data
				const packages = [...new Map(allPackages.map((item) => [JSON.stringify(item), item])).values()]

				const sortedPackages = [...packages].sort((a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version, undefined, { numeric: true }))
				const authors = new Set(sortedPackages.map(({ author }) => author))
				const licenses = new Set<string>()

				let source = 'This file is generated from multiple sources. Included packages:\n'
				for (const pkg of sortedPackages) {
					const license = verifyLicense(pkg.license, pkg.name, pkg.version)
					licenses.add(license)
					source += `- ${pkg.name}\n\t- version: ${pkg.version}\n\t- license: ${license}\n`
				}
				// REUSE-IgnoreStart
				source = [...licenses.values()].sort().map((license) => `SPDX-License-Identifier: ${license}`).join('\n')
					+ '\n'
					+ [...authors.values()].sort().map((author) => `SPDX-FileCopyrightText: ${author}`).join('\n')
					+ '\n\n'
					+ source
				// REUSE-IgnoreEnd

				this.emitFile({
					name: `${chunk.name}.license`,
					fileName: `${chunk.fileName}.license`,
					type: 'asset',
					source,
				})

				if (outputOptions.sourcemap && outputOptions.sourcemap !== 'inline' && options.includeSourceMaps) {
					this.emitFile({
						type: 'asset',
						name: `${chunk.name}.map.license`,
						fileName: `${chunk.fileName}.map.license`,
						source,
					})
				}
			}
		},
	}
}
