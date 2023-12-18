import type { Plugin } from 'vite'
import config from './vite.config.ts'

// This plugin does not work with vite
config.plugins = config.plugins!.filter((v) => (v as Plugin).name !== 'node-externals')

export default config
