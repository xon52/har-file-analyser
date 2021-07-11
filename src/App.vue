<template>
  <h1>HAR File Analyser</h1>
  <div class="wrapper">
    <Instructions />
    <Upload @data-uploaded="handleData" />
    <LogAnalyser v-if="data" :logs="data" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import Upload from './components/Upload.vue'
import Instructions from './components/Instructions.vue'
import LogAnalyser from './components/LogAnalyser.vue'

export default defineComponent({
  name: 'App',
  components: { LogAnalyser, Instructions, Upload },
  setup: () => {
    const data = ref(null)
    const handleData = (payload: any) => {
      console.log('Data inserted.')
      return (data.value = payload)
    }
    return { data, handleData }
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.wrapper {
  max-width: 100vw;
}
</style>
