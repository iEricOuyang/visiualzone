/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-01 08:23:12 
 * @Description: 主入口文件
 * @Last Modified by: ouyangdecai@hiynn.com
 * @Last Modified time: 2017-12-22 10:12:45
 */

import loader from '@/loader/loader'
import apis from './mock'
import './index.css'
// import { fetch } from '@/util/request'
import config from './config'
import Title from './components/common/title/'
import CasePies from './components/casePies/'
import Map from './components/map/'
import Time from './components/common/time/'
import CaseTop10 from './components/caseTop10/'
import CaseTrend from './components/caseTrend/'
import CaseInfo from './components/caseInfo/'
import TopicCase from './components/topicCase/'
import CaseRatio from './components/caseRatio/'
import Total from './components/total/'
import CaseMenu from './components/common/dropMenu'
import ReturnBtn from './components/common/returnBtn'
import CaseDetail from './components/common/caseDetail'

// 获取当日日期，作为开始时间，结束时间使用。后续添加时间轴功能后删掉
const today = new Date()
const year = today.getFullYear()
let month = today.getMonth() + 1
month = month < 10 ? '0' + month : month
let date = today.getDate()
date = date < 10 ? '0' + date : date
const startTime = year + '' + month + '' + date
const endTime = year + '' + month + '' + date
// 案由详情弹出框
const caseDetail = new CaseDetail('body')
/**
 * 删除定时器，当点击下钻地图时需要调用
 */
const removeInterval = () => {
  clearInterval(window.interval)
}
/**
 * 显示弹出框
 * @param {string} caseId 案由id
 * @param {string} domainId 点击数据所对应的区域的id
 */
const showCaseDetail = (caseId, domainId) => {
  caseDetail.render(caseId, domainId, startTime, endTime)
}
// 初始化地图并渲染
const map = new Map('#app,#sub-app', showCaseDetail, removeInterval)
map.startTime = startTime
map.endTime = endTime

/**
 * 点击左上角环时的回调处理函数
 * @param id 被点击重点案由的id
 */
const updateMap = (id) => {
  map.caseId = id
  map.updateData()
}

// 重点案由环图
const casePies = new CasePies('#app', updateMap)
// 本月各类案件TOP10
const caseTop10 = new CaseTop10('#app')
// 本月处警量趋势
const caseTrend = new CaseTrend('#app')
// 今日警情
const caseInfo = new CaseInfo('#app')
// 本月专题警情
const topicCase = new TopicCase('#app')
// 本月警情同环比
const caseRatio = new CaseRatio('#app')
// 今日处警
const total = new Total('#app')
// 案由树形菜单
const caseMenu = new CaseMenu('#sub-app', updateMap)
// 页面标题初始化
const title = new Title('body')
// 时间组件渲染
const time = new Time('body')
// 点击返回一级地图的事件
const returnEvent = () => {
  map.startTime = 0
  map.endTime = 0
  map.areaId = 0
  map.caseId = 0
}
 // 刷新组件
const refresh = () => {
  casePies.render()
  updateMap(0)
  caseTop10.render()
  caseTrend.render()
  topicCase.render()
  total.render()
  caseRatio.render()
  caseInfo.render()
}
// 调用loader初始化操作
loader.load({
  apis: apis,
  config: config,
  init(){
    // await fetch('fetchLogin', data => {
    //   map.render(data.areaId, true)
    // })
    map.render('500107000000')
    caseMenu.render('.drop-menu', 0)
    title.render(config.title)
    time.render()
    // 初始调用数据并设置定时刷新
    refresh()
    window.interval = setInterval(refresh, 60000)
    // 返回按钮
    new ReturnBtn('#sub-app', config.returnBtnText, returnEvent)
  }
})
