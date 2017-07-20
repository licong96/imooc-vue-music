<template lang="html">
  <!-- 轮播图 -->
  <div class="slider">
    <div class="slider-group">
      <slot></slot>
    </div>
    <div class="dots">

    </div>
  </div>
</template>

<script>
export default {
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
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/sass/variable";

  .slider{
    min-height: 1px;
  }
</style>
