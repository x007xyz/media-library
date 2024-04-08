<template>
  <div class="folder-wrapper">
    <img v-if="[7].includes(item.sourceType)" src="/@/assets/sync_folder.png" alt="" />
    <img v-else src="/@/assets/folder.png" alt="" />
    <div class="title">{{ item.libName }}</div>
    <div class="desc">{{ item.materialCount }}个文件</div>
    <a-popover color="#fff" v-model:visible="popVisible" v-if="title !== '管理中心'">
      <i class="icon-gengduo_zongxiang_line handle"></i>
      <template #content>
        <div style="cursor: pointer">
          <div
            v-if="![7].includes(item.sourceType)"
            style="color: #0a0a15; margin-bottom: 8px"
            @click="onRename"
            >重命名</div
          >
          <div style="color: #0a0a15; margin-bottom: 8px" @click="onCheck">文件夹详情</div>
          <a-popconfirm title="是否确定删除？" ok-text="是" cancel-text="否" @confirm="onRemove">
            <div style="color: #e64d4d">删除</div>
          </a-popconfirm>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  defineProps<{
    item: any
  }>()

  const emits = defineEmits(['remove', 'rename', 'check'])

  const popVisible = ref<boolean>(false)

  function onRemove() {
    popVisible.value = false
    emits('remove')
  }

  function onRename() {
    popVisible.value = false
    emits('rename')
  }

  function onCheck() {
    popVisible.value = false
    emits('check')
  }
</script>

<style scoped lang="scss">
  .folder-wrapper {
    width: 214px;
    height: 172px;
    background: #f4f4f7;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;

    .handle {
      position: absolute;
      bottom: 10px;
      right: 12px;
      transform: rotate(90deg);
    }

    img {
      width: 74px;
      height: 74px;
    }

    .title {
      font-weight: 400;
      font-size: 14px;
      color: #0a0a15;
      word-break: break-all;
    }

    .desc {
      font-weight: 400;
      font-size: 12px;
      color: #99999f;
    }
  }
</style>
