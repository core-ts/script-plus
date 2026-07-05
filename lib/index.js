"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SHORTCUT_KEYS = new Set(["a", "c", "v", "x", "z", "y"]);
var CONTROL_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Enter",
  "Escape",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Insert",
]);
function detectShortcut(e) {
  return (e.ctrlKey || e.metaKey) && SHORTCUT_KEYS.has(e.key.toLowerCase());
}
exports.detectShortcut = detectShortcut;
function isDigit(key) {
  return key.length === 1 && key >= "0" && key <= "9";
}
function isControlKey(key) {
  return CONTROL_KEYS.has(key);
}
function digitOnKeyDown(e) {
  if (detectShortcut(e)) {
    return true;
  }
  var key = e.key;
  if (isControlKey(key)) {
    return true;
  }
  return isDigit(key);
}
exports.digitOnKeyDown = digitOnKeyDown;
function integerOnKeyDown(e) {
  if (detectShortcut(e)) {
    return true;
  }
  var key = e.key;
  if (isControlKey(key)) {
    return true;
  }
  var input = e.target;
  if (key === "-") {
    if (!input.min) {
      return true;
    }
    else {
      var min = Number(input.min);
      return !Number.isNaN(min) && min < 0 && !input.value.includes("-");
    }
  }
  return isDigit(key);
}
exports.integerOnKeyDown = integerOnKeyDown;
function numberOnKeyDown(e, decimalSeparator) {
  if (detectShortcut(e)) {
    return true;
  }
  var key = e.key;
  if (isControlKey(key)) {
    return true;
  }
  var input = e.target;
  if (key === "-") {
    if (!input.min) {
      return true;
    }
    else {
      var min = Number(input.min);
      return !Number.isNaN(min) && min < 0 && !input.value.includes("-");
    }
  }
  if (key === "." || key === "," || key === "٫") {
    if (!decimalSeparator) {
      decimalSeparator = ".";
    }
    return key === decimalSeparator && !input.value.includes(decimalSeparator);
  }
  return isDigit(key);
}
exports.numberOnKeyDown = numberOnKeyDown;
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
  var buffer = new Array(32);
  var i = buffer.length;
  var digitCount = 0;
  while (n > 0) {
    if (digitCount > 0 && digitCount % 3 === 0) {
      buffer[--i] = groupSeparator;
    }
    var digit = n % 10;
    buffer[--i] = String.fromCharCode(48 + digit);
    n = Math.floor(n / 10);
    digitCount++;
  }
  if (isNegative) {
    buffer[--i] = "-";
  }
  return buffer.slice(i).join("");
}
exports.formatInteger = formatInteger;
function formatNumber(v, precision, decimalSeparator, groupSeparator) {
  if (precision === void 0) { precision = 0; }
  if (v == null || !Number.isFinite(v)) {
    return "";
  }
  var d = ".";
  var g = ",";
  if (decimalSeparator && groupSeparator) {
    d = decimalSeparator;
    g = groupSeparator;
  }
  else if (decimalSeparator && !groupSeparator) {
    d = decimalSeparator;
    if (d === "٫") {
      g = "٬";
    }
    else {
      g = d === "," ? "." : ",";
    }
  }
  var negative = v < 0;
  var s = precision < 0 ? Math.abs(v).toString() : Math.abs(v).toFixed(precision);
  var dot = s.indexOf(".");
  var intEnd = dot >= 0 ? dot : s.length;
  var fracLen = dot >= 0 ? s.length - dot - 1 : 0;
  var intLen = intEnd;
  var groups = intLen > 3 ? ((intLen - 1) / 3) | 0 : 0;
  var outLen = (negative ? 1 : 0) + intLen + groups * g.length + (fracLen > 0 ? d.length + fracLen : 0);
  var out = new Array(outLen);
  var p = 0;
  if (negative) {
    out[p++] = "-";
  }
  var firstGroup = intLen % 3;
  if (firstGroup === 0) {
    firstGroup = 3;
  }
  for (var i = 0; i < intLen; i++) {
    if (i > 0 && (i === firstGroup || (i > firstGroup && (i - firstGroup) % 3 === 0))) {
      for (var j = 0; j < g.length; j++) {
        out[p++] = g[j];
      }
    }
    out[p++] = s[i];
  }
  if (fracLen > 0) {
    for (var j = 0; j < d.length; j++) {
      out[p++] = d[j];
    }
    for (var i = dot + 1; i < s.length; i++) {
      out[p++] = s[i];
    }
  }
  return out.join("");
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
function valueOf(obj, key) {
  var mapper = key.split(".").map(function (item) {
    return item.replace(/\[/g, ".[").replace(/\[|\]/g, "");
  });
  var reSplit = mapper.join(".").split(".");
  return reSplit.reduce(function (acc, current, index, source) {
    var value = getDirectValue(acc, current);
    if (!value) {
      source.splice(1);
    }
    return value;
  }, obj);
}
exports.valueOf = valueOf;
function getDirectValue(obj, key) {
  if (obj && obj.hasOwnProperty(key)) {
    return obj[key];
  }
  return null;
}
exports.getDirectValue = getDirectValue;
function setValue(obj, key, value) {
  var replaceKey = key.replace(/\[/g, ".[").replace(/\.\./g, ".");
  if (replaceKey.indexOf(".") === 0) {
    replaceKey = replaceKey.slice(1, replaceKey.length);
  }
  var keys = replaceKey.split(".");
  var firstKey = keys.shift();
  if (!firstKey) {
    return;
  }
  var isArrayKey = /\[([0-9]+)\]/.test(firstKey);
  if (keys.length > 0) {
    var firstKeyValue = obj[firstKey] || {};
    var returnValue = setValue(firstKeyValue, keys.join("."), value);
    return setKey(obj, isArrayKey, firstKey, returnValue);
  }
  return setKey(obj, isArrayKey, firstKey, value);
}
exports.setValue = setValue;
function setKey(_object, _isArrayKey, _key, _nextValue) {
  if (_isArrayKey) {
    if (_object.length > _key) {
      _object[_key] = _nextValue;
    }
    else {
      _object.push(_nextValue);
    }
  }
  else {
    _object[_key] = _nextValue;
  }
  return _object;
}
exports.setKey = setKey;
function parseDate(v, format) {
  if (!format || format.length === 0) {
    format = "MM/DD/YYYY";
  }
  else {
    format = format.toUpperCase();
  }
  var dateItems = format.split(/\/|\.| |-/);
  var valueItems = v.split(/\/|\.| |-/);
  var imonth = dateItems.indexOf("M");
  var iday = dateItems.indexOf("D");
  var iyear = dateItems.indexOf("YYYY");
  if (imonth === -1) {
    imonth = dateItems.indexOf("MM");
  }
  if (iday === -1) {
    iday = dateItems.indexOf("DD");
  }
  if (iyear === -1) {
    iyear = dateItems.indexOf("YY");
  }
  var month = parseInt(valueItems[imonth], 10) - 1;
  var year = parseInt(valueItems[iyear], 10);
  if (year < 100) {
    year += 2000;
  }
  var day = parseInt(valueItems[iday], 10);
  return new Date(year, month, day);
}
exports.parseDate = parseDate;
function getDecimals(ele) {
  var decimals = ele.getAttribute("data-decimals");
  if (!decimals) {
    var form = ele.form;
    if (form) {
      decimals = form.getAttribute("data-decimals");
    }
  }
  if (!decimals || isNaN(decimals)) {
    return -1;
  }
  return parseFloat(decimals);
}
exports.getDecimals = getDecimals;
function getDecimalSeparator(ele) {
  var separator = ele.getAttribute("data-decimal-separator");
  if (!separator) {
    var form = ele.form;
    if (form) {
      separator = form.getAttribute("data-decimal-separator");
    }
  }
  return separator ? separator : ".";
}
exports.getDecimalSeparator = getDecimalSeparator;
function getGroupSeparator(ele) {
  var separator = ele.getAttribute("data-group-separator");
  if (!separator) {
    var form = ele.form;
    if (form) {
      separator = form.getAttribute("data-group-separator");
    }
  }
  return separator;
}
exports.getGroupSeparator = getGroupSeparator;
function getChipsByElement(container) {
  if (container) {
    return Array.from(container.querySelectorAll(".chip")).map(function (chip) {
      var v = chip.getAttribute("data-value");
      return v ? v.trim() : "";
    });
  }
  else {
    return [];
  }
}
exports.getChipsByElement = getChipsByElement;
function getChipObjects(container, value, text, star) {
  if (container) {
    return Array.from(container.querySelectorAll(".chip")).map(function (chip) {
      var _a;
      var obj = {};
      var v = chip.getAttribute("data-value");
      obj[value] = v ? v.trim() : "";
      if (text) {
        obj[text] = (_a = chip.firstChild) === null || _a === void 0 ? void 0 : _a.textContent;
      }
      if (star) {
        var i = chip.querySelector("i.star.highlight");
        if (i) {
          obj[star] = true;
        }
      }
      return obj;
    });
  }
  else {
    return [];
  }
}
exports.getChipObjects = getChipObjects;
function normalizePhone(s) {
  if (!s) {
    return "";
  }
  var len = s.length;
  var buf = new Array(len);
  var j = 0;
  for (var i = 0; i < len; i++) {
    var c = s.charCodeAt(i);
    if ((c >= 48 && c <= 57) || c === 43) {
      buf[j++] = s[i];
    }
  }
  return j === len ? buf.join("") : buf.slice(0, j).join("");
}
exports.normalizePhone = normalizePhone;
function normalizeInteger(s) {
  if (!s) {
    return "";
  }
  var len = s.length;
  var buf = new Array(len);
  var j = 0;
  for (var i = 0; i < len; i++) {
    var c = s.charCodeAt(i);
    if (c >= 48 && c <= 57) {
      buf[j++] = s[i];
    }
  }
  return j === len ? buf.join("") : buf.slice(0, j).join("");
}
exports.normalizeInteger = normalizeInteger;
function removeSeparators(s) {
  if (!s) {
    return "";
  }
  var len = s.length;
  var buffer = new Uint16Array(len);
  var write = 0;
  for (var i = 0; i < len; i++) {
    var c = s.charCodeAt(i);
    if ((c >= 48 && c <= 57) || c === 46) {
      buffer[write++] = c;
    }
  }
  return String.fromCharCode.apply(null, buffer.subarray(0, write));
}
exports.removeSeparators = removeSeparators;
function normalizeNumber(s) {
  if (!s) {
    return "";
  }
  var len = s.length;
  var buf = new Array(len);
  var j = 0;
  for (var i = 0; i < len; i++) {
    var c = s.charCodeAt(i);
    if (c >= 48 && c <= 57) {
      buf[j++] = s[i];
    }
    else if (c === 44 || c === 1643) {
      buf[j++] = ".";
    }
  }
  return j === len ? buf.join("") : buf.slice(0, j).join("");
}
exports.normalizeNumber = normalizeNumber;
function decode(form, currencySymbol) {
  var dateFormat = form.getAttribute("data-date-format");
  var obj = {};
  var len = form.length;
  var _loop_1 = function (i) {
    var ele = form[i];
    var name_1 = ele.getAttribute("name");
    var id = ele.getAttribute("id");
    var val = void 0;
    var isDate = false;
    var dataField = ele.getAttribute("data-field");
    if (dataField && dataField.length > 0) {
      name_1 = dataField;
    }
    else if ((!name_1 || name_1 === "") && ele.parentElement && ele.parentElement.classList.contains("DayPickerInput")) {
      if (ele.parentElement.parentElement) {
        dataField = ele.parentElement.parentElement.getAttribute("data-field");
        isDate = true;
        name_1 = dataField;
      }
    }
    if (isDate === false && ele.getAttribute("data-type") === "date") {
      isDate = true;
    }
    if (name_1 != null && name_1 !== "") {
      var nodeName = ele.nodeName;
      var type = ele.getAttribute("type");
      if (nodeName === "INPUT" && type !== null) {
        nodeName = type.toUpperCase();
      }
      var datatype = ele.getAttribute("data-type");
      if (nodeName !== "BUTTON" && nodeName !== "RESET" && nodeName !== "SUBMIT" && ele.getAttribute("data-skip") !== "true") {
        switch (type) {
          case "checkbox":
            if (id && name_1 !== id) {
              val = valueOf(obj, name_1);
              if (!val) {
                val = [];
              }
              if (ele.checked) {
                val.push(ele.value);
              }
              else {
                val = val.filter(function (item) { return item != ele.value; });
              }
            }
            else {
              val = ele.value !== "on" ? ele.value : ele.checked;
            }
            setValue(obj, name_1, val);
            return "continue";
          case "radio":
            if (ele.checked) {
              val = ele.value.length > 0 ? ele.value : ele.checked;
              setValue(obj, name_1, val);
            }
            return "continue";
          case "date":
            val = ele.value.length === 10 ? ele.value : null;
            break;
          case "datetime-local":
            if (ele.value.length > 0) {
              try {
                val = new Date(ele.value);
              }
              catch (err) {
                val = null;
              }
            }
            else {
              val = null;
            }
            break;
          default:
            if (datatype === "phone") {
              val = normalizePhone(ele.value);
            }
            else {
              val = ele.value;
            }
        }
        if (isDate && dateFormat && dateFormat.length > 0) {
          var d = parseDate(val, dateFormat);
          val = d.toString() === "Invalid Date" ? null : d;
        }
        var v = ele.value;
        if (datatype === "phone" || datatype === "fax") {
          val = normalizePhone(v);
        }
        else if (datatype === "integer") {
          var n0 = normalizeInteger(v);
          val = isNaN(n0) ? undefined : parseFloat(v);
        }
        else if (datatype === "number" || datatype === "currency") {
          var decimalSeparator = getDecimalSeparator(ele);
          var n0 = decimalSeparator === "," || decimalSeparator === "٫" ? normalizeNumber(v) : removeSeparators(v);
          val = isNaN(n0) ? undefined : parseFloat(v);
        }
        setValue(obj, name_1, val);
      }
    }
  };
  for (var i = 0; i < len; i++) {
    _loop_1(i);
  }
  form.querySelectorAll(".chip-list").forEach(function (divChip) {
    var name = divChip.getAttribute("data-name");
    if (name && name.length > 0) {
      var dv = divChip.getAttribute("data-value");
      if (dv) {
        var v = getChipObjects(divChip, dv, divChip.getAttribute("data-text"), divChip.getAttribute("data-star"));
        setValue(obj, name, v);
      }
      else {
        var v = getChipsByElement(divChip);
        setValue(obj, name, v);
      }
    }
  });
  return obj;
}
exports.decode = decode;
function getRequiredError(ele) {
  var form = ele.form;
  var msg = "";
  if (form) {
    msg = form.getAttribute("data-required-error");
  }
  return msg ? msg : "{0} is required.";
}
exports.getRequiredError = getRequiredError;
function getIntegerError(ele) {
  var form = ele.form;
  var msg = "";
  if (form) {
    msg = form.getAttribute("data-integer-error");
  }
  return msg ? msg : "{0} is not a valid integer.";
}
exports.getIntegerError = getIntegerError;
function getNumberError(ele) {
  var form = ele.form;
  var msg = "";
  if (form) {
    msg = form.getAttribute("data-number-error");
  }
  return msg ? msg : "{0} is not a valid number.";
}
exports.getNumberError = getNumberError;
function getMinError(ele) {
  var form = ele.form;
  var msg = "";
  if (form) {
    msg = form.getAttribute("data-min-error");
  }
  return msg ? msg : "{0} must be greater than or equal to {1}.";
}
exports.getMinError = getMinError;
function getMaxError(ele) {
  var form = ele.form;
  var msg = "";
  if (form) {
    msg = form.getAttribute("data-max-error");
  }
  return msg ? msg : "{0} must be less than or equal to {1}.";
}
exports.getMaxError = getMaxError;
function addRequiredError(ele, label) {
  var msg = getRequiredError(ele);
  var errorFormat = getRequiredError(ele);
  msg = formatText(errorFormat, label);
  addErrorMessage(ele, msg);
  return msg;
}
exports.addRequiredError = addRequiredError;
function checkInteger(ele, label, normalized) {
  var n0 = normalizeInteger(ele.value);
  if (isNaN(n0)) {
    var errorFormat = getIntegerError(ele);
    var msg = formatText(errorFormat, label);
    addErrorMessage(ele, msg);
    return msg;
  }
  else {
    var n = parseFloat(n0);
    return checkMinMax(ele, label, n);
  }
}
exports.checkInteger = checkInteger;
function checkNumber(ele, label) {
  var decimalSeparator = getDecimalSeparator(ele);
  var n0 = decimalSeparator === "," || decimalSeparator === "٫" ? normalizeNumber(ele.value) : removeSeparators(ele.value);
  if (isNaN(n0)) {
    var errorFormat = getNumberError(ele);
    var msg = formatText(errorFormat, label);
    addErrorMessage(ele, msg);
    return msg;
  }
  else {
    var n = parseFloat(n0);
    return checkMinMax(ele, label, n);
  }
}
exports.checkNumber = checkNumber;
function checkMin(ele, label, n) {
  if (ele.min) {
    var min = parseFloat(ele.min);
    if (n < min) {
      var errorFormat = getMinError(ele);
      var msg = formatText(errorFormat, label, ele.min);
      addErrorMessage(ele, msg);
      return msg;
    }
  }
  return null;
}
exports.checkMin = checkMin;
function checkMax(ele, label, n) {
  if (ele.max) {
    var max = parseFloat(ele.max);
    if (n > max) {
      var errorFormat = getMaxError(ele);
      var msg = formatText(errorFormat, label, ele.max);
      addErrorMessage(ele, msg);
      return msg;
    }
  }
  return null;
}
exports.checkMax = checkMax;
function checkMinMax(ele, label, n) {
  var minError = checkMin(ele, label, n);
  if (minError) {
    return minError;
  }
  var maxError = checkMax(ele, label, n);
  if (maxError) {
    return maxError;
  }
  return null;
}
exports.checkMinMax = checkMinMax;
function validateElement(ele, includeReadOnly) {
  if (!ele) {
    return null;
  }
  if (!ele || (ele.readOnly && includeReadOnly === false) || ele.disabled || ele.hidden || ele.style.display === "none") {
    return null;
  }
  var nodeName = ele.nodeName;
  if (nodeName === "INPUT") {
    var type = ele.getAttribute("type");
    if (type !== null) {
      nodeName = type.toUpperCase();
    }
  }
  if (ele.tagName === "SELECT") {
    nodeName = "SELECT";
  }
  if (nodeName === "BUTTON" || nodeName === "RESET" || nodeName === "SUBMIT") {
    return null;
  }
  var parent = getContainer(ele);
  if (parent) {
    if (parent.hidden || parent.style.display === "none") {
      return null;
    }
    else {
      var p = findParent(parent, "SECTION");
      if (p && (p.hidden || p.style.display === "none")) {
        return null;
      }
    }
  }
  var label = getLabel(ele);
  if (ele.required && !ele.value) {
    return addRequiredError(ele, label);
  }
  var datatype = ele.getAttribute("data-type");
  if (datatype) {
    if (datatype === "integer") {
      var n0 = normalizeInteger(ele.value);
      var errorMsg = checkInteger(ele, label, n0);
      if (errorMsg) {
        return errorMsg;
      }
    }
    else if (datatype === "number" || datatype === "currency") {
      var errorMsg = checkNumber(ele, label);
      if (errorMsg) {
        return errorMsg;
      }
    }
  }
  if (ele.pattern && ele.pattern.length > 0) {
    var flags = ele.getAttribute("data-flags");
    if (!isValidPattern(ele.value, ele.pattern, flags)) {
      var msg = ele.getAttribute("data-error-message");
      if (!msg) {
        msg = "Pattern Error";
      }
      addErrorMessage(ele, msg);
      return msg;
    }
  }
  removeError(ele);
  return null;
}
exports.validateElement = validateElement;
function validateForm(form, focusFirst, scroll, includeReadOnly) {
  if (!form) {
    return true;
  }
  var valid = true;
  var errorCtrl = null;
  var errorShown = false;
  var divMessage = form.querySelector(".message");
  var len = form.length;
  for (var i = 0; i < len; i++) {
    var ele = form[i];
    var type = ele.getAttribute("type");
    if (type != null) {
      type = type.toLowerCase();
    }
    if (type === "checkbox" || type === "radio" || type === "submit" || type === "button" || type === "reset") {
      continue;
    }
    else {
      var msg = validateElement(ele, includeReadOnly);
      if (msg) {
        if (divMessage && !errorShown) {
          if (!divMessage.classList.contains("alert-error")) {
            divMessage.classList.add("alert-error");
          }
          errorShown = true;
          divMessage.innerHTML = msg + '<span onclick="clearMessage(event)"></span>';
        }
        valid = false;
        if (!errorCtrl) {
          errorCtrl = ele;
        }
      }
      else {
        removeError(ele);
      }
    }
  }
  if (focusFirst !== false && !focusFirst) {
    focusFirst = true;
  }
  if (errorCtrl !== null && focusFirst === true) {
    errorCtrl.focus();
    if (scroll === true) {
      errorCtrl.scrollIntoView();
    }
  }
  return valid;
}
exports.validateForm = validateForm;
function showFormError(form, errors, focusFirst, directParent, includeId) {
  if (!form || !errors || errors.length === 0) {
    return [];
  }
  var errorCtrl = null;
  var errs = [];
  var length = errors.length;
  var len = form.length;
  for (var i = 0; i < length; i++) {
    var hasControl = false;
    for (var j = 0; j < len; j++) {
      var ele = form[j];
      var dataField = ele.getAttribute("data-field");
      if (dataField === errors[i].field || ele.name === errors[i].field) {
        addErrorMessage(ele, errors[i].message, directParent);
        hasControl = true;
        if (!errorCtrl) {
          errorCtrl = ele;
        }
      }
    }
    if (hasControl === false) {
      if (includeId) {
        var ele = document.getElementById(errors[i].field);
        if (ele) {
          addErrorMessage(ele, errors[i].message, directParent);
        }
        else {
          errs.push(errors[i]);
        }
      }
      else {
        errs.push(errors[i]);
      }
    }
  }
  if (focusFirst !== false) {
    focusFirst = true;
  }
  if (errorCtrl && focusFirst === true) {
    errorCtrl.focus();
    errorCtrl.scrollIntoView();
  }
  return errs;
}
exports.showFormError = showFormError;
