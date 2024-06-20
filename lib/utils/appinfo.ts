/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { lstatSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'

/**
 * Check if a given path exists and is a directory
 *
 * @param {string} filePath The path
 * @return {boolean}
 */
function isDirectory(filePath: string): boolean {
	const stats = lstatSync(filePath, { throwIfNoEntry: false })
	return stats !== undefined && stats.isDirectory()
}

/**
 * Check if a given path exists and is a directory
 *
 * @param {string} filePath The path
 * @return {boolean}
 */
function isFile(filePath: string): boolean {
	const stats = lstatSync(filePath, { throwIfNoEntry: false })
	return stats !== undefined && stats.isFile()
}

/**
 * Find the path of nearest `appinfo/info.xml` relative to given path
 *
 * @param {string} currentPath The path to check for appinfo
 * @return {string|undefined} Either the full path including the `info.xml` part or `undefined` if no found
 */
export function findAppinfo(currentPath: string): string | null {
	while (currentPath && currentPath !== sep) {
		const appinfoPath = join(currentPath, 'appinfo')
		if (isDirectory(appinfoPath) && isFile(join(appinfoPath, 'info.xml'))) {
			return join(appinfoPath, 'info.xml')
		}
		currentPath = resolve(currentPath, '..')
	}
	return undefined
}
