!function o(i,l,s){function c(t,e){if(!l[t]){if(!i[t]){var a="function"==typeof require&&require;if(!e&&a)return a(t,!0);if(u)return u(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var r=l[t]={exports:{}};i[t][0].call(r.exports,function(e){return c(i[t][1][e]||e)},r,r.exports,o,i,l,s)}return l[t].exports}for(var u="function"==typeof require&&require,e=0;e<s.length;e++)c(s[e]);return c}({1:[function(e,t,a){"use strict";var u={},i=null;$(function(){var e,t,a=(e=new RegExp("(^|&)"+"_id"+"=([^&]*)(&|$)","i"),null!=(t=window.location.search.substr(1).match(e))?unescape(t[2]):null);$.ajax({url:"/manage/getcompanyById?_id="+a,type:"get",data:{}}).done(function(e){u=e,layui.use("form",function(){var e=layui.form,t="";u.position&&u.position.lng&&u.position.lat&&(t=u.position.lng+","+u.position.lat),e.val("searchForm",{companyname:u.company||"",address:u.addr||"",position:t||"",district:u.district||"",city:u.city||"苏州市"}),e.on("submit(search)",function(e){var t,a,n,r=e.field,o="";return o="companyname"==r.searchType?r.companyname:r.address,i&&(t=o,a=layer.load(2),(n=new BMap.LocalSearch(i,{renderOptions:{map:i},onSearchComplete:function(e){layer.close(a),n.getStatus()==BMAP_STATUS_SUCCESS&&e&&e.getCurrentNumPois()&&0<e.getCurrentNumPois()?layer.msg("加载完成！",{time:1e3,offset:"50%"}):layer.msg("在苏州市没有找到相关的地点。")}})).search(t)),!1}),e.on("submit(commit)",function(e){$("#commitData").attr("disabled","true");var t,a,n,r,o,i=e.field;if(i.position){var l=i.position.split(","),s=i.city||u.city,c=i.district||u.district;l&&1<l.length?(t=l[0],a=l[1],n=s,r=c,o=layer.load(2),$.ajax({url:"/manage/updateCompanyPosition",type:"post",data:{_id:u._id,lat:a,lng:t,city:n,district:r}}).done(function(e){if(layer.close(o),!!e&!!e.n&&0<e.n){layer.msg("坐标数据已提交");try{parent.layer.close(parent.layer.getFrameIndex(window.name)),parent.layui.table.reload("compnayList")}catch(e){}}else layer.msg("提交数据执行失败，原因：未匹配的记录");$("#commitData").removeAttr("disabled")}).fail(function(e){layer.close(o),console.error(e),layer.msg("数据提交失败"),$("#commitData").removeAttr("disabled")})):(layer.msg("提交数据格式不正确"),$("#commitData").removeAttr("disabled"))}else layer.msg("请先点选一个位置"),$("#commitData").removeAttr("disabled");return!1}),e.render()})}).fail(function(e){console.error("数据查询超时")}),function(){(i=new BMap.Map("allmap")).centerAndZoom(new BMap.Point(120.621233,31.335415),13);var e=new BMap.NavigationControl;i.addControl(e),i.setCurrentCity("苏州"),i.enableScrollWheelZoom(!0),i.setDefaultCursor("auto"),i.addEventListener("click",function(e){$("input[name=position]").val(e.point.lng+","+e.point.lat)})}()})},{}]},{},[1]);