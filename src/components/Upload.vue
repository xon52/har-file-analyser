<template>
  <button @click="handleDefault">Load example</button> or
  <button @click="handleUpload">Upload HAR File</button>
  <input ref="upload" type="file" accept=".har" @change="handleFile" />
  <p>Loaded: {{ loaded }}</p>
</template>

<script lang="ts">
import processHar from '../assets/scripts/processHar'
import defaultData from '../assets/logs/defaultData.json'
import { defineComponent, Ref, ref } from 'vue'

export default defineComponent({
  name: 'Upload',
  emits: ['data-uploaded'],
  setup: (props, { emit }) => {
    const loaded = ref('None')
    const upload: Ref<HTMLInputElement | null> = ref(null)
    const handleDefault = () => {
      loaded.value = 'Default'
      console.log(defaultData)
      emit('data-uploaded', defaultData)
    }
    const handleUpload = () => upload.value?.click()
    const handleFile = (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.length ? target.files[0] : false
      if (file) {
        loaded.value = file.name
        processHar(file)
          .then((result) => emit('data-uploaded', result))
          .catch()
      }
    }
    return { loaded, upload, handleFile, handleUpload, handleDefault }
  },
})
</script>

<style lang="scss" scoped>
input {
  display: none;
}
p {
  font-size: 75%;
}
</style>
