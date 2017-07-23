// export function addClass (el, className) {
//   if (hasClass(el, className)) {
//     return        // 有这个class就什么都不做
//   }
//   let newClass = el.className.split(' ')      // 先拆分成一个数组
//   newClass.push(className)
//   el.className = newClass.join(' ')          // 再拼接在一起
// }
//
// export function hasClass(el, className) {
//   let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')   // 空白字符开头，就表示有这个class
//   return reg.test(el.className)
// }

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
