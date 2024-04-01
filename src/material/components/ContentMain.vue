<template>
  <div class="main-area">
    <div class="header">
      <div class="header-left">
        <div class="title">{{ props.selectedMenu == 'live_scene' ? '直播场景' : '混剪视频' }}</div>
        团队合成的{{ props.selectedMenu == 'live_scene' ? '直播场景' : '混剪视频' }}会自动同步至此处
      </div>
      <div>
        <SearchInput
          v-if="props.selectedMenu == 'live_scene'"
          v-model:value="keyword"
          @search="onSearch"
          placeholder="搜索直播场景名称"
        />
        <SearchInput
          v-else
          v-model:value="keyword"
          @search="onSearch"
          placeholder="搜索混剪视频名称"
        />
      </div>
    </div>
    <div class="area-content" ref="scrollRef">
      <div v-if="list.length === 0" class="empty-content">
        <img src="/@/assets/empty.png" alt="" />
        <span>暂时还没有内容</span>
      </div>
      <div class="card-grid">
        <ContentCard v-for="item in list" :key="item.mapId" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import SearchInput from '/@/components/SearchInput/index.vue'
  import { fetchTaskList } from '/@/api/creation'
  import { useScrollLoad } from '/@/hooks/web/useScrollLoad'
  import ContentCard from './ContentCard.vue'

  const props = defineProps<{ selectedMenu: string }>()

  const selectedMenu = computed(() => props.selectedMenu)

  const keyword = ref('')

  const scrollRef = ref<HTMLDivElement>()

  const { list, refresh } = useScrollLoad(
    scrollRef,
    (params) =>
      fetchTaskList({
        ...params,
        taskType: props.selectedMenu == 'live_scene' ? 1 : 3,
        showAll: true,
      }),
    {},
  )

  watch(
    selectedMenu,
    () => {
      refresh()
    },
    { immediate: true },
  )

  function onSearch() {}
</script>

<style scoped lang="less">
  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    color: #0a0a15;
    img {
      width: 176px;
      height: 176px;
      margin-top: 200px;
    }
  }
  .main-area {
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex: 1;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-left {
      font-weight: 400;
      font-size: 12px;
      color: #99999f;
      display: flex;
      align-items: center;
    }

    .title {
      font-weight: 500;
      font-size: 16px;
      color: #0a0a15;
      margin-right: 12px;
    }

    .area-content {
      flex: 1;
      overflow-y: auto;
    }
  }

  .card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
  }
</style>
