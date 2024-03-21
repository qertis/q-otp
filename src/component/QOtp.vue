<template>
  <div @click="focusAndSelectInput(input.at(activeInput))">
    <QField
      class="main-field"
      :class="{
        'complete': pin.length === num,
      }"
      bg-color="transparent"
      :model-value="pin"
      :disable="props.loading"
      :rules="props.rules"
      :error="props.error"
      :reactive-rules="props.reactiveRules"
      :lazy-rules="props.lazyRules"
      :loading="props.loading"
      :error-message="props.errorMessage"
      :label="props.label"
      :stack-label="props.stackLabel"
      :bottom-slots="props.bottomSlots"
      :hint="props.hint"
      :hide-hint="props.hideHint"
      :prefix="props.prefix"
      :suffix="props.suffix"
      :borderless="true"
      :clearable="false"
      :counter="false"
      :no-error-icon="true"
      :dense="true"
    >
      <template v-for="(_, i) in num" :key="i">
        <QField
          class="otp-field"
          :class="fieldClasses"
          :autofocus="autofocus"
          :disable="disabled[i]"
          :readonly="props.readonly"
          :label-color="props.labelColor"
          :color="props.color"
          :bg-color="props.bgColor"
          :dark="props.dark"
          :filled="props.filled"
          :outlined="props.outlined"
          :borderless="props.borderless"
          :standout="props.standout"
          :rounded="props.rounded"
          :square="props.square"
          :dense="props.dense"
          :item-aligned="props.itemAligned"
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
              title=""
              :disabled="disabled[i]"
              :style="inputStyles"
              :class="['otp-input', inputClasses, conditionalClass[i]]"
              :placeholder="placeholder"
              :autofocus="activeInput === i"
              @input="handleOnChange"
              @keydown="handleOnKeyDown"
              @paste="handleOnPaste"
            />
          </template>
        </QField>
        <template v-if="separator.length && i !== num - 1">
          <span class="q-mt-auto q-mb-auto non-selectable" :class="'text-'+ (props.color ?? 'secondary')">
            {{ separator }}
          </span>
        </template>
      </template>
      <slot name="control"></slot>
    </QField>
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
    default: 6,
  },
  separator: {
    type: String as PropType<string>,
    default: '',
  },
  inputStyles: {
    type: [String, Object] as PropType<string | any>,
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
    default: ' ',
  },
})

const input = ref<HTMLInputElement | null>(null) as Ref<HTMLInputElement>
const activeInput = ref<number>(0)
const disabled = ref<boolean[]>([...Array(props.num).keys()].map(() => true))
const pin = ref<string>('')

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

function focusAndSelectInput(input: HTMLInputElement) {
  input.focus()
  input.setSelectionRange(0, 0)
  input.select()
}
function handleOnPaste(event: ClipboardEvent) {
  input.value.at(activeInput.value).blur()
  pin.value = event.clipboardData
    .getData('text/plain')
    .slice(0, props.num - activeInput.value)
    .split('')
    .map((elem) => Number(elem))
    .filter((elem) => Number.isInteger(elem))
    .map((value, i) => inputValue(String(value), i))
    .join('')
  return event.preventDefault()
}
function inputValue(value: string, index: number = activeInput.value) {
  return input.value.at(index).value = value[0] ?? ''
}
function handleOnChange() {
  pin.value = getPin()
}
function getPin() {
  let str = ''
  for (const { value } of input.value) {
    str += value
  }
  return str
}
function handleOnKeyDown(event: KeyboardEvent) {
  if (props.loading) {
    return event.preventDefault()
  }
  const { key, code } = event
  if (code === 'KeyV') {
    return
  }
  switch (key) {
    case 'Backspace': {
      if (activeInput.value === (props.num - 1) && input.value.at(props.num - 1).value) {
        return
      }
      inputValue('')
      if (activeInput.value > 0) {
        inputValue('', activeInput.value - 1)
      }
      pin.value = getPin()
      break
    }
    default: {
      if (code.startsWith('Digit') && digits.includes(key)) {
        inputValue(key)
        pin.value = getPin()
      }
      break
    }
  }
  event.preventDefault()
}
watch(
  () => pin.value,
  (newVal, oldVal) => {
    if (newVal === oldVal) {
      return
    }
    emit('change', newVal)
    if (props.num === newVal.length) {
      emit('complete', newVal)
    }
    const value = Math.min(newVal.length, props.num - 1)
    for (let i = 0; i < disabled.value.length - 1; i++) {
      disabled.value.splice(i, 1, i !== value)
    }
    setTimeout(() => {
      activeInput.value = value
    })
  },
)
watch(
  () => activeInput.value,
  (newVal, oldVal) => {
    if (oldVal !== newVal && newVal <= props.num - 1) {
      const elem = input.value.at(newVal)
      if (!elem.disabled) {
        focusAndSelectInput(elem)
      }
    }
  },
)
onMounted(() => {
  if (props.autofocus) {
    focusAndSelectInput(input.value.at(0))
  }
  disabled.value.splice(disabled.value, 0, false)
  if (props.modelValue) {
    for (let i = 0; i < props.modelValue.length; i++) {
      inputValue(props.modelValue[i], i)
    }
  }
})
defineExpose({
  blur() {
    for (let i = 0; i < props.num; i++) {
      input.value.at(i).blur()
    }
  },
  focus() {
    focusAndSelectInput(input.value.at(activeInput.value = 0))
  },
  clear() {
    for (let i = 0; i < props.num; i++) {
      inputValue('', i)
    }
    pin.value = ''
  },
  getPin,
})
</script>
<style lang="scss">
body.body--dark .otp-input {
  color: white;
  background-color: transparent;
}
</style>
<style lang="scss" scoped>
@mixin design-control($color) {
  :deep(.q-field__control) {
    &:hover::before {
      border-color: $color;
    }
    &.row {
      outline-color: transparent;
      color: $color;
    }
    &:has(input:not(:placeholder-shown)) {
      &::before,
      &::after {
        border-color: $color;
        color: $color;
        border-width: 2px;
      }
    }
    &::after {
      color: transparent;
      border: none;
    }
    &::before {
      border-width: 2px;
    }
  }
}
:deep(.otp-input) {
  background: transparent;
  border: none;
  min-width: 24px;
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
:host {
  label {
    cursor: text;
  }
}
.main-field {
  width: fit-content;

  :deep(.otp-field) {
    input,
    .q-field__control-container {
      opacity: 1 !important;
    }
    .q-field__inner {
      cursor: text;
    }
  }
  .q-field {
    @include design-control($primary);
  }
  &.complete {
    @include design-control($positive);
  }
  &.q-field--error {
    @include design-control($negative);
  }
}
</style>
