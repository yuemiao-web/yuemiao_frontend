const fs = require('fs')


var provinceMap = {}
districtList.forEach(districtItem => {
    let city = districtItem.parent

    if (districtItem.level === 'province') {
        delete districtItem.parent
        if (!provinceMap[districtItem.name]) {
            provinceMap[districtItem.name] = districtItem
        }
    } else if (city.level === 'province') {
        let province = city
        city = districtItem
        delete city.parent
        delete province.parent
        if (!provinceMap[province.name]){
            provinceMap[province.name] = province
        } else {
            province = provinceMap[province.name]
        }

        citys = province.children = province.children ? province.children : []
        delete districtItem.parent
        c = citys.find(c => c.name === city.name)
        if (!c) {
            citys.push(city)
        }
    } else {
        let province = city.parent
        delete province.parent
        if (!provinceMap[province.name]) {
            provinceMap[province.name] = province
        } else {
            province = provinceMap[province.name]
        }

        province.children = province.children ? province.children : []
        delete city.parent
        c = province.children.find(c => c.name === city.name)
        if (!c) {
            province.children.push(city)
        } else {
            city = c
        }

        city.children = city.children ? city.children : []
        delete districtItem.parent
        d = city.children.find(d => d.name === districtItem.name)
        if (!d) {
            city.children.push(districtItem)
        }
    }
})

fs.writeFile('./citys.json', JSON.stringify(Object.values(provinceMap)), function(msg) {
    console.log(msg)
})