/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'
import { page } from 'vitest/browser'

/**
 * This test should ensure that legacy vue 2 apps can still be built.
 */
test('legacy vue 2 app is rendered', async () => {
	const main = page.getByRole('main')

	await expect.element(main).toBeInTheDocument()
	await expect.element(main).toBeEmptyDOMElement()

	await import('./js/test-legacy-vue2-app.mjs')

	// vue 2 replaces the container element!
	await expect.element(main).not.toBeInTheDocument()
	// but we should still have the heading
	const heading = page.getByRole('heading')
	await expect.element(heading).toBeInTheDocument()
	await expect.element(heading).toHaveTextContent('Legacy Vue 2 App')
})
