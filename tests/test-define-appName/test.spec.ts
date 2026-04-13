/*!
 * SPDX-License-Identifier: CC0-1.0
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 */

import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

/**
 * This test should ensure that the global `appName` and `appVersion` variables are defined / replaced
 * within the source code.
 * For legacy reasons they have to be defined in app code but also in included code.
 */
test('appName and appVersion are replaced in app code and in dependencies', async () => {
	await expect.element(page.getByRole('main')).toBeEmptyDOMElement()

	await import('./js/test-define-app-name-app.mjs')
	await expect.element(page.getByRole('main').getByText('App: test-define-app-name 1.0.0')).toBeInTheDocument()
	await expect.element(page.getByRole('main').getByText('Library: test-define-app-name 1.0.0')).toBeInTheDocument()
})
