class Device{
    os
    ver
    isPC
    constructor(){
        this.os=this.getBrowserInfo();
        this.ver=this.getOsVersion();
        let mobile=navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        this.isPC=!mobile;
    }
    get(){
        return {
            os:this.os,
            ver:this.ver,
            isPC:this.isPC
        };
    }
    getOsVersion() {
      var u = navigator.userAgent, version = ''
      if (u.indexOf('Mac OS X') > -1) {
        // ios
        var regStr_saf = /OS [\d._]*/gi
        var verinfo = u.match(regStr_saf)
        version = 'IOS' + (verinfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.')
      } else if (u.indexOf('Android') > -1 ||
          u.indexOf('Linux') > -1) {
        // android
        version = 'Android' + u.substr(u.indexOf('Android') + 8, u.indexOf(';', u.indexOf('Android')) - u.indexOf('Android') - 8)
      } else if (u.indexOf('BB10') > -1) {
        // 黑莓bb10系统
        version = 'blackberry' + u.substr(u.indexOf('BB10') + 5, u.indexOf(';', u.indexOf('BB10')) - u.indexOf('BB10') - 5)
      } else if (u.indexOf('IEMobile') > -1) {
        // windows phone
        version = 'winphone' + u.substr(u.indexOf('IEMobile') + 9, u.indexOf(';', u.indexOf('IEMobile')) - u.indexOf('IEMobile') - 9)
      } else {
        var userAgent = navigator.userAgent.toLowerCase()
        if (userAgent.indexOf('windows nt 5.0') > -1) {
          version = 'Windows 2000'
        } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
          version = 'Windows XP'
        } else if (userAgent.indexOf('windows nt 6.0') > -1) {
          version = 'Windows Vista'
        } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
          version = 'Windows 7'
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
          version = 'Windows 8'
        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
          version = 'Windows 8.1'
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
          version = 'Windows 10'
        } else {
          version = 'Unknown'
        }
      }
      return version
    }
    getBrowserInfo() {
        let agent = navigator.userAgent.toLowerCase();
        let arr = [];
        let system = agent.split(' ')[1].split(' ')[0].split('(')[1];
        arr.push(system);
        let REGSTR_EDGE = /edge\/[\d.]+/gi;
        let REGSTR_IE = /trident\/[\d.]+/gi;
        let OLD_IE = /msie\s[\d.]+/gi;
        let REGSTR_FF = /firefox\/[\d.]+/gi;
        let REGSTR_CHROME = /chrome\/[\d.]+/gi;
        let REGSTR_SAF = /safari\/[\d.]+/gi;
        let REGSTR_OPERA = /opr\/[\d.]+/gi;
        // IE
        if (agent.indexOf('trident') > 0) {
          arr.push(agent.match(REGSTR_IE)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_IE)[0].split('/')[1]);
          return arr;
        }
        // OLD_IE
        if (agent.indexOf('msie') > 0) {
          arr.push(agent.match(OLD_IE)[0].split(' ')[0]);
          arr.push(agent.match(OLD_IE)[0].split(' ')[1]);
          return arr;
        }
        // Edge
        if (agent.indexOf('edge') > 0) {
          arr.push(agent.match(REGSTR_EDGE)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_EDGE)[0].split('/')[1]);
          return arr;
        }
        // firefox
        if (agent.indexOf('firefox') > 0) {
          arr.push(agent.match(REGSTR_FF)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_FF)[0].split('/')[1]);
          return arr;
        }
        // Opera
        if (agent.indexOf('opr') > 0) {
          arr.push(agent.match(REGSTR_OPERA)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_OPERA)[0].split('/')[1]);
          return arr;
        }
        // Safari
        if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
          arr.push(agent.match(REGSTR_SAF)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_SAF)[0].split('/')[1]);
          return arr;
        }
        // Chrome
        if (agent.indexOf('chrome') > 0) {
          arr.push(agent.match(REGSTR_CHROME)[0].split('/')[0]);
          arr.push(agent.match(REGSTR_CHROME)[0].split('/')[1]);
          return arr;
        } else {
          arr.push('未获取到浏览器信息');
          return arr;
        }
    }
    // 判断是否APP容器
    cordova() {
      return window.cordova || location.protocol === 'file:'
    }
}

export default {
    install(vue){
        vue.prototype.$device=this.device;
    },
    device:new Device()
}


