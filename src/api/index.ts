import http from './http'

export function queryHospital(params: any) {
    return http.get<any[], any[]>('miao/hospital/', {
        params: params
    })
}

export function queryVacOfHospital(params: any) {
    return http.get<any[], any[]>('miao/hospital/vac/', {
        params: params
    })
}

export function subscribe(params: any) {
    return http.post('miao/hospital/vac/sub/', params)
}

export function timedSub(params: any) {
    return http.post('miao/hospital/vac/timed-sub/', params)
}