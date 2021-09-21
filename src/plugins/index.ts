import {ElButton, ElForm, ElFormItem, ElDivider, ElInput, ElRadio, ElRadioGroup, ElCascader,
ElSelect, ElOption, ElRow, ElCol, ElMessage, ElMessageBox, ElDialog, ElDatePicker, ElNotification} from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

export default function (app: any) {
    app.use(ElButton)
    app.use(ElForm)
    app.use(ElFormItem)
    app.use(ElDivider)
    app.use(ElInput)
    app.use(ElRadio)
    app.use(ElRadioGroup)
    app.use(ElCascader)
    app.use(ElSelect)
    app.use(ElOption)
    app.use(ElRow)
    app.use(ElCol)
    app.use(ElDialog)
    app.use(ElDatePicker)

    app.config.globalProperties.$message = ElMessage
    app.config.globalProperties.$prompt = ElMessageBox.prompt
    app.config.globalProperties.$notify = ElNotification
}