import { boot } from 'quasar/wrappers'
import QOtp from '../component/QOtp.vue'

export default boot(({ app }) => {
  app.component('QOtp', QOtp)
})
