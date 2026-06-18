/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import Vue from 'vue'
import App from './App.vue'

const AppInstance = Vue.extend(App)
const app = new AppInstance()
app.$mount('#content')
