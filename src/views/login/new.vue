<template>
    <div ref="selectArea" class="select-area">
      <div v-for="(item, index) in items" :key="index" class="fileDiv">
        {{ item }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const items = ref<string[]>(['文件1', '文件2', '文件3']);  // 示例数据，可根据需要修改
  
  const selectArea = ref<HTMLDivElement | null>(null);
  
  const clearEventBubble = (evt: Event) => {
    evt.stopPropagation();
    evt.preventDefault();
  };
  
  const showSelDiv = (arr: HTMLElement[]) => {
    let count = 0;
    let selInfo = "";
  
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].classList.contains("seled")) {
        count++;
        selInfo += arr[i].innerHTML + "\n";
      }
    }
  
    alert(`共选择 ${count} 个文件，分别是：\n${selInfo}`);
  };
  
  const onMouseDown = (event: MouseEvent) => {
    let selList: HTMLElement[] = [];
    let fileNodes = selectArea.value!.getElementsByTagName("div");
  
    for (let i = 0; i < fileNodes.length; i++) {
      if (fileNodes[i].classList.contains("fileDiv")) {
        fileNodes[i].className = "fileDiv";
        selList.push(fileNodes[i]);
      }
    }
  
    let isSelect = true;
    let startX = event.clientX;
    let startY = event.clientY;
  
    let selDiv: HTMLDivElement | null = document.createElement("div");
    selDiv.style.cssText = `
      position:absolute;
      width:0px;
      height:0px;
      font-size:0px;
      margin:0px;
      padding:0px;
      border:1px dashed #0099FF;
      background-color:#C3D5ED;
      z-index:1000;
      opacity:0.6;
      display:none;
    `;
    selDiv.id = "selectDiv";
    document.body.appendChild(selDiv);
  
    selDiv.style.left = `${startX}px`;
    selDiv.style.top = `${startY}px`;
  
    let _x: number | null = null;
    let _y: number | null = null;
  
    clearEventBubble(event);
  
    const onMouseMove = (ee: MouseEvent) => {
      if (isSelect) {
        if (selDiv!.style.display === "none") {
          selDiv!.style.display = "";
        }
  
        _x = ee.clientX;
        _y = ee.clientY;
  
        selDiv!.style.left = `${Math.min(_x, startX)}px`;
        selDiv!.style.top = `${Math.min(_y, startY)}px`;
        selDiv!.style.width = `${Math.abs(_x - startX)}px`;
        selDiv!.style.height = `${Math.abs(_y - startY)}px`;
  
        let _l = selDiv!.offsetLeft;
        let _t = selDiv!.offsetTop;
        let _w = selDiv!.offsetWidth;
        let _h = selDiv!.offsetHeight;
  
        for (let i = 0; i < selList.length; i++) {
          let element = selList[i];
          let sl = element.offsetWidth + element.offsetLeft;
          let st = element.offsetHeight + element.offsetTop;
  
          if (sl > _l && st > _t && element.offsetLeft < _l + _w && element.offsetTop < _t + _h) {
            if (!element.classList.contains("seled")) {
              element.classList.add("seled");
            }
          } else {
            if (element.classList.contains("seled")) {
              element.classList.remove("seled");
            }
          }
        }
      }
      clearEventBubble(ee);
    };
  
    const onMouseUp = () => {
      isSelect = false;
  
      if (selDiv) {
        document.body.removeChild(selDiv);
        showSelDiv(selList);
      }
  
      selList = [];
      _x = null;
      _y = null;
      selDiv = null;
  
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  onMounted(() => {
    selectArea.value!.addEventListener('mousedown', onMouseDown);
  });
  
  onUnmounted(() => {
    selectArea.value!.removeEventListener('mousedown', onMouseDown);
  });
  </script>
  
  <style scoped>
  .select-area {
    position: relative;
    user-select: none; /* 禁止用户选择文本 */
  }
  .fileDiv {
    border: 1px solid #ddd;
    margin: 5px;
    padding: 10px;
  }
  .fileDiv.seled {
    background-color: #c3d5ed;
  }
  </style>
  