var d = document,
	g = document.getElementById,
	gameTime = d.getElementById('timeCountDown'),
	countDown = d.getElementById('count_down'),
	ratio = window.devicePixelRatio;
	goods_name = ['','面皮','月饼馅儿'],
	screenItems = [],
	speed  = [2,3,4],
	winHeight = window.innerHeight,
	winWidth = window.innerWidth,
	defaultLevelSingleTime = 45,//单关时间

	canvas = d.getElementById('canvas'),
	stage = canvas.getContext('2d'),

	//碰撞效果
	effect = d.getElementById('effect'),
	effectStage = effect.getContext('2d'),

	enemy = d.getElementById('enemy'),
	stageEnemy = enemy.getContext('2d'),

	zidan = d.getElementById('zidan'),
	stageZidan = zidan.getContext('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	effect.width = window.innerWidth;
	effect.height = window.innerHeight;

	enemy.width = window.innerWidth;
	enemy.height = window.innerHeight;

	zidan.width = window.innerWidth;
	zidan.height = window.innerHeight;
var emTpx = function(em){
	return em * (winWidth / 750 * 24);
}

var emenyConfig = [
	{
		p:'images/game_1_goods.png',
		w:emTpx(3.75),
		h:emTpx(5.5)
	},
	{
		p:'images/game_2_goods.png',
		w:emTpx(11.41),
		h:emTpx(9.2)
	},
	{
		p:'images/game_bad.png',
		w:emTpx(9.58),
		h:emTpx(9.83)
	}
]
var effectConfig = [
	{
		p:'images/pow.png',
		w:emTpx(10.25),
		h:emTpx(7),
		deviationX:0,
		deviationY:0
	},
	{
		p:'images/like.png',
		w:emTpx(7.7),
		h:emTpx(7.125),
		deviationX:0,
		deviationY:0
	},
	{
		p:'images/yeah.png',
		w:emTpx(9.58),
		h:emTpx(9.83),
		deviationX:0,
		deviationY:0
	},
	{
		p:'images/crash.png',
		w:emTpx(10.91),
		h:emTpx(11.16),
		deviationX:0,
		deviationY:0
	}
]

//飞机
var flyLocation = [0, emTpx(11.125), emTpx(22.25)];
var flyWH = {w:emTpx(13.58), h:emTpx(10.375)};
var fly = function(level){
	this.level = level
	this.init();
}
fly.prototype = {
	init : function(){
		var _this = this;
		this.type = 'flys';
		this.item = new Image();
		this.item.src = 'images/fly.png';
		this.width = flyWH.w;
		this.height = flyWH.h;
		this.locations = 1;
		this.timer = null;
		this.dieSpeed = 0;
		this.y = winHeight - this.height;
		this.x = (winWidth - this.width) / 2;
		this.CenterX = this.width / 2;
		this.CenterY = this.height / 2;
		this.startX = 0;
		this.startY = 0;
		this.moveX = 0;
		this.moveY = 0;
		this.endX = 0;
		this.endY = 0;

		this.isRun = true;

		this.item.onload = function(){
			_this.bindEvent();
			return this;
		}
	},
	bindEvent:function(){
		var _this = this;
		d.addEventListener('touchstart', _this.touchstart.bind(this))
		d.addEventListener('touchmove', this.touchmove.bind(this))
	},
	unbindEvent:function(){
		var _this = this;
		d.removeEventListener('touchstart', _this.touchstart.bind(this))
		d.removeEventListener('touchmove', this.touchmove.bind(this))
	},
	touchstart: function(e){
		var _this = this;
		_this.startX = parseInt(e.touches[0].clientX, 10);
		_this.startY = parseInt(e.touches[0].clientY, 10);
	},
	touchmove: function(ex){
		var _this = this;

		_this.moveX = parseInt(ex.changedTouches[0].clientX, 10);
		_this.moveY = parseInt(ex.changedTouches[0].clientY, 10);
		_this.x     = _this.moveX - _this.CenterX;
		_this.y     = _this.moveY - _this.CenterY;
	},
	animateNew: function(){
		var _this = this;
		this.y -= 3;
		if(this.y > winHeight - this.height){
			this.newtimer = requestAnimationFrame(function(){
				_this.animateNew();
			})
		}else{
			this.isRun = true;
			this.y = winHeight - this.height;
			games.blood = 100;
			games.life--;
			if(games.life == 0){
				games.gameOver();
			}
			games.bloodHandler();
			cancelAnimationFrame(this.newtimer);
			cancelAnimationFrame(this.dietimer);
			this.bindEvent();
		}
	},
	animateDie: function(){
		_this = this;
		this.y += 20;
		if(this.y < winHeight + this.height){
			_this.dietimer = requestAnimationFrame(function(){
				_this.animateDie();
			})
		}else{
			this.x = (winWidth - this.width) / 2;
			cancelAnimationFrame(_this.dietimer);
			setTimeout(function(){
				_this.animateNew();
			},300)
		}
	},
	die: function(){
		var _this = this;
		this.unbindEvent();
		setTimeout(function(){
			games.clearItems();
			_this.animateDie();
		},200)
	}
}


var getEffects = function(obj){
	this.obj = obj
	this.init();
}
getEffects.prototype = {
	init : function(){
		var _this = this;
		var thisObj = effectConfig[this.obj.type];
		this.item = new Image();
		this.item.src = thisObj.p;
		this.scale = 0.01;
		this.id = Date.parse(new Date()) + '_' + parseInt(Math.random() * 999999);
		this.w = thisObj.w;
		this.h = thisObj.h;
		this.timer = null;
		this.y = this.obj.y + thisObj.deviationY;
		this.x = this.obj.x + thisObj.deviationX;
		this.isRun = true;
		this.timer = null;
		this.item.onload = function(){
			_this.animate();
			return this;
		}
	},
	delItem : function(id){
		for(var i=0; i<games.screenEffect.length;i++){
			var itemss = games.screenEffect[i];
			if(itemss.id == id){
				itemss.isRun = false;
				cancelAnimationFrame(itemss.timer);
				games.screenEffect.splice(i, 1)
				break;
			}
		}
	},
	animate: function(){
		_this = this;
		_this.scale + 0.01;
		_this.w = _this.w * _this.scale;
		_this.h = _this.h * _this.scale;
		if(_this.scale < 1){
			_this.timer = requestAnimationFrame(function(){
				_this.animate();
			})
		}else{
			settimeOut(function(){
				_this.delItem(_this.id)
			},300)
		}
	}
}

var itemLcation = [emTpx(1.5), emTpx(13.125), emTpx(23.75)];
var getItems = function(level){
	this.level = Math.floor(Math.random()*(3 - 1) + 1);;
	this.init();
}

//敌人
getItems.prototype = {
	init : function(){
		this.items = new Image();
		this.speed = speed[1];
		this.locations = parseInt(Math.random() * 3);
		this.timer = null;
		this.delTimer = null;
		this.create();
	},
	create: function(){
		var _this = this;
		this.shot = 0;
		this.isRun = true;
		this.id = Date.parse(new Date()) + '_' + parseInt(Math.random() * 999999);
		this.isBad = parseInt(Math.random() * 10);
		if(this.isBad < 2){
			this.type = 1;
			this.w = emenyConfig[0].w;
			this.h = emenyConfig[0].h;
			this.items.src = emenyConfig[0].p;//好东西
		}else if(this.isBad >= 2 && this.isBad < 4){
			this.type = 2;
			this.w = emenyConfig[1].w;
			this.h = emenyConfig[1].h;
			this.items.src = emenyConfig[1].p;//好东西
		}else{
			this.type = 3;
			this.w = emenyConfig[2].w;
			this.h = emenyConfig[2].h;
			this.items.src = emenyConfig[2].p;//坏兔子
		}
		this.x = itemLcation[this.locations];
		this.y = -this.h;
		this.items.onload = function(){
			games.screenItems.push(_this);
			_this.startAnimate();
			return this;
		}
	},
	delSelf: function(){
		this.delItem(this.id)
	},
	delItem : function(id){
		for(var i=0; i<games.screenItems.length;i++){
			var itemss = games.screenItems[i];
			if(itemss.id == id){
				itemss.isRun = false;
				cancelAnimationFrame(itemss.timer);
				games.screenItems.splice(i, 1)
				break;
			}
		}
	},
	startAnimate : function(){
		var _this = this;
		this.y = this.y + _this.speed;
		if(this.y > (winHeight + this.h + 50) && !games.isRun){
			this.isRun = false;
			this.delItem(_this.id)
		}
		if(this.y > winHeight+30){
			this.delItem(this.id)
		}

		if(this.isRun && games.isRun){
			this.checkMeet();
			_this.timer = requestAnimationFrame(function(){
				_this.startAnimate();
			})
		}else{
			cancelAnimationFrame(_this.timer);
		}
	},
	checkMeet : function(){
		var _this = this;
		if(
			((this.x + this.w > games.flys.x + emTpx(2) && this.y > games.flys.y + emTpx(2)) ||
			(this.x < games.flys.x + games.flys.w - emTpx(2) && this.y > games.flys.y + emTpx(2))) &&
			((this.x + this.w > games.flys.x + emTpx(2) && this.y + this.h > games.flys.y + emTpx(2)) ||
			(this.x < games.flys.x + games.flys.w - emTpx(2) && this.y+this.h > games.flys.y + emTpx(2)))
		){
			if(this.type == 3){
				this.isRun = false;
				games.blood -= 20;
				games.pointHandler();
				if(games.blood <= 0){
					games.life--;
					games.flys.isRun = false;
					games.flys.die();
				}

				_this.delItem(this.id)
			}
		}
	}
}
//子弹
var getZidan = function(level){
	this.level = Math.floor(Math.random()*(4 - 1) + 1);;
	this.init();
	//return this;
}
getZidan.prototype = {
	init : function(){
		var _this = this;
		this.items = new Image();
		this.width = 4;
		this.height = 6;
		this.id = Date.parse(new Date()) + '_' + parseInt(Math.random() * 999999);
		this.x = games.flys.x + (games.flys.width / 2) - 2;
		this.timer = null;
		this.delTimer = null;
		this.y = games.flys.y;
		this.isRun = true;
		this.items.src = 'images/zidan.png';//好东西

		this.items.onload = function(){
			_this.startAnimate();
			games.screenZidan.push(_this);
			return this;
		}
	},
	delItem : function(id){
		for(var i=0; i<games.screenZidan.length;i++){
			var itemss = games.screenZidan[i];
			if(itemss.id == id){
				itemss.isRun = false;
				cancelAnimationFrame(itemss.timer);
				games.screenZidan.splice(i, 1)
				break;
			}
		}
	},
	startAnimate : function(){
		var _this = this;
		this.y = this.y - 9;
		if(this.y > (winHeight + this.height + 50) && !games.isRun){
			this.isRun = false;
			this.delItem(_this.id)
		}

		if(this.isRun && games.isRun){
			this.checkMeet();
			_this.timer = requestAnimationFrame(function(){
				_this.startAnimate();
			})
		}else{
			this.delItem(_this.id)
			cancelAnimationFrame(_this.timer);
		}
	},
	checkMeet : function(){
		var _this = this;
		for(var i=0;i<games.screenItems.length; i++){
			var goods = games.screenItems[i];
			if(
				this.y < goods.y + (goods.h / 2) &&
				this.x > goods.x &&
				this.x < (goods.x + goods.w) && goods.isRun
			){
				if(!games.pause){
					this.isRun = false;
					this.delItem(this.id);
					goods.shot++;
					if(goods.shot > 5){
						if(goods.type == 3){

							games.point += 10;
						}else if(goods.type == 1){
							games.blood += 5;
							if(games.blood > 100){
								games.blood = 100;
							}
						}else if(goods.type == 2){
							games.addFlag();
						}
						goods.isRun = false;
						games.screenEffect.push(new getEffects(goods))
						games.pointHandler();
						setTimeout(function(){
							goods.delSelf();
						},500)

					}
				}
			}
		}

	}
}
window.game = function(){
	this.level = 1;
}
game.prototype = {
	init : function(){
		this.pointBar = $('.blood .bar');
		this.pointFont = $('.mask_point .point');
		this.pointFlag = $('.mask_point .flag');
		this.timer = null;
		this.stageTimer = null;
		this.insertTimer = null;
		this.insertZidanTimer = null;
		this.isRun = true;
		this.pause = false;
		this.gameCountTime = 3;
		this.flys = new fly();
		this.time = defaultLevelSingleTime;
		this.screenItems = [];
		this.screenZidan = [];
		this.screenEffect = [];
		this.blood = 100;
		this.point = 0;
		this.life = 3;
		this.gameCountDown();
	},
	pointHandler: function(){
		this.pointBar.css('right', (100 - this.blood) + '%');
		this.pointFont.text(this.point);
		if(this.blood == 0){
			this.flys.die()
		}
	},
	addFlag: function(){
		this.pointFlag.append('<img src="images/flag.png">')
	},
	gameCountDown : function(){
		var _this = this;
		countDown.style.display = 'block';
		countDown.className = 'count_down count_' + _this.gameCountTime;
		_this.gameCountTime--;
		if(_this.gameCountTime < 0){
			countDown.style.display = 'none';
			window.clearTimeout(_this.timer);
			_this.timeCountDown();
			_this.start();
			this.drapStage();
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
		if(this.time == 0){
			this.isRun = false;
			window.clearTimeout(_this.timer);
			this.gameOver();
		}
		if(this.isRun){
			this.timer = setTimeout(function(){
				_this.timeCountDown();
			},1000)
		}
	},
	clearItems : function(){
		for(var i=0;i<this.screenItems.length;i++){
			this.screenItems[i] = null;
		}
		for(var i=0;i<this.screenZidan.length;i++){
			this.screenZidan[i] = null;
		}
		this.screenItems = [];
		this.screenZidan = [];
	},
	gameOver : function(){
		var _this = this;
		_this.isRun = false;
		_this.clearItems();
		$('.btn_area').show();


		clearTimeout(_this.insertTimer)
		clearTimeout(_this.insertZidanTimer)
		$('#layerLevel').css('background-image', 'url(images/'+ (this.life == 0 && this.time <= 0 ? 'layer_bg_success' : 'layer_bg_fail') +'.png)')
		showLayer('layerLevel')
	},
	insertItems : function(){
		var _this = this;
		_this.insertTimer = setInterval(function(){
			if(_this.isRun){
				new getItems();
			}
		},800);
	},
	insertZidan : function(){
		var _this = this;
		_this.insertZidanTimer = setInterval(function(){
			if(_this.isRun && _this.flys.isRun){
				new getZidan();
			}
		},100);
	},
	drapStage : function(){
		var _this = this;
		stage.clearRect(0,0,winWidth,winHeight)
		stageEnemy.clearRect(0,0,winWidth,winHeight)
		stageZidan.clearRect(0,0,winWidth,winHeight)
		stageEffect.clearRect(0,0,winWidth,winHeight)
		
		stage.drawImage(_this.flys.item, _this.flys.x, _this.flys.y, _this.flys.width, _this.flys.height);
		for(var i=0;i<this.screenItems.length;i++){
			var goods = this.screenItems[i]
			stageEnemy.drawImage(goods.items, goods.x, goods.y, goods.w, goods.h);
		}

		for(var i=0; i<this.screenZidan.length; i++){
			var zidan = this.screenZidan[i];
			stageZidan.drawImage(zidan.items, zidan.x, zidan.y, zidan.width, zidan.height);
		}


		for(var i=0; i<this.screenEffect.length; i++){
			var zidan = this.screenEffect[i];
			stageEffect.drawImage(zidan.items, zidan.x, zidan.y, zidan.w, zidan.h);
		}
		if(_this.isRun){
			_this.stageTimer = requestAnimationFrame(function(){
				_this.drapStage()
			})
		}
	},
	replay : function(){
		hideLayer('layerLevel');
		this.timer = null;
		this.stageTimer = null;
		this.insertTimer = null;
		this.isRun = true;
		this.time = defaultLevelSingleTime;
		this.flys = null;
		this.flys = new fly();
		this.blood = 100;
		this.point = 0;
		this.life = 3;
		this.clearItems();
		this.timeCountDown();
		this.start();
		this.drapStage();
	},
	start : function(){

		this.insertItems();
		this.insertZidan();

	}
}

function gameStart(){
	window.games = null;
	countDown.style.display = 'block';
	hideLayer('layerLevel');
	$('.btn_area').hide();
	window.games = new game();
	games.init();
}
//gameStart()
function gameNext(){
	games.replay();
}
