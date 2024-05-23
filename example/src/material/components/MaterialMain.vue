<template>
  <div class="main-area">
    <div class="header">
      <div class="title">
        {{ selectedMenuLabel }}
      </div>
      <div style="display: flex">
        <!-- <SearchInput></SearchInput> -->
        <a-button @click="onUpload">
          <upload-outlined />
          上传{{ selectedMenuLabel }}
        </a-button>
      </div>
    </div>
    <div class="area-content" ref="scrollRef">
      <!-- <div v-if="list.length === 0" class="empty-content">
        <img src="@/assets/empty.png" alt="" />
        <span>暂时还没有内容</span>
      </div> -->
      <div class="card-grid">
        <template v-if="selectedMenu === 'audio'">
          <AudioMediaCard v-for="item in audioArr" :item="item" @remove="onRemove(item)"></AudioMediaCard>
          <AudioMediaRow v-for="item in audioArr" :key="item.url" :item="item" @remove="onRemove(item)"></AudioMediaRow>
        </template>
        <template v-if="selectedMenu === 'image'">
          <ImageMediaCard v-for="item in imageArr" :item="item" @remove="onRemove(item)"></ImageMediaCard>
          <ImageMediaRow v-for="item in imageArr" :key="item.url" :item="item" @remove="onRemove(item)"></ImageMediaRow>
        </template>
        <template v-if="selectedMenu === 'video'">
          <VideoMediaCard v-for="item in videoArr" :item="item" @remove="onRemove(item)"></VideoMediaCard>
          <VideoMediaRow v-for="item in videoArr" :key="item.url" :item="item" @remove="onRemove(item)"></VideoMediaRow>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { selectFile, getFileSize } from '@/utils';
  import { getAudioInfo, getVideoInfo } from '@media-library/core';
  import { AudioMediaCard, AudioMediaRow, ImageMediaCard, ImageMediaRow, VideoMediaCard, VideoMediaRow } from "@media-library/vue"
  import AudioImage from '@/assets/audio.png';

  const props = defineProps<{ selectedMenu: string }>()

  const selectedMenu = computed(() => props.selectedMenu)

  const scrollRef = ref(null)

  function onRemove (item: MaterialItem) {
    console.log('onRemove', item)
  }

  const menus = [
    { label: '图片', value: 'image', icon: 'icon-tupian_line' },
    { label: '视频', value: 'video', icon: 'icon-shipin_line' },
    { label: '音频', value: 'audio', icon: 'icon-yinle_line' },
  ]

  const selectedMenuLabel = computed(() => {
    return menus.find((menu) => menu.value === selectedMenu.value)?.label
  })

  function formatDuration(duration: number) {
    const minutes = Math.floor(duration / 60).toString().padStart(2, '0')
    const seconds = Math.round(duration % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  const audioArr = ref<MaterialItem[]>([])

  function addAudio(file: File) {
    getAudioInfo(file).then(res => {
      audioArr.value.push({
        url: URL.createObjectURL(file),
        cover: res.cover || AudioImage,
        name: res.name,
        desc: [res.artist, formatDuration(res.duration)].join(' | ')
      })
    })
  }

  const videoArr = ref<MaterialItem[]>([])

  function addVideo(file: File) {
    getVideoInfo(file).then(res => {
      videoArr.value.push({
        url: URL.createObjectURL(file),
        cover: res.cover,
        name: res.name,
        desc: [getFileSize(file.size), formatDuration(res.duration)].join(' | ')
      })
    })
  }

  const imageArr = ref<MaterialItem[]>([])

  function addImage(file: File) {
    imageArr.value.push({
      url: URL.createObjectURL(file),
      cover: URL.createObjectURL(file),
      name: file.name,
      desc: getFileSize(file.size)
    })
  }

  function onUpload() {
    selectFile({ multiple: false, accept: `${selectedMenu.value}/*` })
      .then((files) => {
        if (selectedMenu.value === 'audio') {
          addAudio(files[0])
        } else if (selectedMenu.value === 'video') {
          addVideo(files[0])
        } else {
          addImage(files[0])
        }
      })
  }
</script>

<style scoped lang="scss">
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

      button {
        margin-left: 12px;
      }
    }

    .title {
      font-weight: 500;
      font-size: 16px;
      color: #0a0a15;
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
