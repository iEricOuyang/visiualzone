/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-11-30 16:58:49 
 * @Description: 渲染地图
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-13 17:23:24
 */
import * as d3 from 'd3'
import _ from 'lodash'
import $ from 'jquery'
import { getCenters, getZoomScale } from '@/util/util'
import './index.css'

class MapChart {
  /**
   * 默认配置项
   * @return {object} 配置对象
   */
  defaultSetting() {
    return {
      height: 1600,
      width: 1700,
      scaleTimes: 48,
      pathStyle: {
        fill: '#0b71c0', // path填充色
        background: '#174e98', // 底层地图填充色
        activeFill: '#044abe', // path被选中时的填充色
      },
      circleStyle: {
        fill: '#e3c0fa', // 地图上圆的填充色
        stroke: '#e3c0fa', // 地图上圆的边框色
        activeFill: '#f75c5b', // 区域被选中时圆的填充色
        activeStroke: '#f75c5b' // 区域被选中时圆的边框色
      }
    }
  }
  /**
   * 地图组件构造函数
   * @param {string} el 地图要挂载的Svg选择器
   * @param {object} config 地图自定义配置
   * @param {function} renderSupMap 用于下钻到二级地图的方法，二级地图的此方法传null
   * @param {function} showCaseDetail 点击数据弹出案由详情的方法
   * @param {function} removeInterval 删除定时器的方法，当地图下钻后，一级地图的刷新要停止
   * @memberof MapChart
   */
  constructor(el, config, renderSupMap, showCaseDetail, removeInterval) {
    const defaultSetting = this.defaultSetting()
    this.config = _.merge({},defaultSetting,config)
    this.svg = d3.select(el)
    this.renderSupMap = renderSupMap
    this.showCaseDetail = showCaseDetail
    this.removeInterval = removeInterval
    // 当前的案由id，默认为0
    this.caseId = 0
    // 将以下方法内部的this指向当前组件
    this.mouseenterEvent = this.mouseenterEvent.bind(this)
    this.mouseleaveEvent = this.mouseleaveEvent.bind(this)
    this.mouseClickEvent = this.mouseClickEvent.bind(this)
    this.mousemoveEvent = this.mousemoveEvent.bind(this)
    this.filterData = this.filterData.bind(this)
    this.drawCircle = this.drawCircle.bind(this)
    this.repeatAnimation = this.repeatAnimation.bind(this)
    this.renderTooltip = this.renderTooltip.bind(this)
    this.getCentroids = this.getCentroids.bind(this)
    // 预添加分组元素，用于持续存放路径、名称、撒点渲染等
    this.svg.append('g').attr('class', 'path-bg-g')
    this.svg.append('g').attr('class', 'path-g').attr('filter', 'url(#map-offset)')
    this.svg.append('g').attr('class', 'map-name')
    this.svg.append('g').attr('class', 'data-g')
    this.svg.append('g').attr('class', 'tooltip')
    // 用于存储数据更新前的数据组
    this.dataSet = new Map()
    // 用于存储需要动画的selection集合
    this.animatedQueue = []
    // 绑定renderData方法的this指向  
    this.renderData = this.renderData.bind(this)
  }
  /**
   * 过滤值为0的并且在地图上能找到对应区域的数据
   * @param {Array} data 需要过滤的原始数据
   * @param {Features} features 地图特征数据集
   * @returns {Array} 返回过滤后的结果集
   */
  filterData(data,features) {
    const datas = []
    const { areaId } = this.config
    data.forEach(item => {
      features.forEach(model => {
        if(model.properties[areaId] == item.id && item.value != 0) {
          datas.push(item)
        }
      })
    })
    return datas
  }
  /**
   * 设置圆的属性
   * @param {selection} selection circle的d3对象
   * @param {Number} deltaR 相对圆最小半径的增加量
   * @returns
   */
  drawCircle(selection, deltaR) {
    const {centroids, scale} = this
    selection.attr('cx', d => {
        return centroids[d.id][0]
      })
      .attr('cy', d => {
        return centroids[d.id][1]
      })
      .attr('r', d => {
        return scale(d.value) + deltaR
      })
      // .attr('filter', 'url(#label-shadow)')
  }
  /**
   * 绘制循环动画
   * @param {*} scale 生成圆半径的比例尺
   * @returns
   */
  repeatAnimation(scale) {
    const { animatedQueue, svg, config } = this
    if (!animatedQueue.length) return
    this.animateObjs = []
    /**
     * 执行单个圆的动画
     * @param {d3} select 当前需要执行动画的d3对象
     * @param {number} deltaR 圆半径的变化值
     * @param {function} resolve 动画执行完成后需要调用promise的resolve方法进行结束处理
     * @param {number} loop 动画执行的次数
     */
    const repeat = (select, deltaR, resolve, loop) => {
      this.animateObjs.push(select) 
      select
        .attr('r', d => {
          return scale(d.value)
        })
        .style('stroke', config.circleStyle.activeStroke)
        .transition()
        .ease('linear')
        .duration(2000)
        .attr('r', d => {
          return scale(d.value) + deltaR
        })
        .each('interrupt', (d) => {
          select
            .attr('r', 0)
            .style('stroke', config.circleStyle.stroke)
          resolve(d.id) 
        })
        .each('end', (d) => {
          if(loop){
            repeat(select, deltaR, resolve, loop - 1)
          }else{
            select
              .attr('r', 0)
              .style('stroke', config.circleStyle.stroke)
            resolve(d.id) 
          }
        })
    }
    const selection = animatedQueue.shift()
    const id = selection.data()[0] && selection.data()[0].id || undefined 
    const currentPath = svg.select('.path-g').select(`.d${id}`)     
    const currentPathName = svg.select('.map-name').select(`.d${id}`)
    const c1 = selection.select('.c1')
    const selections = [selection.select('.c2'), selection.select('.c3'), selection.select('.c4')]
    this.promises = selections.map((item, index) => {
      return new Promise((resolve) => {
        // 利用等差数列求和公式：an = n * a1 + n * (n - 1) * d / 2 
        const deltaR = (index + 1) * 5 + index * (index + 1) * 5 / 2
        const loop = 1
        repeat(item, deltaR, resolve, loop)
      })
    })
    Promise.all(this.promises).then(() => {
      c1.style('fill', config.circleStyle.fill)
      currentPathName.style('display', 'none')
      currentPath.style('fill', config.pathStyle.fill)
      this.repeatAnimation(scale)
    })
    c1.style('fill', config.circleStyle.activeFill)
    currentPathName.style('display', 'block')
    currentPath.style('fill', config.pathStyle.activeFill)
  }
  /**
   * 绘制tooltip
   * @param {selection} toolUpdate 提示框的分组集g元素
   * @returns
   */
  renderTooltip(toolUpdate) {
    toolUpdate.select('path')
      .attr('d', 'M0,0 L50,-50 H100')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('fill', 'none')

    toolUpdate.select('.value')
      .html(d => {
        return d.value
      })
  }
  /**
   * 获取地图各区域中心点
   * @param {FeatureCollection} features 地图特征集合
   * @returns {Object} 返回属性为区域id，值为该区域对应中心坐标的对象
   */
  getCentroids(features,path) {
    const { areaId } = this.config
    // 存储地图各区域的中心点
    const centroids = {}
    features.forEach(item => {
      let x = path.centroid(item)[0]
      let y = path.centroid(item)[1]
      // 九龙园派出所的位置偏移出了地图外,要做微调
      if (item.properties[areaId] === '500107810000') {
        x -= 20
        y += 50
      }
      centroids[item.properties[areaId]] = [x, y]
    })
    return centroids
  }
  /**
   * 地图鼠标移入事件
   * @param {d3} d 当前要操作的path对象
   * @returns null
   */
  mouseenterEvent(d) {
    const { config : { showName, areaId, pathStyle }, svg } = this
    const e = d3.event
    const el = svg.select(`.d${d.properties[areaId]}`)
    el.style('fill', pathStyle.activeFill)
    if(!showName){
      svg.select('.map-name').select(`.d${d.properties[areaId]}`)
        .attr('x', e.offsetX)
        .attr('y', e.offsetY)
        .attr('dy', -30)
        .style('font-size', 40)
        .style('display', 'block')
    }
  }
    /**
   * 地图鼠标移入事件
   * @param {d3} d 当前要操作的path对象
   * @returns null
   */
  mouseleaveEvent(d) {
    const { config : { showName, areaId ,pathStyle }, svg ,centroids } = this
    svg.select('.path-g').select(`.d${d.properties[areaId]}`)
      .style('fill', pathStyle.fill)
    if(!showName){
      svg.select('.map-name').select(`.d${d.properties[areaId]}`)
        .attr('x', centroids[d.properties[areaId]][0])
        .attr('y', centroids[d.properties[areaId]][1])
        .attr('dy', 40)
        .style('font-size', 32)
        .style('display', 'none')
    }
  }
  /**
   * 地图区域点击事件
   * @param {d3} d 当前要操作的path对象
   */
  mouseClickEvent(d){
    const { renderSupMap, config: { areaId }} = this
    // 二级地图不能再继续下钻，点击时要退出
    if(!renderSupMap) return
    renderSupMap(d.properties[areaId])
    $('#sub-app').toggle()
    $('#app').toggle()    
    // removeInterval()    
  }
  /**
   * 地图区域鼠标移动事件
   * @param {any} d 
   * @memberof MapChart
   */
  mousemoveEvent(d) {
    const { config: { showName, areaId }, svg } = this
    // 如果地图的名称本身就显示出来了的，那么鼠标移动就需要任何执行
    if(showName) return
    const e = d3.event
    svg.select('.map-name').select(`.d${d.properties[areaId]}`)
      .attr('x', e.offsetX)
      .attr('y', e.offsetY)
      .attr('dy', -30)
      .style('display', 'block')
  }
  /**
   * 渲染基础地图
   * 
   * @param {string} id 需要获取的区域的ID
   * @param {array} data 从后端获取的地图数据
   * @memberof MapChart
   */
  render(id) {
    const map = require(`./json/${id}.json`)
    this.features = map.features
    const { 
      config, 
      svg, 
      features, 
      getCentroids,
      mouseenterEvent,
      mouseleaveEvent,
      mouseClickEvent,
      mousemoveEvent
    } = this
    const {
      areaId,
      height,
      width,
      scaleTimes,
      showName,
      pathStyle
    } = config
    // 定义地图映射规则
    const projection = d3.geo.equirectangular()
      .center(getCenters(features))
      .scale(getZoomScale(features, width, height) * scaleTimes)
      .translate([width / 2, height / 2])
    // 定义路径生成器
    const path = d3.geo.path()
      .projection(projection)
    // 获取地图上所有区域的中心点并存入对象的centroids中
    this.centroids = getCentroids(features,path)
    
    // 绘制背景地图
    const mapBgUpdate = svg.select('.path-bg-g').selectAll('path').data(features)
    mapBgUpdate.enter().append('path')
    mapBgUpdate
      .attr('stroke-width', 0)
      .attr('stroke', '#54b6ef')
      .attr('d', path)
      .style({
        'fill': pathStyle.background,
        'opacity': 1
      })
      .attr('transform', 'translate(0,30)')
    mapBgUpdate.exit().remove()
    // 绘制装载数据的地图
    const update = svg.select('.path-g').selectAll('path').data(features)
    update.enter().append('path')
      .on('click', mouseClickEvent)
      .on('mouseenter', mouseenterEvent)
      .on('mouseleave', mouseleaveEvent)
      .on('mousemove', mousemoveEvent)

    update
      .attr('class', d => {
        return `d${d.properties[areaId]}`
      })
      .attr('stroke-width', 2)
      .attr('stroke', '#5cbef5')// '#54b6ef'
      .attr('d', path)
      .style({
        'fill': pathStyle.fill,
        'opacity': 1,
        'cursor': 'pointer'
      })
    update.exit().remove()
    // 加地区名称
    const textUpdate = svg.select('.map-name').selectAll('text').data(features)
    textUpdate.enter().append('text')
    textUpdate
      .attr('x', (d) => {
        return this.centroids[d.properties[areaId]][0]
      })
      .attr('y', (d) => {
        return this.centroids[d.properties[areaId]][1]
      })
      .attr('dy', 50)
      .attr('class', d => {
        return `name d${d.properties[areaId]} `
      })
      .attr('text-anchor', 'middle')
      .text(d => {
        return d.properties.name
      })
      .style('display',showName ? 'block' : 'none')
    textUpdate.exit().remove()
  }
  /**
   * 在地图上渲染数据
   * 
   * @param {string} activeCaseId 案由id，地图初始化时传0
   * @param {array} data 从后端获取到的数据
   * @memberof MapChart
   */
  renderData(activeCaseId,data) {
    const { 
      svg, 
      filterData, 
      animatedQueue, 
      dataSet, 
      centroids, 
      repeatAnimation, 
      renderTooltip, 
      features, 
      drawCircle, 
      showCaseDetail,
      animateObjs
    } = this
    // 如果传进来的案由id和之前的案由id不等，则清空之前存储用于比较值是否变化的数据集
    if(activeCaseId !== this.caseId) {
      dataSet.clear()
      this.caseId = activeCaseId
    }
    // 降序排列
    data.sort((a, b) => {
      return b.value - a.value
    })
    // 过滤掉值为0，以及无效id的区域
    const newData = filterData(data,features)
    // 获取最大值、最小值组成的数组
    const extent = d3.extent(newData, d => {
      return d.value
    })
    // 定义圆半径变化的比例尺
    this.scale = d3.scale.linear()
      .domain(extent)
      .range([10, 40])

    // 给地图上圆分组的update,enter,exit操作
    const update = svg.select('.data-g').selectAll('g').data(newData)
    const enter = update.enter().append('g')
    enter.append('circle').attr('class', 'c1')
    enter.append('circle').attr('class', 'c2')
    enter.append('circle').attr('class', 'c3')
    enter.append('circle').attr('class', 'c4')

    update
      .attr('class', d => {
        return 'g' + d.id
      })
    // 初始化圈圈
    update.select('.c1').call(drawCircle, 0)
    update.select('.c2').call(drawCircle, 0)
    update.select('.c3').call(drawCircle, 0)
    update.select('.c4').call(drawCircle, 0)
    // 重新开始动画之前,将所有正在执行的动画全部打断
    if(animateObjs && animateObjs.length){
      animateObjs.forEach(item => {
        item.interrupt()
      })
    }
    // 需要执行动画的分组数量，用于后续判断是否需要调用执行连续动画的方法
    const animationLength = animatedQueue.length
    // 将需要执行动画的分组集合置空，后续要放入新的执行队列
    this.animatedQueue = []
    // 存储更新前用于对比值的结果集的成员总数
    const dataSize = dataSet.size
    newData.forEach(item => {
      /* 
       * 如果dataSet里能找到当前对应id的值，并且之前的值与当前值不相等，则要加入动画队列。
       * 初始化时需要判断dataSet是否为空对象来执行添加操作
       */
      if (dataSet.has(item.id) && dataSet.get(item.id) != item.value || dataSize === 0) {
        const activeG = svg.select('.g' + item.id)
        this.animatedQueue.push(activeG)
      }
      // 将数组集合更新为当前数据值，以便下次更新时对比使用
      dataSet.set(item.id, item.value)
    })
    // 如果动画队列长度为0，则说明动画循环已经停止。需要手动调用开启
    if (animationLength === 0) {
      repeatAnimation(this.scale)
    }
    update.exit().remove()
    
    // 数据展示的update,enter,exit操作
    const toolUpdate = svg.select('.tooltip').selectAll('g').data(newData)
    const toolEnter = toolUpdate.enter().append('g')
    toolEnter.append('path')
    const foreignObject = toolEnter.append('svg:foreignObject')
      .attr('height', '50')
      .attr('width', '100')
      .attr('x', 0)
      .attr('y', -90)
      
    foreignObject.append('xhtml:span').attr('class', 'value')
      .on('click', d => {
        const { caseId } = this
        showCaseDetail(caseId,d.id)
      })

    toolUpdate
      .attr('class', d => {
        return `tool-${d.id}`
      })
      .attr('transform', d => {
        return `translate(${centroids[d.id][0]}, ${centroids[d.id][1]})`
      })
    renderTooltip(toolUpdate)

    toolUpdate.exit().remove()
  }
}
export default MapChart
