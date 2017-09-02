<template lang="html">
  <!-- 歌手歌曲列表组件 -->
  <section class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <!-- 背景图片 -->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 按钮 -->
      <div class="play-wrapper">
        <div class="play" v-show="songs.length>0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 向上滚动的背景 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 列表内容弹动 -->
    <scroll
    class="list"
    @scroll="scroll"
    :probe-type="probeType"
    :listem-scroll="listemScroll"
    :data="songs"
    ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
    </scroll>
    <!-- loading -->
    <loading class="loading-container" v-show="!songs.length"></loading>
  </section>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import {prefixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex'

  const RESERVED_HEIGHT = 40      // 滑动距离顶部title高度
  const transform = prefixStyle('transform')    // 浏览器前缀
  const backdrop = prefixStyle('backdrop-filter')    // 浏览器前缀

  export default {
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        scrollY: 0
      }
    },
    created () {
      this.probeType = 3
      this.listemScroll = true
    },
    mounted () {
      // 记录高度减少dom请求
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslatyY = -this.imageHeight + RESERVED_HEIGHT
      // list列表数据距离顶部要有一张图片的距离，展示背景图片
      this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    },
    computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
    methods: {
      scroll (pos) {      // 监听滚动位置
        this.scrollY = pos.y
      },
      back () {
        this.$router.back()
      },
      selectItem (item, index) {    // 子组件事件，打开播放器
        this.selectPlay({
          list: this.songs,     // list事整个数据
          index
        })
      },
      ...mapActions([
        'selectPlay'
      ])
    },
    watch: {
      scrollY (newY) {
        // max() 方法可返回两个指定的数中带有较大的值的那个数，this.minTranslatyY是小数，所以是最大的
        let translateY = Math.max(this.minTranslatyY, newY)
        // console.log(translateY)    // 距离顶部
        let zIndex = 0
        let scale = 1
        let blur
        const percent = Math.abs(newY / this.imageHeight) // abs返回绝对值
        // 如果是向下拉，则图片放大
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          // 上拉图片模糊
          blur = Math.min(10 * percent, 10) // 返回最低的数字
        }
        // 模糊只有ios有效
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        // 背景颜色向上偏移
        this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
        // 向上滚到顶部
        if (newY < this.minTranslatyY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    },
    components: {
      Scroll,
      SongList,
      Loading
    }
  }
</script>

<style scoped lang="scss">
  @import "~common/sass/variable";
  @import "~common/sass/mixin";

  .music-list {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background-color: $color-background;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
      @include no-wrap();
    }
    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .play-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
      }
      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .bg-layer {
      position: relative;
      height: 100%;
      background: $color-background;
    }
    .list {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      background: $color-background;
      .song-list-wrapper {
        padding: 20px 30px;
      }
    }
  }
</style>
