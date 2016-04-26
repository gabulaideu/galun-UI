(function($){
	$.fn.GlSelect = function(options){
		
		var defaults = {
			txt:'请选择',
			value:'',
			direction:'down',
			trigger:'click',
			callback:function(){}
		};

		var o = $.extend(defaults,options),
			_txt = o.txt,
			_value = o.value,
			_direction = o.direction,
			_trigger = o.trigger,
			_callback = o.callback,
			_document = $(document);

		return this.each(function(){
			var _this = $(this),
				_span = _this.find('span.txt'),
				_spanHeight = _span.outerHeight() - 1,
				_dl = _this.find('dl'),
				_a = _this.find('a'),
				_input = _this.find('.hideInput');

			if(_txt!=''){
				_span.text(_txt);
			}
			_input.val(_value);
			_span.on(_trigger,function(){
				if(_dl.is(':hidden')){
					showList();
				}else{
					hideList();
				}
				$('.GlSelect').each(function(){
					var _me = $(this),
						_dlAll = _me.find('dl');
					if(_dlAll[0]!=_dl[0]){
						_dlAll.hide();
						_me.css('zIndex','1');
					}
				});
			});
			if(_trigger=='mouseenter'){
				_this.mouseleave(function(){
					hideList();
				});
			}
			_a.click(function(){
				var _me = $(this),
					_val = _me.attr('value');
				_span.text(_me.text());
				_input.val(_val);
				hideList();
				_callback();
			});
			_this.mousedown(function(e){
				e.stopPropagation();
			});
			_document.on('mousedown',function(e){
				hideList();
			});
			if(_direction=='up'){
				_dl.css('marginTop',-_spanHeight - _dl.outerHeight());
			}else{
				_dl.css('marginTop',-1);
			}
			function showList(){
				_dl.show();
				_this.css('zIndex','2');
			}
			function hideList(){
				_dl.hide();
				_this.css('zIndex','1');
			}
		});

	};

	$.fn.GlAreaSelect = function(options){
		
		var defaults = {
			data:areaJson,
			first:{show:true,id:'selectProvince',placeholder:'请选择',type:'first',key:null},
			second:{show:true,id:'selectCity',placeholder:'请选择',type:'second',key:null},
			third:{show:true,id:'selectDistrict',placeholder:'请选择',type:'third',key:null},
			temple:'<div class="GlSelect" id="{id}">'+
				   '	<b class="bg"></b>'+
				   '	<i class="icon"><s></s><em></em></i>'+
				   '	<span class="txt">{placeholder}</span>'+
				   '	<input type="hidden" class="hideInput" id="{hideId}" />'+
				   '	<dl>{list}</dl>'+
				   '</div>'
		};

		var o = $.extend(defaults,options),
			_data = o.data,
			_first = o.first,
			_second = o.second,
			_third = o.third,
			_temple = o.temple;

		return this.each(function(){
			var _this = jQuery(this);
			_this.html('');

			addSelect('first',0,0);

			_this.delegate('a','click',function(){
				var _me = $(this),
					_index = _me.attr('index'),
					_type = _me.attr('type'),
					_firstIndex = _me.attr('firstIndex'),
					_parent = _me.parents('.GlSelect');

				_parent.nextAll('.GlSelect').remove();

				if(_type=='first'){
					addSelect('second',_index,0);
				}else if(_type=='second'){
					addSelect('third',_firstIndex,_index);
				}
			});

			if(_first.key!=null){
				$('#'+_first.id+'').find('a[value='+_first.key+']').trigger('click');
				if(_second.key!=null){
					$('#'+_second.id+'').find('a[value='+_second.key+']').trigger('click');
					if(_third.key!=null){
						$('#'+_third.id+'').find('a[value='+_third.key+']').trigger('click');
					}
				}
			}

			function addSelect(listIndex,firstIndex,secondIndex){
				var _dataUse = _data,
					_firstUse = _first,
					_secondUse = _second,
					_thirdUse = _third,
					_templeUse = _temple;

				var _listIndex = listIndex,
					_firstIndex = firstIndex,
					_secondIndex = secondIndex;
				if(_listIndex=='first'){
					_listIndex = _firstUse;
				}else if(_listIndex=='second'){
					_listIndex = _secondUse;
					_dataUse = _dataUse[_firstIndex].child;
				}else if(_listIndex=='third'){
					_listIndex = _thirdUse;
					_dataUse = _dataUse[_firstIndex].child[_secondIndex].child;
				}

				if(_listIndex.show){
					var _idText = _listIndex.id,
						_placeholder = _listIndex.placeholder,
						_type = _listIndex.type,
						_dlHtml = '';

					for(var i = 0;i < _dataUse.length;i++){
						_dlHtml += '<dd><a href="javascript:void(0);" value="'+_dataUse[i].key+'" firstIndex="'+_firstIndex+'" index="'+i+'" type="'+_type+'">'+_dataUse[i].name+'</a></dd>';
					};

					_templeUse = _templeUse.replace('{id}',_idText)
									 .replace('{placeholder}',_placeholder)
									 .replace('{hideId}',_idText+'Hide')
									 .replace('{list}',_dlHtml);

					_this.append(_templeUse);
					var _id = $('#'+_idText+'');
					_id.GlSelect({
						txt:''
					});
					if(_dataUse.length == 1){
						_id.find('a').eq(0).trigger('click');
					}
				}
				
			}
		});

	};

	$.fn.GlTab = function(options){

		var defaults = {
			auto:false,
			time:3000,
			trigger:'click',
			callback:function(){}
		};

		var o = $.extend(defaults,options),
			_auto = o.auto,
			_time = o.time,
			_trigger = o.trigger,
			_callback = o.callback;

		return this.each(function(){
			var _this = $(this),
				_dd = _this.find('dd'),
				_li = _this.find('li'),
				_index = 0,
				_interval;

			_li.eq(0).show();

			_dd.on(_trigger,function(){
				tab($(this).index());
			});

			if(_auto){
				time();

				_this.hover(function(){
					clearInterval(_interval);
				},function(){
					clearInterval(_interval);
					time();
				});
			}

			function time(){
				_interval = setInterval(function(){
					_index = _dd.index(_this.find('dd.current'));
					_index++;
					if(_index >= _dd.length){
						_index = 0;
					}
					tab(_index);
				},_time);
			}

			function tab(index){
				_dd.removeClass().eq(index).addClass('current');
				_li.hide().eq(index).show();
				_callback();
			}
		});

	};

	$.fn.GlSwitch = function(options){

		var defaults = {
			auto:true,
			time:3000,
			animation:500,
			iconCenter:false,
			trigger:'click',
			effect:'fade',
			nav:false,
			navFixed:false,
			pauseBtn:'',
			playBtn:'',
			callback:function(){}
		};

		var o = $.extend(defaults,options),
			_auto = o.auto,
			_time = o.time,
			_animation = o.animation,
			_iconCenter = o.iconCenter,
			_trigger = o.trigger,
			_effect = o.effect,
			_nav = o.nav,
			_navFixed = o.navFixed,
			_pauseBtn = o.pauseBtn,
			_playBtn = o.playBtn,
			_callback = o.callback;

		return this.each(function(){

			var _this = $(this),
				_ul = _this.find('ul'),
				_li = _this.find('li'),
				_length = _li.length,
				_width = _li.outerWidth(),
				_height = _li.outerHeight(),
				_index = 0,
				_dlHtml = '',
				_intervalAuto = true,//判断点击暂停按钮时移出容器不会自动播放
				_interval;

			for(var i = 0;i < _li.length;i++){
				_dlHtml += '<dd>0'+i+'</dd>';
			}

			_dlHtml = '<dl>'+_dlHtml+'</dl>';
			_ul.after(_dlHtml);

			var _dl = _this.find('dl'),
				_dd = _this.find('dd');
			_dd.eq(0).addClass('current');

			if(_nav){
				_this.append('<span class="prev" style="display:none;">&lt;</span><span class="next" style="display:none;">&gt;</span>');
				var _prev = _this.find('.prev'),
					_next = _this.find('.next');

				if(_navFixed){
					_prev.show();
					_next.show();
				}else{
					_this.mouseenter(function(){
						_prev.show();
						_next.show();
					}).mouseleave(function(){
						_prev.hide();
						_next.hide();
					});					
				}

				_prev.on('click',function(){
					prev();
				});

				_next.on('click',function(){
					next();
				});
			}

			if(_effect=='slideX'){
				_ul.addClass('slideX');
			}else if(_effect=='slideY'){
				_ul.addClass('slideY');
			}else{
				_ul.addClass('fade');
				_li.eq(0).show();
			}

			if(_iconCenter){
				_dl.css({
					'right':'auto',
					'left':'50%',
					'marginLeft':-(_dl.outerWidth() - _dd.css('marginRight').replace('px',''))/2
				});
			}

			if(_auto && _length > 1){
				time();
				_this.mouseenter(function(){
					pause();
				}).mouseleave(function(){
					if(_intervalAuto){
						play();
					}
				});
			}

			_dd.on(_trigger,function(){
				_index = _dd.index($(this));
				if(_index!=_this.find('dd.current').index()){
					switchFun(_index);
				}
			});

			$(_pauseBtn).click(function(){
				pause();
				_intervalAuto = false;
			});

			$(_playBtn).click(function(){
				play();
				_intervalAuto = true;
			});

			function pause(){
				clearInterval(_interval);
			}

			function play(){
				clearInterval(_interval);
				time();
			}

			function time(){
				_interval = setInterval(function(){
					_index = _this.find('dd.current').index();
					_index++;
					switchFun(_index);
				},_time);
			}

			function prev(){
				_index = _this.find('dd.current').index() - 1;
				switchFun(_index);
			}

			function next(){
				_index = _this.find('dd.current').index() + 1;
				switchFun(_index);
			}

			function switchFun(index){
				_index = index;
				if(_length > 1){
					if(_effect=='slideX'){
						slideX();
					}else if(_effect=='slideY'){
						slideY();
					}else{
						fade();
					}
				}
			}

			function fade(){
				if(_index >= _length){
					_index = 0;
				}
				_dd.removeClass().eq(_index).addClass('current');
				_li.stop(1,1).fadeOut(_animation).eq(_index).fadeIn(_animation,function(){
					_callback();
				});
			}

			function slideX(){
				_ul.stop(1,0).animate({
						'left':-_width*_index
					},_animation,function(){
					if(_index == _length){
						_ul.css('left','0');
						_li.eq(0).removeAttr('style');
						_index = 0;
					}
					if(_index == -1){
						_ul.css('left',-_width*(_length-1));
						_li.eq(-1).removeAttr('style');
					}
					_dd.removeClass().eq(_index).addClass('current');
					_callback();
				});
				if(_index == _length){
					_li.eq(0).css({
						'position':'relative',
						'left':_width*_length
					});
				}
				if(_index == -1){
					_li.eq(-1).css({
						'position':'relative',
						'left':-_width*_length
					});
				}
			}

			function slideY(){
				_ul.stop(1,0).animate({
						'top':-_height*_index
					},_animation,function(){
					if(_index == _length){
						_ul.css('top','0');
						_li.eq(0).removeAttr('style');
						_index = 0;
					}
					if(_index == -1){
						_ul.css('top',-_height*(_length-1));
						_li.eq(-1).removeAttr('style');
					}
					_dd.removeClass().eq(_index).addClass('current');
					_callback();
				});
				if(_index == _length){
					_li.eq(0).css({
						'position':'relative',
						'top':_height*_length
					});
				}
				if(_index == -1){
					_li.eq(-1).css({
						'position':'relative',
						'top':-_height*_length
					});
				}
			}

		});

	};

	$.GlDialog = function(options){

		var defaults = {
			title:'',
			content:'',
			btnSubmitText:'确定',
			btnCancelText:'取消',
			btnSubmitShow:true,
			btnCancelShow:false,
			btnClose:'.close',
			shadow:true,
			shadowClose:null,
			opacity:'0.4',
			auto:false,
			time:3000,
			width:300,
			effect:'',
			animation:500,
			fixed:true,
			left:null,
			right:null,
			top:null,
			bottom:null,
			esc:true,
			lock:false,
			element:'',
			submitCallback:function(){},
			cancelCallback:function(){},
			closeCallback:function(){},
			shadowCloseCallback:function(){},
			escCallback:function(){}
		};

		var o = $.extend(defaults,options),
			_title = o.title,
			_content = o.content,
			_btnSubmitShow = o.btnSubmitShow,
			_btnCancelShow = o.btnCancelShow,
			_btnSubmitText = o.btnSubmitText,
			_btnCancelText = o.btnCancelText,
			_btnClose = o.btnClose,
			_shadow = o.shadow,
			_shadowClose = o.shadowClose,
			_opacity = o.opacity,
			_auto = o.auto,
			_time = o.time,
			_width = o.width,
			_effect = o.effect,
			_animation = o.animation,
			_fixed = o.fixed,
			_left = o.left,
			_right = o.right,
			_top = o.top,
			_bottom = o.bottom,
			_esc = o.esc,
			_lock = o.lock,
			_element = o.element,
			_submitCallback = o.submitCallback,
			_cancelCallback = o.cancelCallback,
			_closeCallback = o.closeCallback,
			_shadowCloseCallback = o.shadowCloseCallback,
			_escCallback = o.escCallback;

		var _countdownIndex = _time / 1000,
			_document = $(document),
			_window = $(window),
			_body = $('body'),
			_scrollTop = _fixed ? 0 : _document.scrollTop(),
			_position = _fixed ? 'fixed' : 'absolute',
			_html = '<div class="GlDialog">'+
					'	{close}'+
					'	<div class="info">'+
					'		{titleHtml}'+
					'		<div class="con">{content}</div>'+
					'		{btn}'+
					'	</div>'+
					'</div>'+
					'{shadow}',
			_closeHtml = _lock ? '' : '<span class="close">×</span>',
			_titleHtml = _title=='' ? '' : '<p class="tit">{title}{countdown}</p>',
			_countdown = _auto ? '<span class="countdown">（<em class="countdownNum">'+_countdownIndex+'</em>秒后自动关闭）</span>' : '',
			_btnOutHtml = '<div class="btn">{btnSubmit}{btnCancel}</div>',
			_btnSubmitHtml = _btnSubmitShow ? '<input type="button" class="btnNormal btnBlue btnSubmit" value="'+_btnSubmitText+'" />' : '',
			_btnCancelHtml = _btnCancelShow ? '<input type="button" class="btnNormal btnCancel" value="'+_btnCancelText+'" />' : '',
			_shadowHtml = _shadow ? '<div class="GlDialogShadow"></div>' : '',
			arrPageSizes = getPageSize(),
			_leftPX = _left,
			_rightPX = _right,
			_topPX = _top,
			_bottomPX = _bottom,
			_marginLeftPX = 0,
			_marginTopPX = 0,
			_countdownInterval,
			_countdownTimeout;

		if(_element==''){
			if(_btnSubmitShow || _btnCancelShow){
				_btnOutHtml = _btnOutHtml.replace('{btnSubmit}',_btnSubmitHtml)
										 .replace('{btnCancel}',_btnCancelHtml);
			}else{
				_btnOutHtml = '';
			}

			_html = _html.replace('{close}',_closeHtml)
						 .replace('{titleHtml}',_titleHtml)
						 .replace('{title}',_title)
						 .replace('{content}',_content)
						 .replace('{btn}',_btnOutHtml)
						 .replace('{shadow}',_shadowHtml)
						 .replace('{countdown}',_countdown);

			_body.append(_html);
		}else{
			_body.append(_shadowHtml);
		}

		var _GlDialog = _element=='' ? $('.GlDialog').last() : $(_element),
			_GlDialogShadow = $('.GlDialogShadow'),
			_close = _element=='' ? _GlDialog.find('.close') : _GlDialog.find(_btnClose),
			_btnSubmit = _GlDialog.find('.btnSubmit'),
			_btnCancel = _GlDialog.find('.btnCancel'),
			_countdownNum = _GlDialog.find('.countdownNum');
		
		var _support = $.support;

		if(_isIE6){
			_position = 'absolute';
			_scrollTop = _document.scrollTop();
			if(_fixed){
				if(_top!=null){
					_window.scroll(function(){
						_GlDialog.stop(1,0).animate({
							top:_top + _document.scrollTop() + _GlDialog.outerHeight()/2
						},500);
					});
				}else{
					_window.scroll(function(){
						_GlDialog.stop(1,0).animate({
							top:arrPageSizes[3]/2 + _document.scrollTop()
						},500);
					});
				}
			}
		}

		_GlDialog.css({
			'zIndex':'2000',
			'position':_position
		});
		if(_element==''){
			_GlDialog.css({
				'width':_width
			});
		}
		_marginLeftPX = -_GlDialog.outerWidth()/2;
		_marginTopPX = -_GlDialog.outerHeight()/2;
		_leftPX = _left==null&&_right==null ? arrPageSizes[2]/2 : (_right==null ? _leftPX + _GlDialog.outerWidth()/2 : arrPageSizes[2] - _GlDialog.outerWidth() - _marginLeftPX - _rightPX);
		_topPX = _top==null&&_bottom==null ? arrPageSizes[3]/2 + _scrollTop : (_bottom==null ? _topPX + _scrollTop + _GlDialog.outerHeight()/2 : _scrollTop + arrPageSizes[3] - _GlDialog.outerHeight() - _marginTopPX - _bottomPX);
		_GlDialog.css({
			left:_leftPX,
			top:_topPX,
			marginLeft:_marginLeftPX,
			marginTop:_marginTopPX
		});

		if(_effect=='zoom'){
			_GlDialog.stop(1,0).show(_animation,function(){
				countdown();
			});
		}else if(_effect=='slide'){
			_GlDialog.stop(1,0).slideDown(_animation,function(){
				countdown();
			});
		}else if(_effect=='fade'){
			_GlDialog.css({'marginTop':-_GlDialog.outerHeight()/2 - 50});
			_GlDialog.stop(1,0).animate({
				'marginTop':-_GlDialog.outerHeight()/2,
				'opacity':'show'
			},_animation,function(){
				countdown();
			});
		}else if(_effect=='scroll'){
			_GlDialog.css({
				'marginTop':-_GlDialog.outerHeight()/2 - (arrPageSizes[3]+_GlDialog.outerHeight())/2,
				'display':'block'
			});
			_GlDialog.stop(1,0).animate({
				'marginTop':-_GlDialog.outerHeight()/2
			},_animation,function(){
				countdown();
			});
		}else{
			_GlDialog.stop(1,0).show(0,function(){
				countdown();
			});
		}

		if(_shadow){
			shadowResize();
			_GlDialogShadow.css({
				'opacity':'0',
				'backgroundColor':'#000',
				'position':'absolute',
				'left':'0',
				'top':'0',
				'zIndex':'1000'
			}).animate({
				'opacity':_opacity
			},500);
			if(_shadowClose!=null){
				_GlDialogShadow.on(_shadowClose,function(){
					close();
					_shadowCloseCallback();
				});
			}
		}

		if(_btnSubmitShow){
			_btnSubmit.click(function(){
				close();
				_submitCallback();
			});
		}

		if(_btnCancelShow){
			_btnCancel.click(function(){
				close();
				_cancelCallback();
			});
		}

		_close.click(function(){
			close();
			_closeCallback();
		});

		_window.resize(function(){
			dialogCenter();
			shadowResize();
		});

		if(!_lock){
			_document.on('keyup',function(e){
				esc(e);
			});
		}

		function close(){
			if(!_lock){
				if(_effect=='zoom'){
					_GlDialog.stop(1,0).hide(_animation,function(){
						wrapDelete();
					});
				}else if(_effect=='slide'){
					_GlDialog.stop(1,0).slideUp(_animation,function(){
						wrapDelete();
					});
				}else if(_effect=='fade'){
					_GlDialog.stop(1,0).animate({
						'marginTop':-_GlDialog.outerHeight()/2 - 50,
						'opacity':'hide'
					},_animation,function(){
						wrapDelete();
					});
				}else if(_effect=='scroll'){
					_GlDialog.stop(1,0).animate({
						'marginTop':-_GlDialog.outerHeight()/2 - (arrPageSizes[3]+_GlDialog.outerHeight())/2
					},_animation,function(){
						wrapDelete();
					});
				}else{
					_GlDialog.stop(1,0).hide(0,function(){
						wrapDelete();
					});
				}
			}
		}

		function esc(e){
			if(e != undefined && e.keyCode == 27 && _esc){
				close();
				_escCallback();
			}
		}

		function wrapDelete(){
			if(_element==''){
				_GlDialog.remove();
			}else{
				_GlDialog.hide();
			}
			_GlDialogShadow.animate({
				'opacity':'0'
			},500,function(){
				_GlDialogShadow.remove();
			});
			clearInterval(_countdownInterval);
			clearTimeout(_countdownTimeout);
			_document.unbind('keyup',esc());
		}

		function countdown(){
			if(_auto){
				if(_element==''){
					_countdownInterval = setInterval(function(){
						_countdownIndex--;
						if(_countdownIndex < 0){
							_countdownIndex = 0;
						}
						_countdownNum.html(_countdownIndex);
						if(_countdownIndex==0){
							clearInterval(_countdownInterval);
						}
					},1000);
				}
				_countdownTimeout = setTimeout(function(){
					close();
				},_time);
			}
		}

		function shadowResize(){
			arrPageSizes = getPageSize();
			_GlDialogShadow.css({
				'width':arrPageSizes[0],
				'height':arrPageSizes[1]
			});
		}

		function dialogCenter(){
			arrPageSizes = getPageSize();

			if(_top==null && _bottom==null){
				if(_left!=null){
					if(_isIE6){
						_GlDialog.stop(1,0).animate({
							top:arrPageSizes[3]/2 + _document.scroll()
						});
					}else{
						_GlDialog.stop(1,0).animate({
							top:arrPageSizes[3]/2 + _scrollTop
						});
					}
				}else if(_right!=null){
					if(_isIE6){
						_GlDialog.stop(1,0).animate({
							top:arrPageSizes[3]/2 + _document.scroll(),
							left:arrPageSizes[2] - _GlDialog.outerWidth() - _marginLeftPX - _rightPX
						});
					}else{
						_GlDialog.stop(1,0).animate({
							top:arrPageSizes[3]/2 + _scrollTop,
							left:arrPageSizes[2] - _GlDialog.outerWidth() - _marginLeftPX - _rightPX
						});
					}
				}else{
					if(_isIE6){
						_GlDialog.stop(1,0).animate({
							left:arrPageSizes[2]/2,
							top:arrPageSizes[3]/2 + _document.scroll()
						});
					}else{
						_GlDialog.stop(1,0).animate({
							left:arrPageSizes[2]/2,
							top:arrPageSizes[3]/2 + _scrollTop
						});
					}
				}
			}else if(_top!=null){
				if(_left!=null){

				}else if(_right!=null){
					_GlDialog.stop(1,0).animate({
						left:arrPageSizes[2] - _GlDialog.outerWidth() - _marginLeftPX - _rightPX
					});
				}else{
					_GlDialog.stop(1,0).animate({
						left:arrPageSizes[2]/2
					});
				}
			}else if(_bottom!=null){
				if(_left!=null){
					if(_isIE6){
						_GlDialog.stop(1,0).animate({
							top:_document.scroll() + arrPageSizes[3] - _GlDialog.outerHeight() - _marginTopPX - _bottomPX
						});
					}else{
						_GlDialog.stop(1,0).animate({
							top:_scrollTop + arrPageSizes[3] - _GlDialog.outerHeight() - _marginTopPX - _bottomPX
						});
					}
				}else if(_right!=null){
					if(_isIE6){
						_GlDialog.stop(1,0).animate({
							left:arrPageSizes[2] - _GlDialog.outerWidth() - _marginLeftPX - _rightPX,
							top:_document.scroll() + arrPageSizes[3] - _GlDialog.outerHeight() - _marginTopPX - _bottomPX
						});
					}else{
						_GlDialog.stop(1,0).animate({
							left:arrPageSizes[2] - _GlDialog.outerWidth() - _marginLeftPX - _rightPX,
							top:_scrollTop + arrPageSizes[3] - _GlDialog.outerHeight() - _marginTopPX - _bottomPX
						});
					}
				}else{
					if(_isIE6){
						_GlDialog.stop(1,0).animate({
							left:arrPageSizes[2],
							top:_document.scroll() + arrPageSizes[3] - _GlDialog.outerHeight() - _marginTopPX - _bottomPX
						});
					}else{
						_GlDialog.stop(1,0).animate({
							left:arrPageSizes[2],
							top:_scrollTop + arrPageSizes[3] - _GlDialog.outerHeight() - _marginTopPX - _bottomPX
						});
					}
				}
			}
		}

	};

	$.fn.GlTips = function(options){

		var defaults = {
			content:'',
			direction:'top left',
			distance:10,
			closeBtn:true,
			width:null,
			effect:null,
			trigger:null,
			callback:function(){}
		};

		var o = $.extend(defaults,options),
			_content = o.content,
			_direction = o.direction,
			_distance = o.distance,
			_closeBtn = o.closeBtn,
			_width = o.width,
			_effect = o.effect,
			_trigger = o.trigger,
			_callback = o.callback,
			_body = $('body');

		return this.each(function(){
			var _this = $(this),
				_offset = _this.offset(),
				_left = _offset.left,
				_top = _offset.top,
				_thisHeight = _this.outerHeight(),
				_thisWidth = _this.outerWidth(),
				_wrapWidth = _width==null ? 'auto' : _width+'px',
				_closeBtnHtml = _closeBtn ? '<span class="close">×</span>' : '',
				_html = '<div class="GlTips" style="width:'+_wrapWidth+';"><div class="con">'+_content+'</div><span class="icon"><s></s><i></i></span>'+_closeBtnHtml+'</div>';


			_body.append(_html);

			var _GlTips = $('.GlTips').last(),
				_close = _GlTips.find('.close'),
				_icon = _GlTips.find('.icon'),
				_iconWidth = _icon.outerWidth(),
				_iconHeight = _icon.outerHeight(),
				_tipsHeight = _GlTips.outerHeight(),
				_tipsWidth = _GlTips.outerWidth(),
				_marginTopPX = -(_tipsHeight - _thisHeight)/2,
				_marginLeftPX = -(_tipsWidth - _thisWidth)/2;

			if(_direction.indexOf('top') == 0){
				top();
				topBottomAlign();
			}else if(_direction.indexOf('bottom') == 0){
				bottom();
				topBottomAlign();
			}else if(_direction.indexOf('right') == 0){
				right();
				leftRightAlign();
			}else if(_direction.indexOf('left') == 0){
				left();
				leftRightAlign();
			}

			if(_trigger==null){
				tipsShow();
				_this.on('click',function(){
					if(_GlTips.is(':hidden')){
						tipsShow();
					}else{
						close();
					}
				});
			}else if(_trigger=='click'){
				_this.on('click',function(){
					if(_GlTips.is(':hidden')){
						tipsShow();
					}else{
						close();
					}
				});
			}else if(_trigger=='mouseenter'){
				_this.hover(function(){
					tipsShow();
				},function(){
					close();
				});
			}else if(_trigger=='focus'){
				_this.focus(function(){
					tipsShow();
				}).blur(function(){
					close();
				});
			}

			_close.click(function(){
				close();
			});

			function tipsShow(){
				if(_effect=='fade'){
					_GlTips.stop(1,1).fadeIn();
				}else{
					_GlTips.show();
				}
			}

			function close(){
				if(_effect=='fade'){
					_GlTips.fadeOut();
				}else{
					_GlTips.hide();
				}
				_callback();
			}

			function top(){
				_GlTips.css({
					left:_left,
					top:_top - _tipsHeight - _distance
				}).addClass('GlTipsTop');
			}

			function bottom(){
				_GlTips.css({
					left:_left,
					top:_top + _thisHeight + _distance
				}).addClass('GlTipsBottom');
			}

			function topBottomAlign(){
				if(_direction.indexOf('center') > 0){
					_GlTips.css({
						marginLeft:_marginLeftPX
					});
					_icon.css({
						left:'50%',
						marginLeft:-_iconWidth/2
					});
				}else if(_direction.indexOf('right') > 0){
					_GlTips.css({
						marginLeft:_marginLeftPX*2
					});
					_icon.css({
						left:'auto',
						right:10
					});
				}
			}

			function left(){
				if(_direction.indexOf('top') > 0){
					_top = _thisHeight < 20 ? _top-10 : _top;
				}else if(_direction.indexOf('bottom') > 0){
					_top = _thisHeight < 20 ? _top+10 : _top;
				}
				_GlTips.css({
					left:_left - _tipsWidth - _distance,
					top:_top
				}).addClass('GlTipsLeft');
			}

			function right(){
				if(_direction.indexOf('top') > 0){
					_top = _thisHeight < 20 ? _top-10 : _top;
				}else if(_direction.indexOf('bottom') > 0){
					_top = _thisHeight < 20 ? _top+10 : _top;
				}
				_GlTips.css({
					left:_left + _thisWidth + _distance,
					top:_top
				}).addClass('GlTipsRight');
			}

			function leftRightAlign(){
				if(_direction.indexOf('center') > 0){
					_GlTips.css({
						marginTop:_marginTopPX
					});
					_icon.css({
						top:'50%',
						marginTop:-_iconHeight/2
					});
				}else if(_direction.indexOf('bottom') > 0){
					_GlTips.css({
						marginTop:_marginTopPX*2
					});
					_icon.css({
						top:'auto',
						bottom:10
					});
				}
			}

		});

	};

	$.fn.GlPlaceholder = function(options){

		var defaults = {
			color:'#a9a9a9'
		};

		var o = $.extend(defaults,options),
			_color = o.color;

		return this.each(function(){
			var _isPlaceholderSupport = isPlaceholderSupport();
			if(!_isPlaceholderSupport){
				var _this = $(this),
					_paddingLeft = _this.css('paddingLeft'),
					_height = _this.outerHeight(),
					_placeholder = _this.attr('placeholder'),
					_position = _this.position();

				_this.after('<span class="GlPlaceholderMsg">'+_placeholder+'</span>');

				var _GlPlaceholderMsg = _this.siblings('.GlPlaceholderMsg');
				_GlPlaceholderMsg.css({
					'position':'absolute',
					'left':_position.left,
					'top':_position.top,
					'line-height':_height+'px',
					'paddingLeft':_paddingLeft,
					'color':_color
				}).click(function(){
					_this.focus();
				});

				_this.focus(function(){
					_GlPlaceholderMsg.hide();
				}).blur(function(){
					if(_this.val()==''){
						_GlPlaceholderMsg.show();
					}
				});

				if(_this.is('textarea')){
					_GlPlaceholderMsg.css({
						'line-height':'22px'
					});
				}
			}
		});

		function isPlaceholderSupport(){
			return 'placeholder' in document.createElement('input');
		}

	};

})(jQuery);

//判断浏览器
var _isIE6 = !$.support.opacity && !$.support.style && window.XMLHttpRequest==undefined;
var _isIE7 = !$.support.opacity && !$.support.style && window.window.XMLHttpRequest!=undefined;
var _isIE67 = !$.support.opacity && !$.support.style;
var _isMozilla = /firefox/.test(navigator.userAgent.toLowerCase());
var _isWebkit = /webkit/.test(navigator.userAgent.toLowerCase());
var _isOpera = /opera/.test(navigator.userAgent.toLowerCase());
var _isMsie = /msie/.test(navigator.userAgent.toLowerCase());

//获取浏览器页面及窗口高度宽度
function getPageSize() {
    var xScroll, yScroll;
    if (window.innerHeight && window.scrollMaxY) {
        xScroll = window.innerWidth + window.scrollMaxX;
        yScroll = window.innerHeight + window.scrollMaxY;
    } else {
        if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac    
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari    
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }
    }
    var windowWidth, windowHeight;
    if (self.innerHeight) { // all except Explorer    
        if (document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else {
            windowWidth = self.innerWidth;
        }
        windowHeight = self.innerHeight;
    } else {
        if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode    
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else {
            if (document.body) { // other Explorers    
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight;
            }
        }
    }       
    // for small pages with total height less then height of the viewport    
    if (yScroll < windowHeight) {
        pageHeight = windowHeight;
    } else {
        pageHeight = yScroll;
    }    
    // for small pages with total width less then width of the viewport    
    if (xScroll < windowWidth) {
        pageWidth = xScroll;
    } else {
        pageWidth = windowWidth;
    }
    arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
    return arrayPageSize;
};