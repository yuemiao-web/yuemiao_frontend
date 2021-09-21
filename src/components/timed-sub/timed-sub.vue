<template>
  <el-dialog width="40%"
             :model-value="visible"
             @update:visible="val => $emit('update:visible', val)"
             title="定时预约配置"
  >
    <el-form ref="form"
             label-width="100px"
             :model="formData"
             :rules="{
               datetime: [{required: true, message: '请选择执行时间!', trigger: 'change'}]
             }"
    >
      <el-form-item label="执行时间" prop="datetime">
        <el-date-picker v-model="formData.datetime"
                        type="datetime"
                        @change="handleTimeChange"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.stop="handleTimedSub">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from 'vue'

export default defineComponent({
  name: "timed-sub",
  emits: ['update:visible', 'on-timesub'],
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  setup(props, context) {
    const formData = ref({
      datetime: ''
    })
    const form = ref<any>(null)
    let cronInfo: any = {}

    function handleTimedSub() {
      form.value?.validate().then(() => {
        context.emit('on-timesub', cronInfo)
      })
    }
    function handleTimeChange() {
      const date = new Date(formData.value.datetime)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const min = date.getMinutes()
      const sec = date.getSeconds()

      cronInfo.year = year
      cronInfo.month = month
      cronInfo.day = day
      cronInfo.hour = hour
      cronInfo.min = min
      cronInfo.sec = sec
    }

    return {
      form,
      formData,
      handleTimedSub,
      handleTimeChange
    }
  }
})
</script>

<style scoped>

</style>