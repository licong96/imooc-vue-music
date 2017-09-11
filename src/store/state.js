import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false,         // 播放，暂停
  fullScreen: false,      // 播放页面展开收起
  playlist: [],           // 播放数据列表
  sequenceList: [],       // 有顺序的播放数据列表，根据播放顺序排顺序
  mode: playMode.sequence,  // 播放顺序
  currentIndex: -1        // 当前播放的索引
}

export default state
