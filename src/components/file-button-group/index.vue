<template>
    <div class="pan-main-operating-content">
        <div class="pan-main-button-content">
            <upload-button v-if="uploadButtonFlag" size="default" :round-flag=true />
            <create-folder-button v-if="createFolderButtonFlag" size="default" :round-flag=true />
            <download-button v-if="downloadButtonFlag" size="default" :round-flag=true />
            <delete-button v-if="deleteButtonFlag" size="default" :round-flag=true />
            <rename-button v-if="renameButtonFlag" size="default" :round-flag=true />
            <copy-button v-if="copyButtonFlag" size="default" :round-flag=true />
            <transfer-button v-if="transferButtonFlag" size="default" :round-flag=true />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import UploadButton from '../buttons/upload-button/index.vue'
import CreateFolderButton from '../buttons/create-folder-button/index.vue'
import DownloadButton from '../buttons/download-button/index.vue'
import DeleteButton from '../buttons/delete-button/index.vue'
import RenameButton from '../buttons/rename-button/index.vue'
import CopyButton from '../buttons/copy-button/index.vue'
import TransferButton from '../buttons/transfer-button/index.vue'

const props = defineProps({
    //按钮数组
    buttonArray: {
        type: Array,
        default: []
    }
})
const uploadButtonFlag = ref(false);
const createFolderButtonFlag = ref(false);
const downloadButtonFlag = ref(false);
const deleteButtonFlag = ref(false);
const renameButtonFlag = ref(false);
const copyButtonFlag = ref(false);
const shareButtonFlag = ref(false);
const transferButtonFlag = ref(false);


function initButton() {
    if (props.buttonArray) {
        props.buttonArray.forEach(item => {
            switch (item) {
                case 'upload':
                    uploadButtonFlag.value = true
                    break
                case 'createFolder':
                    createFolderButtonFlag.value = true
                    break
                case 'download':
                    downloadButtonFlag.value = true
                    break
                case 'delete':
                    deleteButtonFlag.value = true
                    break
                case 'rename':
                    renameButtonFlag.value = true
                    break
                case 'share':
                    shareButtonFlag.value = true
                    break
                case 'copy':
                    copyButtonFlag.value = true
                    break
                case 'transfer':
                    transferButtonFlag.value = true
                    break
                default:
                    break
            }
        })
    }
}


onMounted(() => {
    initButton()
})

</script>

<style>
.pan-main-operating-content {
    width: 100%;
    padding: 20px 0 0 13px;
    height: 60px;
}

.pan-main-operating-content .pan-main-button-content {
    display: inline-block;
}
</style>