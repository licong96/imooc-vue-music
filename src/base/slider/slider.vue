<template lang="html">
  <!-- 轮播图 -->
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {classie} from 'common/js/dom'

export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted () {     // 为了保证better-scroll成功计算
    setTimeout(() => {    // 浏览器17秒渲染一次
      this._setSliderWidth()
      this._initSlider()

      // 根据参数决定是否播放
      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    // 改变窗口大小时重新渲染
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth()
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth () {    // 设置计算宽度
      this.children = this.$refs.sliderGroup.children   // 获取每一个图片容器

      let width = 0     // 图片父容器宽度
      let sliderWidth = this.$refs.slider.clientWidth   // 总容器宽度
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        classie.addClass(child, 'slider-item')      // 给每一个图片容器加一个class
        child.style.width = sliderWidth + 'px'    // 每个图片容器宽度都等于总宽度
        width += sliderWidth
        this.dots.push(i)         // 轮播下面的小球
      }

      // 如果配置循环，在前后复制两份
      if (this.loop) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'   // 设置图片父容器宽度
    },
    _initSlider () {        // 初始化slider滑动
      this.slider = new BScroll(this.$refs.slider, {
        // click: true,       // 因为冲突，删掉反而可以点击
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400
      })

      // 每次滑动获取当前页数，赋值给dots小球
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _play () {      // 自动播放
      let pageIndex = this.currentPageIndex + 1
      if (this.loop) {
        pageIndex += 1
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  destroyed () {      // 实例销毁后清除轮播切换
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/sass/variable";

  .slider{
    position: relative;
    min-height: 1px;
  }
  .slider-group{
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item{
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      .slider-a{
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }
      .slider-img{
        display: block;
        width: 100%;
      }
    }
  }
  .dots{
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .dot{
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $color-text-l;
      transition: all .3s;
      transform-origin: center center;
      &.active{
        transform: scaleX(1.8);
        border-radius: 3px;
        background-color: $color-text-ll;
      }
    }
  }
</style>
