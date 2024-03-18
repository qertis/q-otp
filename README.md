# q-otp

The q-otp quasar extension allows you to seamlessly add the QOtp component into your Quasar application. 

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

### Content

Attributes | Type
---|---
placeholder | `String`

### State

Attributes | Type
---|---
autofocus | `Boolean`
readonly | `Boolean`
disable | `Boolean`
num | `Number`

### Style

Attributes | Type
---|---
label-color | `String`
color | `String`
bg-color | `String`
dark | `Boolean`
filled | `Boolean`
outlined | `Boolean`
borderless | `Boolean`
standout | `Boolean/String`
hide-bottom-space | `Boolean`
rounded | `Boolean`
square | `Boolean`
dense | `Boolean`
item-aligned | `Boolean`
separator | `String`
conditional-class | `Array<String>`
field-classes | `Array<String>`
input-classes | `Array<String>`
input-styles | `String`

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
