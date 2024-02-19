<template>
    <div class='treeTransfer'>
      <div class="leftTree">
        <div class="treeTit">{{props.leftTit||'左侧栏'}}</div>
        <div class="list">
          <el-tree
            ref="treeRef"
            :data="props.fromData"
            show-checkbox
            default-expand-all
            :node-key="props.nodeKey"
            highlight-current
            :props="props.defaultProps"
            :default-checked-keys="props.toData"
          />
        </div>
      </div>
      <div class="btnDiv">
        <div class="mg10" @click="toRight()"><el-button :icon="Right" circle /></div>
        <div class="mg10" @click="toLeft()"><el-button :icon="Back" circle /></div>
      </div>
      <div class="rightTree">
        <div class="treeTit">{{props.rightTit||'右侧栏'}}</div>
        <div class="list">
          <div :class="['item',{'active':item.active}]" v-for="(item,index) in toData" :key="index" @click="checkNode(item)">{{item[props.defaultProps.label]}}</div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref,reactive,onMounted, nextTick } from 'vue'
  import { Right,Back } from '@element-plus/icons-vue';
  const props = defineProps(['nodeKey','fromData','toData','defaultProps','leftTit','rightTit'])
  //定义emit
  const emit = defineEmits(['checkVal'])
    const treeRef = ref()
  
    //右侧数据
    const toData = ref([]);
  
    onMounted(()=>{
      if(props.toData.length>0){
        toData.value = treeRef.value.getCheckedNodes(false, false)
        treeRef.value.setCheckedKeys([], false)
      }
    })
  
    //方法
    //去右边
    const toRight = () =>{
      const checkNodes = treeRef.value.getCheckedNodes(false, false)

      const newArr = toData.value.concat(checkNodes)
      console.log('newArr',newArr)
      let obj = {};
      let peon = newArr.reduce((cur,next) => {
          obj[next[props.nodeKey]] ? "" : obj[next[props.nodeKey]] = true && cur.push(next);
          return cur;
      },[]) //设置cur默认类型为数组，并且初始值为空的数组
      toData.value = peon
      treeRef.value.setCheckedKeys([], false)
      checkVal()
    }
    //去左边
    const toLeft = () =>{
      for(var i=0; i<toData.value.length;i++){
        if(toData.value[i].active){
          toData.value[i].active = false
          toData.value.splice(i,1)
          i-=1
        }
      }
      checkVal()
    }
    //右侧item点击
    const checkNode = (item) =>{
      item.active = !item.active
    }
    //返回父组件
    const checkVal = () =>{
      emit('rcheckedData',toData.value)
    }
  
  </script>
  <style lang='scss'>
  .treeTransfer{
    display: flex;
    justify-content: space-between;
    .mg10{
      margin:10px;
    }
    .leftTree,.rightTree{
      flex-grow: 1;
      width: calc((100% - 60px) / 2);
      .treeTit{
        margin-bottom: 10px;
      }
      .list{
        overflow: auto;
        height: 300px;
        border: 1px solid #ddd;
        border-radius: 4px;
        .item{
          padding: 3px 10px;
          cursor: pointer;
          margin-bottom: 1px;
          &.active{
            background: #b9d7fa;
          }
        }
      }
    }
    .btnDiv{
      width: 60px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  </style>
  