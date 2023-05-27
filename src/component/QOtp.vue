<template>
  <div>
    <template v-for="(_, i) in num" :key="i">
      <QField
        :autofocus="autofocus"
        :disable="disable"
        :readonly="readonly"
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
            :disabled="disable"
            :readonly="readonly"
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
})

const input = ref<HTMLInputElement | null>(null) as Ref<HTMLInputElement>
const activeInput = ref<number>(0)

function focusAndSelectInput(input) {
  input.focus()
  input.setSelectionRange(0, 0)
  input.select()
}
function handleOnFocus(id) {
  focusInput(id)
}
function focusInput(value) {
  activeInput.value = value
}
function focusNextInput() {
  focusInput(Math.max(Math.min(props.num, activeInput.value + 1), 0))
}
function focusPrevInput() {
  focusInput(Math.max(Math.min(props.num - 1, activeInput.value - 1), 0))
}
function handleOnSelect(event) {
  if (event.currentTarget.value) {
    event.currentTarget.setSelectionRange(0, 1)
  }
}
function handleOnPaste(event: ClipboardEvent) {
  focusAndSelectInput(input.value.at(0))
  const { length } = event.clipboardData
    .getData('text/plain')
    .slice(0, props.num - activeInput.value)
    .split('')
    .map((elem) => Number(elem))
    .filter((elem) => Number.isInteger(elem))
    .map((value, i) => {
      inputValue(value, i)
      return value
    })
  focusInput(length)
  checkComplete()
  return event.preventDefault()
}
function inputValue(value, index = activeInput.value) {
  input.value.at(index).value = value
}
function checkComplete() {
  const pin = getPin()
  emit('change', pin)
  if ((props.num === pin.length) && (props.num === activeInput.value)) {
    emit('complete', pin)
  }
}
function handleOnChange() {
  focusNextInput()
  checkComplete()
}
function getPin() {
  let str = ''
  for (const { value } of input.value) {
    str += value
  }
  return str
}
function handleOnKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Backspace':
    case 'ArrowLeft': {
      focusPrevInput()
      return event.preventDefault()
    }
    case 'Enter':
    case 'ArrowRight': {
      focusNextInput()
      return event.preventDefault()
    }
    default: {
      if (event.code.startsWith('Digit')) {
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(event.key)) {
          event.currentTarget.value = event.key
          focusNextInput()
        }
      }
      checkComplete()
      return event.preventDefault()
    }
  }
}

watch(
  () => activeInput.value,
  (newVal, oldVal) => {
    if (oldVal !== newVal && newVal <= props.num - 1) {
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
    for (let i = 0; i < props.num; i++) {
      input.value.at(i).blur()
    }
  },
  focus() {
    activeInput.value = 0
    focusAndSelectInput(input.value.at(activeInput.value))
  },
  clear() {
    for (let i = 0; i < props.num; i++) {
      inputValue('', i)
    }
  },
  getPin,
})
</script>
<style lang="scss">
body.body--dark .otp-input {
  color: white;
  background-color: var(--q-dark);
}
body .otp-input {
  background: transparent;
  border: none;
  width: 24px;
  text-align: center;
  outline: none;

  &:invalid,
  &:valid,
  &:active,
  &:focus-visible,
  &:hover {
    border-color: transparent;
  }
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
