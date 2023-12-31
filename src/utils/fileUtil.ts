import { getToken } from "./auth";
let panUtil = {
  fileFold: {
    ENTERPRISE: 1,//企业页面
    DEP:2,//部门页面
    ENTERPRISEBYVERIFY:3,//企业文件审核页面
    DEPVERIFY:4,//部门文件审核页面
  },
  fileStatus: {
    PARSING: {
      code: 1,
      text: "解析中",
    },
    WAITING: {
      code: 2,
      text: "等待上传",
    },
    UPLOADING: {
      code: 3,
      text: "正在上传",
    },
    PAUSE: {
      code: 4,
      text: "暂停上传",
    },
    SUCCESS: {
      code: 5,
      text: "上传成功",
    },
    FAIL: {
      code: 6,
      text: "上传失败",
    },
    MERGE: {
      code: 7,
      text: "服务器处理中",
    },
  },
  translateFileSize(fileSize: any) {
    let KB_STR = "K",
      MB_STR = "M",
      GB_STR = "G",
      UNIT = 1024,
      fileSizeSuffix = KB_STR;
    fileSize = fileSize / UNIT;
    if (fileSize >= UNIT) {
      fileSize = fileSize / UNIT;
      fileSizeSuffix = MB_STR;
    }
    if (fileSize >= UNIT) {
      fileSize = fileSize / UNIT;
      fileSizeSuffix = GB_STR;
    }
    return fileSize.toFixed(2) + fileSizeSuffix;
  },
  translateSpeed(byteSpeed: any) {
    return this.translateFileSize(byteSpeed) + "/s";
  },
  translateTime(timeRemaining: any) {
    if (!timeRemaining || Number.POSITIVE_INFINITY === timeRemaining) {
      return "--:--:--";
    }
    let timeRemainingInt = parseInt(timeRemaining),
      hNum = Math.floor(timeRemainingInt / 3600),
      mNum = Math.floor((timeRemainingInt / 60) % 60),
      sNum = Math.floor(timeRemainingInt % 60),
      h = hNum < 10 ? "0" + hNum : hNum,
      m = mNum < 10 ? "0" + mNum : mNum,
      s = sNum < 10 ? "0" + sNum : sNum;
    return h + ":" + m + ":" + s;
  },
  checkUsername(username: any) {
    return !!username && /^[0-9A-Za-z]{6,16}$/.test(username);
  },
  checkPassword(password: any) {
    return !!password && password.length >= 8 && password.length <= 16;
  },
  showOperation(dom: any) {
    let parentDiv = dom.firstElementChild;
    if (parentDiv && parentDiv.classList.contains("el-tooltip")) {
      let div = parentDiv.lastElementChild;
      div.style.display = "inline-block";
    }
  },
  hiddenOperation(dom: any) {
    let parentDiv = dom.firstElementChild;
    if (parentDiv && parentDiv.classList.contains("el-tooltip")) {
      let div = parentDiv.lastElementChild;
      div.style.display = "none";
    }
  },
  getFileFontElement(type: any) {
    let tagStr = "iconfont fa-file";
    switch (type) {
      case 0:
        tagStr = "iconfont  icon-folder-open";
        break;
      case 2:
        tagStr = "iconfont  icon-archive";
        break;
      case 3:
        tagStr = "iconfont  icon-excel";
        break;
      case 4:
        tagStr = "iconfont  icon-WORD";
        break;
      case 5:
        tagStr = "iconfont  icon-pdf1";
        break;
      case 6:
        tagStr = "iconfont  icon-text";
        break;
      case 7:
        tagStr = "iconfont  icon-image";
        break;
      case 8:
        tagStr = "iconfont icon-music-full";
        break;
      case 9:
        tagStr = "iconfont  icon-video";
        break;
      case 10:
        tagStr = "iconfont  icon-ppt";
        break;
      case 11:
        tagStr = "iconfont  icon-code";
        break;
      default:
        break;
    }
    return tagStr;
  },
  getPreviewUrl(fileId: any,userName:any) {
    return "http://localhost:8079/file-service/preview?fileId=" + fileId+"&userName="+userName;
  },
  getUrlPrefix() {
    return "http://localhost:8079/file-service";
  },
  getChunkSize() {
    return 1024 * 1024 * 2;
  },
  getMaxFileSize() {
    return 1024 * 1024 * 1024 * 3;
  },
};

export default panUtil;
