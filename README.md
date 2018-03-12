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



##### 2.2.1 主要知识点：

1. [new Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function): 用于创建一个将模板解析成html字符串并且结合 *data* 的函数  *fn*，通过  *fn(data)*  传入模板中用到的全局 *data*。


1. [with](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/with): 传入的 *data* 作为函数体中 *obj* 的变量取值，也可声明一个临时变量来存值，达到一样的效果。


1. 正则表达式对字符串进行切割 如识别到模板语法中的 *<%* 替换成 *\t*

##### 2.2.2 存在的问题：

1. 代码调试痛苦，不方便定位问题

2. 无法将数据与状态绑定，每次数据的更改需要更新整个视图层

   ​

### 3. Vue的模板实现学习

> Vue的使用非常的简单，根据官方文档可以快速的入门，但是本着不能只知道如何使用，而不知道是如何起作用的原则，了解一下Vue的实现机制

#### 3.1 Vue核心执行过程图

![vue原理](./index/static/imgs/vue原理.jpg)

或者说：

![vue原理图](./index/static/imgs/vue原理图(一).jpg)



#### 3.2 vue源码分析

分析目录结构：通过Vue的package.json文件中的"rollup -w -c scripts/config.js --environment TARGET:web-full-dev"可以得知目录打包入口为 "scripts/config.js" ，一层层找之后获得Vue实例在 'instance/index.js'下创建

```javascript
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

我们创建Vue实例一开始传入的options (el, data, methods)等等属性都通过参数传入了this._init(options)中，我们接着往下看 _init()函数做了什么事情：

首先是创建了uid为每个实例创建唯一id，之后通过mergeOptions()把vm上的options和基础设置的options合并（具体功能不讨论，是个用的比较多的Utils函数），接下来进入核心主题：

```javascript
	initLifecycle(vm)  // 创建初始生命周期
    initEvents(vm)	// 不看。。
    initRender(vm)	// vnode 创建虚拟dom与词法分析 AST
    callHook(vm, 'beforeCreate') // 没看
    initInjections(vm) // resolve injections before data/props
    initState(vm)	// 主菜，数据劫持，创建Depend与Watcher
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
```



#### 3.3 InitState

initState是我着重分析的部分，因为涉及到双向绑定的核心实现和mvvm中的vm。

我们先看看代码：

```javascript
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods) // 将methods合并入vm上
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */) // 对每个数据绑定劫持属性。
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

**3.3.1 observe**

observe函数一开始对数据是否是数组和Object进行了检验，然后创建了一个Observer实例

```javascript
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value //
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```

在数据劫持前，对数据的array和object进行了递归监听属性，最主要是传入了walk函数，之后调用了defineReactive函数，进行每个属性的监听。

**3.3.2 defineReactive**

defineReactive在每个数据一开始创建了一个事件的依赖者Depend()，为了让页面中使用的数据监听依赖，之后通过Object.definePropty方法，对getter，setter处理，在getter调用时判断当前调用时是否传入了depend.target（节点编译时取数据是否调用了当前的getter，如果调用了，则可认为是有一个watcher（事件观察者）观察了这个依赖）接着就可以调用dep.depend()方法来为依赖添加一个订阅者。在setter设置值阶段，如果有数据变化，则调用notify()来将Depend中的所有subs(watchers)调用自己的update方法进行更新页面元素，可能有些枯燥，看看代码：

```javascript
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep() // 首先创建一个数据依赖者

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      // Dep.target 调用数据时，是否来自观察者的调用，如果是，则可认为依赖了这个依赖者
      if (Dep.target) {
        dep.depend() // 通过之后的watcher.addDep()推入dep的subs数组中
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify() // 通知所有的观察者，依赖发生改变
    }
  })
}
```



接着数据劫持属性方法，我们趁热看看数据的观察者和订阅者的实现



**3.3.3 Vue中的依赖者Dep**

```javascript
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++ // 每个dep的唯一id
    this.subs = [] // 用于装入所有的当前的订阅者
  }

  // 增加订阅者
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // 删除订阅者
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  // 为监听依赖的观察者加入subs中
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  // 通知所有的观察者，已经发生了变更
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
```

如同我们上一篇说到的观察者模式一样，Dep()拥有增加观察者，删除观察者，通知观察者等等功能。



**3.3.4 Vue中的观察者Watcher**

```javascript
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  /**
   * Add a dependency to this directive. 为watcher增加依赖
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes. 当事件变化，会推入队列执行自己的update更新函数，即	  * 传入时的cb函数。
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
}
```

其中Watcher会在页面compile解析dom节点,parseHTML的时候传入 ``new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */)`` 每次更新时都会去Update自身的组件。



#### 3.4 Vue中的Compile （AST，tokenize，Vdom）

在前面运行图时已经可以看出在拿到模板后首先要编译模板，生成  *AST* ( *Abstract Syntax Tree* ) 抽象对象树，即源代码的抽象语法树的结构的表示，并不会表示出具体的代码实现细节，也不依赖于源代码的语法，树上的每个节点映射出源代码中的一种结构

> **什么是抽象语法树**
> 抽象语法树(Abstract Syntax Tree) 是源代码语法结构的抽象表示，并以树这种数据结构进行描述。AST 属编译原理范畴，有比较成熟的理论基础，因此被广泛运用在对各种程序语言（JavaScript, C, Java, Python等等）的编译处理中。Vue 同样也是使用 AST 作为中间形式完成对 html 模板的编译。

在继续Vue编译节点原理前，需要先了解 *AST* 构建的一般过程

**3.1.1 AST 示例**

比如：

```javascript
let a = 1;
```

生成的 *AST* 格式如下:

```javascript
{
    type: "Program",
    body: [
        {
            type: "VariableDeclaration",
            declarations: [
                {
                    type: "VariableDeclarator",
                    id: {
                        type: "Identifier",
                        name: "a"
                    },
                    init: {
                        type: "Literal",
                        value: 1,
                        raw: "1"
                    }
                }
            ],
            kind: "let"
        }
    ],
    sourceType: "script"
}
```

*AST* 图形预览:

![AST图形](./index/static/imgs/AST.png)

[在线生成 *AST* 结构工具](http://astexplorer.net/)                 [在线生成 *AST* 图形工具](http://resources.jointjs.com/demos/javascript-ast)



**3.1.2 Vue中AST的实现**

不说了，全是正则，我也不会。