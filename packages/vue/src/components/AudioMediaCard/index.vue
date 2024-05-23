<template>
  <div class="card-wrapper" @click="onClick">
    <div class="content">
      <img :src="item.cover" alt="" />
      <div class="handle">
        <div>
          <i class="icon-zanting_fill" v-if="playingUrl === item.url"></i>
          <i class="icon-bofang_fill" v-else></i>
        </div>
        <div>
          <i class="icon-xiazai_line" @click.stop="onDownFile"></i>
          <i class="icon-shanchu_line" @click.stop="onRemove"></i>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="ellipsis">{{ item.name }}</div>
      <div class="desc">{{ item.desc }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { downFile } from '@media-library/core';
import { useSound } from '../../hooks/useSound';

  const props = defineProps<{
    item: MaterialItem
  }>()

  const emits = defineEmits(['click', 'remove'])

  const { toggle, playingUrl } = useSound()

  const onClick = () => {
    toggle(props.item.url)
    emits('click')
  }

  const onRemove = () => {
    emits('remove')
  }

  const onDownFile = () => {
    downFile(props.item.url, props.item.name)
  }
</script>

<style scoped lang="scss">

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .card-wrapper {
    width: 214px;
    height: 212px;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #e7e7ea;

    .content {
      height: 160px;
      background: #f4f4f7;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      justify-content: center;

      img {
        width: 100%;
      }

      .handle {
        display: none;
      }

      .playing-mask {
        inset: 0;
        position: absolute;
        background: rgba(10, 10, 21, 0.4);
        color: #fff;
        font-weight: 500;
        font-size: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &:hover .handle {
        display: flex;
        justify-content: space-between;
        color: #fff;
        height: 40px;
        line-height: 40px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-image: linear-gradient(180deg, #00000000 0%, #0000004d 100%);

        i {
          margin-left: 12px;

          &:last-child {
            margin-right: 12px;
          }
        }
      }
    }

    .info {
      height: 52px;
      background-color: #fff;
      font-weight: 400;
      font-size: 14px;
      color: #0a0a15;
      line-height: 1.8;
      padding: 0 10px;

      .desc {
        font-weight: 400;
        font-size: 12px;
        color: #99999f;
      }
    }
  }
</style>
