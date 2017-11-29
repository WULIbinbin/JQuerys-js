;
(function($) {
	$.fn.extend({
		slide_show: function(opt) {
			var opt = $.extend({
					ss_box: '', //轮播item
					sd_box: '', //分页器
					par_box: '', //轮播最外层
					bg_box: '', //背景
					prev_btn: 'prev',
					next_btn: 'next',
					time: '4000',
				}, opt),

				data_type = $('.' + opt.par_box).attr('data-type'),
				data_paly = $('.' + opt.par_box).attr('data-paly'),
				get_cur = function(that) {
					$(that).addClass('active').siblings().removeClass('active');

				},
				type = {
					one: function(that, that_index, callback) { //上拉收起
						var clo_par = $(that).closest('.' + opt.par_box);
						clo_par.find('.' + opt.ss_box).children().eq(that_index).slideDown(200).siblings().slideUp(200);
						callback(that_index);
						bgColor(that_index);
					},
					two: function(that, that_index, callback) { //透明
						var clo_par = $(that).closest('.' + opt.par_box);
						clo_par.find('.' + opt.ss_box).children().eq(that_index).fadeIn(100).siblings().fadeOut(100);
						callback(that_index);
						bgColor(that_index);
					},
					three: function(that, that_index, callback) { //隐藏
						var clo_par = $(that).closest('.' + opt.par_box);
						clo_par.find('.' + opt.ss_box).children().eq(that_index).show().siblings().hide();
						callback(that_index);
						bgColor(that_index);
					},
					df: function(that, that_index, callback) { //向左滑动
						var clo_par = $('.' + opt.par_box),
							move_box = $(that),
							img_wid = -move_box.children().first().width();
						move_box.css({
							'position': 'absolute'
						});
						move_box.stop().animate({
							'left': img_wid * that_index + 'px'
						}, 300);
						console.log($(that))
						if(img_wid * that_index == move_box.width()) {
							move_box.css({
								'left': 0
							})
						}
						callback(that_index);
						bgColor(that_index);
					}

				};
			document.getElementsByClassName(opt.par_box)[0].style.position = 'relative';

			function bgColor(index) {
				if($('.slidebox').height() >= 400) {
					var imgbg = $('.slidebox').children().find('li').eq(index).children().find('img').attr('src');
					$('.wrap-top-out').css({
						'background': "url(" + imgbg + ")"
					})
				}
			}
			if(data_type == 'slideDown') {
				style_set();
				dot_click(get_cur, type.one);
			} else if(data_type == 'fadeIn') {
				style_set();
				dot_click(get_cur, type.two);
			} else if(data_type == 'show') {
				style_set();
				dot_click(get_cur, type.three);
			} else {
				style_default();
				dot_click(get_cur, type.df);
			}

			function style_default() {
				var move_box = $('.' + opt.ss_box),
					main_box = $('.' + opt.par_box),
					img_wid = move_box.children().first().width(),
					img_length = $('.' + opt.ss_box).children().length;
				move_box.css('width', img_length * img_wid);
				move_box.children().css('width', main_box.width());
			}

			function style_set() {
				$('.' + opt.ss_box).children().css('display', 'none');
				$('.' + opt.ss_box).children().first().css('display', 'block');
			}

			function dotItemCreate() {
				var dotUl = document.createElement('ul'),
					dotLi;
				dotUl.className = opt.sd_box;
				dotUl.style.display = 'inline-block';
				dotUl.style.position = 'absolute';
				$('.' + opt.par_box).append(dotUl);
				for(var i = 0; i < $('.' + opt.ss_box).children().length; i++) {
					dotLi = document.createElement('li');
					dotUl.appendChild(dotLi);
				}
				var sdbox = document.getElementsByClassName(opt.sd_box)[0].clientWidth,
					parbox = document.getElementsByClassName(opt.par_box)[0].clientWidth;
				dotUl.style.left = (parbox - sdbox) * 0.5 + 'px';
				dotUl.style.bottom = 20 + 'px';
				console.log(sdbox);
				$('.' + opt.sd_box).children().eq(0).addClass('active');
			}
			dotItemCreate()

			function dot_click(callback, type) {
				var num = 0,
					img_length = $('.' + opt.ss_box).first().children().length;
				$('.' + opt.sd_box).children().on('click', function() {
					var that = this,
						that_index = $(that).index();
					num = that_index;
					callback(that);
					type(that, that_index, function() {
						bgColor(that_index);
					});
				})
				if(opt.next_btn != '') {
					$('.' + opt.next_btn).on('click', function() {
						var that = this;
						num++;
						if(num > img_length - 1) {
							num = 0
						};
						type(that, num, function(index) {
							$(that).closest('.' + opt.par_box).find('.' + opt.sd_box).children().eq(index).addClass('active').siblings().removeClass('active');
						});
					})
					$('.' + opt.prev_btn).on('click', function() {
						var that = this;
						num--;
						if(num < 0) {
							num = img_length - 1
						};
						type(that, num, function(index) {
							$(that).closest('.' + opt.par_box).find('.' + opt.sd_box).children().eq(index).addClass('active').siblings().removeClass('active');

						});
					})
					$('.' + opt.next_btn).on('mouseenter', function() {
						clearInterval(timer);
						timer = null;
					}).on('mouseleave', function() {
						clearInterval(timer);
						timer = setInterval(move, opt.time);
					})
					$('.' + opt.prev_btn).on('mouseenter', function() {
						clearInterval(timer);
						timer = null;
					}).on('mouseleave', function() {
						clearInterval(timer);
						timer = setInterval(move, opt.time);
					})
				}
				if(data_paly == 'true') {
					move = function() {
							num++;
							if(num > img_length - 1) {
								num = 0;
							}
							var that = '.' + opt.ss_box;
							type(that, num, function(index) {
								$(that).closest('.' + opt.par_box).find('.' + opt.sd_box).children().eq(index).addClass('active').siblings().removeClass('active');

							});
						},

						timer = setInterval(move, opt.time);
					$('.' + opt.sd_box).on('mouseenter', function() {
						clearInterval(timer);
						timer = null;
					}).on('mouseleave', function() {
						clearInterval(timer);
						timer = setInterval(move, opt.time);
					})
					$('.' + opt.ss_box).on('mouseenter', function() {
						clearInterval(timer);
						timer = null;
					}).on('mouseleave', function() {
						clearInterval(timer);
						timer = setInterval(move, opt.time);
					})
				};

			}

		}
	})
})(jQuery);