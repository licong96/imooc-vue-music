//  * classie.has( elem, 'my-class' ) -> true/false
//  * classie.add( elem, 'my-new-class' )
//  * classie.remove( elem, 'my-unwanted-class' )
//  * classie.toggle( elem, 'my-class' )

function classReg (className) {
  return new RegExp('(^|\\s+)' + className + '(\\s+|$)')
}

var hasClass, addClass, removeClass

if ('classList' in document.documentElement) {
  hasClass = function (elem, c) {
    return elem.classList.contains(c)
  }
  addClass = function (elem, c) {
    elem.classList.add(c)
  }
  removeClass = function (elem, c) {
    elem.classList.remove(c)
  }
} else {
  hasClass = function (elem, c) {
    return classReg(c).test(elem.className)
  }
  addClass = function (elem, c) {
    if (!hasClass(elem, c)) {
      elem.className = elem.className + ' ' + c
    }
  }
  removeClass = function (elem, c) {
    elem.className = elem.className.replace(classReg(c), ' ')
  }
}

function toggleClass (elem, c) {
  var fn = hasClass(elem, c) ? removeClass : addClass
  fn(elem, c)
}

export const classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
}

// 获取data自定义属性
export function getData(el, name, val) {
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}

// 浏览器能力检测
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
