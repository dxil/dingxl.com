const tagName = '([a-zA-Z_][\\w\\-\\.]*)'
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagOpen = new RegExp(`^<${tagName}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${tagName}[^>]*>`)

let index = 0;
function advance (n) {
  index += n
  html = html.substring(n)
}

function createASTElement (tag, attrs, parent){
  return {
    type: 1,
    tag,
    lowerCasedTag: tag.toLowerCase(),
    attrsList: attrs,
    parent,
    children: []
  }
}

let root
let currentParent
let stack = []

function parseStartTag () {
  //-- 第一步 首先匹配开始标签的左边开头部分 --
  const start = html.match(startTagOpen)
  if (start) {
    const match = {
      tagName: start[1],
      attrs: [],
      start: index
    }
    advance(start[0].length)

    //-- 第二步 循环解析开始标签上的每一个属性键值对 --
    let end, attr
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      advance(attr[0].length)
      match.attrs.push({
        name: attr[1],
        value: attr[3]
      })
    }

    //-- 第三步 匹配到开始标签的闭合部分，至此开始标签解析结束 --
    if (end) {
      match.unarySlash = end[1]
      advance(end[0].length)
    }

    // 解析完标签创建一个 AST 节点
    let element = createASTElement(match.tagName, match.attrs, currentParent)

    if(!root){
      root = element
    }

    if(currentParent){
      currentParent.children.push(element);
    }

    // 自闭合就不用压入栈中了
    if (!match.unarySlash) {
      stack.push(element)
      currentParent = element
    }

  }
}

function parseEndTag () {
  const end = html.match(endTag);
  if (end) {
    advance(end[0].length)

    let tagName = end[1], lowerCasedTagName = tagName.toLowerCase()
    let pos

    // 从栈顶往栈底找，直到找到栈中离的最近的同类型标签
    for (pos = stack.length - 1; pos >= 0; pos--) {
      if (stack[pos].lowerCasedTag === lowerCasedTagName) {
        break
      }
    }

    // 如果找到了就取出对应的开始标签
    if (pos >= 0) {
      stack.length = pos
      currentParent = stack[stack.length - 1]
    }
  }
}

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g

function parseText(text){
  if (defaultTagRE.test(text)) {
    // tokens 用于分割普通文本和插值文本
    const tokens = []
    let lastIndex = defaultTagRE.lastIndex = 0
    let match, index
    while ((match = defaultTagRE.exec(text))) {
      index = match.index

      // push 普通文本
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      // push 插值表达式
      tokens.push(`_s(${match[1].trim()})`)

      // 游标前移
      lastIndex = index + match[0].length
    }

    // 将剩余的普通文本压入 tokens 中
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }

    currentParent.children.push({
      type: 2,
      expression: tokens.join('+'),
      text
    })
  }else{
    currentParent.children.push({
      type: 3,
      text
    });
  }
}

let html

function parseHTML(_html){
  html = _html

  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {

      //-- 匹配开始标签 --
      const startTagMatch = html.match(startTagOpen)
      if (startTagMatch) {
        parseStartTag()
        continue
      }

      //-- 匹配结束标签 --
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        parseEndTag()
        continue
      }
    }

    //-- 匹配文本 --
    let text, rest
    if (textEnd >= 0) {
      rest = html.slice(textEnd)
      text = html.substring(0, textEnd)
      advance(textEnd)
    }
    if (textEnd < 0) {
      text = html
      html = ''
    }
    text && parseText(text)
  }

  return root
}

function optimize (root) {
  //-- 第一步 标记 AST 所有静态节点 --
  markStatic(root)
  //-- 第二步 标记 AST 所有父节点（即子树根节点） --
  markStaticRoots(root, false)
}

function markStatic (node) {
  // 标记
  if (node.type === 2) {    // 插值表达式
    node.static = false
  }

  if (node.type === 3) {    // 普通文本
    node.static = true
  }

  if (node.type === 1) {      // 元素
    // 如果所有子节点均是 static，则该节点也是 static
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      markStatic(child)
      if (!child.static) {
        node.static = false
      }
    }
  }
}

function markStaticRoots (node) {
  if (node.type === 1) {
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
        node.children.length === 1 &&
        node.children[0].type === 3
      )) {

      node.staticRoot = true
      return
    } else {
      node.staticRoot = false
    }

    for (let i = 0; i < node.children.length; i++) {
      markStaticRoots(node.children[i])
    }
  }
}


let tpl = `<div id="index"><p>hello, {{msg}}</p><a>bb</a> by 哥</div>`
console.info('生成的AST↓↓↓')
let ast = parseHTML(tpl)
console.info(ast)
optimize(ast)
console.info(ast)
