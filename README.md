# q-otp

The q-otp quasar extension allows you to seamlessly add the QOtp component into your Quasar application. 

![q-otp](https://github.com/user-attachments/assets/ce220a86-0080-49a6-acd6-632bd5a0332a)

## Install

```bash
quasar ext add q-otp
```

## Basic usage

```vue
<template>
  <QOtp
      placeholder="-"
      field-classes="q-ml-xs q-mr-xs"
      input-styles="opacity: 1 !important;"
      @complete="(code) => alert(code)"
  />
</template>
<script lang="ts" setup>
  import QOtp from 'quasar-app-extension-q-otp'
</script>
```

## Documentation

### Slots

Slot |
---|
control |
footer |

### Custom props

Attributes | Type
---|---
placeholder | `String`
autofocus | `Boolean`
num | `Number`
separator | `String`
conditional-class | `Array<String>`
field-classes | `String/Array<String>`
input-classes | `String/Array<String>`
input-styles | `String/Object`

### QField props

Attributes | Type
---|---
rules | `Array`
error | `Boolean`
reactive-rules | `Boolean`
lazy-rules | `Boolean/String`
loading | `Boolean`
error-message | `String`
label | `String`
stack-label | `Boolean`
bottom-slots | `Boolean`
hint | `String`
hide-hint | `Boolean`
prefix | `String`
suffix | `String`
readonly | `Boolean`
label-color | `String`
color | `String`
bg-color | `String`
dark | `Boolean`
filled | `Boolean`
outlined | `Boolean`
borderless | `Boolean`
standout | `Boolean/String`
rounded | `Boolean`
square | `Boolean`
dense | `Boolean`
item-aligned | `Boolean`

### Events

Event | Callback
---|---
@change | `(pin) => String`
@complete | `(pin) => String`

### Methods

Method | Callback
---|---
blur | `() => void`
focus | `() => void`
clear | `() => void`
getPin | `() => String`

## Uninstall

```bash
quasar ext remove q-otp
```

## Contributing

Feel free to open issues and [pull requests](https://github.com/qertis/q-otp/pulls)!

## License

MIT (c) [Denis Baskovsky](https://baskovsky.ru).
