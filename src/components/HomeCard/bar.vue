<script setup lang="ts">
import { userUploadCount } from "@/mode/business/UserUploadModel";
import { ref, onMounted, computed } from 'vue'
// 使用 ECharts 提供的按需引入的接口来打包必须的组件
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as echarts from 'echarts'
/*
  需要注意的是为了保证打包的体积是最小的，ECharts 按需引入的时候不再提供任何渲染器，
  所以需要选择引入 CanvasRenderer 或者 SVGRenderer 作为渲染器。这样的好处是假如
  你只需要使用 svg 渲染模式，打包的结果中就不会再包含无需使用的 CanvasRenderer 模块
*/
const chart = ref()
const barChart = ref()
var option

const props = defineProps({
    //按钮数组
    barData: {
        type: Array as any,
        default: []
    },
    height: {
        type: Number,
        default: '100%'
    }
})

const chartHeight = computed(() => {
    if (typeof props.height === 'number') {
        return props.height + 'px'
    } else {
        return props.height
    }
})
onMounted(() => {
    initChart() // 初始化图标示例
})

function initChart() {
    // 等价于使用 Canvas 渲染器（默认）：echarts.init(containerDom, null, { renderer: 'canvas' })
    barChart.value = echarts.init(chart.value, 'light')

    option = {
        title: {
            text: '文件分享前十榜',
            x: 'center'
        },
        xAxis: {
            data: [] as any,
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}共上传{c}个文件'
        },
        yAxis: {},
        series: [
            {
                name: '文件数量',
                type: 'bar',
                radius: [30, 110],
                roseType: 'area',
                data: [] as any,
                itemStyle: {
                    barBorderRadius: 5,
                    borderWidth: 1,
                    borderType: 'solid',
                    borderColor: '#73c0de',
                    shadowColor: '#5470c6',
                    shadowBlur: 3
                },
                barWidth: '55%'
            }
        ]
    }
    for (let i = 0; i < props.barData.length; i++) {
        option.xAxis.data.push(props.barData[i].userName)
        option.series[0].data.push(props.barData[i].uploadCount)
    }
    option && barChart.value.setOption(option)
}
</script>
<template>
    <div ref="chart" :style="`width: 100%; height: ${chartHeight};`"></div>
</template>