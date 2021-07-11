<template>
  <div class="wrapper">
    <button @click="show = !show">Instructions</button>
    <div class="instructions" :class="{ show: show }">
      <ol>
        <li>Open your target app (e.g. <a href="https://app.safetyculture.com/">iAuditor</a>)</li>
        <li>"Inspect" the page, and go to the Network tab (Chrome)</li>
        <li>Refresh the page (so all Network can be recorded)</li>
        <li>Use iAuditor as you please (to create session data you want to analyse)</li>
        <li>
          Export Network log as HAR file: right click on any entry and click "Save all as HAR with content" (Chrome)
        </li>
        <li>Upload the file using the button below.</li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Instructions',
  setup: () => {
    const show = ref(false)
    return { show }
  },
})
</script>

<style lang="scss" scoped>
.wrapper {
  display: block;
  margin-bottom: 20px;
}
.instructions {
  display: none;
  margin: 0 auto;
  max-width: 800px;
  text-align: left;
  &.show {
    display: block;
  }
}
</style>
