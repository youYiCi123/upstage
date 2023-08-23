<template>
  <el-card class="form-container" shadow="never">
    <el-tree :data="menuTreeList" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current
      :props="defaultProps">
    </el-tree>
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">清空</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage,ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from "vue-router";
import { fetchTreeList } from '@/api/menu';
import { listMenuByRole, allocMenu } from '@/api/role';

const defaultProps = ref({
  children: 'children',
  label: 'title'
});
const menuTreeList = ref([]);
const route = useRoute();
const router = useRouter();
const roleId = route.query.roleId
const tree = ref();
function treeList() {
  fetchTreeList().then(response => {
    menuTreeList.value = response.data;
  });
}

function getRoleMenu(roleId: number) {
  listMenuByRole(roleId).then(response => {
    let menuList = response.data;
    let checkedMenuIds = [];
    if (menuList != null && menuList.length > 0) {
      for (let i = 0; i < menuList.length; i++) {
        let menu = menuList[i];
        if (menu.parentId !== 0) {
          checkedMenuIds.push(menu.id);
        }
      }
    }
    tree.value.setCheckedKeys(checkedMenuIds);
  });
}
function handleSave() {
  let checkedNodes =  tree.value.getCheckedNodes();
  let checkedMenuIds = new Set();
  if (checkedNodes != null && checkedNodes.length > 0) {
    for (let i = 0; i < checkedNodes.length; i++) {
      let checkedNode = checkedNodes[i];
      checkedMenuIds.add(checkedNode.id);
      if (checkedNode.parentId !== 0) {
        checkedMenuIds.add(checkedNode.parentId);
      }
    }
  }
  ElMessageBox.confirm('是否分配菜单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let params = new URLSearchParams();
    params.append("roleId", roleId as string);
    params.append("menuIds", Array.from(checkedMenuIds) as unknown as string);
    allocMenu(params).then(response => {
      ElMessage({
        message: '分配成功',
        type: 'success',
        duration: 1000
      });
      router.back();
    })
  })
}
function handleClear() {
  tree.value.setCheckedKeys([]);
}
treeList()
getRoleMenu(roleId as any)

</script>

<style scoped></style>
