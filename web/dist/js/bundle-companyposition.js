!function e(t,n,a){function i(r,l){if(!n[r]){if(!t[r]){var s="function"==typeof require&&require;if(!l&&s)return s(r,!0);if(o)return o(r,!0);var c=new Error("Cannot find module '"+r+"'");throw c.code="MODULE_NOT_FOUND",c}var u=n[r]={exports:{}};t[r][0].call(u.exports,function(e){var n=t[r][1][e];return i(n||e)},u,u.exports,e,t,n,a)}return n[r].exports}for(var o="function"==typeof require&&require,r=0;r<a.length;r++)i(a[r]);return i}({1:[function(e,t,n){"use strict";function a(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),n=window.location.search.substr(1).match(t);return null!=n?unescape(n[2]):null}function i(){layui.use("form",function(){var e=layui.form,t="";s.position&&s.position.lng&&s.position.lat&&(t=s.position.lng+","+s.position.lat),e.val("searchForm",{companyname:s.company||"",address:s.addr||"",position:t||"",district:s.district||"",city:s.city||"苏州市"}),e.on("submit(search)",function(e){var t=e.field,n="";return n="companyname"==t.searchType?t.companyname:t.address,c&&l(n),!1}),e.on("submit(commit)",function(e){$("#commitData").attr("disabled","true");var t=e.field;if(t.position){var n=t.position.split(","),a=t.city||s.city,i=t.district||s.district;n&&n.length>1?o(n[0],n[1],a,i):(layer.msg("提交数据格式不正确"),$("#commitData").removeAttr("disabled"))}else layer.msg("请先点选一个位置"),$("#commitData").removeAttr("disabled");return!1}),e.render()})}function o(e,t,n,a){var i=layer.load(2);$.ajax({url:"/manage/updateCompanyPosition",type:"post",data:{_id:s._id,lat:t,lng:e,city:n,district:a}}).done(function(e){if(layer.close(i),!!e&!!e.n&&e.n>0){layer.msg("坐标数据已提交");try{parent.layer.close(parent.layer.getFrameIndex(window.name)),parent.layui.table.reload("compnayList")}catch(e){}}else layer.msg("提交数据执行失败，原因：未匹配的记录");$("#commitData").removeAttr("disabled")}).fail(function(e){layer.close(i),console.error(e),layer.msg("数据提交失败"),$("#commitData").removeAttr("disabled")})}function r(){function e(e){$("input[name=position]").val(e.point.lng+","+e.point.lat)}c=new BMap.Map("allmap"),c.centerAndZoom(new BMap.Point(120.621233,31.335415),13);var t=new BMap.NavigationControl;c.addControl(t),c.setCurrentCity("苏州"),c.enableScrollWheelZoom(!0),c.setDefaultCursor("auto"),c.addEventListener("click",e)}function l(e){if(s&&s.position){var t=new BMap.Icon("/images/markers.png",new BMap.Size(23,25),{offset:new BMap.Size(10,25),imageOffset:new BMap.Size(0,-250)}),n=new BMap.Marker(new BMap.Point(s.position.lng,s.position.lat),{icon:t});c.addOverlay(n),n.setAnimation(BMAP_ANIMATION_BOUNCE)}var a=layer.load(2),i=new BMap.LocalSearch(c,{renderOptions:{map:c},onSearchComplete:function(e){layer.close(a),i.getStatus()==BMAP_STATUS_SUCCESS&&e&&e.getCurrentNumPois()&&e.getCurrentNumPois()>0?layer.msg("加载完成！",{time:1e3,offset:"50%"}):layer.msg("在苏州市没有找到相关的地点。")}});i.search(e)}var s={},c=null;$(function(){var e=a("_id");e?$.ajax({url:"/manage/getcompanyById?_id="+e,type:"get",data:{}}).done(function(e){s=e,i(),setTimeout(function(){$(".btn-search").click()},500)}).fail(function(e){console.error("数据查询超时")}):i(),r()})},{}]},{},[1]);