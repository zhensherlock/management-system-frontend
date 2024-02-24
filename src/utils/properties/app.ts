import { App } from 'vue'

export default function registerProperties(app: App) {
  app.config.globalProperties.$app = {
    // @ts-ignore
    isDev: __DEV__,
  }
}
