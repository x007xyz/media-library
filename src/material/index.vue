<template>
  <div class="page-wrapper">
    <div class="page-container">
      <div class="left-area">
        <div style="flex: 1">
          <div class="title">素材</div>
          <div
            v-for="menu in menus"
            :key="menu.value"
            class="menu-item"
            :class="{ selected: selectedMenu === menu.value }"
            @click="onClickMenu(menu.value)"
          >
            <i :class="menu.icon"></i>
            {{ menu.label }}
          </div>
          <a-divider style="margin: 16px 0" />
          <div class="title">作品</div>
          <div
            class="menu-item"
            @click="onClickMenu('live_scene')"
            :class="{ selected: selectedMenu === 'live_scene' }"
          >
            <i class="icon-moban_line"></i>
            直播场景
          </div>
          <div
            class="menu-item"
            @click="onClickMenu('video_scene')"
            :class="{ selected: selectedMenu === 'video_scene' }"
          >
            <i class="icon-shouji_line"></i>
            混剪视频
          </div>
        </div>
        <!-- <div
          class="menu-item"
          @click="onClickMenu('recycle_bin')"
          :class="{ selected: selectedMenu === 'recycle_bin' }"
        >
          <i class="icon-shanchu_line"></i>
          回收站
        </div> -->
      </div>
      <MaterialMain
        v-if="menus.find((menu) => menu.value === selectedMenu)"
        :selectedMenu="selectedMenu"
      />
      <ContentMain v-if="['live_scene','video_scene'].includes(selectedMenu)" :selectedMenu="selectedMenu" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import MaterialMain from './components/MaterialMain.vue'
  import ContentMain from './components/ContentMain.vue'

  const menus = [
    { label: '图片', value: 'dsops_img', icon: 'icon-tupian_line' },
    { label: '视频', value: 'dsops_video', icon: 'icon-shipin_line' },
    { label: '音频', value: 'dsops_audio', icon: 'icon-yinle_line' },
    { label: '自动回复', value: 'dsops_auto_reply', icon: 'icon-QA_line' },
  ]

  const selectedMenu = ref('dsops_img')

  const onClickMenu = (menu: string) => {
    selectedMenu.value = menu
  }
</script>

<style scoped lang="less">
  .page-wrapper {
    height: 100%;
    padding: 16px;
  }
  .page-container {
    height: 100%;
    background: #ffffff;
    border-radius: 12px;
    display: flex;
  }
  .left-area {
    width: 234px;
    border-right: 1px solid #e7e7ea;
    padding: 24px;
    display: flex;
    flex-direction: column;

    .title {
      font-weight: 400;
      font-size: 14px;
      color: #606065;
      margin-bottom: 16px;
    }

    .menu-item {
      width: 185px;
      height: 40px;
      // background: #f5f6ff;
      display: flex;
      font-weight: 400;
      font-size: 14px;
      color: #0a0a15;
      display: flex;
      align-items: center;
      line-height: 1;
      padding: 0 16px;
      cursor: pointer;

      &:hover,
      &.selected {
        color: #683cfd;
        background-color: #f5f6ff;
      }

      i {
        margin-right: 8px;
      }
    }
  }
</style>
