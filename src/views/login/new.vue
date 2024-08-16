<template>
  <div>
    <el-input v-model="targetNodeId" placeholder="请输入节点ID" />
    <el-button @click="filterTree">过滤树</el-button>
    <el-tree :data="filteredTreeData" :props="defaultProps" node-key="id" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElInput, ElButton, ElTree } from 'element-plus';

interface TreeNode {
  id: number;
  label: string;
  children?: TreeNode[];
}

const targetNodeId = ref<string>('');
const originalTreeData = ref<TreeNode[]>([
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 2,
        label: 'Level two 1-1',
        children: [
          {
            id: 3,
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    id: 4,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
        children: [
          {
            id: 7,
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
]);

const filteredTreeData = ref<TreeNode[]>([]);
const defaultProps = ref({
  children: 'children',
  label: 'label',
});

const filterTree = () => {
  const targetId = parseInt(targetNodeId.value);
  const result = findSubtree(originalTreeData.value, targetId);
  filteredTreeData.value = result ? [result] : [];
};

const findSubtree = (nodes: TreeNode[], targetNodeId: number): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === targetNodeId) {
      return node;
    }
    if (node.children) {
      const result = findSubtree(node.children, targetNodeId);
      if (result) {
        return node;
      }
    }
  }
  return null;
};
</script>

<style>
/* 添加一些基本的样式 */
.el-input,
.el-button {
  margin-bottom: 20px;
}
</style>
