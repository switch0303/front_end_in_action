import Tabs from './src/tabs'
import TabPane from './src/tab-pane.vue'

import type { App } from 'vue'

Tabs.install = (app: App): void => {
  app.component(Tabs.name, Tabs)
  app.component(TabPane.name, TabPane)
}

Tabs.TabPane = TabPane

const _Tabs = Tabs

export default _Tabs
export const ElTabs = _Tabs
export const ElTabPane = TabPane
