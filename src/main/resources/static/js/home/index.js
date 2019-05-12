(function ($) {

	// function isInTime(start, end){
	// 	var startTime = new Date(start).getTime();
	// 	var endTime = new Date(end).getTime();
	// 	var currentTime = new Date().getTime();
	// 	var firstTime = cookieUtil.get('firstTime');
	// 	if(firstTime){
	// 		// 如果存在表示进入过
	// 		var time = currentTime - firstTime;
	// 		console.log(time)
	// 		if(time >= 1000*60*60 && startTime <= currentTime && currentTime <= endTime){
	// 			// 如果过了一小时,表示可以显示banner，并且将时间修改成当前时间
	// 			cookieUtil.set('firstTime', currentTime);
	// 			console.log('true')
	// 			return true;
	// 		}else{
	// 			console.log('false')
	// 			return false;
	// 		}
	// 	}else if(startTime <= currentTime && currentTime <= endTime){
	// 		// 如果不存在，就将当前时间存起来(表示第一次进入，第一次进入显示弹框)
	// 		cookieUtil.set('firstTime', currentTime);
	// 		return true;
	// 	}
	// }
	spm.push([ '_trackPageview' ]);
	// $cover = $('.cover');
	// $iDuiFen = $('#iDuiFen');
	// $close = $('.close');
	// var isApp = false;
	// if(browserUtil.jfmore){
	// 	// 如果是app
	// 	isApp = true;
	// }
	// var referrer = document.referrer,
	// 	index0 = referrer.indexOf('/jfmall/index.htm'),//从首页
	// 	index1 = referrer.indexOf('/auth/login'),// 从登录页
	// 	index2 = referrer.indexOf('/auth/reg'),// 从注册页
	// 	index3 = stringUtil.getQueryValue(location.href,'from')==='gzh', // 从公众号
	// 	index4 = stringUtil.getQueryValue(referrer,'channel_source')==='02000148', // 从活动
	// 	butlerIndex = location.href.indexOf('/butler/index.htm');// 当前页面是管家首页
	// function showAD(){
	// 	var isInPeriod = isInTime('2018/8/1 00:00:00','2018/8/31 23:59:59');
	// 	// 如果是从首页进入的(如果是app, H5首页等进入)
	// 	if(isInPeriod && (isApp|| index0 >0 || index1 > 0|| index2 > 0|| index3 || index4) && (butlerIndex > 0)){
	// 		$cover.show();
	// 		$iDuiFen.show();
	// 		$close.show();
	// 	}else{
	// 		$cover.hide();
	// 		$iDuiFen.hide();
	// 		$close.hide();
	// 	}
	// 	$close.click(function(){
	// 		$cover.hide();
	// 		$iDuiFen.hide();
	// 		$close.hide();
	// 	});
	// }
	// showAD();

	// setInterval(function(){
	// 	showAD();
	// },1000*60*60);
	var tencent = stringUtil.getQueryValue('tencentRights');
	if(tencent){
		cookieUtil.set('tencentRights',tencent);
	}
	var userToken = cookieUtil.get('login_token') || '';
	var setTips = function(msg, time, tag) {
		mui.toast(msg, { duration : time || '1', type : tag || 'div' });
	};
	var allCount = 0;
	var showLoading = function() {
		$('#tost').show();
	};
	var hideLoading = function() {
		$('#tost').hide();
	};
	var isArray = function(E) { // 判断是否数组
		return Object.prototype.toString.call(E) === '[object Array]';
	};

	// animate
	var ANIMATION = {
		suanfa : function(t, b, c, d) {
		    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		},
		stop : function (elem) {
			var m = this;
			m.__arr = m.__arr || [];
			for (var i = m.__arr.length - 1; i >= 0; i--) {
				if (m.__arr[i].elem ==  elem) {
					m.__arr[i].callback();
					m.__arr.splice(i, 1);
				}
			}
		},
		animate : function(elem, to, time, callback) {
		    var m = this, from;
		    from = parseFloat(elem.innerHTML.replace(/,/g,''));
		    var t = 0 , d = time , now = +new Date(), range = Math.abs(from - to);
		    var dir = to > from ? true : false, v;
		    var _run = function(gotoEnd) {
		        if (t < d && !gotoEnd) {
		            t = +new Date() - now;
		            v = m.suanfa(t, 0, range, d);
		            elem.innerHTML = stringUtil.comma((dir ? from + v : from - v).toFixed(2));
		        } else {
		            elem.innerHTML = stringUtil.comma((dir ? from + range : from - range).toFixed(2));
		            callback && callback();
		            return true;
		        }
		    };
		    _run.elem = elem;
		    _run.to = to;
		    _run.callback = function () {
		    	callback && callback();
		    	return true;
		    };
		    if (m.__arr && m.__arr.length) {
		        return m.__arr.push(_run);
		    }
		    m.__arr = [_run];
		    clearInterval(m.tid);
		    m.tid = setInterval(function() {
		        for (var i = m.__arr.length - 1; i >= 0; i--) {
		            m.__arr[i]() && m.__arr.splice(i, 1);
		        }

		    }, 15);
		}
	}

	var points = {
		BOC : {
			name : '中国银行',
			value : 0,
			rate : 1 / 5
		},
		CMCC : {
			name : '中国移动',
			value : 0,
			rate : 1
		},
		CEAIR : {
			name : '东方航空',
			value : 0,
			rate : 1.66
		},
		computed : function () {
			var val = 0, elem, obj;
			for ( var item in this) {
				obj = this[item];
				if (this.hasOwnProperty(item) && obj.value > 0) {
					val += obj.value * obj.rate;
				}
			}
			if (val) {
				// elem = document.querySelector('.h_title span');
				$('.cycount').show().find('span').text(val.toFixed(0));
				// ANIMATION.stop(elem)
				// ANIMATION.animate(elem, val, 3000);
			}
		}
	};

	var initUI = setTimeout(function() {
		var wh = $(window).height();
		var offTop = $('.pro_box').offset().top;
		var navHeight = $('.mui-bar-nav').height() || 0;
		var historyDetail = $('.detail').outerHeight();
		var minHeight = Math.floor(wh - offTop - navHeight - historyDetail);

		// $('.pro_box').css('min-height', minHeight);
	}, 0);

	// auto redirect
	var config = {
		_SPLIT : '_',
		_CONFIG : 'bulter_config_',
		_BIND : 'bulter_bind',
		init : function() {
			this.initParm();
		},
		initParm : function() {
			var m = this, _VALS, _split, _KEY, _cache, _data;
			_split = m._SPLIT;
			_KEY = m._CONFIG;
			_cache = spm.util.cookie.get(_KEY);
			_data = { // 这里要从缓存里拿
				type : spm.getQueryValue('type').toUpperCase(),
				opt : spm.getQueryValue('opt').toUpperCase(),
				query : spm.getQueryValue('query').toUpperCase()
			};

			if (_data.type && _data.opt && _data.opt == 'EXCHANGE') {
				spm.util.cookie.set(_KEY, _data.type + _split + _data.opt + _split + _data.query);
			} else if (_cache) {
				_VALS = _cache.split(_split);
				_data = { // 这里要从缓存里拿
					type : _VALS[0],
					opt : _VALS[1],
					query : _VALS[2],
					isCache: true
				};
				spm.util.cookie.set(_KEY, '');
			} else {
				spm.util.cookie.set(_KEY, '');
			}
			this._config = _data;
		},
		setBindCacheForExchange : function(type) {
			spm.util.cookie.set(this._CONFIG, type + this._SPLIT + 'EXCHANGE');
			spm.util.cookie.set(this._BIND, 'true');
		},
		getParm : function(callback) {
			callback(this._config || {});
		},
		checkRedirect : function(type, data, replaceFefreshFunc) {
			var m = this, _key = this._BIND;
			var _refresh = function(url, code) {
				if (replaceFefreshFunc && typeof replaceFefreshFunc === 'function') {
					replaceFefreshFunc();
				} else {
					var spmCode = spm.getNumberCode(code);
					spm.push([ '_trackEvent', spmCode, '02' ]);
					spm.refresh(spm.addSpm(url, spmCode), true);
				}
			};
			var _setSign = function(parm) {
				parm.opt == 'EXCHANGE' && spm.util.cookie.set(_key, 'true');
			};
			// 防止三个股东方都会跳转入来前先人判断清除之前的
			m.getParm(function(parm) {
				if (!parm.type || !parm.opt || parm.type != type) {
					return;
				}
				var code = '';
				if ((data.state === 0 || data.state === 2) && (parm.opt === 'BIND' || (parm.opt === 'EXCHANGE' && !parm.isCache))) {
					// 成功后要清除缓存
					switch (parm.type) {
					case 'BOC':
						code = '3.1';
						break;
					case 'CMCC':
						code = '4.1';
						break;
					case 'CEAIR':
						code = '5.1';
						break;
					}
					_setSign(parm);
					_refresh(data.url, code);
				} else if (data.state == 1 && parm.opt == 'EXCHANGE') { // 新绑定才执行
					if (spm.util.cookie.get(_key)) {
						// 成功后要清除缓存
						switch (parm.type) {
						case 'BOC':
							code = '3.5';
							break;
						case 'CMCC':
							code = '4.5';
							break;
						case 'CEAIR':
							code = '5.5';
							break;
						}
						_refresh(data.exchangeUrl, code);
					} else if (parm.query == 'TRUE') {
						switch (parm.type) {
						case 'CMCC':
							interfaceObj.queryCmccIsExchange(function(isExchange) {
								!isExchange && _refresh(data.exchangeUrl, '4.5');
							});
							break;
						}
					}
					spm.util.cookie.set(_key, '');
				}
			});
		}
	};

	// about resource
	var interfaceObj = {
		init : function() {
			var m = this;
			typeof tips == 'string' && tips && setTips(tips);
			var __runCmcc = m.getCmccInfo.bind(this, function(data) { // 移动
				var $li, $moveUnbind, $moveBind, $txt;
				$li = $('#CMCC_li');
				$moveUnbind = $li.find('.move-unbind');
				$moveBind = $li.find('.move-bind');
				$txt = $li.find('.txt');

				if (data.ret == '0000') {
					if (data.state == 1) {
						$moveBind.show();
						$txt.show().text('可兑换积分进入兑分页查看');
						$('#CMCC_div').attr('data-spm', 2);
						$li.click(function () {
							location.href="/butler/exchange/cmcc/CMCC.htm"; // 进入 去兑入 页面
						});
						config.checkRedirect('CMCC', data);
					} else if (data.state == 2) {
						var _runActive = function(isReplace) {
							m.findCmccActiveUrl(function(_data) { // 激活（绑定后3个月内未使用才会出现冻结状态）
								if (_data.ret == '0000') {
									spm.push([ '_trackEvent', spm.getNumberCode('4.1'), '02' ]);
									spm.refresh(spm.addSpm(_data.mobileurl, spm.getNumberCode('4.1')), isReplace);
								} else {
									setTips(_data.msg);
									/D201|D202|D203|D205/.test(_data.ret) && setTimeout(function() {
										location.reload(true);
									}, 2000);
								}
							});
						};
						$txt.show().text('激活后才可进行积分兑入');
						$moveUnbind.show();
						$('#CMCC_div').attr('data-spm', 3);
						$li.click(_runActive);
						config.checkRedirect('CMCC', data, _runActive.bind(null,
								true));
					} else {
						var _runBind = function(isReplace) {
							m.findCmccBindUrl(function(_data) { // 绑定
								if (_data.ret == '0000') {
									spm.push([ '_trackEvent', spm.getNumberCode('4.2'), '02' ]);
									spm.refresh(spm.addSpm(_data.mobileurl, spm.getNumberCode('4.2')), isReplace);
								} else {
									setTips(_data.msg);
								}
							});
						};
						$txt.show().text('绑定后才可进行积分兑入');
						$moveUnbind.show();
						$('#CMCC_div').attr('data-spm', 1);
						$li.click(function () {
							config.setBindCacheForExchange('CMCC');
							_runBind();
						});
						config.checkRedirect('CMCC', data, _runBind);
					}
				} else {
					$moveUnbind.show();
					$txt.show().text('绑定后才可进行积分兑入');
					$('#CMCC_div').attr('data-spm', 1);
					$li.unbind('click').click(__runCmcc);
				}
			});
			var __runBoc = m.getBocInfo.bind(this, function(data) { // 中行
				var $li, $bankBind, $bankUnbind, $txt, $bindTxt;
				$li = $('#BOC_li');
				$bankBind = $li.find('.bank-bind');
				$bankUnbind = $li.find('.bank-unbind');
				$txt = $li.find('.txt');
				$bindTxt = $li.find('.bind-txt');
				if (data.ret == '0000') { // 显示兑换
					if (data.state == 1) {
						points.BOC.value = data.point;
						$bindTxt.show().find('span').html('可兑换'+stringUtil.comma((Number(points.BOC.value)/5).toFixed(0))+'畅由积分');
						$li.click(function () {
							location.href = data.url;
						});
						$bankBind.show();
						$('#BOC_div').attr('data-spm', 2);
						points.computed();
					} else { // 显示绑定
						$txt.show();
						$bankUnbind.show();
						$('#BOC_div').attr('data-spm', 1);
						$li.click(function () {
							config.setBindCacheForExchange('BOC');
							location.href = data.url;
						});
					}
					config.checkRedirect('BOC', data);
				} else {
					$txt.show();
					$bankUnbind.show();
					$('#BOC_div').attr('data-spm', 1);
					$li.unbind('click').click(__runBoc);
				}
			});
			var __runCeair = m.getCeairInfo.bind(this, function(data) { // 东航
				var $li, $airBind, $airUnbind, $txt, $bindTxt;
				$li = $('#CEAIR_li');
				$airBind = $li.find('.air-bind');
				$airUnbind = $li.find('.air-unbind');
				$txt = $li.find('.txt');
				$bindTxt = $li.find('.bind-txt');
				successFun = function(showPoint) {
					if (data.state == 1) {
						if (showPoint) {
							points.CEAIR.value = data.point;
							$airBind.show();
							$bindTxt.show().find('span').html('可兑换'+stringUtil.comma((Number(points.CEAIR.value) * 1.66).toFixed(0))+'畅由积分');
							points.computed();
						}
						$('#CEAIR_div').attr('data-spm', 2);
						$li.click(function () {
							location.href = data.url;
						});
					} else {
						$li.click(function () {
							config.setBindCacheForExchange('CEAIR');
							location.href = data.url;
						})
						$airUnbind.show();
						$txt.show();
						$('#CEAIR_div').attr('data-spm', 1);
					}
					config.checkRedirect('CEAIR', data);
				}

				if (data.ret == '0000') {
					successFun(true);
				} else if (data.ret == '400') {// 东航正在升级
					successFun(false);
					$airUnbind.show();
					$txt.show();
					$li.unbind('click').click(function() {
						mui.toast('东方航空，' + data.msg);
					});
				} else {
					$airUnbind.show();
					$txt.show();
					$('#CEAIR_div').attr('data-spm', 1);
					$li.unbind('click').click(__runCeair);
					mui.toast('东方航空，' + data.msg);
				}

			});
			__runCmcc();
			__runBoc();
			__runCeair();

			var $cycount = $('.cycount');
			$cycount.on('click',function() {
				var $that = $(this);
				if($that.hasClass('pon')) {
					$that.removeClass('pon');
					$cycount.find('p').fadeOut();
				} else {
					$that.addClass('pon');
					$cycount.find('p').fadeIn();
				}
			});

			$('body').on('click',function() {
				if($cycount.hasClass('pon')) {
					$cycount.removeClass('pon');
					$cycount.find('p').fadeOut();
				} else {
					$cycount.addClass('pon');
					$cycount.find('p').fadeIn();
				}
			});

		}, // 查中行
		getBocInfo : function(callback) {
			this._getInfo({
				url : '/butler/getbindinginf/BOC',
				bindUrl : '/butler/tobinding/BOC.htm',
				activeUrl : '',
				detailUrl : '/butler/exchange/BOC.htm',
				exchangeUrl : '/butler/exchange/BOC.htm',
				callback : callback,
				getJSONCallback : function(data, _data) {
					_data.msg = data.msg;
					if (data && data.ret == '0000' && String(data.isbinding) === 'true') {
						_data.state = 1;
						_data.url = this.detailUrl;
						_data.point = data.outer_points || 0 ;
					}
					if (data.ret !== '0000') {
						mui.toast('中国银行，' + data.msg);
					}
				}
			});
		}, // 查东航
		getCeairInfo : function(callback) {
			this._getInfo({
				url : '/butler/getbindinginf/CEAIR',
				bindUrl : '/butler/tobinding/CEAIR.htm',
				activeUrl : '',
				detailUrl : '/butler/exchange/ceair/CEAIR.htm',
				exchangeUrl : '/butler/exchange/ceair/CEAIR.htm',
				callback : callback,
				getJSONCallback : function(data, _data) {
					_data.msg = data.msg;
					if ((data.ret == '0000' || data.ret == '400') && String(data.isbinding) === 'true') {
						_data.state = 1;
						_data.url = this.detailUrl;
						_data.point = data.outer_points || 0 ;
					}
				}
			});
		}, // 查移动
		getCmccInfo : function(callback) {
			this._getInfo({
				url : '/butler/cmcc/getbindinfo',
				bindUrl : '',
				activeUrl : '',
				detailUrl : '/butler/exchange/cmcc/CMCC.htm',
				exchangeUrl : '/butler/exchange/cmcc/CMCC.htm',
				callback : callback,
				getJSONCallback : function(data, _data) {
					_data.msg = data.msg;
					if (data && data.ret == '0000') {
						if (data.msg == 0 || data.msg == 3) {
							_data.state = 0;
						} else if (data.msg == 1) {
							_data.state = 1;
							_data.url = this.detailUrl;
							_data.point = data.bindPoint || 0 ;
						} else if (data.msg == 2) {
							_data.state = 2;
							_data.url = this.activeUrl;
						}
					}
				}
			});
		},
		_getInfo : function(parm) {
			var m = this, _run, _data, isTimeout = false, tId;
			var userToken = cookieUtil.get('login_token') || '';
			var _URL = parm.url;
			var _isBind = parm.isBind || 0;
			var _bindPoint = parm.bindPoint || 0;
			var _bindUrl = parm.bindUrl;
			var _activeUrl = parm.activeUrl;
			var _detailUrl = parm.detailUrl;
			var _exchangeUrl = parm.exchangeUrl;
			_data = {
				state : _isBind,
				point : _bindPoint,
				url : _bindUrl,
				exchangeUrl : _exchangeUrl
			};
			_run = function(data) {
				delete m[_URL];
				parm.callback(data);
			};
			if (m[_URL])
				return;
			m[_URL] = true;
			if (!userToken) {
				return _run(_data);
			}
			var cacheData = window.cache.get(_URL);
			if (cacheData) {
				spm.push([ '_trackEvent', _URL, '02', 'cache' ]);
				return _run(cacheData);
			}
			// 0:未绑定、1：已绑定、2：已锁定
			mui.getJSON(_URL + '.htm', function(data) {
				if (isTimeout) return;
				clearTimeout(tId);
				data = data || {};
				_data.ret = data.ret;
				parm.getJSONCallback(data, _data);
				spm.push([ '_trackEvent', _URL, '02', data.ret ]);
				data.ret == '0000' && window.cache.set(_URL, _data, 1000 * 30);
				_run(_data);
			});
			tId = setTimeout(function() {
				isTimeout = true;
				spm.push([ '_trackEvent', _URL, '02', 'timeout' ]);
				_run({ msg : '请求超时！' });
			}, 1000 * 20);
		}, // 积分
		qureyCmccPoints : function(callback) {
			var m = this, _run, _URL, isTimeout = false, tId;
			_URL = '/butler/cmcc/getuserpoint/CMCC';
			_run = function(data) {
				delete m[_URL];
				hideLoading();
				callback(data || {});
			};
			if (m[_URL]) return;
			m[_URL] = true;
			var cacheData = window.cache.get(_URL);
			if (cacheData) {
				spm.push([ '_trackEvent', _URL, '02', 'cache' ]);
				return _run(cacheData);
			}
			showLoading();
			mui.getJSON(_URL + '.htm', function(data) {
				if (isTimeout) return;
				clearTimeout(tId);
				spm.push([ '_trackEvent', _URL, '02', data.ret ]);
				data.ret == '0000' && window.cache.set(_URL, data, 1000 * 60);
				_run(data);
			});
			tId = setTimeout(function() {
				isTimeout = true;
				spm.push([ '_trackEvent', _URL, '02', 'timeout' ]);
				_run({ msg : '请求超时！' });
			}, 1000 * 20);
		}, // 绑定
		findCmccBindUrl : function(callback) {
			this._cmccBindActive('binding', callback);
		}, // 激活
		findCmccActiveUrl : function(callback) {
			this._cmccBindActive('active', callback);
		}, // 绑定&激活
		_cmccBindActive : function(type, callback) {
			var m = this, _run, _URL, isTimeout = false, tId;
			_URL = '/butler/cmcc/' + type + '/CMCC';
			_run = function(data) {
				delete m[_URL];
				callback(data || {});
			};
			if (m[_URL]) return;
			m[_URL] = true;
			var cacheData = window.cache.get(_URL);
			if (cacheData) {
				spm.push([ '_trackEvent', _URL, '02', 'cache' ]);
				return _run(cacheData);
			}
			mui.getJSON(_URL + '.htm', function(data) {
				if (isTimeout) return;
				clearTimeout(tId);
				spm.push([ '_trackEvent', _URL, '02', data.ret ]);
				data.ret == '0000' && window.cache.set(_URL, data, 1000 * 60);
				_run(data);
			});
			tId = setTimeout(function() {
				isTimeout = true;
				spm.push([ '_trackEvent', _URL, '02', 'timeout' ]);
				_run({ msg : '请求超时！' });
			}, 1000 * 20);
		},
		queryCmccIsExchange : function(callback) {
			var m = this, _URL, isTimeout = false, tId;
			_URL = '/butler/exchange/bindingAndExchange/' + userToken;
			mui.getJSON(_URL, function(data) {
				if (isTimeout) return;
				clearTimeout(tId);
				spm.push([ '_trackEvent', _URL, '02', data.ret ]);
				if (data && data.ret == '0000') {
					var isSuccess = String(data.msg).toUpperCase() === 'SUCCESS';
					callback(isSuccess ? true : false);
				} else {
					callback(false);
				}
			});
			tId = setTimeout(function() {
				isTimeout = true;
				spm.push([ '_trackEvent', _URL, '02', 'timeout' ]);
				callback(true);
			}, 1000 * 20);
		}
	};

  config.init();
  interfaceObj.init();

  (function () {
	  var more, moreCon, isClick;
	  var doc, isHide = true;
	  more = $(".more");
	  more_con = $(".more_con");
	  doc = $(document);
	  more.click(function() {
		  isClick = true;
	      isHide = !isHide;
	      setTimeout(function () {
	    	  isHide ? more_con.hide() : more_con.show();
	      }, 100);
	      setTimeout(function () {
	    	  isClick = false;
	      },300);
	  });
	  doc.click(function() {
		  if (isClick) return true;
	      setTimeout(function () {
	    	  isHide = true;
		      more_con.hide();
	      }, 100);
	  });
  })();


})(jQuery);
