!function i(u,f,c){function p(r,e){if(!f[r]){if(!u[r]){var n="function"==typeof require&&require;if(!e&&n)return n(r,!0);if(l)return l(r,!0);var t=new Error("Cannot find module '"+r+"'");throw t.code="MODULE_NOT_FOUND",t}var o=f[r]={exports:{}};u[r][0].call(o.exports,function(e){return p(u[r][1][e]||e)},o,o.exports,i,u,f,c)}return f[r].exports}for(var l="function"==typeof require&&require,e=0;e<c.length;e++)p(c[e]);return p}({1:[function(e,r,n){"use strict";$(function(){ejs.render('<%= people.join(", "); %>',{people:["geddy","neil","alex"]})})},{}]},{},[1]);