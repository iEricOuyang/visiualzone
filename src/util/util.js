/**
 * @Author:      baizn
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 通用工具方法
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */

import $ from 'jquery'
import * as d3 from 'd3'

/**
 * @describe [错误提示]
 * @param    {[type]}   data [提示内容]
 * @return {boolean} false
 */
export const errorTooltip = (data) => {
  let errorTpl = require('./errorTips/errorDialog.hbs')
  let html = errorTpl({
    data
  }) 
  $('.error-dialog').html(html)
  $('#errorDialog').fadeIn(50)
  // 关闭错误提示
  $('#errorDialog').on('click', '.close-model', function(evt){
    evt.stopPropagation()
    evt.preventDefault()
    $('#errorDialog').fadeOut(50)
    $('.error-dialog').empty()
  })
  return false
}

/**
 *  生成一个延迟函数
 *  @param    {Function}  func        需要延迟执行的函数
 *  @param    {number}  delayMillis 延迟执行的毫秒数
 *  @return   {Function}  延迟函数
 */
export function delay(func, delayMillis) {
  /**
   * 延迟函数
   * @param    {boolean=}  immediate 是否立即执行（可选，默认为false）
   * @return {function} 延时函数
   */
  return function delayFunc(immediate) {
    if(immediate === true) {
      func()
    } else {
      setTimeout(func, delayMillis)
    }
  }
}

/**
 * 获取地图缩放比例
 * @param {CollectionFeatures} features 
 * @param {number} width 地图宽度
 * @param {number} height 地图高度
 * @return {number} 地图缩放的比例
 */
export function getZoomScale(features, width, height) {
    var longitudeMin = 100000; // 最小经度
    var latitudeMin = 100000; // 最小维度
    var longitudeMax = 0; // 最大经度
    var latitudeMax = 0; // 最大纬度
    features.forEach(function(e) {
        var a = d3.geo.bounds(e); // [[最小经度，最小维度][最大经度，最大纬度]]
        if (a[0][0] < longitudeMin) {
            longitudeMin = a[0][0];
        }
        if (a[0][1] < latitudeMin) {
            latitudeMin = a[0][1];
        }
        if (a[1][0] > longitudeMax) {
            longitudeMax = a[1][0];
        }
        if (a[1][1] > latitudeMax) {
            latitudeMax = a[1][1];
        }
    });

    var a = longitudeMax - longitudeMin;
    var b = latitudeMax - latitudeMin;
    return Math.min(width / a, height / b)
}
/**
 * 获取地图的中心点
 * @param {CollectionFeatures} features 地图特征数据组
 * @return {array} 中心点坐标
 */
export function getCenters(features) {
    var longitudeMin = 100000;
    var latitudeMin = 100000;
    var longitudeMax = 0;
    var latitudeMax = 0;
    features.forEach(function(e) {
        var a = d3.geo.bounds(e);
        if (a[0][0] < longitudeMin) {
            longitudeMin = a[0][0];
        }
        if (a[0][1] < latitudeMin) {
            latitudeMin = a[0][1];
        }
        if (a[1][0] > longitudeMax) {
            longitudeMax = a[1][0];
        }
        if (a[1][1] > latitudeMax) {
            latitudeMax = a[1][1];
        }
    });
    var a = (longitudeMax + longitudeMin) / 2;
    var b = (latitudeMax + latitudeMin) / 2;
    return [a, b];
}