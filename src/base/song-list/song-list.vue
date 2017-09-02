<template lang="html">
  <!-- 一个公用列表 -->
  <section class="song-list">
    <ul>
      <li @click="selectItem(song, index)" v-for="(song, index) in songs" class="item">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem (item, index) {    // 打开播放
        this.$emit('select', item, index)
      },
      getDesc (song) {
        return `${song.singer} . ${song.album}`
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "~common/sass/variable";
  @import "~common/sass/mixin";

  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }

</style>
