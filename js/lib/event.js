var zhJs = (function() {
	/*
		concat : 连接多个数组，返回一个新的组合数组，
		slice : 从某个已有的数组返回选定的元素,指定开始与结束，返回开始与结束之间的数组元素
	*/
    var zhLib = {}, $, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter, concat = emptyArray.concat,
    	isMobile = ('ontouchstart' in window) ? true : false,
		eventStar = isMobile ? 'touchstart' : 'mousedown',
		eventEnd  = isMobile ? 'touchend' : 'mouseup',
		eventMove = isMobile ? 'touchmove' : 'mousemove',
		readyRE = /complete|loaded|interactive/,//页面加载状态集合
		//规范化样式属性:例：background-image转换成backgroundImage;
		standardCss = function(str){return str.match('-') ? str.replace(/-\w/g,function(match){return match.toString().split('-')[1].toUpperCase()}) : str};

    $$ = function(selecter){
	    var dom = zhLib.selector(document,selecter) || [];
	    dom.prototype = $$.fn;
	    dom.__proto__ = $$.fn;
	    return dom;
    }

    zhLib.changeToDom = function(dom, selector){
	    dom = dom || [];
	    dom.__proto__ = $$.fn;
	    dom.selector = selector || '';
	    return dom
    }

	zhLib.binds = function(el,event,eventArr){
		
	}


	//判断手势移动方向
	function swipeDirections(x1, x2, y1, y2) {
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
        if (Math.abs(xDelta - yDelta) && xDelta >= yDelta) {
            return (x1 - x2 > 30 ? "Left" : "Right");
        } else {
            return (y1 - y2 > 30 ? "Up" : "Down");
        }
    }
    var langTapTimer = 0;
    function addEvent(el,event,fn,useCatpure, one){
	    var stype, startX, startY, now, last, endX, endY, langTap, tap, swipeLeft, swipeRight, swipeUp, swipeDown, langTime = 500, moveE;
	    if(event.match("longTap:")){
		    langTime = parseInt(event.split(':')[1],10);
		}
		
		function startEventHalde(e){
			var touches = isMobile ? e.touches[0] : e;
				startX = touches.clientX;
				startY = touches.clientY;
				langTapTimer && clearTimeout(langTapTimer);
				now = Date.now();
			el.addEventListener(eventMove, moveEventHalde, useCatpure);
			langTapTimer = setTimeout(function(){
				if(Date.now() - now >= langTime){
					clearTimeout(langTapTimer);
					el.removeEventListener(eventMove, moveEventHalde, useCatpure);
					langTapTimer = 0;
					if(event.match('long')) fn.call(el,e);
				}
			},langTime)
		}
		function moveEventHalde(ex){
			clearTimeout(langTapTimer);
			langTapTimer = 0;
			var touches = isMobile ? ex.changedTouches[0] : ex;
			var endX = touches.clientX,
				endY = touches.clientY,
				last = Date.now(),
			    swipe = swipeDirections(startX, endX, startY, endY);
			/*if(swipe == 'Up')
				stype = 'swipeUp';
			else if(swipe == 'Down')
				stype = 'swipeDown';
			else if(swipe == 'Left')
				stype = 'swipeLeft';
			else if(swipe == 'Right'){
				stype = 'swipeRight';
			}
			if(event == stype){
				fn.call(el, touches)
			}*/
			//if(event.match('swipe')) fn.call(el, ex)
		}
		function endEventHalde(e){
			//console.log('eventEnd = ',el)
			el.removeEventListener(eventMove, moveEventHalde, useCatpure);
			clearTimeout(langTapTimer);
			if(langTapTimer != 0){
				var touches = isMobile ? e.changedTouches[0] : e,
					endX = touches.clientX;
					endY = touches.clientY;
					last = Date.now();
				var swipe = swipeDirections(startX, endX, startY, endY);
				if( Math.abs(startX - endX) < 6 && Math.abs(startY - endY) < 6 )
					stype = 'tap';
				else if(swipe == 'Up')
					stype = 'swipeUp';
				else if(swipe == 'Down')
					stype = 'swipeDown';
				else if(swipe == 'Left')
					stype = 'swipeLeft';
				else if(swipe == 'Right'){
					stype = 'swipeRight';
				}
				if(one){
					el.removeEventListener(eventStar, startEventHalde, useCatpure);
					el.removeEventListener(eventEnd, endEventHalde, useCatpure);
				}
				if(event == stype){
					fn.call(el, e)
				}
			}
		}
		el.addEventListener(eventStar, startEventHalde, useCatpure);
		el.addEventListener(eventEnd, endEventHalde, useCatpure);
    }
    $$.fn = {
	    version : 'Base Ver 1.0',
	    isZh : true,
	    ready: function(callback){
	      if (readyRE.test(document.readyState) && document.body) callback($)
	      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
	      return this
	    },
	    on : function(event,fn,useCatpure, one){
		    var _this = this;
		    event.split(' ').forEach(function(ev){
				return addEvent(_this.get(0),ev,fn,(useCatpure ? useCatpure : false), one)
			})
	    },
	    binds : function(event,fn,useCatpure, one){
			if(this.length == 0) return false;
			var _this = this;
			if(_this.length == 1) _this.on(event,fn,useCatpure, one)
			else $$.each(_this, function(i, t){$(t).on(event,fn,useCatpure, one)})
			return _this;
		},
		one : function(event, fn, useCatpure){
			return this.binds(event, fn, useCatpure, true)
		},
		longTap : function(fn){
			return this.binds('longTap',fn)
		},
		tap : function(fn){
			return this.binds('tap',fn)
		},
		event : {},
	    slice : function(){
		    return $(slice.apply(this, arguments))
	    },
	    get : function(sn){
		    return this[sn ? sn : 0];
	    },
	    eq : function(sn){
		    return $(this[sn ? sn : 0])
	    },
	    last : function(){
		    return $(this[this.length - 1]);
	    },
	    first : function(){
		    return $(this[0]);
	    },
		map : function(fn){
			return　$$.map(this,function(i,t){return fn.call(t, i)});
		},
		//查找无素
	    finds : function(selecter){
		    var elements = this;
		    if(elements.length == 0) return $()
		    var mapV = this.map(function(){
		    	return zhLib.selector(this,selecter);
		    })
		    return zhLib.changeToDom(mapV, selecter)
	    },
	    //无素个数
	    size : function(){
		    return this.length;
	    },
	    //无素在zh对象中的位置
	    indexOf : function(element){
		    return $$.indexOf(this,element)
	    },
	    //循环　－　依托$$.each方法
	    each : function(callback){
		    return $$.each(this,callback);
	    },
	    //隐藏元素
	    hide : function(fn){
		    this.get(0).style.display="none";
	    },
	    //显示元素
	    show : function(fn){
		    this.get(0).style.display="block";
	    },
	    //添加元素属性,如果vlaue为空，则获取对应的prop的值
	    attr : function(prop,value){
		    if(value){
			    this.get(0).setAttribute(prop,value);
			    //this.get(0)[prop] = value;
			    return;
		    }else{
			    return this.get(0).getAttribute(prop);
		    }
	    },
	    //删除元素属性
	    removeAttr : function(prop){
		    this.get(0).removeAttribute(prop)
	    },
	    //只针对input type为checkbox radio两个控件。
		prop : function(attr,checked){
			if(checked){
				this.attr(attr,checked);
			}else{
				this.removeAttr(attr);
			}
		},
	    parent : function(){
			return $(this.get(0).parentNode);
		},
		next : function(tag){
			var nextEle = this.get(0).nextElementSibling;
			var tags = this.get(0).nodeName;
			if(nextEle == null) return [];
			if(tag){
				if(tag.indexOf(".") != -1){
					var split = tag.split('.');
					if(split[0] != null){
						while(nextEle != null && nextEle.className.indexOf(split[1]) == -1){
							nextEle = nextEle.nextElementSibling;
						}
					}
				}else{
					while(nextEle != null && nextEle.nodeName != tag.toUpperCase()){
						nextEle = nextEle.nextElementSibling;
					}
				}
			}else{
				while(nextEle != null && nextEle.nodeName != tags){
					nextEle = nextEle.nextElementSibling;
				}
			}
			return $(nextEle);
		},
		prev : function(){
			return $(this.get(0).previousElementSibling);
		},
		//获取当前对象同级元素
	    siblings : function(tag){
			var $parent = this.parent();
			return tag ? $parent.finds(tag) : $parent.clildren();
		},
		clildren : function(){
			var d = this.get(0).childNodes;
			var dom = [];
			for(i=0;i<d.length;i++){
				if(d[i].nodeName != "#text"){
					dom.push(d[i])
				}
			}
			return $(dom);
		},
		insertAfter : function(html){
			this.get(0).insertAdjacentHTML('afterBegin',html.outerHTML)
		},
	    appendTo : function(targetDom){
		    targetDom.get(0).appendChild(this);
	    },
	    css : function(property, value){
		    var _this = this;
		    if(arguments.length >= 2){
			    match = property.match(/-\w/g);
			    property = standardCss(property)
			    $$.each(_this,function(i, t){
				    t.style[property] = value
			    })
		    }else{
			    for(key in property){
				    $$.each(_this,function(i, t){
					    t.style[standardCss(key)] = property[key]
				    })
			    }
		    }
	    },
	    swapClass : function(className){
		    if(!className) return false;
		    var _this = this.get(0),
		    	thisClass = _this.className,
		    	classArr = thisClass.split(' ') > 0 ? thisClass.split(' ') : [];
		    if(classArr.length == 1){
			    _this.className = '';
			    return;
		    }
		    if(thisClass.match(className)){
			    classArr.splice($$.indexOf(classArr,className),1);
		    }else{
			    classArr.push(className);
		    }
		    _this.className = classArr.join(' ');
	    },
	    setClass : function(type,className){
		    var _this = this.get(0),
		    	thisClass = _this.className,
		    	classArr = thisClass.split(' ').length > 0 ? thisClass.split(' ') : [];
		    if(type == 0){
			    //删除
			    if(thisClass.match(className)) classArr.splice($$.indexOf(classArr,className),1);
		    }else if (type == 1){
			    //添加
			    if(!thisClass.match(className)) classArr.push(className);
		    }
		    _this.className = classArr.join(' ');
	    },
	    removeClass : function(className){
		    if(!className) return false;
		    if(this.size() > 1){
			    $$.each(this,function(i, t){
				    $$(t).setClass(0,className)
			    })
		    }else this.setClass(0,className);
	    },
	    addClass : function(className){
		    if(!className) return false;
		    if(this.size() > 1){
			    $$.each(this,function(i, t){
				    $$(t).setClass(1,className)
			    })
		    }else this.setClass(1,className);
	    }
	}

	$$.fn.offset = function(){
		var obj = this[0].getBoundingClientRect()
        return {
	        left: obj.left + window.pageXOffset,
	        top: obj.top + window.pageYOffset/*,
	        width: Math.round(obj.width),
	        height: Math.round(obj.height)*/
        }
	}
    $$.isArray = Array.isArray || function(object){ return object instanceof Array };
	$$.isFunction = function(fn){
		return typeof fn == 'function';
	}
	$$.indexOf = function(arr, element){
	    var _this = arr;
	    if($$.isArray(_this)){
		    for (var i = 0; i < _this.length; i++) {
				if (_this[i] == element) {
					return i;
				}
			}
			return -1;
	    }
    }
    $$.elementsFilterByAttribute = function(dom,filter){
	    var attrName = filter.split('=')[0],
	    	attrValue = filter.split('=')[1],
	    	doms = [];
	    $$.each(dom,function(i, t){
		    if(t.getAttribute(attrName) == attrValue){
			    doms.push(t)
		    }
	    })
	    return $(doms);
    }
    $$.each = function(elements,fn){
	    var i,key;
	    if($$.isArray(elements))
			for(i = 0; i < elements.length; i++){
				if($$.isFunction(fn)){
					fn(i, elements[i]);
				}
			}
		else
			for(key in elements){
				if($$.isFunction(fn)){
					fn.call(key, elements[i])
				}
			}
	}
	$$.map = function(elements,fn){
		var i,key,v = [],vf;
	    if($$.isArray(elements)){
			for(i = 0; i < elements.length; i++){
				if($$.isFunction(fn)){
					vf = fn(i, elements[i]);
					if(vf.length>0) v.push(vf);
				}
			}
		}else{
			for(key in elements){
				if($$.isFunction(fn)){
					vf = fn(key, elements[i])
					if(vf.length>0) v.push(vf);
				}
			}
		}
		return concat.apply([],v);
	}
    zhLib.selector = function(elements,selecter){
	    var dom = [],selecterProx;
		if(!selecter) return false;
		var d = elements,
			isId = selecter[0] === '#',
			isClass = selecter[0] === '.',
			isTag = isId || isClass ? false : true,
			//haveProp = selecter[0].match(/[]/g),
			selector = isTag ? ((typeof selecter == 'string' && selecter.indexOf('[') > -1) ? selecter.substring(0,selecter.indexOf('[')) : selecter) : selecter.slice(1);
		if(typeof selecter == 'string'){
			if(selecter.indexOf('[') >= 0 && selecter.indexOf(']') >= 0){
				selecterProx = selecter.substring(selecter.indexOf('[')+1,selecter.indexOf(']'))
			}
		}
		if(selecter.isZh){
			return selecter;
		}else if(isId){
			var d = d.getElementById(selector);
			d && dom.push(d); //如果找到这外委会元素，则向dom里添加，否则不返回任何值，保持原dom值;
		}else if(isClass){
			var d = d.getElementsByClassName(selector);
			d && (dom = slice.call(d));
		}else if((typeof selecter == 'object' || selecter.nodeName == '#document')){
			dom = selecter.length > 1 ? selecter : [selecter] ;
		}else if(isTag){
			var d = d.getElementsByTagName(selector);
			d && (dom = slice.call(d));
		}
		if(selecterProx){
			dom = $$.elementsFilterByAttribute(dom,selecterProx)
		}
		return dom;
    };
    
    return $$;
})()
window.zhJs = zhJs;
window.$$ === undefined && (window.$$ = zhJs);

function log() {
	if (typeof console != 'undefined') {
		if (console.debug) {
			console.debug(arguments);
		} else {
			(console.log(typeof JSON != 'undefined' ? JSON.stringify([].slice
					.call(arguments, 0)) : arguments));
		}
	}
};