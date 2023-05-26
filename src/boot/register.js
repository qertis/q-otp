import { boot } from 'quasar/wrappers'
import QOtp from '../component/QOtp.vue'

export default boot(({ app }) => {
  app.use(QOtp)
})
