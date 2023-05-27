# q-otp

The QOtp App Extension allows you to seamlessly add the QOtp component into your Quasar application. It manages the boot file file and all other configuration for you.

## Basic usage
```vue
<q-otp class="flex" @complete="(code) => alert(code)"></q-otp>
```

## Documentation

### Props

#### Content
```
placeholder: String
```

#### State
```
autofocus: Boolean
disabled: Boolean
num: Number
```

#### Style
```
label-color: String
color: String
bg-color: String
dark: Boolean
filled: Boolean
outlined: Boolean
borderless: Boolean
standout: Boolean | String
hide-bottom-space: Boolean
rounded: Boolean
square: Boolean
dense: Boolean
item-aligned: Boolean
separator: String
conditional-class: Array<String>
input-classes: Array<String>    
```

### Events
```
@change: (pin) => String
@complete: (pin) => String
```

### Methods
```
blur: () => void
focus: () => void
clear: () => void
getPin: () => String
```

## Install

```bash
quasar ext add q-otp
```

## Uninstall

```bash
quasar ext remove q-otp
```

## Contributing

Feel free to open issues and [pull requests](https://github.com/qertis/q-otp/pulls)!

## License

MIT (c) [Denis Baskovsky](https://baskovsky.ru).
