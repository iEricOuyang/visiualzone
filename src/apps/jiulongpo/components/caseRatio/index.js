/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-02 08:36:29 
 * @Description: 本月警情同环比模块
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-02 08:56:14
 */
import $ from 'jquery'
import { fetch } from '@/util/request'
import tpl from './index.hbs'
import item from './item.hbs'
import './index.css'

class CaseRatio {
  constructor(el) {
    $(el).append(tpl())
    this.updateRatio = this.updateRatio.bind(this)
  }
  /**
   * 更新同环比列表
   * @param {any} data 从后端取回来的总共10条数据
   * @return
   */
  updateRatio(data) {
    // 本次循环的开始位置
    const startIndex = this.currentStart
    // 本次循环结束位置，每次展示4条
    let endIndex = startIndex + 4
    this.currentStart += 4
    // 如果当前的结束位置已经超过了纪录总条数，则将结束位置改成总条数
    if (endIndex > data.length) {
      endIndex = data.length
      // 将下一次循环的开始位置重置为0，从头开始展示
      this.currentStart = 0
    }
    const dataSet = data.slice(startIndex, endIndex).map(model => {
      return {
        name: model.name,
        tongbiClass: model.tongbi > 0 ? 'up' : model.tongbi < 0 ? 'down' : 'zero',
        huanbiClass: model.huanbi > 0 ? 'up' : model.huanbi < 0 ? 'down' : 'zero',
        tongbi: Math.abs(model.tongbi) + '%',
        huanbi: Math.abs(model.huanbi) + '%',
        tongbiValue: Math.abs(model.tongbiValue),
        huanbiValue: Math.abs(model.huanbiValue)
      }
    })
    $('.case-ratio .ratio-list').html(item(dataSet))

  }
  render() {
    fetch('fetchCaseRatio', data => {
      // 每次重新请求数据后，要先清除定时器
      clearInterval(this.interval)
      this.length = data.length
      // 默认当前从下标为0的纪录开始展示
      this.currentStart = 0
      this.updateRatio(data)
      // 每20s切换一次显示纪录，每组显示4条
      this.interval = setInterval(() => {
        this.updateRatio(data)
      }, 20000)
    })
  }
}
export default CaseRatio