var imgArr = [
	'loading_icon.png',

	'btn_1.png',
	'btn_2.png',
	'btn_3.png',
	'btn_start.png',
	'countdown_1.png',
	'countdown_2.png',
	'countdown_3.png',

	'crash.png',
	'pow.png',
	'logo.png',

	'flag.png',
	'game_1_goods.png',
	'game_2_goods.png',
	'game_bad.png',
	'fly.png',

	'star_1.png',
	'star_2.png',
	'star_3.png',

	'pow.png'
];
var loaded = 0, failImg = [], timer = '';
var t = Date.parse(new Date());
var loading_ship = document.getElementById('loading_ship'),
	loading_nums = document.getElementById('loading_nums')
var barWidth = document.getElementById('bar_box').clientWidth;
var shipWidth = loading_ship.clientWidth
function loadImg(newImg){
	failImg = [];
	newImg.forEach(function(el){
		var img;

		img = new Image();
		img.src='images/'+el;

		img.onload = function(){
			loaded++;

			var bar_num = parseInt(loaded / imgArr.length * 100);
			document.getElementById('bar').style.width = bar_num + '%';
			loading_nums.innerHTML = bar_num + '%';
			loading_ship.style.left = bar_num / 100 * (barWidth - shipWidth + 10) + 'px';
			loading_nums.style.left = bar_num / 100 * (barWidth - shipWidth + 10) + 'px';


			if(loaded == imgArr.length){
				setTimeout(function(){
					window.clearInterval(timer);
					toPage($(loading_ship), 'home')
				},1000)
			}
		}
		img.onerror = function(){
			failImg.push(el);
		}
	})
	if(failImg.length > 0) loadImg(failImg);
}
loadImg(imgArr);
