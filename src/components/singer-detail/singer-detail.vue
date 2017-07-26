<template lang="html">
  <section class="singer-detail">
    <span @click="go">返回</span>
  </section>
</template>

<script>
export default {
  methods: {
    go () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/sass/variable";

  .singer-detail{
    position: fixed;
    z-index: 100;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: $color-background;
  }
</style>
