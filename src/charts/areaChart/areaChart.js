/**
 * @Author:      zhanghq
 * @DateTime:    2017-09-21 08:56:13
 * @Description: 折线图
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-09-21 08:56:13
 */

import * as d3 from 'd3'
import _ from 'lodash'
import { genSVGDocID, isNoData } from '../util/util'
import AddAxis from './addAxis'
import filterHbs from './hbs/filter.hbs'

// g元素id
const gId = genSVGDocID()
// 滤镜id
const filterId = genSVGDocID()
const gradientId = [genSVGDocID(), genSVGDocID()]
const patternId = [genSVGDocID(), genSVGDocID()]

export default class AreaChart {
  /**
   * 柱状图默认配置项
   * @return {object} 默认配置项
   */
  defaultSetting () {
    return{
      width: 700,
      height: 300,
      dur: 750, // 动画过度时间
      itemStyle: {
        margin: {
          top: 20,
          right: 80,
          bottom: 40,
          left: 80
        },
        // 滤镜样式
        gradient: {
          x1: '0%',
          y1: '0%',
          x2: '0%',
          y2: '100%',
          offset1: '20%',
          offset2: '100%',
          opacity1: 1,
          opacity2: 0.1
        },
        // 如果加了mark 不可用曲线basis样式
        fillStyle: 'pattern', // patterns:图案线条填充、gradient:渐变填充
        lineStyle: 'cardinal', // 折线样式 linear/linear-closed/step/... 曲线:basis/cardinal/
        // 区域及线条path样式
        pathStyle:[
          {
            areaPath: { 
              fill: ['#3ee57a', '#3ee57a'],
              stroke: 'none'
            },
            linePath: {
              stroke: '#3ee57a',
              strokeWidth: 2
            }
          }, { // 环比
            areaPath: {
              fill: ['#8b3cc4', '#8b3cc4'],
              stroke: 'none'
            },
            linePath: {
              stroke: '#8b3cc4',
              strokeWidth: 2
            }
          }
        ]
      },
      topMark: {
        show: true,
        radius: 4,
        fill: '#fff',
        stroke: ['#3ee57a', '#8b3cc4'],
        strokeWidth: 1
      },
      topText: {
        show: true,
        fill: ['#fff', '#fff'],
        fontSize: 16,
        textAnchor: 'middle'
      },
      yAxis: {
        axisLine: {
          show: true // 轴线
        },
        gridLine: { 
          show: true // 网格线
        },
        ticks: 5 // 刻度  
      },
      xAxis: {
        axisLine: {
          show: true
        },
        gridLine: { 
          show: true // 网格线
        }
      },
      xText: {
        fontSize: 16,
        fill: '#fff',
        textAnchor: 'end'
      }
    }
  }

  /**
   * Creates an instance of areaChart
   * @param {string} selector 容器元素选择器
   * @param {object} opt 图表组件配置项
   */
  constructor(selector, opt) {
    // 获取配置项
    const defaultSetting = this.defaultSetting()
    this.config = _.merge({}, defaultSetting, opt)

    const { width, height, itemStyle, topText, topMark } = this.config  
    const { left, right, top, bottom } = itemStyle.margin
    // x轴的实际宽度(该值会多次使用,初始化计算出来，后面就不用计算了)
    this.config.xWidth = width - left - right
    this.config.yHeight = height - top - bottom 

    // 创建svg元素
    const svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
    // 创建defs元素  
    const defs = svg.append('defs')    

    // 创建line-path g元素
    this.lineGroup = svg.append('g')
      .attr('class', `line-group-${gId}`)
    // 创建area-path g元素  
    this.areaGroup = svg.append('g')
      .attr('class', `area-group-${gId}`)
    // 是否显示标记点
    this.isShowMark = topMark.show
    if(this.isShowMark) {
      // 创建mark g元素
      this.markGroup = svg.append('g')
        .attr('class', `mark-group-${gId}`) 
    }
    // 是否显示标记点 
    this.isShowTopText = topText.show 
    if(this.isShowTopText) {
      // 创建text g元素
      this.textGroup = svg.append('g')
        .attr('class', `text-group-${gId}`)
    }   
    this.svg = svg
    // x轴比例尺
    this.xScale = null  
    // y轴比例尺
    this.yScale = null  
    // 线条生成器
    this.linePath = null
    // 区域生成器
    this.linePath = null
    // 获取滤镜配置项 
    const { pathStyle } = itemStyle
    let cfg = []
    let patterns = []

    pathStyle.map((d, i) => {
      let gradientCfg = {
        stopColor: pathStyle[i].areaPath.fill[0],
        endColor: pathStyle[i].areaPath.fill[1],
        gradient: itemStyle.gradient,
        id: gradientId[i]
      }
      // 图案填充配置项
      let patternCfg = {
        id: patternId[i],
        fill: pathStyle[i].areaPath.fill[0]
      }
      cfg.push(gradientCfg)
      patterns.push(patternCfg)
    })
    defs.html(filterHbs({
      config: cfg,
      filterId: filterId,
      patterns: patterns
    })) 

    // 实例化轴线
    this.addAxis = new AddAxis(this.svg, this.config)
    // 保存一组空数组,用于折线动画过度
    this.nullData = []
  }  

  /**
   *  渲染
   *  @example: [
   *    {
   *     'name': '@cname', // 名称
   *     'tongbi|1-100': 1, // 同比数据
   *     'huanbi|1-100': 1 // 环比数据
   *   }
   *  ]
   *  @param    {array}  data 图表数据
   *  @return   {[type]}  null
   */
  render(data) {
    const self = this
    const { width, height, yHeight, itemStyle } = self.config
    // 判断数据是否为空
    if(!data || !data.length) {
      isNoData(self.svg, { width, height })
      return false
    }
    self.config.dataLen = data.length
 
    // 获取所有value
    let dataset = []
    data.map((d) => {  
      dataset.push(d.value)
      self.nullData.push(0)
    })

    // 渲染x轴
    self.xScale = self.addAxis.renderXAxis(data)  
    // 渲染y轴  
    self.yScale = self.addAxis.renderYAxis(dataset) 

    // 线条生成器
    self.linePath = d3.svg.line()
      .x((d, i) => self.xScale(i))
      .y((d) => self.yScale(d))
      .interpolate(itemStyle.lineStyle)

    // 区域生成器
    self.areaPath = d3.svg.area()  
      .x((d, i) => self.xScale(i))
      .y0(yHeight)
      .y1((d) => self.yScale(d))
      .interpolate(itemStyle.lineStyle)
      
      self.renderLinePath(dataset, 0)
      self.renderAreaPath(dataset, 0)
      // 是否显示顶部mark  
      if(self.isShowMark){
        self.renderTopMark(dataset, 0) 
      }
      // 是否显示顶部文字
      if(self.isShowTopText){
        self.renderTextData(dataset, 0) 
      }
  }

  /**
   *  渲染线条path
   *  @param    {array}   data 数据
   *  @param    {number}  i    下标
   *  @return   {object}  null
   */
  renderLinePath(data, i) {
    const self = this
    // 创建line-path g元素
    const lineGroup = this.lineGroup
      .call(self::self.setGroupAttribute)  

    // 创建path元素
    let linePath = lineGroup.selectAll(`.line-path-${i}`)
    if(linePath.node()) {
      lineGroup.select(`.line-path-${i}`)
        .call(self::self.setLinePathAttribute, data, i)    
    } else{
      lineGroup.append('path')
        .call(self::self.setLinePathAttribute, data, i)  
    }
  }

  /**
   *  设置线条path属性
   *  @param    {array}  path   path元素
   *  @param    {array}  data   数据
   *  @param    {number}  i     下标
   *  @return   {object}  null
   */
  setLinePathAttribute(path, data, i) {
    const self = this
    const { dur, itemStyle } = self.config
    const { pathStyle } = itemStyle
    path.attr('class', `line-path-${i}`)
      .attr('fill', 'none')
      .attr('stroke', 'url(#line-fill)')
      .attr('stroke-width', pathStyle[i].linePath.strokeWidth)
      .attr('filter', `url(#${filterId})`)
      .attr('d', self.linePath(self.nullData))
      .transition()
      .duration(dur)
      .attr('d', self.linePath(data))
  }

  /**
   *  渲染区域path
   *  @param    {array}   data 数据
   *  @param    {number}  i    下标
   *  @return   {object}  null
   */
  renderAreaPath(data, i) {
    const self = this
    // line-path g元素
    const areaGroup = this.areaGroup
      .call(self::self.setGroupAttribute)  

    // 创建path元素
    let areaPath = areaGroup.selectAll(`.area-path-${i}`)
    if(areaPath.node()) {
      areaGroup.select(`.area-path-${i}`)
        .call(self::self.setAreaPathAttribute, data, i)    
    } else{
      areaGroup.append('path')
        .call(self::self.setAreaPathAttribute, data, i)  
    }
  }

  /**
   *  设置区域path属性
   *  @param    {array}  path   path元素
   *  @param    {array}  data   数据
   *  @param    {number}  i     下标
   *  @return   {object}  null
   */
  setAreaPathAttribute(path, data, i) {
    const self = this
    const { dur, itemStyle } = self.config
    path.attr('class', `area-path-${i}`)
      .attr('fill', () => {
        let fill = null
        switch(itemStyle.fillStyle) {
          // 图案填充
          case 'pattern':
            fill = patternId[i]
            break
          // 渐变填充  
          case 'gradient':
            fill = gradientId[i]
            break
          default:
            break
        }
        return `url(#${fill})`
      })
      .attr('stroke', 'none')
      .attr('d', self.areaPath(self.nullData))
      .transition()
      .duration(dur)
      .attr('d', self.areaPath(data)) 
  }

  /**
   *  渲染文字数据
   *  @param    {array}   data 数据
   *  @param    {number}  i    下标
   *  @return   {object}  null
   */
  renderTextData(data, i) {
    const self = this
    // text g元素
    const textGroup = this.textGroup
      .call(self::self.setGroupAttribute)  

    // 获取并处理update部分
    let update = textGroup.selectAll(`.text-${i}`)
      .data(data)
      .call(self::self.setTextDataAttribute, i)  
    // 获取并处理enter部分
    update.enter()
      .append('text')
      .call(self::self.setTextDataAttribute, i)  
    // 获取并处理exit部分  
    update.exit().remove()  
  }

  /**
   *  设置文字属性
   *  @param    {array}   text text元素
   *  @param    {number}  i    下标
   *  @return   {object}  null
   */
  setTextDataAttribute(text, i) {
    const self = this
    const { topText, dur, yHeight } = self.config
    text.attr('class', `text-${i}`)
      .attr('font-size', topText.fontSize)
      .attr('fill', topText.fill[i])
      .attr('text-anchor', topText.textAnchor)
      .attr('x', (d, j) => self.xScale(j))
      .attr('y', yHeight)
      .transition()
      .duration(dur)
      .attr('y', (d) => self.yScale(d) - 10)
      .text((d) => d)
  }

  /**
   *  渲染顶部小圆点
   *  @example: [example]
   *  @param    {[type]}  data [description]
   *  @param    {[type]}  i    [description]
   *  @return   {object}  null
   */
  renderTopMark(data, i) {
    const self = this
    // mark g元素
    let markGroup = this.markGroup
      .call(self::self.setGroupAttribute)  
 
    // 获取并处理update部分
    let update = markGroup.selectAll(`.mark-${i}`)
      .data(data)
      .call(self::self.setMarkAttribute, i)  
    // 获取并处理enter部分
    update.enter()
      .append('circle')
      .call(self::self.setMarkAttribute, i)  
    // 获取并处理exit部分  
    update.exit().remove()  
  }

  /**
   *  设置圆点属性
   *  @param    {array}   circle  circle元素
   *  @param    {number}  i       下标
   *  @return   {object}  null
   */
  setMarkAttribute(circle, i) {
    const self = this
    const { topMark, yHeight, dur } = self.config
    circle.attr('class', `mark-${i}`)
      .attr('r', topMark.radius)
      .attr('fill', topMark.fill)
      .attr('stroke', topMark.stroke[i])
      .attr('stroke-width', topMark.strokeWidth)
      .attr('cx', (d, j) => self.xScale(j))
      .attr('cy', yHeight)
      .transition()
      .duration(dur)
      .attr('cy', (d) => self.yScale(d))
  }

  /**
   *  设置g元素属性
   *  @param    {array}  g  g元素
   *  @return   {object}  null
   */
  setGroupAttribute(g) {
    const { itemStyle } = this.config
    const { top, left } = itemStyle.margin
    g.attr('transform', `translate(${left}, ${top})`)
  }
}
