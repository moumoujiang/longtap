/*
 * 不带参数指令
 * v-longtap=longHandler
 * or
 * 带参数指令
 * v-longtap=longHandler($index,el,$event)
 *
 * !!!新增!!!
 *
 * */
import soundPlay from './sound'
import device from './device'
var vueLongtap = {};
var isVue3 = false;
var preventDefaultException = {
  tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
};
var passiveSupported = false;
try {
  var options = Object.defineProperty({}, "passive", {
    get: function () {
      passiveSupported = true;
    }
  });
  window.addEventListener("test", null, options);
  window.removeEventListener("test", null, options);
} catch (err) {}
/**                               公用方法开始                 **/
function isPc() {
  return device.device.isPC;
}

function preventDefaultTest(el, exceptions) {
  for (var i in exceptions) {
    if (exceptions[i].test(el[i])) {
      return true;
    }
  }
  return false;
}

function isLongtap(self) {
  if (isVue3 ? self.disabled : self.el.disabled) {
    return false;
  }
  return self.isLongtap;
}

function touchstart(e, self) {
  // return;
  self.isLongtap = false;
  self.longtapMove = true
  clearTimeout(self.timer)
  self.timer = setTimeout(() => {
    self.isLongtap = true;
    self.longtapMove = false
    self.longHandler(e, isPc());
    if(self.soundPlay) soundPlay.playTap()
    clearTimeout(self.timer)
  }, 500)
  // 记录初始位置
  self.longTapObj.distanceX = 0;
  self.longTapObj.distanceY = 0;
  if (isPc()) {
    var longTapObj = self.longTapObj;
    longTapObj.pageX = e.pageX;
    longTapObj.pageY = e.pageY;
  } else {
    var touches = e.touches[0];
    var longTapObj = self.longTapObj;
    longTapObj.pageX = touches.pageX;
    longTapObj.pageY = touches.pageY;
  }


}

function touchmove(e, self) {
  // console.log(self.longtapMove&&distance(e,self))
  if (self.longtapMove && !distance(e, self)) {
    clearTimeout(self.timer)
    return;
  }
}

function touchend(e, self) {
  if (!isLongtap(self)) {
    clearTimeout(self.timer)
    return;
  }
  self.isLongtap = false;
  self.longtapMove = false
}
// 判断手指是否移动超过阈值
function distance(e, self) {
  var longTapObj = self.longTapObj;
  if (isPc()) {
    longTapObj.distanceX = longTapObj.pageX - e.pageX;
    longTapObj.distanceY = longTapObj.pageY - e.pageY;
  } else {
    if (e.changedTouches.length) {
      var touches = e.changedTouches[0];
      longTapObj.distanceX = longTapObj.pageX - touches.pageX;
      longTapObj.distanceY = longTapObj.pageY - touches.pageY;
    }
  }
  // console.log(longTapObj)
  return Math.abs(longTapObj.distanceX) < 20 && Math.abs(longTapObj.distanceY) < 20;
}
/**                               公用方法结束                 * */
var Vue3 = {
  bind: function (el, binding) {
    el.longTapObj = {};
    el.longHandler = function (e, isPc) { //This directive.longHandler
      var value = binding.value;
      if (!value && el.href && !binding.modifiers.prevent) {
        return window.location = el.href;
      }
      value.event = e;
      !isPc ? value.longTapObj = el.longTapObj : null;
      value.methods.call(this, value);
    };
    if (isPc()) {
      el.addEventListener('mousedown', function (e) {
        // console.log(binding.value.methods,'++++++++++++++')
        var value = binding.value;
        if (value.stop)
          e.stopPropagation();
        if (binding.modifiers.prevent || value['prevent-event'])
          e.preventDefault();
        if (!binding.modifiers["no-sound"]) el.soundPlay = true
        touchstart(e, el)
      }, passiveSupported ? {
        passive: true
      } : false);
      el.addEventListener('mousemove', function (e) {
        var value = binding.value;
        if (value.stop)
          e.stopPropagation();
        if (binding.modifiers.prevent || value['prevent-event'])
          e.preventDefault();
        touchmove(e, el)
      }, passiveSupported ? {
        passive: true
      } : false);
      el.addEventListener('mouseup', function (e) {
        var value = binding.value;
        if (value.stop)
          e.stopPropagation();
        if (binding.modifiers.prevent || value['prevent-event'])
          !passiveSupported&&e.preventDefault();
        touchend(e, el)
      }, passiveSupported ? {
        passive: true
      } : false);
    } else {
      el.addEventListener('touchstart', function (e) {
        var value = binding.value;
        if (value.stop || binding.modifiers.stop || value['prevent-stop'])
          e.stopPropagation();
        if (binding.modifiers.prevent || value['prevent-event'])
        !passiveSupported&&e.preventDefault();
        try {
          Object.defineProperty(e, 'currentTarget', { // 重写currentTarget对象 与jq相同
            value: el,
            writable: true,
            enumerable: true,
            configurable: true
          })
        } catch (e) {
          // ios 7下对 e.currentTarget 用defineProperty会报错。
          // 报“TypeError：Attempting to configurable attribute of unconfigurable property”错误
          // 在catch里重写
          e.currentTarget = el
        }
        if (!binding.modifiers["no-sound"]) el.soundPlay = true
        touchstart(e, el);
      }, passiveSupported ? {
        passive: true
      } : false);
      el.addEventListener('touchmove', function (e) {
        if (e.target == el || !preventDefaultTest(e.target, preventDefaultException)) {
          !passiveSupported&&e.preventDefault();
        }
        touchmove(e, el)
      }, passiveSupported ? {
        passive: true
      } : false);
      el.addEventListener('touchend', function (e) {
        if (e.target == el || !preventDefaultTest(e.target, preventDefaultException)) {
          !passiveSupported&&e.preventDefault();
        }
        touchend(e, el);
      }, passiveSupported ? {
        passive: true
      } : false);
    }
  },
  componentUpdated: function (el, binding) {
    el.longTapObj = {};
    el.longHandler = function (e, isPc) { //This directive.longHandler
      var value = binding.value;
      if (!value && el.href && !binding.modifiers.prevent) {
        return window.location = el.href;
      }
      value.event = e;
      !isPc ? value.longTapObj = el.longTapObj : null;
      value.methods.call(this, value);
    };
  },
  unbind: function (el) {
    // 卸载，别说了都是泪
    el.longHandler = function () {};
  }
};

vueLongtap.install = function (Vue) {
  if (Vue.version.substr(0, 1) > 1) {
    isVue3 = true;
  }

  Vue.directive('longtap', Vue3);
};

export default vueLongtap;