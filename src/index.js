function extendConf (conf, api) {
  conf.boot.push('~quasar-app-extension-q-otp/src/boot/register.js')

  if (api.hasVite !== true) {
    conf.build.transpileDependencies.push(/quasar-app-extension-q-otp[\\/]src/)
  }
}

module.exports = function (api) {
  api.compatibleWith('quasar', '^2.0.0')
  api.extendQuasarConf(extendConf)
}
