<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{ top: top + 'px' }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const delta = 15
let top = 0
const scrollContainer = ref();
const scrollWrapper = ref();
function handleScroll(e: any) {
  const eventDelta = e.wheelDelta || -e.deltaY * 3
  const $container = scrollContainer.value
  const $containerHeight = $container.offsetHeight
  const $wrapper = scrollWrapper.value
  const $wrapperHeight = $wrapper.offsetHeight
  // console.log("eventDelta",eventDelta)
  // console.log("$containerHeight",$containerHeight)
  // console.log("delta",delta)  
  // console.log("$wrapperHeight",$wrapperHeight)
  if (eventDelta > 0) {
    top = Math.min(0, top + eventDelta)
  } else {
    if ($containerHeight - delta < $wrapperHeight) {
      if (top < -($wrapperHeight - $containerHeight + delta)) {
        console.log("top1",top)
        top = top
      } else {
        top = Math.max(top + eventDelta, $containerHeight - $wrapperHeight - delta)
        console.log("top2",top)
      }
    } else {
      top = 0
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../styles/variables.scss';

.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $menuBg;

  .scroll-wrapper {
    position: absolute;
    width: 100% !important;
  }
}
</style>
