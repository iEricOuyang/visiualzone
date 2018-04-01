/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-11-23 09:50:36 
 * @Description:  重点案由单个环图组件
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-13 16:41:29
 */
import * as d3 from 'd3'
import _ from 'lodash'
import './index.css'
export default class CasePie {
  /**
   * 默认配置项
   * @return {object} 配置对象
   */
  defaultSetting() {
    return {
      fill: ['#e4f010', '#465138'], // 第0个表示粗弧的颜色，第1个表示细弧的颜色
      stroke: '',
      strokeWidth: 2,
      centroid: { // 弧的中心点所在的位置
        x: 91.5,
        y: 80
      },
      className: '',
      filter: ''
    }
  }
  constructor(opt) {
    const defaultSetting = this.defaultSetting()
    this.config = _.merge({},defaultSetting, opt)
    this.arcPath = d3.svg.arc()
  }

  /**
   * 更新环
   * @param {object} data 渲染环需要的数据
   */
  render(data) {
    const { className, centroid, fill, stroke, strokeWidth, filter } = this.config
    d3.select(`.${className}`).data([ data.item ])
      .attr('cursor', 'pointer')

    // 创建环
    const update = d3.select(`.${className}`).selectAll('path').data(data.dataSet)
    update.enter().append('path')

    update.exit().remove()

    update
      .attr('filter', filter)
      .attr('d', d => {
        return this.arcPath(d)
      })
      .attr('transform', `translate(${centroid.x}, ${centroid.y})`)
      .attr('fill', (d, i) => {
        return fill[i]
      })
      .attr('class', (d,i) => {
        return `path${i}`
      })
      .attr('stroke', stroke)
      .attr('stroke-width', strokeWidth)

    // 创建展示案由名称和数值的文本，采用div的包裹方式创建
    const infoUpdate = d3.select(`.${className}`).selectAll('foreignObject').data([ data.item ])
    const foreignObject = infoUpdate.enter()
      .append('svg:foreignObject')
      .attr('x', centroid.x - 100)
      .attr('y', centroid.y - 35)
      .attr('width', 200)
      .attr('height', 70)
    foreignObject
      .append('xhtml:div').attr('class', 'name')
    foreignObject
      .append('xhtml:div').attr('class', 'value')

    infoUpdate.select('.name')
      .style('color', fill[0])
      .html(d => {
        return d.name
      })
    infoUpdate.select('.value')
      .html(d => {
        return d.value
      })
  }
}
