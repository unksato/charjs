[![CircleCI](https://circleci.com/gh/unksato/charjs.svg?style=svg)](https://circleci.com/gh/unksato/charjs)
[![Coverage Status](https://coveralls.io/repos/github/unksato/charjs/badge.svg?branch=feature_unit_test)](https://coveralls.io/github/unksato/charjs?branch=feature_unit_test)

# Sample

[![Join the chat at https://gitter.im/unksato/charjs](https://badges.gitter.im/unksato/charjs.svg)](https://gitter.im/unksato/charjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
https://unksato.github.io/charjs/

# How to use

Add the following code to your bookmark

## Super Mario
- for non CSP setting site
```javascript
javascript:(function(){var s=document.createElement("script");s.charset="UTF-8";s.src="https://unksato.github.io/charjs/bookmarklet/mario.min.js";document.body.appendChild(s)})(); 
```
- for all site (include v0.0.1 code)
```javascript
javascript:(function(t){function n(c,b,k,g){var a=document.createElement("canvas"),f=a.getContext("2d"),e=16*k;a.setAttribute("width",e.toString());a.setAttribute("height",e.toString());a.style.cssText="z-index: 999; position: fixed; bottom: 0;";for(e=0;e<c.length;e++){g&&c[e].reverse();for(var d=0;d<c[e].length;d++)0!=c[e][d]&&(f.beginPath(),f.rect(d*k,e*k,k,k),f.fillStyle=b[c[e][d]],f.fill());g&&c[e].reverse()}return a}var p=[],q=[],m=0,r=0,g=null,f=0,d=t||2,l=0,h=!1,a=!1;document.addEventListener("keypress",
function(c){32==c.keyCode&&0==a&&(a=!0,l=23)});document.addEventListener("touchstart",function(){0==a&&(a=!0,l=23)});(function(){for(var c=["#000000","#dc2900","#fea53b","#8b7300"],b=[[[0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],[0,0,0,0,3,3,3,2,2,3,2,0,0,0,0,0],[0,0,0,3,2,3,2,2,2,3,2,2,2,0,0,0],[0,0,0,3,2,3,3,2,2,2,3,2,2,2,0,0],[0,0,0,3,3,2,2,2,2,3,3,3,3,0,0,0],[0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0],[0,0,3,3,3,3,1,1,3,3,0,0,0,0,0,0],[2,2,3,3,3,3,1,1,1,3,3,3,2,2,2,0],[2,2,2,0,3,
3,1,2,1,1,1,3,3,2,2,0],[2,2,0,0,1,1,1,1,1,1,1,0,0,3,0,0],[0,0,0,1,1,1,1,1,1,1,1,1,3,3,0,0],[0,0,1,1,1,1,1,1,1,1,1,1,3,3,0,0],[0,3,3,1,1,1,0,0,0,1,1,1,3,3,0,0],[0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],[0,0,0,0,3,3,3,2,2,3,2,0,0,0,0,0],[0,0,0,3,2,3,2,2,2,3,2,2,2,0,0,0],[0,0,0,3,2,3,3,2,2,2,3,2,2,2,0,0],[0,0,0,3,3,2,2,2,2,3,3,3,3,0,0,0],[0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0],[0,0,0,0,3,3,1,3,3,3,0,0,0,0,0,0],
[0,0,0,3,3,3,3,1,1,3,3,0,0,0,0,0],[0,0,0,3,3,3,1,1,2,1,1,2,0,0,0,0],[0,0,0,3,3,3,3,1,1,1,1,1,0,0,0,0],[0,0,0,1,3,3,2,2,2,1,1,1,0,0,0,0],[0,0,0,0,1,3,2,2,1,1,1,0,0,0,0,0],[0,0,0,0,1,1,1,3,3,3,3,0,0,0,0,0],[0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0],[0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],[0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],[0,0,0,0,3,3,3,2,2,3,2,0,0,0,0,0],[0,0,0,3,2,3,2,2,2,3,2,2,2,0,0,0],[0,0,0,3,2,3,3,2,2,2,3,2,2,2,0,0],[0,0,0,3,3,2,2,2,2,3,3,
3,3,0,0,0],[0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0],[0,0,0,0,3,3,3,3,1,3,0,2,0,0,0,0],[0,0,0,2,3,3,3,3,3,3,2,2,2,0,0,0],[0,0,2,2,1,3,3,3,3,3,2,2,0,0,0,0],[0,0,3,3,1,1,1,1,1,1,1,0,0,0,0,0],[0,0,3,1,1,1,1,1,1,1,1,0,0,0,0,0],[0,3,3,1,1,1,0,1,1,1,0,0,0,0,0,0],[0,3,0,0,0,0,3,3,3,0,0,0,0,0,0,0],[0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0]],[[0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2],[0,0,0,0,0,0,1,1,1,1,1,0,0,2,2,2],[0,0,0,0,0,1,1,1,1,1,1,1,1,1,2,2],[0,0,0,0,0,3,3,3,2,2,3,2,0,3,3,3],[0,0,0,0,3,2,3,2,2,2,3,2,2,2,3,3],[0,0,0,0,3,2,
3,3,2,2,2,3,2,2,2,0],[0,0,0,0,3,3,2,2,2,2,3,3,3,3,3,0],[0,0,0,0,0,0,2,2,2,2,2,2,2,3,0,0],[0,0,3,3,3,3,3,1,3,3,3,1,3,0,0,0],[0,3,3,3,3,3,3,3,1,3,3,3,1,0,0,3],[2,2,3,3,3,3,3,3,1,3,3,3,1,0,0,3],[2,2,2,0,1,1,3,1,1,2,1,1,2,1,3,3],[0,2,0,3,1,1,1,1,1,1,1,1,1,1,3,3],[0,3,3,3,1,1,1,1,1,1,1,1,1,1,3,3],[0,3,3,3,1,1,1,1,1,1,1,0,0,0,0,0],[0,3,0,0,0,1,1,1,0,0,0,0,0,0,0,0]]],a=0;a<b.length;a++)p.push(n(b[a],c,d,!1)),q.push(n(b[a],c,d,!0))})();setInterval(function(){var c=document.body;null!=g&&(c.removeChild(g),
g=null);var b;if(a)b=3;else switch(m){case 0:b=1;break;case 1:b=0==r?2:0;break;default:b=0}r=m;m=b;g=h?q[b]:p[b];g.style.left=f+"px";a&&(l-=4,b=l*d,0>=b&&(a=!1,l=0),g.style.bottom=b+"px");c.appendChild(g);f>window.innerWidth-16*d&&0==h&&(h=!0);0>f&&1==h&&(h=!1);f=h?f-2*d:f+2*d},50)})();
```

## Super Mario World
- for non CSP setting site
```javascript
javascript:(function(){var s=document.createElement("script");s.charset="UTF-8";s.src="https://unksato.github.io/charjs/bookmarklet/mario_world.min.js";document.body.appendChild(s)})(); 
```
- for all site (include v0.0.1 code)
```javascript
javascript:(function(r){function m(b,g,c,f){var a=document.createElement("canvas"),e=a.getContext("2d"),d=20*c;a.setAttribute("width",(16*c).toString());a.setAttribute("height",d.toString());a.style.cssText="z-index: 999; position: fixed; bottom: 0;";for(d=0;d<b.length;d++){f&&b[d].reverse();for(var h=0;h<b[d].length;h++)0!=b[d][h]&&(e.beginPath(),e.rect(h*c,d*c,c,c),e.fillStyle=g[b[d][h]],e.fill());f&&b[d].reverse()}return a}var n=[],p=[],q=0,g=null,f=0,e=r||2,a=!1,k=!1,l=1;document.addEventListener("keypress", function(b){32==b.keyCode&&0==k&&(k=!0,yVector=jump)});document.addEventListener("touchstart",function(){0==k&&(k=!0,yVector=jump)});(function(){for(var b=" #000000 #ffffff #520000 #8c5a18 #21318c #ff4273 #b52963 #ffde73 #dea539 #ffd6c6 #ff736b #84dece #42849c".split(" "),a=[[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0],[0,0,0,0,0,3,3,6,6,6,8,6,3,0,0,0],[0,0,0,0,3,6,6,7,7,9,8,2,3,0,0,0],[0,0,0,3,7,6,7,7,1,1,1,1,1,1,0,0],[0,0,3,7,7,7,1,1,1,1,1,1,1,1,1,0],[0,0,3,10,1,1,1,11,1, 11,1,11,0,0,0,0],[0,3,10,4,10,1,11,10,1,10,1,10,4,4,0,0],[0,3,11,4,10,1,1,10,10,10,10,10,10,10,4,0],[0,3,1,11,10,1,10,10,1,11,11,11,11,11,4,0],[0,0,1,1,11,11,10,1,1,1,1,1,1,1,0,0],[0,0,0,1,4,4,11,11,11,1,1,1,1,0,0,0],[0,0,0,0,3,7,4,4,4,4,5,0,0,0,0,0],[0,0,0,3,7,7,6,13,13,12,12,5,0,0,0,0],[0,0,0,3,4,4,4,13,2,2,12,2,5,0,0,0],[0,0,0,4,2,2,2,4,2,2,12,2,5,0,0,0],[0,0,0,4,2,2,4,13,13,13,12,12,5,0,0,0],[0,0,0,4,2,2,4,13,13,5,13,5,0,0,0,0],[0,0,0,0,4,4,4,4,1,4,1,0,0,0,0,0],[0,0,0,0,1,4,4,4,8,1,8,1,0,0,0, 0]],[[0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0],[0,0,0,0,0,3,3,6,6,6,8,6,3,0,0,0],[0,0,0,0,3,6,6,7,7,9,8,2,3,0,0,0],[0,0,0,3,7,6,7,7,1,1,1,1,1,1,0,0],[0,0,3,7,7,7,1,1,1,1,1,1,1,1,1,0],[0,0,3,10,1,1,1,11,1,11,1,11,0,0,0,0],[0,3,10,4,10,1,11,10,1,10,1,10,4,4,0,0],[0,3,11,4,10,1,1,10,10,10,10,10,10,10,4,0],[0,3,1,11,10,1,10,10,1,11,11,11,11,11,4,0],[0,0,1,1,11,11,10,1,1,1,1,1,1,1,0,0],[0,0,0,1,4,4,11,11,11,1,1,1,1,0,0,0],[0,0,0,4,7,7,7,4,4,4,5,0,0,0,0,0],[0,0,0,4,4,4,4,13,13,12,12,5,0,0,0,0],[0,0,1,4,2,2,2,4, 2,2,12,2,5,1,1,0],[0,1,3,4,2,2,4,4,2,2,12,2,1,8,1,1],[0,1,3,4,2,2,4,13,13,13,12,5,1,4,1,1],[0,1,3,1,4,4,13,13,13,13,5,1,4,1,1,0],[0,1,3,8,1,0,5,5,5,5,0,1,4,1,1,0],[0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0]]],c=0;c<a.length;c++)n.push(m(a[c],b,e,!1)),p.push(m(a[c],b,e,!0))})();setInterval(function(){var b=document.body;null!=g&&(b.removeChild(g),g=null);if(1>l)l++;else{l=0;switch(q){case 0:next=1;break;case 1:next=0;break;default:next=0}q=next}g=a?p[next]:n[next];g.style.left=f+"px";b.appendChild(g);f>window.innerWidth- 16*e&&0==a&&(a=!0);0>f&&1==a&&(a=!1);f=a?f-2*e:f+2*e},50)})();
```

