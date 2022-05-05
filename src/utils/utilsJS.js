/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-param-reassign */
// import moment from "moment"
/**
 * @param {Array} source
 * @returns {object}
 * editor fuhy
 */
// 数组对象
export function setTreeData(source) {
  const cloneData = deepCopy(source);
  // 对源数据深度克隆
  return (
    cloneData &&
    cloneData.filter((father) => {
      // 循环所有项，并添加children属性
      // father.icon = '';
      father.title = father.name;
      father.key = father.id;
      father.value = father.id;
      const branchArr = cloneData.filter((child) => father.id === child.parentId); // 返回每一项的子级数组
      branchArr.length > 0 ? (father.children = branchArr) : ''; // 给父级添加一个children属性，并赋值
      return father.parentId === '0' || !father.parentId; // 返回第一层
    })
  );
}

function daotree(cloneData, children) {
  const arr2 = cloneData.filter((father) => {
    const brancharr = children.filter((child) => {
      return father.id === child.parentId;
    });
    // eslint-disable-next-line no-return-assign
    return brancharr.length > 0 ? (father.children = brancharr) : '';
  });
  if (arr2.length > 1) {
    return daotree(cloneData, arr2);
  }
  return arr2;
}
// 递归树
// eslint-disable-next-line @typescript-eslint/no-redeclare
export function retTreeData(source, nocheck) {
  const cloneData = deepCopy(source);
  const children = cloneData.filter((item) => {
    return item[nocheck] === false;
  }); // 最底层
  if (children.length > 0) {
    return daotree(cloneData, children);
  }
  return cloneData.filter((father) => {
    // 循环所有项，并添加children属性
    father.icon = '';
    const branchArr = cloneData.filter((child) => father.id === child.parentId); // 返回每一项的子级数组
    branchArr.length > 0 ? (father.children = branchArr) : ''; // 给父级添加一个children属性，并赋值
    return father.parentId === '0'; // 返回第一层
  });
}
/**
 * @param {Object} obj
 * @returns {object}
 * editor fuhy
 */
export function deepCopy(obj) {
  // 深度复制数组
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    const object = [];
    for (let i = 0; i < obj.length; i++) {
      object.push(deepCopy(obj[i]));
    }
    return object;
  }
  // 深度复制对象
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    const object = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const p in obj) {
      object[p] = obj[p];
    }
    return object;
  }
}
/**
 * @param {Array} treeObj
 * @param {String} rootid
 * @param {String} idName
 * @returns {Array}
 * editor fuhy
 */
export function tree2Array(treeObj, rootid, idName) {
  let temp = []; // 设置临时数组，用来存放队列
  let out = []; // 设置输出数组，用来存放要输出的一维数组
  if (!Array.isArray(treeObj) || treeObj.length === 0) {
    return treeObj;
  }
  temp = temp.concat(treeObj);
  // 首先把根元素存放入out中
  let pid = rootid;
  const obj = deepCopy(treeObj);
  const outObj = obj.map((item) => {
    delete item.children;
    return item;
  });
  out = out.concat(outObj);
  // 对树对象进行广度优先的遍历
  while (temp.length > 0) {
    const first = temp.shift();
    const { children } = first;
    if (rootid && first[idName || 'id'] === rootid) {
      temp = [];
      out = [];
    }
    if (children && children.length > 0) {
      // console.log(first)
      pid = first[idName || 'id'];
      const len = first.children.length;
      for (let i = 0; i < len; i++) {
        temp.push(children[i]);
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const obj = deepCopy(children[i]);
        obj.parentId = pid;
        delete obj.children;
        out.push(obj);
      }
    }
  }
  return out;
}
export function url2obj(url) {
  const urlobj = {};
  const urlArr = url.split(':');
  // eslint-disable-next-line prefer-destructuring
  urlobj.http = urlArr[0];
  urlobj.ip = urlArr[1].replace('//', '');
  const pathA = urlArr[2].split('/');
  const port = pathA.shift();
  urlobj.port = port;
  urlobj.path = `/${pathA.join('/')}`;

  if (url.indexOf('?') < 0) {
    urlobj.params = {};
  }
  urlobj.url = url.substring(0, url.indexOf('?') + 1);
  const paraString = url.substring(url.indexOf('?') + 1, url.length).split('&');
  urlobj.params = {};
  let keyvalue = [];
  let key = '';
  let value = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const i in paraString) {
    keyvalue = paraString[i].split('=');
    // eslint-disable-next-line prefer-destructuring
    key = keyvalue[0];
    // eslint-disable-next-line prefer-destructuring
    value = keyvalue[1];
    urlobj.params[key] = value;
  }
  return urlobj;
}

// 去除半选状态
export function checked(id, data, newArr) {
  data.forEach((item) => {
    if (item.id === id) {
      if (!item.children || item.children.length === 0) {
        newArr.push(item.id);
      }
    } else if (item.children && item.children.length !== 0) {
      checked(id, item.children, newArr);
    }
  });
}

// 获取近多少天起始日期/当年(type=1 为获取当年)
export function getDate(days, type = 0) {
  const nowDate = new Date();
  const nowYear = nowDate.getFullYear();
  let nowMonth = nowDate.getMonth() + 1;
  let nowDay = nowDate.getDate();
  if (nowMonth >= 1 && nowMonth <= 9) {
    nowMonth = `0${nowMonth}`;
  }
  if (nowDay >= 0 && nowDay <= 9) {
    nowDay = `0${nowDay}`;
  }
  const date = new Date(nowDate);
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = `0${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`;
  }
  const endDate = `${nowYear}-${nowMonth}-${nowDay}`;
  let startDate = `${year}-${month}-${strDate}`;
  if (type === 1) {
    startDate = `${nowYear}-01-01`;
  }
  return {
    startDate,
    endDate,
  };
}

//中国标准时间转化---yyyy-MM-dd 00:00:00
export function formatDate(date) {
  let formatDateTime;
  formatDateTime = new Date(date);
  formatDateTime =
    formatDateTime.getFullYear() +
    '-' +
    (formatDateTime.getMonth() + 1 > 9
      ? formatDateTime.getMonth() + 1
      : '0' + (formatDateTime.getMonth() + 1)) +
    '-' +
    (formatDateTime.getDate() > 9 ? formatDateTime.getDate() : '0' + formatDateTime.getDate()) +
    ' ' +
    (formatDateTime.getHours() > 9 ? formatDateTime.getHours() : '0' + formatDateTime.getHours()) +
    ':' +
    (formatDateTime.getMinutes() > 9
      ? formatDateTime.getMinutes()
      : '0' + formatDateTime.getMinutes()) +
    ':' +
    (formatDateTime.getSeconds() > 9
      ? formatDateTime.getSeconds()
      : '0' + formatDateTime.getSeconds());
  return formatDateTime;
}

// 判断字符串是不是json格式
export function isJSON(json) {
  if (typeof json == 'string') {
    const str = json.replace(/&nbsp;/g, '');
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
}
// 小数或整数
export const intOrDouble = /^[1-9][0-9]*(\.[0-9]{1,2})?$/;
/**
 * 中文
 */
export const chinese = /^[\u4E00-\u9FA5]{1,}$/g;

export const indexObj = {
  title: '序号',
  dataIndex: 'index',
  render: (_, record, index) => index + 1,
  width: 100,
  search: false,
};

/**
 * 联系电话-固话正则
 */
export const Phones = /(^[1][3,4,5,7,8]\d{9}$)|(^([0-9]{3,4}-)?[0-9]{7,8}$)/;

/**
 * 联系电话正则
 */
export const Phone =
  /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;
/**
 * 经度正则 0-180 小数点限制9位
 */
export const lon =
  /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,9})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
/**
 * 纬度正则 0-90  小数点限制9位
 */
export const lat = /^(\-|\+)?([0-8]?\d{1}\.\d{0,9}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
/**
 * 高度正则 判断整数或小数 判断6位整数2位小数
 */
export const Jalt = /(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/;

/**
 * 高度正则 判断整数或小数 整数限制9位 小数点限制两位
 */
export const alt = /(^[+]?(0|([1-9])){1,9}$)|(^[0-9]{1,9}[.]{1}[0-9]{1,2}$)/g;
/**
 * 数字+特殊符号
 */
export const numAndSymbol =
  /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、0-9]/im;

export const url = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/;

export const a_zAndNumber = /^[0-9a-zA-Z]{1,}$/;

export const onlyNumber = /^[+]{0,1}(\d+)$/;

export const fixed2 = /^\d{1,}(\.\d{1,2})?$/;

/**
 * 中文+数字+英文
 */
export const chinese_Figure_English = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9]){1,40}$/;

//判断循环引用
export const cycle = (obj, parent) => {
  //表示调用的父级数组
  var parentArr = parent || [obj];
  for (var i in obj) {
    if (typeof obj[i] === 'object') {
      //判断是否有循环引用
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      parentArr.forEach((pObj) => {
        if (pObj === obj[i]) {
          obj[i] = '[cycle]';
        }
      });
      cycle(obj[i], [...parentArr, obj[i]]);
    }
  }
  return obj;
};
// 公共方法
export const transitionJsonToString = (jsonObj, callback) => {
  // 转换后的jsonObj受体对象
  var _jsonObj = null;
  // 判断传入的jsonObj对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
  jsonObj = jsonObj
    ?.replace(/[，]/g, ',')
    .replace(/[,，]{1,}/g, ',')
    .replace(/[,，]\n\s{0,}\}/g, '\n}')
    .replace(/[,，]\n\s{0,}\]/g, '\n]');
  if (Object.prototype.toString.call(jsonObj) !== '[object String]') {
    try {
      _jsonObj = JSON.stringify(jsonObj);
    } catch (error) {
      // 转换失败错误信息
      console.error('您传递的json数据格式有误，请核对...');
      console.error(error);
      callback(error);
    }
  } else {
    try {
      if (!jsonObj) return;
      jsonObj = jsonObj.replace(/(\')/g, '"').replace(/&nbsp;/gi, '');
      _jsonObj = JSON.stringify(JSON.parse(jsonObj));
    } catch (error) {
      // 转换失败错误信息
      console.error('您传递的json数据格式有误，请核对...');
      console.error(error);
      callback(error);
    }
  }
  return _jsonObj;
};
// callback为数据格式化错误的时候处理函数
export const formatJson = (jsonObj, callback) => {
  // 正则表达式匹配规则变量
  // var reg = null;
  // 转换后的字符串变量
  var formatted = '';
  // 换行缩进位数
  var pad = 0;
  // 一个tab对应空格位数
  var PADDING = '    ';
  // json对象转换为字符串变量
  var jsonString = transitionJsonToString(jsonObj, callback);
  if (!jsonString) {
    return jsonString;
  }
  // 存储需要特殊处理的字符串段
  var _index = [];
  // 存储需要特殊处理的“再数组中的开始位置变量索引
  var _indexStart = null;
  // 存储需要特殊处理的“再数组中的结束位置变量索引
  var _indexEnd = null;
  // 将jsonString字符串内容通过\r\n符分割成数组
  var jsonArray = [];
  // 正则匹配到{,}符号则在两边添加回车换行
  console.log(jsonString);
  jsonString = jsonString.replace(/([\{\}])/g, '\r\n$1\r\n');
  // 正则匹配到[,]符号则在两边添加回车换行
  jsonString = jsonString.replace(/([\[\]])/g, '\r\n$1\r\n');
  // 正则匹配到,符号则在两边添加回车换行
  jsonString = jsonString.replace(/(\,)/g, '$1\r\n');
  // 正则匹配到要超过一行的换行需要改为一行
  jsonString = jsonString.replace(/(\r\n\r\n)/g, '\r\n');
  // 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
  jsonString = jsonString.replace(/\r\n\,/g, ',');

  // 特殊处理双引号中的内容
  jsonArray = jsonString.split('\r\n');
  jsonArray.forEach(function (node, index) {
    // 获取当前字符串段中"的数量
    var num = node.match(/\"/g) ? node.match(/\"/g).length : 0;
    // 判断num是否为奇数来确定是否需要特殊处理
    if (num % 2 && !_indexStart) {
      _indexStart = index;
    }
    if (num % 2 && _indexStart && _indexStart != index) {
      _indexEnd = index;
    }
    // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
    if (_indexStart && _indexEnd) {
      _index.push({
        start: _indexStart,
        end: _indexEnd,
      });
      _indexStart = null;
      _indexEnd = null;
    }
  });
  // 开始处理双引号中的内容，将多余的"去除
  _index.reverse().forEach(function (item) {
    var newArray = jsonArray.slice(item.start, item.end + 1);
    jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(''));
  });
  // 奖处理后的数组通过\r\n连接符重组为字符串
  jsonString = jsonArray.join('\r\n');
  // 将匹配到:后为回车换行加大括号替换为冒号加大括号
  jsonString = jsonString.replace(/\:\r\n\{/g, ':{');
  // 将匹配到:后为回车换行加中括号替换为冒号加中括号
  jsonString = jsonString.replace(/\:\r\n\[/g, ':[');
  // 将上述转换后的字符串再次以\r\n分割成数组
  jsonArray = jsonString.split('\r\n');
  // 将转换完成的字符串根据PADDING值来组合成最终的形态
  jsonArray.forEach(function (item) {
    var i = 0;
    // 表示缩进的位数，以tab作为计数单位
    var indent = 0;
    // 表示缩进的位数，以空格作为计数单位
    var padding = '';
    if (item.match(/\{$/) || item.match(/\[$/)) {
      // 匹配到以{和[结尾的时候indent加1
      indent += 1;
    } else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/)) {
      // 匹配到以}和]结尾的时候indent减1
      if (pad !== 0) {
        pad -= 1;
      }
    } else {
      indent = 0;
    }
    for (i = 0; i < pad; i++) {
      padding += PADDING;
    }
    formatted += padding + item + '\r\n';
    pad += indent;
  });
  // 返回的数据需要去除两边的空格
  return formatted.trim();
};

/**
 * 表格删除末页数据，跳回上一页
 *
 * @param total 数据总量
 * @param page  当前页数
 * @param size  当前页条数
 * @param delNum 删除数据条数
 */
export function calcPageNo(total, page = 1, size = 10, delNum = 1) {
  let pageNo = page;
  const restNum = total - size * (pageNo - 1);
  let pageNoDiff = Math.floor((delNum - restNum) / size) + 1;
  if (pageNoDiff < 0) {
    pageNoDiff = 0;
  }
  pageNo = pageNo - pageNoDiff;
  if (pageNo < 1) {
    pageNo = 1;
  }
  return pageNo;
}

//判断视域格式
export function formatPolygon(json) {
  const data = json || false;
  if (!Array.isArray(data)) {
    return null;
  } else {
    if (data.length < 3) return null;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (!item.hasOwnProperty('x') || !item.hasOwnProperty('y')) {
        return null;
      }
    }
    if (data[0].x !== data[data.length - 1].x || data[0].y !== data[data.length - 1].y) {
      data.push(data[0]);
    }
  }
  return data;
}
//截取小数点后(bit-1)位
export function getBit(value, bit = 7) {
  if (!value) return null;
  let str = value.toString();
  let strIndex = str.indexOf('.');
  if (strIndex === -1) return parseInt(str);
  if (str.length - (strIndex + 1) <= bit - 1) return parseFloat(str);
  str = str.substring(0, strIndex + bit);
  return parseFloat(str);
}
