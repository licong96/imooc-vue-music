<template lang="html">
  <scroll class="listview"
          :data="data"
          :listemScroll="listemScroll"
          :probeType="probeType"
          @scroll="scroll"
          ref="listview">
    <!-- 数据列表 -->
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img class="avatar loadimg" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧列表 -->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            class="item"
            :data-index="index"
            :class="{current: currentIndex === index}">{{item}}</li>
      </ul>
    </div>
    <!-- 浮动在顶部的标题 -->
    <div class="list-fixed" v-show="fixedTitle">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18    // 每个右字母导航高度

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        scrollY: -1,        // 滚动的位置
        currentIndex: 0     // 滚动的index
      }
    },
    created() {
      this.touch = {}         // 记录手指按下和滑动的值
      this.listemScroll = true   // 是否监听滚动事件
      this.listHeight = []      // 每个列表的高度
      this.probeType = 3
    },
    computed: {
      shortcutList() {    // 获取右侧字母导航列表
        return this.data.map((group) => {     // map 原数组被“映射”成对应新数组
          return group.title.substr(0, 1)     // 抽取字符串第一个标题
        })
      },
      fixedTitle() {      // 浮动title
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      onShortcutTouchStart(e) {   // 按下
        let anchorIndex = getData(e.target, 'index')   // 按下的位置
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY    // 拿到按下时的Y值
        this.touch.anchorIndex = anchorIndex   // 保存当前按下的index
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {    // 滑动
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY    // 拿到滑动时的Y值
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0   // | 0表示向下取整
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
        this.currentIndex = anchorIndex
      },
      _scrollTo(index) {    // 整合在一起
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      scroll(pos) {     // scroll组件派发的事件
        this.scrollY = pos.y
      },
      _calculateHeight() {    // 每个列表的高度
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        })
      },
      scrollY(newY) {         // 滚动到的区间位置
        const listHeight = this.listHeight
        // 当滚动到顶部，newY > 0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在列表里面滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            // console.log(this.currentIndex)
            return
          }
        }
        this.currentIndex = 0
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/sass/variable";

  .listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: $color-background;
    .list-group{
      padding-bottom: 30px;
      .list-group-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      .list-group-item{
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name{
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .list-shortcut{
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background-color: $color-background-d;
      font-family: Helvetica;
      .item{
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current{
          color: $color-theme;
        }
      }
    }
    .list-fixed{
      position: absolute;
      top: -1px;
      left: 0;
      width: 100%;
      .fixed-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background-color: $color-highlight-background;
      }
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
