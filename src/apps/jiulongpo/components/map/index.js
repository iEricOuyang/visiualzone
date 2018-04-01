/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-11-23 09:48:08 
 * @Description:  地图展示模块
 * @Last Modified by: ouyangdecai@hiynn.com
 * @Last Modified time: 2017-12-18 11:11:02
 */
import $ from 'jquery'
import _ from 'lodash'
import { MapChart } from '@/charts/index'
import { fetch } from '@/util/request'
import tpl from './index.hbs'
import './index.css'
const svgConfig = {
  height: 2000,
  width: 2200,
  scaleTimes: 50
}
let mapConfig = {
  areaId: 'ZZJGDM',
  showName: false
}
let subMapConfig = {
  areaId: 'YWBSM',
  showName: false,
  scaleTimes: 48,
}
class Map {
  /**
   * 地图组件构造函数
   * @param {any} el 组件要挂载的dom选择器
   * @param {any} showCaseDetail 点击数据展示案由详情的函数
   * @param {function} removeInterval 清楚首页的定时刷新
   */
  constructor(el, showCaseDetail, removeInterval) {
    this.render = this.render.bind(this)
    this.updateData = this.updateData.bind(this)
    this.renderSubMap = this.renderSubMap.bind(this)
    // 保存地图对应的案由id、时间轴的开始时间、结束时间
    this.caseId = 0
    this.startTime = 0
    this.endTime = 0

    const { height, width } = svgConfig
    $(el).append(
      tpl({
        height,
        width
      })
    )
    mapConfig = _.merge({},svgConfig,mapConfig)
    subMapConfig = _.merge({},svgConfig,subMapConfig)
    this.mapChart = new MapChart('#app .map-svg', mapConfig, this.renderSubMap, showCaseDetail, removeInterval)
    this.subMapChart = new MapChart('#sub-app .map-svg', subMapConfig, null, showCaseDetail, null)
  }
  /**
   * 二级地图渲染
   * @param {string} areaId 被选中区域的id
   */
  renderSubMap(areaId){
    const { render, updateData } = this
    this.caseId = 0
    render(areaId, false)
    updateData()
  }
  /**
   * 获取地图数据并渲染
   * @param {string} areaId 需要绘制的地图的id
   */
  render(domainId) {
    const { mapChart, subMapChart } = this
    this.areaId = domainId == '500107000000' ? 0 : domainId
    if(!this.areaId){
      mapChart.render(domainId)
    }else{
      subMapChart.render(domainId)
    }
  }
  /**
   * 仅更新地图上的数据，不重新构造地图的path。
   * 这个方法舍弃了render的构造地图path的操作
   */
  updateData(){
    const { 
      mapChart, 
      subMapChart, 
      areaId, 
      caseId, 
      startTime, 
      endTime 
    } = this
    fetch('fetchMap', {
      caseId,
      areaId,
      startTime,
      endTime
    }, data => {
      if(!areaId) {
        mapChart.renderData(caseId,data)
      } else {
        subMapChart.renderData(caseId,data)
      }
    })
  }
}
export default Map