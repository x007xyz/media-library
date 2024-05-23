<template>
  <div class="cell-item-wrapper" @click="onClick">
    <div class="thumb">
      <img :src="item.cover" alt="" />
    </div>
    <div class="content">
      <div class="title">{{ item.name }}</div>
      <div class="desc">{{ item.desc }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { previewVideo } from '../PreviewVideo';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['click'])

function onClick() {
  previewVideo(props.item.url)
  emits('click')
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
  overflow: hidden;
  border-radius: 4px;

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
    margin-left: 12px;

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
