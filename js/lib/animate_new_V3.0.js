(function(){
	var getCssPreFix = function(){
		var userAgent = navigator.userAgent,
			isWebkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false,
			isIe = userAgent.match(/MSIE 10.0/i)||userAgent.match(/Trident\/7/i) ? true : false,
			isFennec = userAgent.match(/Firefox/) ? true : false,
			isOpera = userAgent.match(/Opera/) ? true : false,
			cssPreFix = isWebkit ? "Webkit" : isFennec ? "Moz" : isIe ? "ms" : isOpera ? "O" : "",
			open = isOpera ? "3d(" : "3d(",
			close = isOpera ? ",0)" : ",0)";
		var transitionEnd = cssPreFix.replace(cssPreFix.charAt(0), cssPreFix.charAt(0).toLowerCase()) + 'TransitionEnd';
		return {'preFix':cssPreFix,'open':open,'close':close, 'transEnd' : transitionEnd};
	}
	var body=document.body || document.documentElement,
		style=body.style,
		css = getCssPreFix();
	transitionEnd=(function(){
        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        }
        for(var name in transEndEventNames){
            if(typeof style[name] === "string"){
 				return transEndEventNames[name]
            }
        }
    })();


	$$.fn.animation = function(parame, oldPage){
		return new css3Animation(parame, this);
	}
	$$.fn.linkPage = function(targerPage, parame){
		var _this = this;
		targerPage.get(0).style['display'] = 'block';
		parame.isInit = parame.time ? false : true;
		var transAnimate = new css3Animation(parame, targerPage, _this);
		return transAnimate;
	}





	var css3Animation = function(parame,page, oldPage){
		this.x = parame.x;
		this.y = parame.y;
		this.time = parame.time;
		this.complete = parame.complete;
		this.isInit = parame.isInit;
		this.oldPage = oldPage;
		this.isActive = true;
		this.el = page.get(0);
		var _this = this;
		return _this.animate();
	}
	css3Animation.prototype = {
		animate : function(){
			var _this = this,
				trans = 'translate'+css.open + _this.x + ',' + _this.y + (_this.z ? (',' + _this.z) : '') + css.close,
				time = _this.time ? _this.time + 'ms' : '0.01s';
			if(this.isActive){
				this.isActive = false;
				
				_this.el.style[css.preFix + "TransitionProperty"] = "all";
				_this.el.style[css.preFix + "TransitionDuration"] = time;
				_this.el.style[css.preFix + "TransitionTimingFunction"] = "linear";
				_this.el.style[css.preFix + 'Transform'] = trans;
				var aniamtionStop = function(e){
					e.preventDefault();
					this.isActive = true;
					_this.initCurrentPageAnimation();
					_this.el.removeEventListener(transitionEnd, aniamtionStop, false)
					if(typeof _this.complete == 'function') _this.complete();
				}
				_this.el.addEventListener(transitionEnd, aniamtionStop, false);
				return $$(_this.el)
			}
		},
		animationComplete : function(){
			var _this = this;
		},
		initCurrentPageAnimation : function(){
			var _this = this;
			if(_this.oldPage){
				this.oldPage.get(0).style.display = 'none';
			}
			_this.el.style[css.preFix + "TransitionProperty"] = "none";
			_this.el.style[css.preFix + "TransitionDuration"] = '0s';
			_this.el.style[css.preFix + "TransitionTimingFunction"] = "linear";
			_this.el.style[css.preFix + 'Transform'] = 'none';
			
		}
	}

	
})()