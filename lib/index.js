"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findParent(e, className, nodeName) {
  if (!e) {
    return null;
  }
  if (nodeName && e.nodeName === nodeName) {
    return e;
  }
  var p = e;
  while (true) {
    p = p.parentElement;
    if (!p) {
      return null;
    }
    if (p.classList.contains(className)) {
      return p;
    }
    if (nodeName && p.nodeName === nodeName) {
      return p;
    }
  }
}
exports.findParent = findParent;
function getContainer(ele) {
  return findParent(ele, "form-input", "LABEL");
}
exports.getContainer = getContainer;
function getLabel(ele) {
  if (!ele) {
    return "";
  }
  var l = ele.getAttribute("data-label");
  if (l) {
    return l;
  }
  var parent = getContainer(ele);
  if (parent) {
    if (parent.nodeName === "LABEL") {
      var first = parent.childNodes[0];
      if (first.nodeType === 3) {
        return first.nodeValue ? first.nodeValue : "";
      }
    }
    else {
      var firstChild = parent.firstChild;
      if (firstChild && firstChild.nodeName === "LABEL") {
        return firstChild.innerHTML;
      }
    }
  }
  return "";
}
exports.getLabel = getLabel;
function toggleClass(e, className) {
  if (e) {
    if (e.classList.contains(className)) {
      e.classList.remove(className);
      return false;
    }
    else {
      e.classList.add(className);
      return true;
    }
  }
  return false;
}
exports.toggleClass = toggleClass;
function addClass(ele, className) {
  if (ele) {
    if (!ele.classList.contains(className)) {
      ele.classList.add(className);
      return true;
    }
  }
  return false;
}
exports.addClass = addClass;
function addClasses(ele, classes) {
  var count = 0;
  if (ele) {
    for (var i = 0; i < classes.length; i++) {
      if (addClass(ele, classes[i])) {
        count++;
      }
    }
  }
  return count;
}
exports.addClasses = addClasses;
function removeClass(ele, className) {
  if (ele) {
    if (ele && ele.classList.contains(className)) {
      ele.classList.remove(className);
      return true;
    }
  }
  return false;
}
exports.removeClass = removeClass;
function removeClasses(ele, classes) {
  var count = 0;
  if (ele) {
    for (var i = 0; i < classes.length; i++) {
      if (removeClass(ele, classes[i])) {
        count++;
      }
    }
  }
  return count;
}
exports.removeClasses = removeClasses;
function addErrorMessage(ele, msg, directParent) {
  if (!ele) {
    return;
  }
  if (!msg) {
    msg = "Error";
  }
  addClass(ele, "invalid");
  var parent = directParent ? ele.parentElement : getContainer(ele);
  if (parent === null) {
    return;
  }
  addClass(parent, "invalid");
  var span = parent.querySelector(".span-error");
  if (span) {
    if (span.innerHTML !== msg) {
      span.innerHTML = msg;
    }
  }
  else {
    var spanError = document.createElement("span");
    spanError.classList.add("span-error");
    spanError.innerHTML = msg;
    parent.appendChild(spanError);
  }
}
exports.addErrorMessage = addErrorMessage;
var errorArr = ["valid", "invalid", "ng-invalid", "ng-touched"];
function removeError(ele, directParent) {
  if (!ele) {
    return;
  }
  removeClasses(ele, errorArr);
  var parent = directParent ? ele.parentElement : getContainer(ele);
  if (parent) {
    removeClasses(parent, errorArr);
    var span = parent.querySelector(".span-error");
    if (span !== null && span !== undefined) {
      parent.removeChild(span);
    }
  }
}
exports.removeError = removeError;
function removeErrors(form) {
  if (form) {
    var len = form.length;
    for (var i = 0; i < len; i++) {
      var ele = form[i];
      removeError(ele);
    }
  }
}
exports.removeErrors = removeErrors;
function isEmpty(str) {
  return !str || str === "";
}
exports.isEmpty = isEmpty;
function isValidPattern(v, pattern, flags) {
  if (flags === null) {
    flags = undefined;
  }
  var p = new RegExp(pattern, flags);
  return p.test(v);
}
exports.isValidPattern = isValidPattern;
function removeSeparators(input) {
  if (!input)
    return "";
  var len = input.length;
  var buffer = new Array(len);
  var write = 0;
  for (var i = 0; i < len; i++) {
    var c = input[i];
    if (c === " " ||
      c === "\u00A0" ||
      c === "," ||
      c === "." ||
      c === "٬" ||
      c === "$" ||
      c === "€" ||
      c === "£" ||
      c === "¥") {
      continue;
    }
    buffer[write++] = c;
  }
  return write === len ? input : buffer.slice(0, write).join("");
}
exports.removeSeparators = removeSeparators;
function formatInteger(v, groupSeparator) {
  if (groupSeparator === void 0) { groupSeparator = ","; }
  if (v == null || !Number.isFinite(v)) {
    return "";
  }
  var isNegative = v < 0;
  var n = Math.abs(Math.trunc(v));
  if (n < 1000) {
    return isNegative ? "-" + n : "" + n;
  }
  var result = "";
  var count = 0;
  while (n > 0) {
    var digit = n % 10;
    n = (n / 10) | 0;
    if (count > 0 && count % 3 === 0) {
      result = groupSeparator + result;
    }
    result = digit + result;
    count++;
  }
  return isNegative ? "-" + result : result;
}
exports.formatInteger = formatInteger;
function formatNumber(v, scale, d, g) {
  if (v == null) {
    return "";
  }
  if (!d && !g) {
    g = ",";
    d = ".";
  }
  else if (!g) {
    g = d === "," ? "." : ",";
  }
  var s = scale === 0 || scale ? v.toFixed(scale) : v.toString();
  var x = s.split(".", 2);
  var y = x[0];
  var arr = [];
  var len = y.length - 1;
  for (var k = 0; k < len; k++) {
    arr.push(y[len - k]);
    if ((k + 1) % 3 === 0) {
      arr.push(g);
    }
  }
  arr.push(y[0]);
  if (x.length === 1) {
    return arr.reverse().join("");
  }
  else {
    return arr.reverse().join("") + d + x[1];
  }
}
exports.formatNumber = formatNumber;
function formatText() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var formatted = args[0];
  if (!formatted || formatted === "") {
    return "";
  }
  if (args.length > 1 && Array.isArray(args[1])) {
    var params = args[1];
    for (var i = 0; i < params.length; i++) {
      var regexp = new RegExp("\\{" + i + "\\}", "gi");
      formatted = formatted.replace(regexp, params[i]);
    }
  }
  else {
    for (var i = 1; i < args.length; i++) {
      var regexp = new RegExp("\\{" + (i - 1) + "\\}", "gi");
      formatted = formatted.replace(regexp, args[i]);
    }
  }
  return formatted;
}
exports.formatText = formatText;
