/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-11-30 16:58:49 
 * @Description: 下钻地图
 * @Last Modified by: ouyangdecai@hiynn.com
 * @Last Modified time: 2017-11-30 17:29:28
 */
import * as d3 from 'd3'
import {getCenters, getZoomScale} from '@/util/util'

class SubMap{
    constructor(el, config){
        this.config = config
        this.svg = d3.select(el)
        this.svg.append('g').attr('class','path-bg-g')
        this.svg.append('g').attr('class','path-g').attr('filter','url(#map-offset)')
        this.svg.append('g').attr('class','map-name')
        this.svg.append('g').attr('class','data-g')
    }
    render(id){
        const map = require(`./json/${id}.json`)
        const {features} = map

        const projection = d3.geo.mercator()
            .center(getCenters(features))
            .scale(getZoomScale(features, this.config.width, this.config.height) * this.config.scaleTimes)
            .translate([this.config.width / 2, this.config.height / 2])
        const path = d3.geo.path()
            .projection(projection)

        const mapBgUpdate = this.svg.select('.path-bg-g').selectAll('path').data(features)
        mapBgUpdate.enter().append('path')
        mapBgUpdate
            .attr('stroke-width', 0)
            .attr('stroke', '#54b6ef')
            .attr('d', path)
            .style({
                'fill': '#448ec5',
                'opacity': 0.8
            })
            .attr('transform','translate(0,20)')
        const update = this.svg.select('.path-g').selectAll('path').data(features)
        update.enter().append('path')
        update
            .attr('class', d => {
                return 'sub d-' + d.properties.YWBSM
            })
            .attr('stroke-width', 2)
            .attr('stroke', '#54b6ef')
            .attr('d', path)
            .style({
                'fill': '#07227a',
                'opacity': 1
            })
    }
}
export default SubMap