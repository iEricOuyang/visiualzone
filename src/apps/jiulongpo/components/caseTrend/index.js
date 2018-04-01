/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-11-23 13:57:17 
 * @Description: 本月处警量趋势
 * @Last Modified by: ouyangdecai@hiynn.com
 * @Last Modified time: 2017-12-08 15:16:48
 */
import $ from 'jquery'
import { AreaChart } from '@/charts/index'
import { fetch } from '@/util/request'
import tpl from './index.hbs'
import './index.css'
const config = {
  width: 500,
  height: 340,
  itemStyle: {
    margin: {
      right: 20,
      left: 80,
      bottom: 90
    },
    pathStyle: [ {
      areaPath: {
        fill: ['none', '#3ee57a'],
        stroke: 'none'
      },
      linePath: {
        stroke: '#e4baff',
        strokeWidth: 4
      }
    } ]
  },
  topText: {
    fontSize: 28,
  },
  yAxis: {
    axisLine: {
      show: false // 轴线
    },
    gridLine: {
      show: false // 网格线
    },
    ticks: 5 // 刻度  
  },

}
class CaseTrend {
  constructor(el) {
    $(el).append(tpl())
    this.chart = new AreaChart('.trend', config)
  }
  render() {
    fetch('fetchCaseTrend', data => {
      // 后端返回的是整个月的数据，要求取出最近7天的数据
      let dataSet = data
      const length = data.length
      if(length > 7) {
        dataSet = data.slice(data.length - 7, data.length)
      }
      this.chart.render(dataSet)
    })
  }
}
export default CaseTrend
