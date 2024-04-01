import { useInfiniteScroll } from '@vueuse/core'
import { ref } from 'vue'
import { TopicId, fetchMaterDirList, fetchMaterialList } from '/@/api/material'

export const useScrollLoad = (el, options) => {
  const list1 = ref([])
  const total1 = ref(999)
  const list2 = ref([])
  const total2 = ref(999)

  const pageSize = options.pageSize || 10
  let pageIndex = 1
  let finished = false
  let loading = false
  let topicId: TopicId = 'dsops_img'
  let libId
  let keyword = ''

  function search() {
    if (list1.value.length < total1.value) {
      fetchMaterDirList({ pageIndex, pageSize, topicId, libId, keyword }).then((res) => {
        total1.value = res.total
        list1.value = (pageIndex === 1 ? [] : list1.value).concat(res.list)

        pageIndex++
        loading = false
        if (list1.value.length === total1.value) {
          // 目录已经加载完成
          pageIndex = 1
        }
      })
    } else {
      fetchMaterialList({ pageIndex, pageSize, topicId, libId, keyword }).then((res) => {
        total2.value = res.total
        list2.value = (pageIndex === 1 ? [] : list2.value).concat(res.list)
        pageIndex++
        loading = false
        if (list2.value.length === total2.value) {
          finished = true
        }
      })
    }
  }

  function refresh(_topicId: TopicId, params?) {
    useInfiniteScroll(
      el,
      () => {
        if (loading) return
        if (finished) return
        loading = true
        search()
        // load more
        // list.value.push(...moreData)
      },
      options,
    )

    pageIndex = 1
    finished = false
    loading = true
    topicId = _topicId
    libId = params.libId || ''
    keyword = params.keyword || ''
    // 清除数据
    list1.value = []
    list2.value = []
    total1.value = 999
    total2.value = 999
    // 如何再次触发加载，并且不再次触发加载
    search()
  }

  return { list1, list2, refresh }
}
