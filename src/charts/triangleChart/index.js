/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-11-24 11:47:12 
 * @Description: 绘制专题警情图形
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-07 21:28:25
 */
import * as d3 from 'd3'
import _ from 'lodash'
class TriangleChart {
  /**
   * 默认配置项
   * @return {object} 配置对象
   */
  defaultSetting() {
    return {
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
  }
  constructor(option) {
    const defaultSetting = this.defaultSetting()
    this.config = _.merge({},defaultSetting, option)
    this.svg = d3.select('.topic-case svg')
    this.svg.append('g').attr('class', 'axis')
    this.svg.append('g').attr('class', 'triangle')
    this.svg.append('text').attr('class', 'tooltip')
      .attr('font-size', 24)
      .attr('fill', '#fff')
    this.drawYAxis = this.drawYAxis.bind(this)
    this.drawTriangle = this.drawTriangle.bind(this)
  }
  // 画y轴
  drawYAxis() {
    const { svg, config, scale } = this
    const axis = d3.svg.axis()
      .scale(scale)
      .ticks(5)
      .orient('left')

    const gAxis = svg.select('.axis')
      .attr('transform', `translate(${config.padding.left}, 0)`)

    gAxis.call(axis)
  }
  /**
   * 根据数据集绘制多边形
   * @param {any} data 数据集
   */
  drawTriangle(data) {
    const { config, svg } = this
    const { padding, width, height, colors } = config
    const { left, right, bottom } = padding
    data.sort((a, b) => {
      return b.value - a.value
    })
    // 三角形底部两点坐标
    const point1 = [left, height - bottom]
    const point2 = [width - right, height - bottom]
    const update = svg.select('.triangle').selectAll('g').data(data)
    const enter = update.enter().append('g')
    enter.append('polygon')
    enter.append('line')
    enter.append('text').attr('class', 'name')
    enter.append('text').attr('class', 'value')
    // 画三角形
    update.select('polygon')
      .transition()
      .ease('linear')
      .duration(400)
      .attr('points', d => {
        const point3 = [(point1[0] + point2[0]) / 2, this.scale(d.value)]
        return `${point1.join(',')} ${point2.join(',')} ${point3.join(',')}`
      })
      .attr('fill', (d, i) => {
        return colors[i]
      })
      .attr('fill-opacity', 0.5)
      .attr('stroke-width', 2)
      .attr('stroke', (d, i) => {
        return colors[i]
      })
    // 画指示线
    update.select('line')
      .transition()
      .ease('linear')
      .duration(400)
      .attr('x1', (left + (width - right)) / 2)
      .attr('y1', (d) => {
        return this.scale(d.value)
      })
      .attr('x2', (d, i) => {
        switch (i) {
          case 0:
            return left + (width - right) / 2 + 70
          case 1:
            return left + (width - right) / 2 - 100
          default:
            return left + (width - right) / 2 + 70
        }
      })
      .attr('y2', (d, i) => {
        let y = 0
        switch (i) {
          case 0:
            y = 20
            break
          case 1:
            y = 50
            break
          default:
            y = 120
            break
        }
        return y
      })
      .attr('stroke', (d, i) => {
        return colors[i]
      })
      .attr('stroke-width', 2)
    // 渲染案由名称
    update.select('.name')
      .transition()
      .ease('linear')
      .duration(400)
      .attr('x', (d, i) => {
        switch (i) {
          case 0:
            return left + (width - right) / 2 + 80
          case 1:
            return left + (width - right) / 2 - 100
          default:
            return left + (width - right) / 2 + 80
        }
      })
      .attr('y', (d, i) => {
        let y = 0
        switch (i) {
          case 0:
            y = 40
            break
          case 1:
            y = 70
            break
          default:
            y = 120
            break
        }
        return y
      })
      .attr('dy', -10)
      .attr('text-anchor', (d, i) => {
        return i === 1 ? 'end' : 'start'
      })
      .attr('font-size', 28)
      .attr('fill', '#9fbdb8')
      .text(d => {
        return d.name
      })
    // 渲染值
    update.select('.value')
      .transition()
      .ease('linear')
      .duration(400)
      .attr('x', (d, i) => {
        switch (i) {
          case 0:
            return left + (width - right) / 2 + 80
          case 1:
            return left + (width - right) / 2 - 100
          default:
            return left + (width - right) / 2 + 80
        }
      })
      .attr('y', (d, i) => {
        let y = 0
        switch (i) {
          case 0:
            y = 40
            break
          case 1:
            y = 70
            break
          default:
            y = 120
            break
        }
        return y
      })
      .attr('dy', 25)
      .attr('text-anchor', (d, i) => {
        return i === 1 ? 'end' : 'start'
      })
      .attr('font-size', 32)
      .attr('fill', '#9fbdb8')
      .text(d => {
        return d.value
      })
  }
  /**
   * 更新数据
   * @param {any} data 
   */
  render(data) {
    const { config } = this
    const { height, padding: {bottom, top}} = config
    const max = d3.max(data, d => {
      return d.value
    })
    this.scale = d3.scale.linear()
      .domain([0, max])
      .range([height - bottom, top])
    this.drawYAxis()

    this.drawTriangle(data)

  }
}

export default TriangleChart
