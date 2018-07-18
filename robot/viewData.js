import helper from "../../iRobots/helper.js";
import Container from "./Container.js";
import Company from "./model/Company.js";
import { addrToGeo, geoToCityAndDistrict } from "./utils/bdHelper.js";



export default class ViewData {
    constructor(db, table,year,month,types=['基础','框架和库','MVVM','图形','构建服务','数据库']) {
        this.db = db;
        this.year = year;
        this.month = month;
        this.table = table;
        this.types = types;
    }
    async show(){
        await this.average();
        await this.chart();
        await this.tech();
        await this.top();
       
    }
    top(){
        this.getTopRank(50).then(toprank=>{
            
            this.getTechDetailRanks(this.types).then(detailRank=>{

                this.getAvgSarlyRank(50).then(companyRank=>{

                    this.getCountJobRank(50).then(jobRank=>{

                        var year = this.year;
                        var month = this.month;
                        var types = this.types;
                        var time = new Date();
                        //console.log({toprank,detailRank,companyRank,jobRank,types,year,month,time})
                        
                        return this.setTop({toprank,detailRank,companyRank,jobRank,types,year,month,time});
                    });
                });
            });
        }).catch(error=>{
            console.error(error);
            throw error;
        });
    }
    getTopRank(limit=20){
        let year = this.year;
        let month = this.month;
        return new Promise((resolve, reject) => {
            this.getTopRankDb(year,month,limit).then(topRank=>{
                if(!!topRank && topRank.length>0){
                    resolve(topRank);
                }else{
                    if(month ==1){
                        year--;
                        month = 12;
                    }else{
                        month--;
                    }
                    this.getTopRankDb(year,month,limit).then(topRank2=>{
                        if(!!!topRank2 || topRank2.length<=0){
                            topRank2 = [];
                        }
                        resolve(topRank2);
                    }).catch(e=>{
                        reject(e);
                    });
                }
            }).catch(e=>{
                reject(e);
            });
        });
    }
    getTechDetailRanks(types){
        return new Promise((resolve, reject) => {
            let ranks = [];
            if(!!types && types.length>0){
                this.getTechDetailRank(0,types,ranks).then(res=>{
                    resolve(res);
                })
            }else{
                resolve(ranks);
            }
        });
    };
    getTechDetailRank(index,types,ranks){
        return new Promise((resolve, reject) => {
            if(!!types && types.length<=index){
                resolve(ranks);
                return;
            }
            let type = types[index++];
            let year = this.year;
            let month = this.month;
            this.getTopRankDb(year,month,10,type).then(topRank=>{
                if(!!topRank && topRank.length>0){
                    ranks.push(topRank);
                    this.getTechDetailRank(index,types,ranks).then(res=>{
                        resolve(res);
                    });
                }else{
                    let year2 = year;
                    let month2 = month;
                    if(month2 ==1){
                        year2--;
                        month2 = 12;
                    }else{
                        month2--;
                    }
                    this.getTopRankDb(year2,month2,10,type).then(topRank2=>{
                        if(!!!topRank2 || topRank2.length<=0){
                            topRank2 = [];
                        }
                        ranks.push(topRank2);
                        this.getTechDetailRank(index,types,ranks).then(res=>{
                            resolve(res);
                        });
                    }).catch(e=>{
                        reject(e);
                    });
                }
            }).catch(e=>{
                reject(e);
            });
        });
    }
    getTopRankDb(year,month,limit,type) {
        this.db.close();
        var query = {year:year+'',month:month+''};
        if(!!type){
            query.type = type;
        }
        return this.db.open(this.table.tech).then((collection) =>{
            return collection.find(query,{tech:1,type:1,count:1}).sort({count:-1}).skip(0).limit(limit).toArray();
        }).then((data)=> {
            this.db.close();
            return data;
        }).catch((error) => {
            this.db.close();
            console.error(error)
            throw error;
        })
    };
    getAvgSarlyRank(limit) {
        this.db.close();
        var query = {};
        return this.db.open(this.table.job).then((collection) =>{
            return collection.find(query,{company:1,average:1}).sort({average:-1}).skip(0).limit(limit).toArray();
        }).then((data)=> {
            this.db.close();
            let hash = {};
            data = data.reduce((item, next) => {
                hash[next.company] ? '' : hash[next.company] = true && item.push(next);
                return item
            }, []);

            return data;
        }).catch((error)=> {
            this.db.close();
            console.error(error)
            throw error;
        })
    };
    getCountJobRank(limit) {
        this.db.close();
        var query = {};
        return this.db.open(this.table.company).then((collection)=> {
            return collection.find(query,{company:1,count:1}).sort({count:-1}).skip(0).limit(limit).toArray();
        }).then((data)=> {
            this.db.close();
            return data;
        }).catch((error)=> {
            this.db.close();
            console.error(error)
            throw error;
        })
    };
    setTop(top){
        //console.log("xx",top)
        this.db.close();
        return this.db.open(this.table.top).then(() => {
            return this.db.collection.findOne({
                year: this.year,
                month:this.month
            })
        }).then((data) => {
            //console.log(this.year+this.month, data)
            console.log(JSON.stringify(top,null,4))
            if (data) {
                return this.db.collection.update({
                    year: this.year,
                    month:this.month
                }, {
                    $set: top
                })
            } else {
                return this.db.collection.insert(top);
            }
        }).then(() => {
            this.db.close();
            console.log("top success");
            return;
        }).catch((e) => {
            this.db.close()
            console.log(e);
            return;
        })
    }
    average() {
        this.db.close();
        return this.db.open(this.table.job).then(() => {
            return this.db.findToArray({}, { average: 1 })
        }).then((data) => {
            this.db.close()
            var count =0;
            var total = 0;
            data.forEach((i) => {
                if(i.average>0){
                    total += i.average
                    count++
                }
            });
            console.log(total, count)
            var average = total / count;
            return (average.toFixed(2))
        }).then((value) => {

            this.db.close();
            return this.db.open(this.table.board).then(() => {
                return this.db.collection.findOne({
                    year: this.year,
                    month:this.month
                })
            }).then((data) => {
                console.log(this.year+this.month, value)
                if (data) {
                    return this.db.collection.update({
                        year: this.year,
                        month:this.month
                    }, {
                        $set: {
                            average: parseFloat(value),
                            time:new Date(this.year,this.month-1),
                            publish:false
                        }
                    })
                } else {
                    return this.db.collection.insert({
                        year: this.year,
                        month:this.month,
                        average: parseFloat(value),
                        time:new Date(this.year,this.month-1),
                        publish:false
                    })
                }
            })
        }).then(() => {
            this.db.close();
            console.log("average success");
            return;
        }).catch((e) => {
            this.db.close()
            console.log(e);
            return;
        })
    }


    chart() {
        this.db.close();
        return this.db.open(this.table.job).then(() => {
            return this.db.collection.group({
                'salaryRange': true
            }, {
                filter: {
                    $ne: true
                },
                position: {
                    $ne: null
                }
            }, {
                positions: [],
                "count": 0
            }, (doc, prev) => {
                prev.count++;
                var {
                    lat,
                    lng
                } = doc.position;
                prev.positions.push([lng, lat, 1])
            }, true)
        }).then((data) => {
            var obj = {}
            var arr = []
            data.forEach((i) => {
                obj[i.salaryRange] = i.positions
                arr.push({
                    "label": i.salaryRange,
                    "count": i.count
                })
            })

            return {points:obj,salaryRange:arr}
        }).then(({points,salaryRange}) => {
            return this.db.collection.group({
                'eduRange': true
            }, {
                filter: {
                    $ne: true
                }
            }, {

                "count": 0
            }, function(doc, prev) {
                prev.count++;
            }, true).then((data) => {
                var eduRange = []
                data.forEach((i) => {
                    eduRange.push({
                        "label": i.eduRange,
                        "count": i.count
                    })
                })
    
                return {points,salaryRange,eduRange};
            })

        }).then(({points,salaryRange,eduRange}) => {
            return this.db.collection.group({
                'yearRange': true
            }, {
                filter: {
                    $ne: true
                }
            }, {

                "count": 0
            }, function(doc, prev) {
                prev.count++;
            }, true).then((data) => {
                var yearRange = []
                data.forEach((i) => {
                    yearRange.push({
                        "label": i.yearRange,
                        "count": i.count
                    })
                })


                return {points,salaryRange,eduRange,yearRange};
            })
        }).then(({points,salaryRange,eduRange,yearRange}) => {
            return this.db.collection.group({
                'district': true
            }, {
                filter: {
                    $ne: true
                }
            }, {

                "count": 0
            }, function(doc, prev) {
                prev.count++;
            }, true).then((data) => {
                this.db.close()
                var districtRange = []
                data.forEach((i) => {
                    districtRange.push({
                        "label": i.district,
                        "count": i.count
                    })
                })


                return {points,salaryRange,eduRange,yearRange,districtRange};
            })
        }).then(({points,salaryRange,eduRange,yearRange,districtRange})=>{

            this.db.close();
            return this.db.open(this.table.board).then(() => {
                return this.db.collection.findOne({
                    year: this.year,
                    month:this.month
                })
            }).then((data) => {
                console.log(points)
                console.log(salaryRange)
                console.log(eduRange)
                console.log(yearRange)
                console.log(districtRange)
            
                return this.db.collection.update({
                    year: this.year,
                    month:this.month
                }, {
                    $set: {
                        points: points,
                        salaryRange:salaryRange,
                        eduRange:eduRange,
                        yearRange:yearRange,
                        districtRange:districtRange,
                        time:new Date(),
                        publish:false
                    }
                })
                
            })

        }).then(()=>{
            this.db.close();
            console.log("chart success");
            return;
        }).catch((e)=> {
            this.db.close()
            console.log(e)
        })
    }

    topTen(){
         this.db.close();
        
    }

    tech() {
        let techCount ={};
        return this.db.open(this.table.job).then(() => {
            return this.db.collection.find({
                info: {
                    $ne: null
                }
            }, {
                info: 1
            }).toArray()
        }).then((arr)=> {
            console.log(arr.length)
            return helper.iteratorArr(arr, (data) => {
                var content = (data.info).toLowerCase();


                for (let prop in TECH) {
                    if (!techCount[prop]) {
                        techCount[prop] = 0;
                    }

                    var text = prop.toLowerCase();
                    if (content.indexOf(text) > -1) {
                        techCount[prop]++;
                    }
                }
                //console.log(techCount)

                return Promise.resolve(data);
            })
        }).then(() => {
            this.db.close();
            techCount["javascript"] = techCount["javascript"] + techCount["js"] - techCount["json"];
            techCount["ES6+"] = techCount["ECMAScript"] 
            + techCount["ES6"] + techCount["ES7"]+techCount["ES8"]
            + techCount["ES2015"] + techCount["ES2016"]+techCount["ES2017"]+techCount["ES2018"];


            techCount["html"] = techCount["html"] + techCount["H5"];
            techCount["jquery"] = techCount["jq"];
            techCount["angular"] = techCount["ng"] - techCount["mongodb"]
            delete techCount['jq'];
            delete techCount['ng'];
            delete techCount['js'];
            delete techCount['H5'];

            delete techCount["ECMAScript"];
            delete techCount["ES6"];
            delete techCount["ES7"];
            delete techCount["ES8"];
            delete techCount["ES9"];

            delete techCount["ES2015"];
            delete techCount["ES2016"];
            delete techCount["ES2017"];
            delete techCount["ES2018"];

            var arr = [];
            for (let prop in techCount) {

                arr.push({
                    year:this.year,
                    month:this.month,
                    tech: prop,
                    type: TECH[prop],
                    count: techCount[prop]
                });
            }

            return this.db.open(this.table.tech).then(() => {
                return this.db.collection.remove({});
            }).then(() => {
                return this.db.collection.insertMany(arr);
            }).then(() => {
                this.db.close();
                return;
            })
        }).catch((e) => {
            this.db.close();
            console.log(e)
        })
    }

}



const TECH = {
    javascript: "基础",
    html: "基础",
    H5:"基础",
    css: "基础",
    ajax: "基础",
    json: "基础",
    webrtc: "基础",
    websocket: "基础",
    js: "基础",

    WebGL: "图形",
    Flash: "图形",
    canvas: "图形",
    svg: "图形",
    d3: "图形",
    echart: "图形",
    Three: "图形",
    ArcGIS: "图形",
    ChartJS: "图形",
    Highcharts: "图形",
    Flot: "图形",
    AntV:"图形",


    jq: "框架和库",
    jquery: "框架和库",
    zepto: "框架和库",
    prototype: "框架和库",
    handlebars:"框架和库",
    undersorce:"框架和库",
    lodash:"框架和库",

    bootstrap: "框架和库",
    MooTools: "框架和库",
    Dojo: "框架和库",
    YUI: "框架和库",
    Ext: "框架和库",
    Sencha: "框架和库",
    easyui: "框架和库",

    GWT: "MVVM",

    backbone: "MVVM",
    Knockout: "MVVM",
    riotjs:"MVVM",

    PhoneGap: "移动库",
    IONIC: "移动库",

    require: "基础",
    sea: "基础",
    common: "基础",

    react: "MVVM",
    vue: "MVVM",
    ng: "MVVM",
    angular: "MVVM",
    Redux: "MVVM",
    canJS:"MVVM",
    Ractive:"MVVM",

    node: "构建服务",
    npm: "构建服务",
    Express: "构建服务",
    koa: "构建服务",
    Hapi: "构建服务",

    ECMAScript: "基础",
    "ES6+": "基础",
    ES6: "基础",
    ES7: "基础",
    ES8: "基础",
    ES9: "基础",

    ES2015: "基础",
    ES2016: "基础",
    ES2017: "基础",
    ES2018: "基础",

    CoffeeScript: "基础",
    TypeScript: "基础",

    Grunt: "构建服务",
    gulp: "构建服务",
    Bower: "构建服务",
    less: "构建服务",
    sass: "构建服务",
    webpack: "构建服务",
    Yeoman: "构建服务",
    fis: "构建服务",

    mysql: "数据库",
    mongodb: "数据库",
    Oracle: "数据库",
    Redis: "数据库",
    Memcache: "数据库",
    postgresql: "数据库",
    NOSQL: "数据库",

    karma:"测试",
    jasmine:"测试",
    protractor:"测试",
    mock:"测试"
}
