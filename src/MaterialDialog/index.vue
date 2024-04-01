<template>
  <a-modal v-model:visible="visible" @ok="onOk" @cancel="onCancel" title="选择文件" width="840px">
    <div style="padding: 0 24px">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1">
          <template #tab>
            <span>
              <i class="icon-shangchuan_line"></i>
              本地上传
            </span>
          </template>
          <DragUploadBox @select="onSelectFile" :multiple="_multiple" :accept="accept">
            <div class="upload-box">
              <i class="icon-shangchuan_line" style="font-size: 24px; margin-bottom: 16px"></i>
              点击上传，或将文件拖放进此处
            </div>
          </DragUploadBox>
          <a-table
            :dataSource="dataSource"
            style="height: 230px"
            :scroll="{ y: 167 }"
            :columns="columns"
          />
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span>
              <i class="icon-wenjianjia_line"></i>
              素材中心
            </span>
          </template>
          <a-breadcrumb style="cursor: pointer; margin-bottom: 16px">
            <a-breadcrumb-item @click="jumpToFolder(-1)"> 图片 </a-breadcrumb-item>
            <a-breadcrumb-item
              v-for="(item, index) in folderPaths"
              :key="item.libId"
              @click="jumpToFolder(index)"
            >
              {{ item.libName }}
            </a-breadcrumb-item>
          </a-breadcrumb>
          <div class="cell-list" ref="scrollRef">
            <CellItem
              v-for="item in list1"
              :key="item.libId"
              :item="item"
              @click="enterFolder(item)"
            />
            <CellItem
              v-for="item in list2"
              :key="item.materialId"
              :item="item"
              :selected="selected.find((i) => i.materialUrl === item.materialUrl)"
              @change="onChangeSelect(item)"
            />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup lang="tsx">
  import { computed, h, ref } from 'vue'
  import DragUploadBox from '/@/components/DragUploadBox/index.vue'
  import CellItem from './CelItem.vue'
  import { useScrollLoad } from '/@/views/material/useScrollLoad'
  import {
    getFileSize,
    uploadFile,
  } from '/@/views/creation/createWork/components/framesContent/utils'

  const scrollRef = ref(null)
  const { list1, list2, refresh } = useScrollLoad(scrollRef, {})

  const folderPaths = ref([])

  const _multiple = ref(true)

  const enterFolder = (path) => {
    folderPaths.value.push(path)
    refreshData()
  }

  function jumpToFolder(index) {
    folderPaths.value = folderPaths.value.slice(0, index + 1)
    refreshData()
  }

  const curFolderId = computed(() => {
    if (folderPaths.value.length === 0) {
      return ''
    }
    return folderPaths.value[folderPaths.value.length - 1].libId
  })

  let _topicId = 'dsops_img'

  const accept = computed(() => {
    if (_topicId === 'dsops_img') {
      return 'image/*'
    }
    if (_topicId === 'dsops_video') {
      return 'video/*'
    }
    if (_topicId === 'dsops_audio') {
      return 'audio/*'
    }
    return ''
  })

  function refreshData() {
    refresh(_topicId, {
      libId: curFolderId.value,
    })
  }

  const selected = ref([])

  const onChangeSelect = (item) => {
    if (_multiple.value) {
      console.log('🚀 ~ onChangeSelect ~ item:', item)
      if (selected.value.find((i) => i.materialUrl === item.materialUrl)) {
        selected.value = selected.value.filter((i) => i.materialUrl !== item.materialUrl)
      } else {
        selected.value.push(item)
      }
    } else {
      selected.value = [item]
    }
  }

  const activeKey = ref('1')

  const visible = ref(false)

  const dataSource = ref<
    {
      name: string
      statusText: string
      status: string
      percent: number
      url: string
    }[]
  >([])

  function onSelectFile(files) {
    files.map((file) => {
      console.log('🚀 ~ files.map ~ file:', file)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      if (_multiple.value) {
        dataSource.value.push({
          name: file.name,
          statusText: '上传中',
          status: 'uploading',
          percent: 0,
          url: '',
        })
      } else {
        dataSource.value = [
          {
            name: file.name,
            statusText: '上传中',
            status: 'uploading',
            percent: 0,
            url: '',
          },
        ]
      }
      // 记录index
      const index = dataSource.value.length - 1
      reader.onload = (e) => {
        dataSource.value[index].url = e.target.result
      }

      uploadFile(file, {
        onProgress: (percent) => {
          dataSource.value[index].percent = percent
        },
      })
        .then((url) => {
          dataSource.value[index] = {
            ...dataSource.value[index],
            url,
            statusText: '上传成功',
            status: 'success',
          }
          console.log('🚀 ~ file:', url)
        })
        .catch((error) => {
          dataSource.value[index].statusText = '上传失败'
          dataSource.value[index].status = 'error'
        })
    })
  }

  function onRemoveFile(index) {
    dataSource.value.splice(index, 1)
  }

  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      width: '60%',
      customRender: ({ record }) => {
        return (
          <div style="display: flex; align-items: center;">
            <div class="upload-file-thumb">
              <img src={record.url}></img>
            </div>
            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-left: 12px;flex: 1;">
              <div class="ellipsis">{record.name}</div>
              <a-progress percent={record.percent}></a-progress>
            </div>
          </div>
        )
      },
    },
    {
      title: '上传状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      customRender: ({ record }) => {
        return (
          <div style="display: flex; align-items: center; justify-content: center">
            <span class={`upload-status-${record.status}`}></span>
            {record.statusText}
          </div>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      customRender: ({ index }) => {
        return (
          <>
            <a-button type="link" onClick={() => onRemoveFile(index)}>
              删除
            </a-button>
          </>
        )
      },
    },
  ]

  function onCancel() {
    visible.value = false
  }

  let _callback = null

  function onOk() {
    if (activeKey.value === '1') {
      // 本地上传dataSource不能为空
      if (dataSource.value.length === 0) {
        return
      }
      _callback &&
        _callback(
          dataSource.value.map((item) => ({
            url: item.url,
            name: item.name,
            desc: getFileSize(item.size),
          })),
        )
      visible.value = false
    } else {
      // 素材中心selected不能为空
      if (selected.value.length === 0) {
        return
      }
      _callback &&
        _callback(
          selected.value.map((item) => ({
            url: item.materialUrl,
            name: item.materialName,
            desc: getFileSize(item.metaInfo.size),
          })),
        )
      visible.value = false
    }
  }

  defineExpose({
    open({ topicId, multiple, selectedUrl = null }, callback) {
      _topicId = topicId
      _callback = callback
      _multiple.value = multiple
      if (selectedUrl) {
        if (Array.isArray(selectedUrl)) {
          selected.value = selectedUrl.map((url) => ({ materialUrl: url }))
        } else {
          selected.value = [{ materialUrl: selectedUrl }]
        }
      } else {
        selected.value = []
        dataSource.value = []
      }
      refreshData()
      visible.value = true
    },
  })
</script>

<style scoped lang="less">
  .upload-box {
    width: 792px;
    height: 170px;
    background: #f4f4f7;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-weight: 400;
    font-size: 14px;
    color: #606065;
    text-align: center;
    cursor: pointer;
    margin-bottom: 20px;
  }

  .cell-list {
    overflow-y: auto;
    height: 400px;
    // padding: 16px 0;
  }
</style>

<style lang="less">
  .upload-file-thumb {
    width: 42px;
    height: 42px;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;

    img {
      width: 100%;
    }
  }

  [class^='upload-status-'] {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #99999f;
    margin-right: 6px;
  }

  .upload-status-uploading {
    background-color: #4964f2;
  }

  .upload-status-success {
    background-color: #18ab62;
  }

  .upload-status-error {
    background-color: #e64d4d;
  }
</style>
