<template>
    <div class="chart-wrapper">
        <h2 style="text-align: center">{{ props.item.theme }}</h2>
        <div v-html="props.item.content" style="font-size:13px"></div>
        <span v-html="timeFormat(props.item.createdTime)" style="float:right ;margin:15px"></span>
    </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";

const props = defineProps({
    item: {
        type: Object,
        default: null,
    }
})

function timeFormat(time: string) {
    if (time == null || time === '') {
        return 'N/A';
    }
    let date = new Date(time);
    return dayjs(date).format("YYYY-MM-DD")
}

</script>
<style scoped>
.chart-wrapper{
    font-family: "OPPOSans-M";
}
</style>