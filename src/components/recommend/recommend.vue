<template lang="html">
  <!-- 推荐页面 -->
  <div class="recommend">
    <!-- scroll滚动 -->
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <!-- 轮播图 -->
        <!-- 数据请求到之后再渲染轮播组件，宽度计算就不会出问题 -->
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl" class="slider-a">
                <!-- class="needsclick" 可以出发点击 -->
                <img @load="loadImage" :src="item.picUrl"  class="slider-img needsclick"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon">
                <img class="loadimg" width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- loading -->
      <loading class="loading-container" v-show="!discList.length"></loading>
    </scroll>
  </div>
</template>

<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'

export default {
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  created() {
    this._getRecommend()    // 轮播图数据
    this._getDiscList()      // 热门歌单推荐数据
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.slider)
          this.recommends = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.list)
          this.discList = res.data.list
        }
      })
    },
    loadImage() {   // 轮播图片加载出来之后，再计算scroll
      // 只执行一次
      if (!this.checkLoader) {
        setTimeout(() => {
          this.$refs.scroll.refresh()
          this.checkLoader = true
        }, 20)
      }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  @import "../../common/sass/variable.scss";

  .slider-wrapper{
    overflow: hidden;
  }
  .recommend{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .recommend-content{
      height: 100%;
      overflow: hidden;
    }
  }
  .recommend-list{
    .list-title{
      height: 65px;
      line-height: 65px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-theme;
    }
    .item{
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 20px 20px 20px;
      .icon{
        flex: 0 0 60px;
        width: 60px;
        padding-right: 20px;
      }
      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        font-size: $font-size-medium;
        .name{
          margin-bottom: 10px;
          color: $color-text;
        }
        .desc{
          color: $color-text-d;
        }
      }
    }
  }
  .loading-container{
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
  }
</style>
