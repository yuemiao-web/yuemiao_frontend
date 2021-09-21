import axios from 'axios'
import {ElLoading, ElNotification} from 'element-plus'
import {ILoadingInstance} from "element-plus/es/el-loading/src/loading.type";


const http = axios.create({
    timeout: 30000
})

let loading: ILoadingInstance
http.interceptors.request.use(function(config) {
    loading = ElLoading.service({fullscreen: true})
    return config
}, function(err) {
    loading.close()
    return Promise.reject(err)
})

http.interceptors.response.use(function (res) {
    loading.close()
    const resData = res.data
    if (resData.code !== 200) {
        ElNotification({
            type: 'error',
            message: resData.msg,
            duration: 0
        })
        return Promise.reject(resData.data)
    }
    return resData.data
}, function(err) {
    loading.close()
    return Promise.reject(err)
})

export default http