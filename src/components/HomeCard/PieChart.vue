<script setup lang="ts">
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
const pieChart = ref()
var option

const props = defineProps({
    //按钮数组
    pieData: {
        type: Array,
        default: []
    },
    width: {
        type: Number,
        default: '100%'
    },
    height: {
        type: Number,
        default: '100%'
    }
})

const chartWidth = computed(() => {
    if (typeof props.width === 'number') {
        return props.width + 'px'
    } else {
        return props.width
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
    pieChart.value = echarts.init(chart.value, 'light')
    option = {
        title: {
            text: '企业文件类型占比图',
            x: 'center'
        },
        legend: {
            top: 'bottom',
            selectedMode: false, // 是否允许点击
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}数量 : {c}个 <br/>(占比{d}%)'
        },
        series: [
            {
                name: '文件数量',
                type: 'pie',
                // radius: '50%',  
                radius: [20, 110],
                // roseType: 'area',    
                itemStyle: {
                    borderRadius: 8
                },
                data: props.pieData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
    option && pieChart.value.setOption(option)
}
</script>
<template>
    <div ref="chart" :style="`width: ${chartWidth}; height: ${chartHeight};`"></div>
</template>