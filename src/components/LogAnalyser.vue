<template>
  <!-- Filters -->
  <div class="filters">
    Filters:
    <input v-model="includeFilter" class="include" placeholder="Include" />
    <input v-model="excludeFilter" class="exclude" placeholder="Exclude" />
  </div>
  <!-- Table -->
  <div class="table">
    <div class="row header">
      <div :class="`sortable ${sortBy === 'id' ? 'sorted' : ''}`" @click="sortBy = 'id'">#</div>
      <div :class="`sortable ${sortBy === 'url' ? 'sorted' : ''}`" @click="sortBy = 'url'">URL</div>
      <div :class="`sortable ${sortBy === 'type' ? 'sorted' : ''}`" @click="sortBy = 'type'">Type</div>
      <div :class="`sortable ${sortBy === 'count' ? 'sorted' : ''}`" @click="sortBy = 'count'">Count</div>
      <div :class="`sortable ${sortBy === 'size' ? 'sorted' : ''}`" @click="sortBy = 'size'">Max Size</div>
    </div>
    <template v-for="log in logs" :key="log.id">
      <div class="row" @click="openRow(log.id)">
        <div>{{ log.id }}</div>
        <div>{{ log.url }}</div>
        <div>{{ log.type }}</div>
        <div>{{ log.count }}</div>
        <div>{{ displayKB(log.maxSize) }}</div>
      </div>
      <div class="row-expand" :class="{ collapsed: !log.open }">
        <div>
          <p>URL: {{ log.url }}</p>
          <p>
            Referrers: <span class="purple" v-for="(v, i) in [...log.referrers]" :key="i">{{ v }}</span>
          </p>
          <p>
            Statuses: <span class="green" v-for="(v, i) in [...log.statuses]" :key="i">{{ v }}</span>
          </p>
          <p>
            Response Sizes:
            <span class="orange" v-for="(v, i) in Array.from(log.sizes)" :key="i">
              {{ displayKB(+v) }}
            </span>
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive } from 'vue'
import { LogData } from '../assets/scripts/processHar'
export default defineComponent({
  name: 'LogAnalyser',
  props: {
    logs: { required: true },
  },
  setup: (prop) => {
    const logsFilter = prop.logs as LogData[]
    const sortBy = ref('id')
    const includeFilter = ref('')
    const excludeFilter = ref('')
    const logsOrdered = computed(() => {
      if (sortBy.value === 'url') return logsFilter.sort((a, b) => (b.url > a.url ? -1 : 1))
      if (sortBy.value === 'type') return logsFilter.sort((a, b) => (b.type > a.type ? -1 : 1))
      if (sortBy.value === 'size') return logsFilter.sort((a, b) => b.maxSize - a.maxSize)
      if (sortBy.value === 'count') return logsFilter.sort((a, b) => b.count - a.count)
      return logsFilter.sort((a, b) => a.id - b.id)
    })
    const logsFiltered = computed(() =>
      logsOrdered.value
        .filter((e) => includeFilter.value.length < 1 || e.url.match(includeFilter.value.toLowerCase())?.length)
        .filter((e) => excludeFilter.value.length < 1 || !e.url.match(excludeFilter.value.toLowerCase())?.length)
    )
    const openRow = (index: number) => {
      const target = logsFilter.find((e) => e.id === index)
      if (target) target.open = !target.open
    }
    const displayKB = (size: number) => {
      if (size === 0) return '-'
      if (!size) return 'N/A'
      if (size < 100) return `~0`
      if (size < 1000) return `${Math.round(size / 100) / 10}kB`
      return `${Math.round(size / 1000)}kB`
    }
    return { logs: logsFiltered, includeFilter, excludeFilter, openRow, sortBy, displayKB }
  },
})
</script>

<style lang="scss" scoped>
.table {
  text-align: left;
  border: 1px solid silver;
  border-bottom: 1px;
  border-right: 1px;
}
.header {
  font-weight: bold;
  cursor: none;
  background: #eee;
  .sortable {
    cursor: pointer;
  }
  .sorted {
    background: skyblue;
    position: relative;
  }
  .sorted::after {
    content: '↓';
    position: absolute;
    right: 5px;
  }
}
.row {
  display: grid;
  grid-template-columns: 40px 3fr 120px 120px 120px;
  cursor: pointer;
}
.row-expand {
  display: grid;
  background: #eee;
  grid-template-columns: 100%;
  padding: 10px;
  border: 1px solid silver;
  border-top: 0;
  border-left: 0;
  font-size: small;
  p {
    line-height: 1.5;
    word-wrap: break-word;
  }
  span {
    border-radius: 50px;
    padding: 2px 5px;
    margin-right: 5px;
    margin-bottom: 2px;
    display: inline-block;
  }
  span.purple {
    color: white;
    border: 1px solid purple;
    background: rgb(150, 69, 226);
  }
  span.green {
    color: white;
    border: 1px solid rgb(0, 128, 53);
    background: rgb(52, 182, 85);
  }
  span.orange {
    color: white;
    border: 1px solid rgb(128, 77, 0);
    background: rgb(182, 126, 52);
  }
  &.collapsed {
    display: none;
  }
}
.row div {
  border: 1px solid silver;
  border-top: 1px;
  border-left: 1px;
  padding: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.filters {
  margin-top: 40px;
  margin-bottom: 20px;
  .include {
    background: lightgreen;
  }
  .exclude {
    background: pink;
  }
}
</style>
