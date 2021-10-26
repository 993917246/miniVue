"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _proxy = require("./proxy.js");

var _mount = require("./mount.js");

var _render = require("./render.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var uid = 0;

var miniVue =
/*#__PURE__*/
function () {
  function miniVue() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, miniVue);

    console.log(options); // 初始化vue对象

    this._init(options);
  }

  _createClass(miniVue, [{
    key: "_init",
    value: function _init(options) {
      var vm = this; // 初始化

      vm.uid = uid++; //vm唯一id

      vm._isVue = true; //是否是vue实例
      // 执行beforeCreate生命周期

      options.beforeCreate && options.beforeCreate.call(vm); // 注入代理后的data

      if (options.data) {
        vm._data = (0, _proxy.ProxyData)(vm, options.data, '');
      } // 创建vnode虚拟dom


      if (options.el) {
        var rootDom = document.querySelector(options.el);
        vm._vnode = (0, _mount.mount)(vm, rootDom);
        (0, _render.prepareRender)(vm, vm._vnode);
        (0, _render.getTemplate2Vnode)();
        (0, _render.getVnode2Template)();
      }
    }
  }]);

  return miniVue;
}();

exports["default"] = miniVue;