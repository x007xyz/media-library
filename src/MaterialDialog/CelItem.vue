<template>
  <div class="cell-item-wrapper" @click="onClick" :class="{ selected }">
    <div class="status">
      <a-checkbox v-if="!props.item.libId" v-model:checked="selected" />
    </div>
    <div class="thumb">
      <img :src="coverUrl" alt="" />
    </div>
    <div class="content">
      <div class="title">{{ title }}</div>
      <div class="desc">{{ desc }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import FolderImage from '/@/assets/folder.png'
  import { computed } from 'vue'
  import { getFileSize } from '/@/views/creation/createWork/components/framesContent/utils'
  import dayjs from 'dayjs'
  import AudioImage from '/@/assets/images/audio.png'

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  })

  const coverUrl = computed(() => {
    if (props.item.libId) {
      return FolderImage
    }
    if (props.item.materialType === 1) {
      return AudioImage
    }
    return props.item.materialUrl
  })

  const title = computed(() => {
    if (props.item.libId) {
      return props.item.libName
    }
    return props.item.materialName
  })

  const desc = computed(() => {
    if (props.item.libId) {
      return `包含${props.item.materialCount}素材`
    }
    return `${getFileSize(props.item.metaInfo.size)} | ${props.item.creatorName}上传于${dayjs(
      props.item.createTimestamp * 1000,
    ).format('YYYY-MM-DD HH:mm:ss')}`
  })

  const emits = defineEmits(['change', 'click'])

  function onClick() {
    emits('click')
    if (props.item.libId) {
      return
    }
    emits('change', !props.selected)
  }
</script>

<style scoped lang="scss">
  .cell-item-wrapper {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    // padding: 0 16px;
    cursor: pointer;

    &:hover,
    &.selected {
      background: #f5f6ff;
    }

    .status {
      padding: 0 16px;
      display: flex;
      width: 48px;
      align-items: center;
    }

    .thumb {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      overflow: hidden;
      margin-right: 12px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .title {
      font-weight: 400;
      font-size: 14px;
      color: #0a0a15;
    }

    .desc {
      font-weight: 400;
      font-size: 12px;
      color: #99999f;
    }
  }
</style>
