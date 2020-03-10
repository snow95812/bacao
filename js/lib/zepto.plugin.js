(function($) {
	"use strict";
	/**
	 * @param {Number} duration
	 * @param {Object} [options]
	 * @returns {$.fn}
	 */
	$.fn.transition = function(duration, options) {
        if (duration === false) {
            //清除transition
            this.each(function() {
                $(this).transitionend(false);
                $(this).css({
                    '-ms-transition-property': 'none',
                    '-webkit-transition-property': 'none',
                    'transition-property': 'none'
                });
            });
        }
        else {
            //参数处理
            options || (options = {});
            duration = Number(duration) || 1000;
            options.delay = Number(options.delay) || 0;
            var transition = ['all', duration + 'ms', options.delay + 'ms', options.ease || 'ease-in'].join(' ');
            this.each(function() {
                $(this).css({
                    '-ms-transition': transition,
                    '-webkit-transition': transition,
                    'transition': transition
                });
                $(this).data('transitionTime', duration + options.delay);
            });
        }
        return this;
    };
  /**
   * @param {Function} callback
   * @returns {$.fn}
   */
	$.fn.transitionend = function(callback) {
        var transitionend = 'webkitTransitionEnd msTransitionEnd transitionend';
        this.each(function() {
            var timer = $(this).data('transitionendtimer');
            timer && clearTimeout(timer);
            $(this).off(transitionend);
            if (typeof callback == 'function') {
                var callbackTimer;
                var start = Date.now();
                var duration = $(this).data('transitionTime') || 0;

                var complete = function() {
                    $(this).off(transitionend);
                    callbackTimer && clearTimeout(callbackTimer);
                    var that = this;
                    callbackTimer = setTimeout(function() {
                        callback && callback.call(that);
                    }, 50);
                };
                $(this).on(transitionend, function(e) {
                    if (Date.now() - start >= 10) {
                        timer && clearTimeout(timer);
                        complete.apply(this, arguments);
                    }
                });
                timer = setTimeout(complete.bind(this), duration + 100);
                $(this).data('transitionendtimer', timer);
            }
        });
        return this;
    };
	/**
	 * @param {String|Boolean} className
	 * @param {Number} duration
	 * @param {Object|Function} options
	 * @param {Function} [callback]
	 * @returns {$.fn}
	 */
	$.fn.animation = function(className, duration, options, callback) {
    //解除绑定
        var animationEnd = 'webkitAnimationEnd MSAnimationEnd animationend';
    this.each(function() {
      var timer = $(this).data('animationendtimer');
      timer && clearTimeout(timer);
      $(this).off(animationEnd);
      var removeClass = ['alternate', 'infinite', $(this).data('animation') || ''];
      $(this).removeClass(removeClass.join(' ')).css({
          '-ms-animation-duration': null,
          '-ms-animation-delay': null,
          '-webkit-animation-duration': null,
          '-webkit-animation-delay': null,
          'animation-duration': null,
          'animation-delay': null
      });
    });
    //仅解除绑定
		if (className === false) {
			return this;
		}
    //处理参数
		if (typeof options == 'function') {
			callback = options;
			options = null;
		}
		if (typeof options != 'object') {
			options = {delay: options};
		}
		options || (options = {});
		$(this).data('animation', className);
		$(this).addClass(className + ' animated');
		duration = Number(duration) || 1000;
		var delay = Number(options.delay) || 0;
    this.each(function() {
      var timer;
      $(this).css({
          '-ms-animation-duration': duration + 'ms',
          '-ms-animation-delay': delay + 'ms',
          '-webkit-animation-duration': duration + 'ms',
          '-webkit-animation-delay': delay + 'ms',
          'animation-duration': duration + 'ms',
          'animation-delay': delay + 'ms'
      });
      if (options.loop) {
        $(this).addClass('infinite');
      }
      if (options.alternate) {
        $(this).addClass('alternate');
      }
      //回调
      var start = Date.now();
      var complete = function() {
        $(this).off(animationEnd);
        callback && callback.call(this);
      };
      $(this).on(animationEnd, function(e) {
        //部分手机支持animationend，但会直接执行回调
        //通过判断实际的动画时间检查
        if (Date.now() - start >= 10) {
          timer && clearTimeout(timer);
          complete.apply(this, arguments);
        }
      });
      //使用setTimeout兼容不支持回调的设备
      timer = setTimeout(complete.bind(this), duration + delay);
      $(this).data('animationendtimer', timer);
    });
		return this;
	};
	/**
     * @todo 支持X轴和Y轴的scale, rotate, skew
	 * @param {object|string} props
	 * @param {number} [delay]
	 * @returns {Zepto}
	 */
	$.fn.transform = function(props, delay) {
		props || (props = {});
		var values = props;
		if (typeof props == 'object') {
            var exists = function(name) {
                return props.hasOwnProperty(name) && props[name] != null;
            };
            var toPx = function(value) {
                return typeof value == 'number' ? (value + 'px') : value
            };
			if (exists('x') || exists('y') || exists('z')) {
                var translate3d = [props.x, props.y, props.z];
                translate3d = translate3d.map(function(value) {
                    return toPx(value || 0);
                });
				props.translate3d = translate3d.join(', ');
			}
			var transform = ['translate', 'translate3d', 'rotate', 'scale', 'skew', 'matrix'];
			values = [];
			Object.keys(props).forEach(function(key) {
				if (transform.indexOf(key) != -1) {
					var value = toPx(props[key]);
					values.push(key + '(' + value + ')');
				}
			});
		}
		var setCss = function() {
			if (values.length > 0) {
				values = values.join(' ');
				$(this).css('-ms-transform', values);
				$(this).css('-webkit-transform', values);
				$(this).css('transform', values);
			}
			else {
				$(this).css('-ms-transform', 'none');
				$(this).css('-webkit-transform', 'none');
				$(this).css('transform', 'none');
			}
		};
		if (delay === undefined) {
			setCss.call(this);
		}
		else {
			setTimeout(setCss.bind(this), delay);
		}
		return this;
	};
    $.fn.x = function(value, delay) {
        if (arguments.length == 0) {
            var transform = $(this).css('transform') || $(this).css('-webkit-transform') || $(this).css('-ms-transform') || '';
            var data = parseTranslate3d(transform);
            return data.x;
        }
        else {
            $(this).transform({x: value}, delay);
        }
    };
    $.fn.y = function(value, delay) {
        if (arguments.length == 0) {
            var transform = $(this).css('transform') || $(this).css('-webkit-transform') || $(this).css('-ms-transform') || '';
            var data = parseTranslate3d(transform);
            return data.y;
        }
        else {
            $(this).transform({y: value}, delay);
        }
    };
	$.fn.clip = function(top, right, bottom, left, delay) {
    if (top == null) {
      top = 0;
    }
    if (right == null) {
      right = $(this).width();
    }
    if (bottom == null) {
      bottom = $(this).height()
    }
    if (left == null) {
      left = 0;
    }
		var value = [top, right, bottom, left];
		value = value.map(function(val) {
			return val == null ? 'auto' : (val + 'px');
		});
    var setCss = function() {
      $(this).css('clip', 'rect(' + value.join(' ') + ')');
    };
    if (delay === undefined) {
      setCss.call(this);
    }
    else {
      setTimeout(setCss.bind(this), delay);
    }
		return this;
	};

    function parseTranslate3d(transform) {
        var search = transform.toString().match(/translate3d\(([^\,]*)\,([^\,]*)\,([^\,]*)\)/);
        if (search) {
            var x = search[1] || 0;
            var y = search[2] || 0;
            var z = search[3] || 0;
            var data = [x, y, z].map(function(text) {
                return Number(parseFloat(text.trim())) || 0;
            });
            return {
                x: data[0],
                y: data[1],
                z: data[2]
            };
        }
        else {
            return {x: 0, y: 0, z: 0};
        }
    }
})(window.Zepto);
