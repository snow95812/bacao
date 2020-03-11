var modjs = function(t) {
	"use strict";
	var n = {},
		e = function(t, e) {
			3 === arguments.length && (e = arguments[2]), n[t] = "function" == typeof e ? e : {
				exports: e
			}
		},
		i = function(t, e) {
			setTimeout(function() {
				if (n.hasOwnProperty(t)) {
					var i = r(t);
					e && e(i)
				}
			}, 0)
		},
		r = function(t) {
			if (n.hasOwnProperty(t)) {
				if ("function" == typeof n[t]) {
					var e = {};
					e.exports = {};
					var i = n[t](r, e.exports, e);
					void 0 !== i && (e.exports = i), n[t] = e
				}
				return n[t].exports
			}
			throw new Error("module[" + t + "] not defined")
		};
	return t.define = e, {
		define: e,
		use: i,
		require: r
	}
}(window);
(function(window){
	var audios = document.getElementById('audio');
	$('.music_play').bind('touchend',function(){
		audios.pause();
		$('.music_play').hide();
		$('.music_pause').show();
	})
	$('.music_pause').bind('touchend',function(){
		audios.play();
		$('.music_pause').hide();
		$('.music_play').show();
	})
	$.fn.fadeIn = function(){
		var i=0;
		var _this = this.get(0);

		_this.style.display = 'block';
		_this.style.opacity = i;
		var timers = setInterval(function(){
			i = i + 0.05;
			_this.style.opacity = i;
			if(i >= 1){
				clearInterval(timers);
			}
		},1)
	}
	$.fn.fadeOut = function(){
		var i=1;
		var _this = this.get(0);
		if(!_this) return;
		_this.style.opacity = i;
		var timers = setInterval(function(){
			i = i - 0.05;
			_this.style.opacity = i;
			if(i <= 0){
				_this.style.display = 'none'
				clearInterval(timers);
			}
		},1)
	}

	function showMessage(){
		$('#message').fadeIn();
	}

	function startHomeAnimate(){
		$('#home').addClass('animate');
	}
	function pageAnimate($currentPage, $targetPage, fn, isBack){
		var pageRunningTime = 400;
			currentPage = $currentPage.get(0),
			fn = eval($targetPage.attr('data-fn')),
			targetpage = $targetPage.get(0);
		$$(currentPage).animation({
			x : '0%',
			y : '0%',
			complete : function(){
				$$(currentPage).animation({
					x : '0%',
					y : '-100%',
					time : pageRunningTime,
					complete : function(){
						$currentPage.removeClass('show')
						$targetPage.addClass('show')
						if($targetPage.attr('after-data-fn')){
							var afn = eval($targetPage.attr('after-data-fn'));
							if(typeof afn == 'function') afn();
						}

						if(typeof fn == 'function') fn();
					}
				}).linkPage($$(targetpage), {
					x : '0%',
					y : '0%',
					time : pageRunningTime
				})
			}
		}).linkPage($$(targetpage), {
			x : '0%',
			y : '100%'
		})

	}


	window.toPage = function($target, targetPage, data, fn){
		var currentPage = '',
			targetPage = $('#' + targetPage);
		currentPage = $target.parents('div[data-role="page"]').size() > 0 ? $target.parents('div[data-role="page"]') : $('div.show');
		$('#layerLevel').fadeOut();
		$('#layerRule').fadeOut();
		$('#layer_mask').fadeOut();
		pageAnimate(currentPage, targetPage, function(){
			if(typeof fn == 'function') fn();
		}, ($target.hasClass('btn_back') ? true : false))
	}


	//提交收货地址
	function submitForm($target){
		var name = $('#name').val(),
			mobile = $('#mobile').val(),
			address = $('#address').val();
		$.ajax({
			url:'index.php?s=Home&c=Index&a=add',
			type:'POST',
			data : {
				name : name,
				mobile : mobile,
				address : address,
				sure_num : sure_nums
			},
			dataType:'json',
			success : function(rs){
				if(rs.error_code == '10000'){
					userInfoInputed = 1//已添加用户信息了

					var percent=rs.share_percent;
					var num=rs.num;

					shareInfo = {
							title : '我成功制作了'+num+'个月饼，成功打败了'+percent+'%的粮粉，试试你能做几个？',
							desc : '没有月饼的中秋不是好假期，玩游戏看看你能制作几个月饼',
							link : 'http://citiczq.appinside.com',
							imgUrl : 'http://citiczq.appinside.com/share.jpg'
					}
					wx.onMenuShareAppMessage(shareInfo);
					wx.onMenuShareTimeline(shareInfo);
					wx.onMenuShareQQ(shareInfo);
					wx.onMenuShareWeibo(shareInfo)

					toPage($target, 'sharePage')
				}else{
					alert(rs.error);
				}
			}
		})
		//toPage($target, 'sharePage')
	}


	function fontScroll(){
		audios.pause();
		var speed = 40
		// 向上滚动
		var demo = document.getElementById("demo");
		var demo2 = document.getElementById("demo2");
		var demo1 = document.getElementById("demo1");
		demo2.innerHTML = demo1.innerHTML
		function Marquee() {
		    if (demo.scrollTop >= demo1.offsetHeight) {
		        demo.scrollTop = 0;
		    } else {
		        demo.scrollTop = demo.scrollTop + 1;
		    }
		}
		var MyMar = setInterval(Marquee, speed)
		demo.onmouseover = function() {
		    clearInterval(MyMar)
		}
		demo.onmouseout = function() {
		    MyMar = setInterval(Marquee, speed)
		}
	}

	window.showLayer = function(obj){
		$('#'+obj).fadeIn();
		$('#layer_mask').fadeIn();
	}
	window.hideLayer = function(obj){
		$('#'+obj).fadeOut();
		$('#layer_mask').fadeOut();
	}

	window.executionFun = function($target, actionType, actionObject, data){
		switch(actionType){
			case 'toPage':{
				toPage($target, actionObject, data, ($target.attr('data-fn') ? eval($target.attr('data-fn')) : ''))
				break;
			}
			case 'runFn':{
				if(actionObject.indexOf('->') > -1){
					actionObject = actionObject.replace('->', '.')
				}
				var fn = eval(actionObject);
				fn($target, actionType, actionObject);
				//if(typeof fn == 'funciton') fn();
				break;
			}
			case 'showLayer' : {
				showLayer(actionObject)
				break;
			}
			case 'closeLayer' : {
				$target.parents('.layer_style').fadeOut();
				$('#layer_mask').fadeOut();
				break;
			}
		}
	};

	$$(document).binds('tap',function(e){
		var $target = $(e.target);
		while($target[0]){
			var action = $target.attr('action');
			if(action){
				var action_type = action.split(".")[0],
					action_option = action.split('.')[1];
				executionFun($target, action_type, action_option);
				break;
			}else{
				$target = $target.parent();
			};
		};
	})

})(window)
