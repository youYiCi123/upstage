<template>
	<el-date-picker type="datetimerange" align="center" size="default" unlink-panels v-model="thisDate"
		:shortcuts="shortcuts"  format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" @change="setDate(thisDate)" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="-">
	</el-date-picker>
</template>

<script setup lang="ts">
import { defineProps,ref} from 'vue'
const props = defineProps({
	date: {
		required: true
	},
	setDate: {
		type: Function,
		required: true
	}
})

//子组件不能直接修改父组件的值
const thisDate = ref(props.date);
// thisDate: this.date,
const shortcuts = [
{
			text: '今天',
			value: () => {
				const start = new Date()
				const end = new Date()
				start.setHours(0)
				start.setMinutes(0)
				start.setSeconds(0)
				end.setHours(23)
				end.setMinutes(59)
				end.setSeconds(59)
				return [start, end]
			}
		},
		{
			text: '昨天',
			value: () => {
				const date = new Date()
				const start = new Date()
				const end = new Date()
				start.setTime(date.getTime() - 3600 * 1000 * 24)
				end.setTime(date.getTime() - 3600 * 1000 * 24)
				start.setHours(0)
				start.setMinutes(0)
				start.setSeconds(0)
				end.setHours(23)
				end.setMinutes(59)
				end.setSeconds(59)
				return [start, end]
			}
		},
		{
			text: '最近三天',
			value: () => {
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
				return [start, end]
			}
		},
		{
			text: '最近一周',
			value: () => {
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
				return [start, end]
			}
		},
		{
			text: '最近一个月',
			value: () => {
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
				return [start, end]
			}
		}
]


</script>

<style scoped></style>