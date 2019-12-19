import Parse from "./parse.js";
import loader from "../../../../iRobots/loader.js";

var  CITY_CODE = {
	"苏州":"suzhou-639"
}

export default class Loader {
	constructor(city = "苏州", kd = "前端") {
		this.city = city;
		this.kd = kd;
		this.px = "new";
		this.needAddtionalResult = false;
		this.first = false;
	}

	list (pageSize = 1){

		var code = CITY_CODE[this.city];

		let url = encodeURI(`https://m.zhaopin.com/${code}/?keyword=${this.kd}&pageindex=${pageSize}&maprange=3&islocation=0`);
		//console.log(url);
		return loader.getDOM(url,{delay:1000}).then(($)=>{
			return {content:$.html(),url};
		})
	}

	info (jobId){
		let url = `https://m.zhaopin.com/job/${jobId}`;
		return loader.getDOM(url,{delay:300}).then(($)=>{
			return {content:$.html(),url};
		}).catch((e)=>{
			console.log(e,url);
			return {};
		});
	}
}


