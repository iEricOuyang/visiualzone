/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-11-24 11:09:47 
 * @Description: 本月专题警情模块
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-06 21:38:47
 */
import $ from 'jquery'
import { fetch } from '@/util/request'
import { TriangleChart } from '@/charts/index'
import tpl from './index.hbs'
import './index.css'

const config = {
  width: 480,
  height: 350,
  padding: {
    left: 50,
    right: 50,
    top: 50,
    bottom: 20
  },
  colors: ['#043d8b', '#02f396', '#c9e08c']// 三个区域的颜色值列表
}

class TopicCase {
  constructor(el) {
    $(el).append(tpl(config))
    this.triangleChart = new TriangleChart(config)
  }
  render() {
    fetch('fetchTopicCase', data => {
      this.triangleChart.render(data)
    })
  }
}
export default TopicCase
