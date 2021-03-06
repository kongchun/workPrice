import Database from "../../iRobots/db.js";
import Table from "./model/table.js";

import Main from "./main.js";

import FiveOneJob from "./source/51job/config.js";
import Baidu from "./source/baidu/config.js";
import ZhaoPin from "./source/zhaopin/config.js";
import ZhiPin from "./source/zhipin/config.js";
import Lagou from "./source/lagou/config.js";
//tobeDel
import Jobui from "./source/jobui/config.js"; //主要还是拉钩问题

var db = Database("127.0.0.1", "kongchun");
var table = new Table({});


const city = "苏州";
const kd = "前端";
const year = "2020";
const month = "11";

var main = new Main(db,table,year,month);

main.addConfig(new FiveOneJob(1,city,kd)); //51Job  5
// main.addConfig(new Baidu(3,city,kd)); //baidu  5
// main.addConfig(new Lagou(2,city,kd)); //lagou  1
// main.addConfig(new ZhiPin(2,city,kd)); //ZhiPin  1
// main.addConfig(new ZhaoPin(1,city,kd)); //ZhaoPin  1

main.robotData();
//main.analyseCompany();
//main.statistic();
