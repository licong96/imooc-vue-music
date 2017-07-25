<template lang="html">
  <!-- 封装成一个页面scroll组件 -->
  <section ref="wrapper">
    <slot></slot>
  </section>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listemScroll: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      // 监听scroll滚动事件
      if (this.listemScroll) {
        let self = this
        this.scroll.on('scroll', (pos) => {
          self.$emit('scroll', pos)           // 派发事件，输出位置
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable()    // 启用
    },
    disable() {
      this.scroll && this.scroll.disable()  // 禁用
    },
    refresh() {
      this.scroll && this.scroll.refresh()  // 重新计算
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
</style>
