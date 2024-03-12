<template>
  <div class="flex">
    <template v-for="(_, i) in num" :key="i">
      <QField
        :class="fieldClasses"
        :autofocus="autofocus"
        :disable="disabled[i]"
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
            :disabled="disabled[i]"
            :readonly="readonly"
            :style="inputStyles"
            :class="['otp-input', inputClasses, conditionalClass[i]]"
            :placeholder="placeholder"
            :autofocus="activeInput === i"
            @input="handleOnChange"
            @keydown="handleOnKeyDown"
            @paste="handleOnPaste"
            @focus="focusInput(i)"
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
  inputStyles: {
    type: String as PropType<string>,
  },
  fieldClasses: {
    type: [String, Array] as PropType<string[] | string>,
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
const disabled = ref([...Array(props.num).keys()].map(() => true))

function focusAndSelectInput(input) {
  input.focus()
  input.setSelectionRange(0, 0)
  input.select()
}
function blurInput() {
  input.value[activeInput.value].blur()
}
function focusInput(value) {
  for (let i = 0; i < disabled.value.length - 1; i++) {
    disabled.value.splice(i, 1, i !== value)
  }
  setTimeout(() => {
    activeInput.value = value
    if (!input.value[activeInput.value].disabled) {
      input.value[activeInput.value].focus()
    }
  })
}
function focusNextInput() {
  const elem = Math.max(Math.min(props.num, activeInput.value + 1), 0)
  if (elem === props.num) {
    return
  }
  blurInput()
  focusInput(elem)
}
function focusPrevInput() {
  const elem = Math.max(Math.min(props.num - 1, activeInput.value - 1), 0)
  blurInput()
  focusInput(elem)
}
function handleOnPaste(event: ClipboardEvent) {
  blurInput()
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
  focusInput(Math.min(props.num - 1, length))
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
    case 'Backspace': {
      if (activeInput.value === (props.num - 1) && input.value[(props.num - 1)].value) {
        return
      }
      input.value[activeInput.value].value = ''
      if (activeInput.value > 0) {
        input.value[activeInput.value - 1].value = ''
      }
      focusPrevInput()
      return event.preventDefault()
    }
    case 'ArrowRight':
    case 'ArrowLeft': {
      return event.preventDefault()
    }
    case 'Enter': {
      if (input.value[activeInput.value].value !== '') {
        checkComplete()
        focusNextInput()
      }
      return event.preventDefault()
    }
    default: {
      if (event.code === 'KeyV') {
        break
      } else if (event.code.startsWith('Digit')) {
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(event.key)) {
          input.value[activeInput.value].value = event.key
          focusNextInput()
        }
        checkComplete()
      }
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
  disabled.value.splice(disabled.value, 0, false)
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
