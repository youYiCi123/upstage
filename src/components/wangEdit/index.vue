<template>
    <div ref="editorRef" />
</template>
<script setup lang="ts">
import E from 'wangeditor';
import { getStsToken } from '@/api/oss'
import { ref, onMounted } from 'vue'
const props = defineProps({
    content: {
        type: String,
        default: ''
    }
})
const editorRef = ref();
const emit = defineEmits(['change'])

onMounted(() => {
    var editor = new E(editorRef.value)
    // 自定义菜单配置
    editor.config.zIndex = 10
    // 文件上传
    editor.config.customUploadImg = function (files: any, insertFn: any) {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        files.forEach((image: any) => {
            getStsToken().then(reponse => {
                const OSS = require('ali-oss');
                let ossConfig = reponse.data;
                let client = new OSS({
                    region: ossConfig.region,
                    accessKeyId: ossConfig.accessKeyId,
                    accessKeySecret: ossConfig.accessKeySecret,
                    bucket: ossConfig.bucket,
                    stsToken: ossConfig.stsToken,
                })
                let res = client.put('Blog/image/' + image.name, image)
                res.then((result: any) => {
                    insertFn(result.url)
                })
            }).catch((e) => {
                console.log("捕捉错误", e)
            })
        })
    }
    editor.config.languageType = [
        'Java',
        'JavaScript',
        'JSON',
        'SQL',
        'TypeScript',
        'Html',
        'XML',
        'C',
        'C#',
        'C++',
        'CSS',
        'Bash',
        'Plain text',
        'Go',
        'Kotlin',
        'Lua',
        'Markdown',
        'PHP',
        'Python',
        'Shell Session',
        'Ruby',
    ]
    editor.config.onchange = (html: any) => {
        emit('change', html) // 将内容同步到父组件中
    }
    editor.create()
    setTimeout(() => {//子组件onMounted比父组件onMounted先执行
        editor.txt.html(props.content)  //从父组件传递过来
    }, 250)
})



</script>
<style>
.editor {
    margin: 0px;
    text-align: left;
}
</style>