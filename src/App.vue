<template>
  <div class="w-2/3 mx-auto">
    <el-form ref="form" :model="formData" label-width="100px" :rules="formRule">
      <el-row>
        <el-col :span="12">
          <el-divider content-position="left">查询疫苗</el-divider>
          <el-form-item label="sessionId" prop="sessionId">
            <el-input v-model="formData.sessionId" placeholder="ASP.NET_SessionId=xxxxxxxxxxxx"></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="cityCode">
            <el-cascader
                placeholder="请选择查询城市"
                class="w-full"
                ref="cityCascader"
                v-model="formData.cityCode"
                filterable :options="citys"
                :props="{value: 'adcode', label: 'name', checkStrictly: true, emitPath: false}"
                @change="handleSelectCity"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="疫苗" prop="vacTypeId">
            <el-cascader
                placeholder="请选择要查询的疫苗类型"
                class="w-full"
                v-model="formData.vacTypeId"
                filterable :options="vacList"
                :props="{value: 'id', label: 'name', emitPath: false}"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.stop="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item label="疫苗信息" prop="vacId">
            <el-cascader
                placeholder="请选择要预约的疫苗"
                v-model="formData.vacId"
                ref="selectVac"
                :options="hosOptions"
                :props="hosProps"
                @change="handleSelectVac"
                class="w-full"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="针次" prop="ftime">
            <el-select placeholder="请选择接种针次" v-model="formData.ftime" class="w-full">
              <el-option v-for="i in ftimeNum" :key="i" :label="`第${i}针`" :value="i"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-divider content-position="left">个人信息</el-divider>
          <el-form-item label="姓名" prop="cname">
            <el-input placeholder="请输入姓名" v-model="formData.cname"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model.number="formData.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker placeholder="请选择生日" v-model="formData.birthday"></el-date-picker>
          </el-form-item>
          <el-form-item label="手机号" prop="tel">
            <el-input placeholder="请输入手机号" v-model="formData.tel"></el-input>
          </el-form-item>
          <el-form-item label="证件信息" prop="idcard">
            <el-radio v-model="formData.doctype" :label="1">身份证</el-radio>
            <br/>
            <el-input placeholder="请输入证件号" v-model="formData.idcard"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="text-right">
        <el-button icon="el-icon-time" @click.stop="handleShowTimeSub">定时预约</el-button>
        <el-button type="primary" @click.stop="handleSub">预约</el-button>
      </el-form-item>
    </el-form>
    <timed-sub v-model="timedSubVisible" @on-timesub="handleTimedSub"></timed-sub>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, getCurrentInstance, nextTick} from 'vue'
import citys from './assets/citys.json'
import vacList from './assets/product.json'
import {queryHospital, queryVacOfHospital, subscribe, timedSub} from './api'
import TimedSub from '@/components/timed-sub/timed-sub.vue'
import {dateFormat} from "./assets/js/utils"

export default defineComponent({
  name: 'App',
  components: {TimedSub},
  setup() {
    const instance = getCurrentInstance()
    const directlyUnder = ['北京市', '天津市', '上海市', '重庆市']
    const formData = reactive({
      cname: '',
      sex: 1,
      tel: '',
      birthday: '',
      doctype: 1,
      idcard: '',
      sessionId: '',
      cityCode: '',
      city: '',
      vacTypeId: '',
      hosId: '',
      vacId: '',
      vacName: '',
      ftime: ''
    })
    const queryVacRule = {
      sessionId: [{required: true, message: '请输入sessionId!'}],
      cityCode: [{required: true, message: '请选择查询城市!'}],
      vacTypeId: [{required: true, message: '请选择要查询的疫苗类型!'}]
    }
    const subRule = {
      vacId: [{required: true, message: '请选择要预约的疫苗!'}],
      ftime: [{required: true, message: '请选择接种针次!'}],
      cname: [{required: true, message: '请输入姓名!'}],
      birthday: [{required: true, message: '请选择生日!'}],
      tel: [
        {required: true, message: '请输入手机号!'},
        {
          pattern: /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/,
          message: '请输入有效的手机号!',
          trigger: 'blur'
        }
      ],
      idcard: [
        {required: true, message: '请输入身份证号!'},
        {
          pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
          message: '请输入有效身份证号!',
          trigger: 'blur'
        }
      ]
    }
    const formRule = ref<any>({})
    const form = ref<any>(null)

    const cityCascader = ref<any>(null)

    function handleSelectCity() {
      const nodes = cityCascader.value.getCheckedNodes()
      const node = nodes[0]
      formData.city = node.pathLabels
      let list = node.pathLabels

      if (node.data.level === 'province' && !directlyUnder.includes(node.label)) {
        list.push('')
        list.push('')
      } else if (node.data.level !== 'province' && node.data.level !== 'district') {
        list.push('')
      }
      if (node.data.level === 'province' && directlyUnder.includes(node.label)) {
        list.push(node.label)
        list.push('')
      }
      if (node.data.level === 'district' && directlyUnder.includes(node.pathLabels[0])) {
        list = [node.pathLabels[0], node.pathLabels[0], node.label]
      }
      formData.city = JSON.stringify(list)
    }

    const hosOptions = ref<any[]>([])
    const hosProps = {
      emitPath: false,
      lazy: true,
      async lazyLoad(node: any, resolve: Function) {
        if (node.root) {
          resolve()
          return
        }
        formData.hosId = node.value
        try {
          const dataList = await queryVacOfHospital({hosId: node.value, sessionId: formData.sessionId})
          const data = dataList.map(item => ({
            value: item.id,
            label: item.text,
            vacNum: item.NumbersVaccine.length,
            leaf: true
          }))
          resolve(data)
        } catch (e) {
          resolve([])
        }
      }
    }

    function handleSearch() {
      formRule.value = queryVacRule

      nextTick(async () => {
        await form.value.validate()

        const dataList = await queryHospital({
          sessionId: formData.sessionId,
          cityCode: formData.cityCode,
          city: formData.city,
          vacTypeId: formData.vacTypeId
        })

        hosOptions.value = []
        dataList.forEach(item => {
          hosOptions.value.push({
            value: item.id,
            label: item.cname,
            tags: item.tags
          })
        })
      })
    }

    const selectVac = ref<any>(null)
    const ftimeNum = ref(0)

    function handleSelectVac() {
      const node = selectVac.value.getCheckedNodes()[0]
      formData.vacName = node.data.label
      ftimeNum.value = node.data.vacNum
    }

    function handleSub() {
      formRule.value = Object.assign({}, queryVacRule, subRule)
      nextTick(async () => {
        await form.value.validate()

        await subscribe({
          cname: formData.cname,
          sex: formData.sex,
          tel: formData.tel,
          birthday: dateFormat('yyyy-MM-dd', new Date(formData.birthday)),
          doctype: formData.doctype,
          idcard: formData.idcard,
          sessionId: formData.sessionId,
          hosId: formData.hosId,
          vacId: formData.vacId,
          vacName: formData.vacName,
          ftime: formData.ftime
        })
        instance?.proxy?.$notify.success({
          title: '提示',
          message: '预约成功!',
          duration: 0
        })
      })
    }

    const timedSubVisible = ref(false)

    function handleShowTimeSub() {
      form.value?.validate().then(() => {
        timedSubVisible.value = true
      })
    }

    async function handleTimedSub(cronInfo: any) {
      await timedSub({
        subInfo: {
          cname: formData.cname,
          sex: formData.sex,
          tel: formData.tel,
          birthday: dateFormat('yyyy-MM-dd', new Date(formData.birthday)),
          doctype: formData.doctype,
          idcard: formData.idcard,
          sessionId: formData.sessionId,
          hosId: formData.hosId,
          vacId: formData.vacId,
          vacName: formData.vacName,
          ftime: formData.ftime
        },
        cronInfo: cronInfo
      })
      instance?.proxy?.$notify.success({
        title: '提示',
        message: '设置定时预约成功!',
        duration: 0
      })
      timedSubVisible.value = false
    }

    return {
      formRule,
      form,
      timedSubVisible,
      ftimeNum,
      selectVac,
      hosProps,
      hosOptions,
      vacList,
      cityCascader,
      formData,
      citys,
      handleSelectCity,
      handleSelectVac,
      handleSearch,
      handleSub,
      handleShowTimeSub,
      handleTimedSub
    }
  }
})
</script>
