<template>
  <div class="file-page-container">
    <el-container>
      <el-aside width="300px" class="folder-aside">
        <el-input
          v-model="foldName"
          :prefix-icon="Search"
          placeholder="请输入文件夹名称"
          style="margin-bottom: 20px"
        ></el-input>
        <el-tree
          class="filter-tree"
          ref="treeRef"
          default-expand-all
          node-key="id"
          :current-node-key="currentLivingId"
          highlight-current
          :props="defaultProps"
          :data="foldData"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <i
              class="iconfont icon-folder"
              style="margin-right: 15px; font-size: 20px; cursor: pointer"
            />
            <span>{{ node.label }}</span>
          </template>
        </el-tree>
      </el-aside>
      <div class="file-container">
        <el-card :body-style="{ padding: '13px' }">
          <div class="operation-card">
            <div class="breadcrumb-content">
              <el-breadcrumb
                :separator-icon="ArrowRight"
                style="display: inline-block"
              >
                <el-breadcrumb-item
                  v-for="(item, index) in breadcrumbStore.depBreadCrumbs"
                  :key="index"
                >
                  <a
                    class="breadcrumb-item-a"
                    @click="goToThis(item.id)"
                    href="#"
                    >{{ item.name }}</a
                  >
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <label>
              <input type="text" v-model="fileNameBySerch" required @keyup.enter.native="searchFileByName"/>
              <span class="line"></span>
            </label>
            <upload-button
              @loadFileList="getList"
              :is-dep="true"
              size="default"
              :round-flag="true"
            />
            <create-folder-button
              @loadFileList="getList"
              :is-dep="true"
              size="default"
              :round-flag="true"
            />
          </div>
        </el-card>
        <div
          :class="isImg ? 'file-list bigImg' : 'file-list col'"
          @contextmenu.prevent="openOutSideMenu($event)"
        >
          <div
            class="item"
            v-for="(item, index) in fileList"
            @click="viewFile(item)"
            @contextmenu.prevent.stop="openMenu($event, item)"
          >
            <el-image
              :src="analysisType(item.fileType)"
              class="img"
              fit="fill"
            ></el-image>
            <div class="file-name">{{ item.filename }}</div>
          </div>
          <el-image-viewer
            :initial-index="imgIndex"
            v-if="showViewer"
            @close="
              () => {
                showViewer = false;
              }
            "
            :url-list="imgUrl"
          />
          <!-- item右键菜单 -->
          <ul
            v-show="menuVisible"
            :style="{
              left: position.left + 'px',
              top: position.top + 'px',
              display: menuVisible ? 'block' : 'none',
            }"
            class="contextmenu"
          >
            <div class="menuItem">
              <file-info-button
                :round-flag="true"
                size="small"
                :item="rightClickItem"
              />
            </div>
            <div class="menuItem">
              <download-button
                @loadFileList="getList"
                :round-flag="true"
                size="small"
                :item="rightClickItem"
              />
            </div>
            <div class="menuItem">
              <comment-button
                :round-flag="true"
                size="small"
                :item="rightClickItem"
              />
            </div>
            <div class="menuItem">
              <set-button
                @loadFileList="getList"
                :round-flag="true"
                size="small"
                :item="rightClickItem"
              />
            </div>
            <div
              v-if="
                userStore.roles.findIndex((item) => item == '部门负责人') != -1
              "
              class="menuItem"
            >
              <rename-button
                @loadFileList="getList"
                :round-flag="true"
                size="small"
                :item="rightClickItem"
              />
            </div>
            <div
              v-if="
                userStore.roles.findIndex((item) => item == '部门负责人') != -1
              "
              class="menuItem"
            >
              <copy-button
                @loadFileList="getList"
                size="small"
                :is-dep="true"
                :round-flag="true"
                :item="rightClickItem"
              />
            </div>
            <div
              v-if="
                userStore.roles.findIndex((item) => item == '部门负责人') != -1
              "
              class="menuItem"
            >
              <transfer-button
                @loadFileList="getList"
                size="small"
                :is-dep="true"
                :round-flag="true"
                :item="rightClickItem"
              />
            </div>
            <div
              v-if="
                userStore.roles.findIndex((item) => item == '部门负责人') != -1
              "
              class="menuItem"
            >
              <delete-button
                @loadFileList="getList"
                :round-flag="true"
                size="small"
                :item="rightClickItem"
              />
            </div>
          </ul>
          <!-- 外部右键菜单 -->
          <ul
            v-show="outsideMenuVisible"
            :style="{
              left: position.left + 'px',
              top: position.top + 'px',
              display: outsideMenuVisible ? 'block' : 'none',
            }"
            class="contextmenu"
          >
            <div class="menuItem" @click="toListMode">
              <i class="iconfont icon-liebiaoshitucaidan"></i>
              列表模式
            </div>
            <div class="menuItem" @click="toImgMode">
              <i class="iconfont icon-dasuolvetuliebiao"></i>
              图标模式
            </div>
          </ul>
        </div>
      </div>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { getFolderTree, list,searchForName } from "@/api/file";
import CommentButton from "@/components/buttons/comment-button/index.vue";
import DownloadButton from "@/components/buttons/download-button/index.vue";
import RenameButton from "@/components/buttons/rename-button/index.vue";
import DeleteButton from "@/components/buttons/delete-button/index.vue";
import CopyButton from "@/components/buttons/copy-button/index.vue";
import TransferButton from "@/components/buttons/transfer-button/index.vue";
import FileInfoButton from "@/components/buttons/fileInfo-button/index.vue";
import SetButton from "@/components/buttons/set-button/index.vue";
import panUtil from "@/utils/fileUtil";
import { useRouter } from "vue-router"; //vue3路由跳转
const router = useRouter();
import pinia from "@/store/index";
import { useFileStore } from "@/store/modules/fileStore";
import { useUserStore } from "@/store/modules/userStore";
import { useBreadcrumbStore } from "@/store/modules/breadcrumbStore";
const fileStore = useFileStore(pinia);
const userStore = useUserStore(pinia);
const breadcrumbStore = useBreadcrumbStore(pinia);
import UploadButton from "@/components/buttons/upload-button/index.vue";
import CreateFolderButton from "@/components/buttons/create-folder-button/index.vue";
//用户搜索文件夹名称
const foldName = ref("");
const treeRef = ref();
const currentLivingId = ref<any>(null);
//用户搜索文件名
const fileNameBySerch = ref("");
//图片
const showViewer = ref(false);
const imgUrl = ref<any[]>([]);
const imgIndex = ref(0);

//右键菜单
const menuVisible = ref(false);
const outsideMenuVisible = ref(false);
const position = ref({
  top: 0,
  left: 0,
});
const closeMenu = () => {
  menuVisible.value = false;
};
const rightClickItem = ref<any>(null);
watch(menuVisible, () => {
  if (menuVisible.value) {
    document.body.addEventListener("click", closeMenu);
  } else {
    document.body.removeEventListener("click", closeMenu);
  }
});
//外部右键菜单
const closeOutsideMenu = () => {
  outsideMenuVisible.value = false;
};
watch(outsideMenuVisible, () => {
  if (outsideMenuVisible.value) {
    document.body.addEventListener("click", closeOutsideMenu);
  } else {
    document.body.removeEventListener("click", closeOutsideMenu);
  }
});
//文件呈现方式，true大图标；false列表
const isImg = ref(true);

interface Tree {
  [key: string]: any;
}

const defaultProps = {
  children: "children",
  label: "label",
};

//搜索时树节点过滤
watch(foldName, (val) => {
  treeRef.value!.filter(val);
});

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};
//文件树
const foldData = ref<Tree[]>([]);
//文件列表
const fileList = ref<any[]>([]);
//获取文件树
function getFoldTree() {
  getFolderTree({ fileRootId: panUtil.fileFold.DEP }).then((response) => {
    foldData.value = response.data;
    if (fileStore.parentDepId !== -1) {
      currentLivingId.value = fileStore.parentDepId;
    } else {
      currentLivingId.value = response.data[0].id;
    }
  });
}
getFoldTree();

function searchFileByName() {
    searchForName({pageType: panUtil.fileFold.DEP,keyword:fileNameBySerch.value}).then((response)=>{
        fileList.value = response.data;
    })
}

function rename(rightClickItem: any) {
  console.log("rightClickItem", rightClickItem.value);
}

//获取文件
function getList() {
  list({
    pageType: panUtil.fileFold.DEP,
    parentId: fileStore.parentDepId,
    fileTypes: fileStore.fileTypes,
  }).then((response) => {
    fileList.value = response.data;
  });
}
getList();

//0 文件夹 3 excel 4 word 5 pdf 7 图片
function analysisType(type: any) {
  let tagStr = "";
  switch (type) {
    case 0:
      tagStr = require("@/assets/images/file-img/fold.png");
      break;
    case 3:
      tagStr = require("@/assets/images/file-img/excel.png");
      break;
    case 4:
      tagStr = require("@/assets/images/file-img/word.png");
      break;
    case 5:
      tagStr = require("@/assets/images/file-img/pdf.png");
      break;
    case 6:
      tagStr = require("@/assets/images/file-img/txt.png");
      break;
    case 7:
      tagStr = require("@/assets/images/file-img/img.png");
      break;
    case 8:
      tagStr = require("@/assets/images/file-img/music.png");
      break;
    case 9:
      tagStr = require("@/assets/images/file-img/video.png");
      break;
    case 10:
      tagStr = require("@/assets/images/file-img/pptx.png");
      break;
    default:
      break;
  }
  return tagStr;
}

//点击el-tree
function handleNodeClick(item: any, data: any) {
  //加载文件
  list({
    pageType: panUtil.fileFold.DEP,
    parentId: item.id,
    fileTypes: fileStore.fileTypes,
  }).then((response) => {
    fileList.value = response.data;
  });
  fileStore.setFileDepParentId(item.id);
  breadcrumbStore.depBreadCrumbs = [];
  /*临时变量nodeData储存被点击节点的node信息，判断如果此节点有父节点，
    那么将相关信息添加到面包屑的首位，并将父节点赋值给临时节点，继续判断该节点是否有父节点*/
  let nodeData = data;
  while (nodeData.parent != null) {
    breadcrumbStore.depBreadCrumbs.unshift({
      name: nodeData.data.label,
      id: nodeData.data.id,
    });
    nodeData = nodeData.parent;
  }
}
//面包屑点击
function goToThis(id: any) {
  if (id !== "-1") {
    let newBreadCrumbs = new Array();
    breadcrumbStore.depBreadCrumbs.some((item) => {
      newBreadCrumbs.push(item);
      if (item.id == id) {
        return true;
      }
    });
    breadcrumbStore.resetDep(newBreadCrumbs);
    fileStore.setFileDepParentId(id);
    // 设置树节点当前选中的key
    currentLivingId.value = id;
    // 重点: 设置树节点渲染
    treeRef.value.setCurrentKey(id);
    // 加载文件
    list({
      pageType: panUtil.fileFold.DEP,
      parentId: id,
      fileTypes: fileStore.fileTypes,
    }).then((response) => {
      fileList.value = response.data;
    });
  }
}

//点击查看文件
function viewFile(item: any) {
  switch (item.fileType) {
    case 0:
      goInFolder(item);
      break;
    case 3:
    case 4:
    case 10:
      showOffice(item);
      break;
    case 5:
    case 6:
      showIframe(item);
      break;
    case 7:
      showImg(item);
      break;
    case 8:
      showMusic(item);
      break;
    case 9:
      showVideo(item);
      break;
  }
}

//文件夹操作
function goInFolder(item: any) {
  fileStore.setFileDepParentId(item.fileId);
  //加载文件
  list({
    pageType: panUtil.fileFold.DEP,
    parentId: item.fileId,
    fileTypes: fileStore.fileTypes,
  }).then((response) => {
    fileList.value = response.data;
  });
  //面包屑
  let breadItem = {
    id: item.fileId,
    name: item.filename,
  };
  breadcrumbStore.addDepItem(breadItem);
  //el-tree设置选中
  currentLivingId.value = item.fileId;
}

//office预览
function showOffice(row: any) {
  openNewPage(
    "/preview/office/" +
      row.fileId +
      "/" +
      row.filename +
      "/" +
      userStore.nickName,
    "PreviewOffice",
    {
      fileId: row.fileId,
      filename: row.filename,
      userName: userStore.nickName,
    }
  );
}

function showIframe(row: any) {
  const pdfUrl = panUtil.getPreviewUrl(row.fileId, userStore.nickName); // pdf路径
  window.open(pdfUrl);
}

//视频播放
function showVideo(row: any) {
  openNewPage(
    "/preview/video/" +
      row.parentId +
      "/" +
      row.fileId +
      "/" +
      panUtil.fileFold.DEP,
    "PreviewVideo",
    {
      pageType: panUtil.fileFold.DEP,
      fileId: row.fileId,
      parentId: row.parentId,
    }
  );
}
function showMusic(row: any) {
  openNewPage(
    "/preview/music/" +
      row.parentId +
      "/" +
      row.fileId +
      "/" +
      panUtil.fileFold.DEP,
    "PreviewMusic",
    {
      pageType: panUtil.fileFold.DEP,
      parentId: row.parentId,
      fileId: row.fileId,
    }
  );
}

function openNewPage(path: any, name: any, params: any) {
  const { href } = router.resolve({
    path: path,
    name: name,
    params: params,
  });
  window.open(href, "_blank");
}

function showImg(row: any) {
  imgUrl.value = new Array();
  let t = 0;
  for (let i = 0, iLength = fileList.value.length; i < iLength; ++i) {
    if (fileList.value[i].fileType === 7) {
      imgUrl.value.push(panUtil.getPreviewUrl(fileList.value[i].fileId, ""));
      if (fileList.value[i].fileId === row.fileId) {
        imgIndex.value = t;
      }
      t++;
    }
  }
  showViewer.value = true;
}

function closeShowViewer() {
  showViewer.value = false;
}

function toListMode() {
  isImg.value = false;
}
function toImgMode() {
  isImg.value = true;
}

function init() {
  if (!breadcrumbStore.depExpandFlag) {
    if (fileStore.parentDepId == fileStore.defaultParentDepId) {
      let firstItem = {
        id: fileStore.defaultParentDepId,
        name: fileStore.defaultParentDepFilename,
      };
      breadcrumbStore.clearDep();
      breadcrumbStore.addDepItem(firstItem);
      breadcrumbStore.resetDepFlag();
    }
  }
}
onMounted(() => {
  init();
});

function openOutSideMenu(e: any) {
  outsideMenuVisible.value = true;
  position.value.top = e.pageY;
  position.value.left = e.pageX;
}
function openMenu(e: any, item: any) {
  menuVisible.value = true;
  position.value.top = e.pageY;
  position.value.left = e.pageX;
  rightClickItem.value = item;
}
</script>
<style scoped>
.breadcrumb-content {
  width: 100%;
  padding: 10px 0 0 25px;
}

.breadcrumb-item-a {
  cursor: pointer !important;
  color: #409eff !important;
}

.file-page-container .folder-aside {
  width: 300px;
  height: calc(100vh - 91px);
  border-right: 1px solid #ddd;
  margin: 0;
  -webkit-box-shadow: 1px 0 6px rgba(0, 21, 41, 0.35);
  box-shadow: 1px 0 6px rgba(0, 21, 41, 0.35);
}

aside {
  background: #fff;
  padding: 8px 24px;
  margin-bottom: 20px;
  border-radius: 8px;
}

label{
  position: relative;
  margin-right: 14px;
}
input{
    width: 30px;
    height: 30px;
    line-height: 30px;
    outline-style: none;
    font-size: 13px;
    color: #333;
    border: 3px solid #a8a8a8;
    border-radius: 19px;
    padding: 0 8px;
    box-sizing: border-box;
    transition: all 1s ease-in-out;
}
.line{
    width: 3px;
    height: 12px;
    display: block;
    background-color: #a8a8a8;
    transform: rotate(320deg);
    position: absolute;
    left: 25px;
    top: 24px;
    z-index: 10;
    opacity: 1;
    transition: all 1s ease-in-out;
}
input:focus,input:valid{
  width: 180px;
}
input:focus+.line,input:valid+.line{
  width: 1px;
  height: 16px;
  left: 19px;
  top: 10px;
  opacity: 0;
  transform: rotate(360deg);
}

.file-page-container .file-container {
  padding: 0 10px;
  width: 100%;
}

.file-page-container .file-container .operation-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.file-page-container .file-container .bigImg {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
}

.file-page-container .file-container .col {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

.file-page-container .file-container .col .item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  padding: 10px;
  height: 55px;
  width: 270px;
}

.file-page-container .file-container .col .item .img {
  width: 35px;
  height: 35px;
}

.file-page-container .file-container .col .item .file-name {
  text-align: left;
  line-height: 35px;
  font-size: 14px;
  color: #606266;
  height: 35px;
  overflow: hidden;
  width: 215px;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 10px;
  cursor: default;
}

.file-page-container .file-container .file-list {
  height: calc(100vh - 91px);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  padding-top: 10px;
  padding-left: 10px;
  overflow: scroll;
}

.file-page-container .file-container .bigImg .item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  padding: 5px;
  height: 150px;
  width: 130px;
}

.file-page-container .file-container .bigImg .item:hover {
  background-color: #eee;
}

.file-page-container .file-container .col .item:hover {
  background-color: #eee;
}

.file-page-container .file-container .bigImg .item .img {
  width: 120px;
  height: 120px;
}

.el-image__inner {
  vertical-align: top;
}

.file-page-container .file-container .bigImg .item .file-name {
  text-align: center;
  font-size: 14px;
  color: #606266;
  height: 20px;
  overflow: hidden;
  width: 120px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.contextmenu {
  position: absolute;
  padding: 5px 0;
  margin: 0;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  -webkit-box-shadow: 2px 2px 8px 0 hsla(0, 0%, 58.8%, 0.2);
  box-shadow: 2px 2px 8px 0 hsla(0, 0%, 58.8%, 0.2);
  list-style: none;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;
  z-index: 2800;
  -webkit-tap-highlight-color: transparent;
}

.contextmenu .menuItem {
  padding: 10px 0;
  text-align: center;
  width: 150px;
  color: #606266;
  line-height: 1;
}

.contextmenu .menuItem:hover {
  background: rgb(64, 158, 255);
}
</style>