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
      <MaterialMain :selectedMenu="selectedMenu" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import MaterialMain from './components/MaterialMain.vue'

  const menus = [
    { label: '图片', value: 'image', icon: 'icon-tupian_line' },
    { label: '视频', value: 'video', icon: 'icon-shipin_line' },
    { label: '音频', value: 'audio', icon: 'icon-yinle_line' },
  ]

  const selectedMenu = ref('image')

  const onClickMenu = (menu: string) => {
    selectedMenu.value = menu
  }
</script>

<style scoped lang="scss">
  .page-wrapper {
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
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
