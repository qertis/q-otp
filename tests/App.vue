<template>
  <main class="page">
    <h1>q-otp</h1>
    <p class="description">
      Click a filled field, use the keyboard, paste a code, then test focus and clear.
    </p>

    <QOtp
        ref="otp"
        outlined
        label="Verification code"
        :num="6"
        :autofocus="true"
    />

    <div class="actions">
      <QBtn color="primary" label="Focus first field" @click="otp?.focus()"/>
      <QBtn outline color="primary" label="Clear" @click="otp?.clear()"/>
    </div>
  </main>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {QBtn} from 'quasar'
import QOtp from '../src/component/QOtp.vue'

const otp = ref<InstanceType<typeof QOtp>>()
</script>

<style>
:root {
  color: #172033;
  background: #f4f7fb;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

body {
  margin: 0;
}

.page {
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 520px;
  min-height: 100vh;
  padding: 48px 24px;
}

h1 {
  margin: 8px 0 12px;
  font-size: 2rem;
}

.description {
  color: #52627c;
  line-height: 1.5;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}
</style>
