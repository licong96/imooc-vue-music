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
    },
    enable() {
      this.scroll && this.scroll.enable()    // 启用
    },
    disable() {
      this.scroll && this.scroll.disable()  // 禁用
    },
    refresh() {
      this.scroll && this.scroll.refresh()  // 重新计算
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

<style lang="css">
</style>
