/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-11-23 09:45:33 
 * @Description:  创建重点案由环图
 * @Last Modified by: ouyangdecai@hiynn.com
 * @Last Modified time: 2017-12-08 15:49:11
 */
import * as d3 from 'd3'
import $ from 'jquery'
import tpl from './index.hbs'
import './index.css'
import { fetch } from '@/util/request'
import { CasePie } from '@/charts/index'

const config = {
  height: 160, // svg画布高度
  width: 550, // svg画布宽度
  pie: [ 
    {
      fill: ['#e4f010', '#465138'], // 第0个表示粗弧的颜色，第1个表示细弧的颜色
      stroke: '',
      strokeWidth: 2,
      centroid: { // 弧的中心点所在的位置
        x: 91.5,
        y: 80
      },
      className: 'pie1',
      filter: 'url(#shadow)'
    }, {
      fill: ['#33f97d', '#296666'],
      stroke: '',
      strokeWidth: 2,
      centroid: {
        x: 274.5,
        y: 80
      },
      className: 'pie2',
      filter: 'url(#shadow)'
    }, {
      fill: ['#387baf', '#47448b'],
      stroke: '',
      strokeWidth: 2,
      centroid: {
        x: 458.5,
        y: 80
      },
      className: 'pie3',
      filter: 'url(#shadow)'
    }
  ]
}

/**
 * 重点案由环图
 * 
 * @class CasePies
 */
class CasePies {
  constructor(el, updateMap) {
    const { height, width, pie } = config
    $(el).append(tpl({height,width}))
    this.svg = d3.select('.case-pies').select('svg')
    // activeId表示当前被点击选中的重点案由ID
    this.activeId = ''
    // 点击重点案由回调
    const reRenderMap = (id) => {
      // 如果点击的案由与已经选中的案由相同，则不再重复发送请求，避免恶意操作
      if (this.activeId === id) return
      updateMap(id)
      this.activeId = id
    }
    this.pies = pie.map(item => {
      this.svg.append('g')
        .attr('class', item.className)
        .on('click', d => {
          reRenderMap(d.id)
        })
      return new CasePie(item)
    })
  }

  render() {
    fetch('fetchCasePies', data => {
      const max = d3.max(data, d => {
        return d.value
      })
      const result = data.map(item => {
        const percent = max && item.value / max || 0
        return {
          item,
          dataSet: [
            {
              startAngle: 0,
              endAngle: percent * 2 * Math.PI,
              innerRadius: 69,
              outerRadius: 75
            },
            {
              startAngle: percent === 1 ? 0 : (percent + 0.01) * 2 * Math.PI,
              endAngle: percent === 1 ? 0 : 1.98 * Math.PI,
              innerRadius: 70,
              outerRadius: 74
            }
          ]
        }
      })
      this.pies.forEach((item, index) => {
        item.render(result[index])
      })
    })
  }
}

export default CasePies
