<template>
  <div>
    <template v-for="(_, i) in num" :key="i">
      <QField
        :label-color="labelColor"
        :color="color"
        :bg-color="bgColor"
        :dark="dark"
        :filled="filled"
        :outlined="outlined"
        :borderless="borderless"
        :standout="standout"
        :hide-bottom-space="hideBottomSpace"
        :rounded="rounded"
        :square="square"
        :dense="dense"
        :item-aligned="itemAligned"
      >
        <template #default>
          <input
            ref="input"
            type="tel"
            inputmode="tel"
            min="0"
            max="9"
            maxlength="1"
            pattern="[0-9]"
            required
            :disabled="disabled"
            :class="['otp-input', 'q-ma-xs', inputClasses, conditionalClass[i]]"
            :placeholder="placeholder"
            :autofocus="activeInput === i"
            @input="handleOnChange"
            @keydown="handleOnKeyDown"
            @paste="handleOnPaste"
            @focus="handleOnFocus(i)"
            @select="handleOnSelect"
          />
        </template>
      </QField>
      <template v-if="separator.length && i !== num - 1">
        <span class="q-ma-md non-selectable">
          {{ separator }}
        </span>
      </template>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, PropType, ref, Ref, watch } from 'vue'
import { QField } from 'quasar'

const emit = defineEmits(['complete', 'change'])
const props = defineProps({
  ...QField.props,
  num: {
    type: Number as PropType<number>,
    default: 4,
  },
  separator: {
    type: String as PropType<string>,
    default: '',
  },
  inputClasses: {
    type: [String, Array] as PropType<string[] | string>,
  },
  conditionalClass: {
    type: Array as PropType<string[]>,
    default: [],
  },
  autofocus: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  placeholder: {
    type: String as PropType<string>,
    default: '*',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})

const input = ref<HTMLInputElement | null>(null) as Ref<HTMLInputElement>
const activeInput = ref<number>(0)

function focusAndSelectInput(input) {
  input.focus()
  input.setSelectionRange(0, 0)
  input.select()
}
function handleOnFocus(id) {
  activeInput.value = id
}
function focusInput(input: number) {
  activeInput.value = Math.max(Math.min(props.num - 1, input), 0)
}
function focusNextInput() {
  focusInput(activeInput.value + 1)
}
function focusPrevInput() {
  focusInput(activeInput.value - 1)
}
function handleOnSelect(event) {
  if (event.currentTarget.value) {
    event.currentTarget.setSelectionRange(0, 1)
  }
}
function handleOnPaste(event: ClipboardEvent) {
  event.preventDefault()
  focusAndSelectInput(input.value.at(0))
  event.clipboardData
    .getData('text/plain')
    .slice(0, props.num - activeInput.value)
    .split('')
    .map((elem) => Number(elem))
    .filter((elem) => Number.isInteger(elem))
    .forEach((value, i) => {
      inputValue(value, i)
      focusNextInput()
    })
  const pin = getPin()
  emit('change', pin)
}
function inputValue(value, index = activeInput.value) {
  input.value.at(index).value = value
}
function handleOnChange() {
  const pin = getPin()
  emit('change', pin)
  if (props.num === pin.length) {
    emit('complete', pin)
  } else {
    focusNextInput()
  }
}
function getPin() {
  let str = ''
  for (const { value } of input.value) {
    str += value
  }
  return str
}
function handleOnKeyDown(event: KeyboardEvent) {
  if (props.disabled) {
    return event.preventDefault()
  }
  switch (event.key) {
    case 'Backspace': {
      focusPrevInput()
      return event.preventDefault()
    }
    case 'Tab':
    case 'Delete': {
      return event.preventDefault()
    }
    case 'Enter': {
      focusNextInput()
      return event.preventDefault()
    }
    case 'ArrowLeft': {
      focusPrevInput()
      return event.preventDefault()
    }
    case 'ArrowRight': {
      focusNextInput()
      return event.preventDefault()
    }
    default: {
      if (event.code.startsWith('Digit')) {
        if (!Number.isNaN(Number(event.key))) {
          event.currentTarget.value = event.key
          return
        }
      }
      return event.preventDefault()
    }
  }
}

watch(
  () => activeInput.value,
  (newVal, oldVal) => {
    if (oldVal !== newVal) {
      focusAndSelectInput(input.value.at(newVal))
    }
  },
)

onMounted(() => {
  if (props.autofocus) {
    focusAndSelectInput(input.value.at(0))
  }
})

defineExpose({
  blur() {
    input.value.at(activeInput.value).blur()
  },
  focus() {
    focusAndSelectInput(input.value.at(activeInput.value))
  },
  clear() {
    activeInput.value = 0
    for (let i = 0; i < props.num; i++) {
      inputValue('', i)
    }
  },
  getPin() {
    return getPin()
  },
  get num() {
    return props.num
  },
})
</script>
<style lang="scss">
body.body--light {
  .otp-input {
    &:invalid,
    &:valid,
    &:active,
    &:focus-visible,
    &:hover {
      border-color: transparent;
    }
  }
}
body.body--dark {
  .otp-input {
    background-color: var(--q-dark);

    &:invalid,
    &:valid,
    &:active,
    &:focus-visible,
    &:hover {
      border-color: transparent;
    }
  }
}
body .otp-input {
  background: transparent;
  border: none;
  width: 24px;
  text-align: center;
  outline: none;

  &:focus-visible,
  &:focus,
  &:target {
    outline: none;
  }
  &::selection {
    background: transparent;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }
  &::placeholder {
    text-align: center;
  }
}
</style>
