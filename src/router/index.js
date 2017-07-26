import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/components/recommend/recommend'    // 热门歌单推荐
import Singer from '@/components/singer/singer'           // 歌手列表
import Rank from '@/components/rank/rank'
import Search from '@/components/search/search'           // 搜索
import SingerDetail from 'components/singer-detail/singer-detail'   // 歌手信息页

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'      // 重定向 和 别名
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',                // ：id变量为路由
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
