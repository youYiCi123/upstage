<template>
    <div class="app-container calendar">
        <el-button type="primary" icon="Plus" style="margin-bottom: 10px;" @click="handleAdd">添加日程安排</el-button>
        <FullCalendar :options="calendarOptions" />
    </div>
    <el-dialog :title="isEdit ? '修改日程' : '添加日程'" v-model="calendarDialogVisible" width="35%">
        <el-form :model="calendarInfo" ref="calendarForm" :rules="calendarRules" label-width="110px" size="default">
            <el-form-item label="描述：" prop="title">
                <el-input type="textarea" :rows="3" v-model="calendarInfo.title" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="起始日期：" prop="startDate">
                <el-date-picker v-model="calendarInfo.startDate" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="截止日期：" prop="endDate">
                <el-date-picker v-model="calendarInfo.endDate" type="date" placeholder="请选择日期" style="width: 250px" />
            </el-form-item>
            <el-form-item label="级别：">
                <el-select v-model="calendarInfo.level" clearable>
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        <span style="position: absolute;top: 50%; transform: translate(-150%, -50%);" :class="item.label === '紧急' ? 'badgeDot JJdot' : item.label === '重要' ? 'badgeDot ZYdot' :
                            item.label === '次要' ? 'badgeDot CYdot' : 'badgeDot BZYdot'"></span>
                        <span style="font-size: 14px;">{{ item.label }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否通知：">
                <el-radio-group v-model="calendarInfo.isRemind">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="calendarDialogVisible = false" size="small">取 消</el-button>
            <el-button  v-if="isEdit" type="danger" size="small" style="float: left;" @click="handleDelete(calendarInfo.id)">删 除</el-button>
            <el-button type="primary" @click="handleDialogConfirm(calendarForm)" size="small">确 定</el-button>
        </template>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { addCalendar, updateCalendar,deleteCalendar,getCalendarById } from "@/api/calendar";
import pinia from '@/store/index'
import { useUserStore } from "@/store/modules/userStore";
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useRouter } from 'vue-router';
const router = useRouter();
const UserStore = useUserStore(pinia);

const calendarDialogVisible = ref(false)
const isEdit = ref(false)

const calendarInfo = reactive({
    id: null,
    title: '',
    startDate: '',
    endDate: '',
    level: null,
    userId:UserStore.id,
    isRemind: 0,//是否提醒
    // remidType: 0//提醒方式
})

const options = [
    {
        value: 'level0',
        label: '紧急',
    },
    {
        value: 'level1',
        label: '重要',
    },
    {
        value: 'level2',
        label: '次要',
    },
    {
        value: 'level3',
        label: '不重要',
    },
]
const calendarForm = ref<FormInstance>();
/** 验证规则 */
const calendarRules: FormRules = {
    title: [
        { required: true, message: '请输入内容', trigger: 'blur' }
    ],
    startDate: [
        { required: true, message: '请选择起始日期', trigger: 'blur' }
    ],
    endDate: [
        { required: true, message: '请选择截至日期', trigger: 'blur' }
    ]
}

function handleAdd() {
    calendarInfo.startDate = ''
    calendarInfo.endDate = ''
    calendarInfo.title = ''
    calendarInfo.isRemind = 0
    calendarInfo.level = null
    isEdit.value = false;
    calendarDialogVisible.value = true;
}

function handleDelete(id:any) {
  ElMessageBox.confirm('是否要删除该日程', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteCalendar(id).then(response => {
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1000
      });
      calendarDialogVisible.value = false;
    });
  });
}

function handleDialogConfirm(formEl: FormInstance | undefined) {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            if (isEdit.value) {
                updateCalendar(calendarInfo).then(res=>{
                    ElMessage({
                        message: '修改成功！',
                        type: 'success'
                    });
                    calendarDialogVisible.value = false
                }).catch(err=>console.log(err))
            } else {
                addCalendar(calendarInfo).then(res => {
                    ElMessage({
                        message: '创建成功！',
                        type: 'success'
                    });
                    calendarDialogVisible.value = false
                }).catch(err=>console.log(err))
            }

        }
    })

}

const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
        right: "prevYear,prev,next,nextYear today",
    },
    locale: "zh-cn", // 切换语言，当前为中文
    events: [], //事件事件+文本
    eventClick: (info: any) => {
        calendarInfo.id = info.event.id
        calendarInfo.startDate = info.event.startStr
        calendarInfo.endDate = info.event.endStr
        calendarInfo.title = info.event.title
        calendarInfo.level = info.event.classNames[0]
        isEdit.value = true;
        calendarDialogVisible.value = true
        console.log(info.event);
        info.el.style.borderColor = "red";
    },
    dateClick: (info: any) => {
        // alert("Clicked on: " + info.dateStr);
        // info.dayEl.style.backgroundColor = "red";
    },
    editable: true,
    dayMaxEventRows: 2,
})

function init() {
    getCalendarById(UserStore.id).then(res => {
        calendarOptions.value.events = res.data
    })
}

init()
</script>
  
<style>
.badgeDot {
    width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 50%;
}

.JJdot {
    background-color: #ff5722;
}

.ZYdot {
    background-color: #ffb800 !important;
}

.CYdot {
    background-color: #1e9fff !important;
}

.BZYdot {
    background-color: #16b777 !important;
}

.calendar .level0 {
    background-color: #ff5722 !important
}

.calendar .level1 {
    background-color: #ffb800 !important
}

.calendar .level2 {
    background-color: #1e9fff !important
}

.calendar .level3 {
    background-color: #16b777 !important
}
</style>
  