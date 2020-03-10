var d = document,
	gameTime = d.getElementById('timeCountDown'),
	pointBad = d.getElementById('gameBad'),
	gameGoods = d.getElementById('gameGoods'),
	countDown = d.getElementById('count_down'),
	goods_name = ['','面皮','月饼馅儿'],
	screenItems = [],
	speed  = [2,3,4],
	winHeight = window.innerHeight,
	winWidth = window.innerWidth,
	defaultLevelSingleTime = 20,//单关时间
	canvas = d.getElementById('canvas'),
	stage = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var emTpx = function(em){
	return em * (winWidth / 750 * 24);
}
var delItems = function(id){
	for(var i=0;i<screenItems.length;i++){
		if(screenItems[i].id == id){
			screenItems.splice(i,1);
		}
	}
}

var panziLocation = [0, emTpx(11.125), emTpx(22.25)];
var panziWH = [[], [emTpx(9), emTpx(4.54)], [emTpx(9), emTpx(4.54)], [emTpx(9), emTpx(13.375)]]
var panzi = function(level){
	this.level = level
	this.init();
}
panzi.prototype = {
	init : function(){
		var _this = this;
		this.item = new Image();
		this.item.src = 'Public/images/game_'+ this.level +'.png';
		this.width = panziWH[this.level][0];
		this.height = panziWH[this.level][1];
		this.locations = 1;
		this.timer = null;
		this.top = winHeight - this.height;
		this.left = panziLocation[this.locations];
		this.item.onload = function(){
			_this.moveTo('', _this.locations);
			return this;
		}
	},
	moveTo : function(locations, direction){
		var _this = this;
		this.stop = false;
		if(direction == 'left'){
			this.left = this.left - 10;
			if(this.left <= panziLocation[this.locations]){
				this.stop = true;
				this.left = panziLocation[this.locations]
				cancelAnimationFrame(_this.timer)
			}
			
		}else if(direction == 'right'){
			this.left = this.left + 10;
			if(this.left >= panziLocation[this.locations]){
				this.stop = true;
				this.left = panziLocation[this.locations]
				cancelAnimationFrame(_this.timer)
			}
		}
		
		if(!this.stop){
			this.timer = requestAnimationFrame(function(){
				_this.moveTo(_this.locations, direction)
			});
		}
	}
}


var itemLcation = [emTpx(1.5), emTpx(13.125), emTpx(23.75)];
var getItems = function(level){
	this.level = level;
	this.init();
	//return this;
}

getItems.prototype = {
	init : function(){
		var _this = this;
		this.items = new Image();
		this.isBad = parseInt(Math.random() * 10);
		this.width = emTpx(6);
		//this.speed = speed[parseInt(Math.random() * 3)];
		this.speed = speed[1];
		this.height = emTpx(6);
		this.id = Date.parse(new Date()) + '_' + parseInt(Math.random() * 999999);
		this.locations = parseInt(Math.random() * 3);
		//console.log(this.locations)
		this.left = itemLcation[this.locations];
		this.timer = null;
		this.delTimer = null;
		this.top = -this.height;
		this.isRun = true;
		if(this.isBad <= 3){
			this.isBad = 0;
			this.items.src = 'Public/images/game_'+ this.level +'_goods.png';//好东西
		}else{
			this.isBad = 1;
			this.items.src = 'Public/images/game_bad.png';//坏兔子
		}
		this.items.onload = function(){
			_this.startAnimate();
			return this;
		}
	},
	startAnimate : function(){
		var _this = this;
		this.top = this.top + _this.speed;
		if(this.top > (winHeight + this.height + 50) && !games.isRun){
			this.isRun = false;
			delItems(_this.id)
			cancelAnimationFrame(_this.timer);
		}
		this.checkMeet();
		if(this.isRun){
			_this.timer = requestAnimationFrame(function(){
				_this.startAnimate();
			})
		}
	},
	checkMeet : function(){
		var _this = this;
		if(
			this.locations == games.panzis.locations && 
			(this.top + this.height) > (games.panzis.top + emTpx(2)) && 
			(this.top + this.height) < (winHeight - emTpx(2)) &&
			this.level == games.currentLevel
		){
			if(!games.pause){
				this.isRun = false;
				games.meetCheck(this);
				this.delTimer = setTimeout(function(){
					delItems(_this.id);
					clearTimeout(this.delTimer);
				},_this.isBad ? 2000 : 400)
				cancelAnimationFrame(_this.timer);
			}
		}
	}
}
window.game = function(){
	this.level = 1;
}
game.prototype = {
	init : function(){
		this.currentLevel = 1;
		this.timer = null;
		this.goods_num = 0;
		this.bad_num = 0;
		this.goods_arr = [];
		this.last_goods_num = 0;
		this.stageTimer = null;
		this.insertTimer = null;
		this.isRun = true;
		this.pause = false;
		this.gameCountTime = 3;
		this.time = defaultLevelSingleTime;
		screenItems = [];
		this.panzis = new panzi(this.currentLevel);
		this.gameCountDown();
	},
	gameCountDown : function(){
		var _this = this;
		countDown.style.display = 'block';
		countDown.className = 'count_down count_' + _this.gameCountTime;
		_this.gameCountTime--;
		if(_this.gameCountTime <= 0){
			countDown.style.display = 'none';
			window.clearTimeout(_this.timer);
			_this.timeCountDown();
			_this.insertItems();
			_this.drapStage();
			_this.start();
			return false;
		}
		_this.timer = setTimeout(function(){
			_this.gameCountDown();
		}, 1000);
	},
	timeCountDown : function(){
		var _this = this;
		gameTime.innerHTML = this.time + "'";
		this.time--;
		//console.log('第'+ this.currentLevel +'关时间：'+this.time)
		if(this.time == 0){
			this.isRun = false;
			window.clearTimeout(_this.timer);
			this.levelOver();
		}
		if(this.isRun){
			this.timer = setTimeout(function(){
				_this.timeCountDown();
			},1000)
		}
	},
	clearItems : function(){
		for(var i=0;i<screenItems.length;i++){
			screenItems[i] = null;
		}
		screenItems = [];
	},
	levelOver : function(){
		//console.log('当前关卡'+ this.currentLevel +'结束');
		var _this = this;
		this.goods_arr.push(this.goods_num);
		_this.isRun = false;
		_this.clearItems();
		//cancelAnimationFrame(_this.stageTimer);
		gameBad.innerHTML = 'x 0';
		gameGoods.innerHTML = 'x 0';
		$('#layerLevel a.btns').hide();
		$('#layerLevel').find('.barrier').attr('class', 'barrier bar_' + this.currentLevel);
		if(this.currentLevel >= 3){
			$('#layerLevel a.btn_again2').show();
			$('#layerLevel a.btn_write').show();
			this.last_goods_num = this.goods_arr;
			sure_nums = this.last_goods_num.sort(function(a,b){return a-b})[0];
			$('#layerLevel').find('.barrier_box').empty().html([
				'<div class="item item_pi">共接到 <span>'+ this.goods_arr[0] +'</span> 个面皮</div>',
				'<div class="item item_xier">共接到 <span>'+ this.goods_arr[1] +'</span> 个月饼馅儿</div>',
				'<div class="item item_gj">共接到 <span>'+ this.goods_arr[2] +'</span> 个工具</div>',
				'<div class="over_tips">成功制作'+ sure_nums +'个月饼！</div>'
			].join(''));
		}else{
			$('#layerLevel a.btn_next').show();
			$('#layerLevel').find('.barrier_box').empty().html([
				'<div class="barrier_pic"><img src="Public/images/barrier_'+ this.currentLevel +'_pic.jpg" /></div>',
            	'<div class="tips">共接到 <span>'+ this.goods_num +'</span> 个'+ goods_name[this.currentLevel] +'</div>'
			].join(''));
		}
		$(d).unbind({
			swipeLeft : _this.swipeLeft,
			swipeRight : _this.swipeRight
		})
		
		
		showLayer('layerLevel')
	},
	insertItems : function(){
		var _this = this;
		var items = new getItems(this.currentLevel);
		screenItems.push(items);
		if(_this.isRun){
			_this.insertTimer = setTimeout(function(){
				_this.insertItems();
			},800);
		}
	},
	drapStage : function(){
		var _this = this;
		stage.clearRect(0,0,winWidth,winHeight)
		stage.drawImage(_this.panzis.item, _this.panzis.left, _this.panzis.top, _this.panzis.width, _this.panzis.height);
		for(var i=0;i<screenItems.length;i++){
			if(screenItems[i].level == _this.currentLevel){
				stage.drawImage(screenItems[i].items, screenItems[i].left, screenItems[i].top, screenItems[i].width, screenItems[i].height);
			}
		}
		
		if(_this.isRun){
			_this.stageTimer = requestAnimationFrame(function(){
				_this.drapStage()
			})
		}
	},
	meetCheck : function(items){
		var _this = this;
		if(this.time >= 0){
			if(items.isBad){
				_this.bad_num++;
				_this.pause = true;
				setTimeout(function(){
					_this.pause = false;
				},2000)
			}else{
				_this.goods_num++;
				
			}
			gameBad.innerHTML = 'x '+_this.bad_num;
			gameGoods.innerHTML = 'x '+_this.goods_num;
		}
	},
	nextLevel : function(){
		hideLayer('layerLevel');
		var _this = this;
		_this.currentLevel++;
		gameGoods.className = 'goods good_' + _this.currentLevel;
		gameBad.innerHTML = 'x 0';
		gameGoods.innerHTML = 'x 0';
		_this.timer = null;
		_this.goods_num = 0;
		_this.bad_num = 0;
		_this.stageTimer = null;
		_this.insertTimer = null;
		_this.isRun = true;
		_this.time = defaultLevelSingleTime;
		_this.panzis = null;
		_this.panzis = new panzi(_this.currentLevel);
		$(d).bind({
			swipeLeft : _this.swipeLeft,
			swipeRight : _this.swipeRight
		})
		_this.timeCountDown();
		_this.insertItems();
		_this.drapStage();
	},
	start : function(){
		var _this = this;
		gameGoods.className = 'goods good_' + this.currentLevel;
		$(d).bind({
			swipeLeft : _this.swipeLeft,
			swipeRight : _this.swipeRight
		})
	},
	swipeLeft : function(){
		if(!games.pause){
			//console.log('向左了');
			games.panzis.locations--;
			if(games.panzis.locations <= 0) games.panzis.locations = 0
			games.panzis.moveTo(games.panzis.locations, 'left')
		}
	},
	//alert('右边啊')
	swipeRight : function(){
		if(!games.pause){
			//console.log('向右了');
			games.panzis.locations++;
			if(games.panzis.locations >= 2) games.panzis.locations = 2
			games.panzis.moveTo(games.panzis.locations, 'right')
		}
	},
}

function gameStart(){
	window.games = null;
	countDown.style.display = 'block';
	hideLayer('layerLevel');
	window.games = new game();
	games.init();
}

function gameNext(){
	games.nextLevel();
}