<template lang="html">
  <!-- 歌手页面 -->
  <div class="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res.data.list)
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) {      // 格式化成我们想要的数据
        let map = {
          hot: {        // 热门歌手数据
            title: HOT_NAME,
            items: []
          }
        }
        // 共需要两种数据，一是热门，二是字母排列
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            // 拿前10个作为热门歌手数据，用了Singer类封装
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          // 右侧字母导航
          const key = item.Findex
          if (!map[key]) {
            // 如果没有key就创建一个，默认是没有的
            map[key] = {
              title: key,
              items: []
            }
          }
          // 字母排列歌手数据
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        // console.log(map)
        // 为了得到有序列表，我们需要处理 map
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            // 如果是字母，push到 ret中
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            // 如果事 hot，push到热门中
            hot.push(val)
          }
        }
        // 字母列表要排序 A-Z
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)    // concat 方法用于连接多个数组
      }
    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .singer{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
