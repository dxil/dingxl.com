# 前端模板的演变

### 1、 直接操作dom

页面的构建，总是离不开对dom的直接操作

```javascript
var div = document.createElement('div')
var p = document.createElement('p')
p.innerText = 'Hello World'
div.appendChild(p)
document.body.appendChild(div)
```

缺点：

1. 频繁对dom进行访问/操作，性能变差
2. 每次的更改比较麻烦



### 2、Micro-Templating

为了解决这种麻烦的操作方式，jQuery的作者 [John Resig] 写了一个小型的[Micro-Templating](https://johnresig.com/blog/javascript-micro-templating/)

模板的使用语法:

```html
<script type="text/html" id="item_templ">
	<div id="<%=id%>" class="<%=(i % 2 == 1 ? " even" : "")%>">
      <div class="grid_1 alpha right">
        <img class="righted" src="<%=profile_image_url%>"/>
      </div>
      <div class="grid_6 omega contents">
        <p><b><a href="/<%=from_user%>"><%=from_user%></a>:</b> <%=text%></p>
      </div>
    </div>  
</script>
```

#### 2.1 Micro Template 实现代码

```javascript
// Simple JavaScript Templating

// John Resig - https://johnresig.com/ - MIT Licensed

(function(){

  var cache = {};

   

  this.tmpl = function tmpl(str, data){

    // Figure out if we're getting a template, or if we need to

    // load the template - and be sure to cache the result.

    var fn = !/\W/.test(str) ?

      cache[str] = cache[str] ||

        tmpl(document.getElementById(str).innerHTML) :

       

      // Generate a reusable function that will serve as a template

      // generator (and which will be cached).

      new Function("obj",

        "var p=[],print=function(){p.push.apply(p,arguments);};" +

         

        // Introduce the data as local variables using with(){}

        "with(obj){p.push('" +

         

        // Convert the template into pure JavaScript

        str

          .replace(/[\r\t\n]/g, " ")

          .split("<%").join("\t")

          .replace(/((^|%>)\t*)'/g, "$1\r")

          .replace(/\t=(.*?)%>/g, "',$1,'")

          .split("\t").join("');")

          .split("%>").join("p.push('")

          .split("\r").join("\'")

      + "');}return p.join('');");

     

    // Provide some basic currying to the user

    return data ? fn( data ) : fn;

  };

})();

```



**2.2.1 主要知识点：**

1. [new Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function): 用于创建一个将模板解析成html字符串并且结合 *data* 的函数  *fn*，通过  *fn(data)*  传入模板中用到的全局 *data*。


1. [with](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with): 传入的 *data* 作为函数体中 *obj* 的变量取值，也可声明一个临时变量来存值，达到一样的效果。


1. 正则表达式对字符串进行切割 如识别到模板语法中的 *<%* 替换成 *\t*

**2.2.2 存在的问题：**

1. 代码调试痛苦，不方便定位问题

2. 无法将数据与状态绑定，每次数据的更改需要更新整个视图层

   ​

### 3. Vue的模板实现学习

> Vue的使用非常的简单，根据官方文档可以快速的入门，但是本着不能只知道如何使用，而不知道是如何起作用的原则，了解一下Vue的实现机制

**3.1 Vue核心执行过程图**

