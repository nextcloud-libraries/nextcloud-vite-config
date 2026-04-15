/*!
 * SPDX-License-Identifier: CC0-1.0
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 */

/**
 * Get the `appName` from global scope.
 */
export function getName() {
	const el = document.createElement('div')
	el.innerText = `Library: ${appName} ${appVersion}`
	document.querySelector('main').append(el)
}
