!function l(o,r,s){function d(e,t){if(!r[e]){if(!o[e]){var a="function"==typeof require&&require;if(!t&&a)return a(e,!0);if(c)return c(e,!0);var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}var n=r[e]={exports:{}};o[e][0].call(n.exports,function(t){return d(o[e][1][t]||t)},n,n.exports,l,o,r,s)}return r[e].exports}for(var c="function"==typeof require&&require,t=0;t<s.length;t++)d(s[t]);return d}({1:[function(t,e,a){"use strict";function i(){var t=$("input[name=companyName]").val().trim();layui.table.reload("compnayList",{where:{company:t},page:{curr:1}})}$(function(){layui.use(["table"],function(){var n=layui.table,l=layui.jquery;n.render({elem:"#compnayList",url:"/manage/listcompany",id:"compnayList",cols:[[{type:"checkbox"},{field:"_id",width:80,title:"",sort:!1,templet:function(t){return t.LAY_INDEX}},{field:"logo",width:180,title:"图标",templet:function(t){var e='<button type="button" class="layui-btn layui-btn-sm layui-btn-radius btn-logo-upload"><i class="layui-icon">&#xe67c;</i>上传</button><input type="file" class="input-logo-upload" cpnid='+t._id+' style="display:none">';return t.logo?e+'<img src="'+t.logo+'">':e+"<img>"}},{field:"logoText",width:250,edit:"text",title:"图标URL"},{field:"company",width:250,edit:"text",title:"公司"},{field:"alias",width:150,title:"別名",sort:!1,edit:"text"},{field:"realAlias",width:150,title:"真实別名",edit:"text",sort:!1},{field:"addr",title:"地址",edit:"text",minWidth:250},{field:"city",width:80,title:"城市",sort:!1},{field:"district",width:90,title:"区域"},{field:"salary",width:90,title:"平均薪酬",edit:"text"},{field:"score",width:90,title:"评分",edit:"text"},{field:"description",width:90,title:"介绍",edit:"text"},{field:"bdStatus",width:92,title:"审核状态",templet:function(t){return t.bdStatus&&99==t.bdStatus?'<span class="layui-badge-rim" style="padding: 1px 5px 20px;">手动审核</span>':t.bdStatus&&77==t.bdStatus?'<span class="layui-badge-rim" style="padding: 1px 5px 20px;">回收站</span>':t.bdStatus&&3==t.bdStatus?'<span class="layui-badge-rim" style="padding: 1px 5px 20px;">地图识别</span>':t.bdStatus&&2==t.bdStatus?'<span class="layui-badge-rim" style="padding: 1px 5px 20px;">库识别</span>':t.bdStatus&&1==t.bdStatus?'<span class="layui-badge-rim" style="padding: 1px 5px 20px;">自动识别</span>':(t.bdStatus,'<span class="layui-badge-rim" style="padding: 1px 5px 20px;">未识别</span>')}},{fixed:"right",width:120,align:"center",toolbar:"#barCompany"}]],page:!0,done:r,parseData:function(t){return t.data=t.data.map(function(t){return Object.assign({logoText:t.logo},t)}),t}}),n.on("tool(company)",function(t){var a=t.data,e=t.event;if("detail"===e)layer.msg("查看暂不支持");else if("del"===e)layer.confirm("删除数据："+(a.alias||a.company)+"？",function(t){var e=layer.load(2);l.ajax({url:"/manage/deleteCompanyById",type:"post",data:{_id:a._id}}).done(function(t){if(layer.close(e),!!t&!!t.n&&0<t.n){layer.msg("删除成功！");try{layui.table.reload("compnayList")}catch(t){}}else layer.msg("删除失败，原因：未匹配的记录");l("#commitData").removeAttr("disabled")}).fail(function(t){layer.close(e),console.error(t),layer.msg("删除失败"),l("#commitData").removeAttr("disabled")})});else if("edit"===e)layer.msg("编辑操作");else if("position"===e){var i=layer.open({type:2,title:a.company+"-位置",maxmin:!1,offset:"100px",area:[l(window).width()+"px",l(window).height()+"px"],content:"/manage/pagecompanyposition?_id="+a._id});layer.full(i)}}),n.on("edit(company)",function(e){var a="logoText"===e.field?"logo":e.field,i=e.value;l.post("/manage/updateCompanyInfo",{id:e.data._id,field:a,value:i},function(t){!!t&!!t.n&&0<t.n?(layer.msg("更新成功"),"logo"===a&&l(e.tr[0]).find("[data-field=logo]").find("img").attr("src",i)):0===t.n?layer.msg("更新未执行"):layer.msg("更新执行失败")}).fail(function(t){console.error(t),layer.msg("更新失败，网络错误")})});var e={setDelStatus:function(){var t=n.checkStatus("compnayList").data;if(!t||t.length<=0)layer.alert("请选择至少一条记录");else if(!o){o=!0;for(var e=t[0]._id,a=1;a<t.length;a++)e+=","+t[a]._id;var i=layer.load(2);l.ajax({url:"/manage/updateCompanyStatus",type:"post",data:{_ids:e,bdStatus:77}}).done(function(t){if(layer.close(i),!!t&!!t.n&&0<t.n){layer.msg("数据已提交");try{n.reload("compnayList")}catch(t){}}else layer.msg("提交数据执行失败，原因：未匹配的记录");o=!1}).fail(function(t){layer.close(i),console.error(t),layer.msg("操作失败"),o=!1})}}};l(".layui-form .layui-btn").on("click",function(){var t=l(this).data("type");e[t]&&e[t].call(this)})}),$("#searchBtn").on("click",function(){var t=$("select[name=positionStatus]").val();layui.table.reload("compnayList",{where:{positionConfirm:t},page:{curr:1}})}),$("#searchBtnName").click(i),$("input[name=companyName]").on("keydown",function(t){"Enter"===t.key&&i()})});var o=!1;function r(){$(".btn-logo-upload").click(function(){$(this).next().click()}),$(".input-logo-upload").change(function(){var a=$(this),t=a[0].files[0],i=new FileReader;i.onload=function(){var e=i.result;$.post("/manage/updateCompanyInfo",{id:a.attr("cpnid"),field:"logo",value:e},function(t){!!t&!!t.n&&0<t.n?(layer.msg("更新成功"),a.next()[0].src=e,a.parent().parent().next().children().text(e)):0===t.n?layer.msg("更新未执行"):layer.msg("更新执行失败")}).fail(function(t){console.error(t),layer.msg("更新失败，网络错误")})},i.readAsDataURL(t)})}},{}]},{},[1]);