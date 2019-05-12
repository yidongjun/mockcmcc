(function($) {
    spm.push(['_trackPageview']);
    var isArray;
    isArray = function(E) { // 判断是否数组
        return Object.prototype.toString.call(E) === "[object Array]";
    };
    var userToken = cookieUtil.get('login_token') || '';
    // about recommend
    var pageData = {
        getClientCode: function(params) {
            var __keyId = params.h5;
            if (browserUtil.ios && params.ios) {
                __keyId = params.ios;
            } else if (browserUtil.android && params.android) {
                __keyId = params.android;
            }
            return __keyId;
        },
        getBaseReq: function(options, callback, reload) {
            var that = this,
                dkey;
            dkey = options.url + stringUtil.params(options.params);
            reload && window.cache.del(dkey);
            if (window.cache.get(dkey)) {
                callback && callback(window.cache.get(dkey));
                return false;
            }
            if (options.onSend && options.onSend(options, callback) === false) return;
            ajaxUtil.loadData({
                url: options.url,
                type: options.type,
                params: options.params,
                onSuccess: function(data) {
                    if (data && (isArray(data) || stringUtil.params(data))) {
                        window.cache.set(dkey, data);
                        callback && callback(data);
                    } else {
                        callback(null);
                    }
                },
                onError: function() { callback(null); }
            });
        },
        getProModule: function(params, callback, reload) {
            var that = this,
                __keyId;
            __keyId = that.getClientCode(params.codes);
            params = mui.extend({ max: 0, moduleName: '' }, params);
            that.getBaseReq({
                type: "payload",
                onSend: params.onSend,
                params: { keyId: __keyId },
                url: "/pointgate/service/product/recommend"
            }, function(data) {
                data = data || [];
                params.max && (data = data.slice(0, params.max));
                params.onBefore && params.onBefore(params, data);
                data.sort(function(a, b) {
                    return b.sort - a.sort;
                })
                for (var j = 0, temamount, item; j < data.length; j++) {
                    item = data[j];
                    item.index = (j + 1);
                    item.moduleName = params.moduleName;
                    item.img = '/' + item.centerPic;
                    temamount = Number(item.price / 100).toFixed(2).split(".");
                    item.bamount = '<font>' + temamount[0] + '.</font>';
                    item.aamount = '<sub>' + temamount[1] + '</sub>';
                    item.link = '/mall/#/goodsDetail?productId=' + item.productId;
                    item.storedCount < 0 && (item.storedCount = 0);

                    if (item.payType == 'cust' || item.payType == 'cash') {
                        item.priceHtml = '<span><b>￥</b>' + (item.bamount + item.aamount) + '</span>';
                        if (item.payType == 'cust') {
                            item.label = '积分抵用';
                        }
                    } else if (item.payType == 'comb') {
                        item.priceHtml = '<span>' + item.points + '</span>积分 + <span><b>￥</b>' + (item.bamount + item.aamount) + '</span>';
                    } else {
                        item.priceHtml = '<span>' + item.points + '</span>积分';
                    }
                }

                var temDate, __data = [],
                    __arr = data.slice();
                if (__arr.length) {
                    while (__arr.length) {
                        temDate = __arr.shift();
                        __data.push(temDate);
                    }
                } else {
                    params.el.hide();
                }

                params.el.template(__data, params.tmpl).attr('keyId', __keyId);
                userUtil.checkLink(params.el);
                params.onAfter && params.onAfter(params, data, __data);
                callback && callback(data, __data);
            }, reload);
        },
        getAdModule: function(params, callback, reload) {
            var that = this,
                __keyId;
            __keyId = that.getClientCode(params.codes);
            params = mui.extend({ column: [1], defLen: 1, max: 0, row: -1, moduleName: '' }, params);
            that.getBaseReq({
                type: "payload",
                onSend: params.onSend,
                params: { keyId: __keyId },
                url: "/pointgate/service/ad/recommend"
            }, function(data) {
                data = data || [];
                params.max && (data = data.slice(0, params.max));
                params.onBefore && params.onBefore(params, data);
                data.sort(function(a, b) {
                    return b.sort - a.sort;
                })
                for (var j = 0, obj; j < data.length; j++) {
                    obj = data[j];
                    obj.index = (j + 1);
                    obj.moduleName = params.moduleName;
                    obj.img = '/' + obj.adContent;
                    obj.link = obj.adUrl.replace(/(http.*?.jfmore.com)(\/.*)/, '$2');
                    obj.adUrl == 'https://www.changyoyo.com' && (obj.adUrl = '', obj.id = 'no');

                }
                var num = 0,
                    len = 0,
                    difLen = 0,
                    temArr = [];
                var __data = [],
                    __arr = data.slice();
                if (__arr.length) {
                    while (__arr.length) {
                        len = params.column[num] || params.defLen;
                        temArr = __arr.splice(0, len);
                        difLen = len - temArr.length;
                        (difLen > 0 && num > params.row) && mui.each(Array(difLen), function() { temArr.push({}); })
                        __data.push({ items: temArr.splice(0) });
                        num++;
                    }
                } else {
                    params.el.hide();
                }
                params.el.template(__data, params.tmpl).attr('keyId', __keyId);;
                userUtil.checkLink(params.el);
                params.onAfter && params.onAfter(params, data, __data);
                callback && callback(data, __data);
            }, reload);
        },
        getImages: function(keyId, callback, reload) {
            var __data = [];
            this.getBaseReq({
                type: 'payload',
                url: '/pointgate/service/ad/recommend',
                params: { keyId: keyId }
            }, function(data) {
                data = data || [];
                data.length && data.map(function(item) {
                    var __item = {
                        id: item.id,
                        title: item.adName,
                        img: '/' + item.adContent,
                        link: item.adUrl.replace(/(http.*?.jfmore.com)(\/.*)/, '$2'),
                        desc: item.adDesc
                    };
                    __item.link == 'https://www.changyoyo.com' && (__item.link = '', __item.id = 'no');
                    __data.push(__item);
                });
                callback(__data);
            }, reload);
        }
    };
    // ad list
    var adList = {
        tmpl: {
            slider: function() {
                /*
                             <div class="mui-slider-group mui-slider-loop">
                             {#firstSlide}
                	             <div class="mui-slider-item mui-slider-item-duplicate">
                		             {#link}<a href="{link}" data-spm="{id}" data-stat="轮播1-{title}">{/link}
                		             <img src="{img}" alt="{title}" />
                		             {#link}</a>{/link}
                	             </div>
                             {/firstSlide}
                             {#slideList}
                	             <div class="mui-slider-item">
                		             {#link}<a href="{link}" data-spm="{id}" data-stat="轮播{index}-{title}">{/link}
                		             <img src="{img}" alt="{title}" />
                		             {#link}</a>{/link}
                	             </div>
                             {/slideList}
                             {#firstSlide}
                	             <div class="mui-slider-item mui-slider-item-duplicate">
                		             {#link}<a href="{link}" data-spm="{id}" data-stat="轮播1-{title}">{/link}
                		             <img src="{img}" alt="{title}" />
                		             {#link}</a>{/link}
                	             </div>
                             {/firstSlide}
                             </div>
                             <div class="mui-slider-indicator">
                	             {#slideList}
                	             	<div class="mui-indicator{#index=1} mui-active{/index}"></div>
                	             {/slideList}
                             </div>
                             */
            },
            promodule: function() {/*!
             	<a href="{link}" data-spm="{id}">
					<img alt="{goodsName}" src="{img}">
					<strong>{goodsName}</strong>
					<span>{subTitle}</span>
				</a>
         */}
        },
        init: function() {
            var m = this;
            m.eventlist();
            m.initSlider();
            m.goActivityHome();
            m.otherAd();
            m.dhDalibao();
            m.isexchange();
            m.goOrder();
        },
        initSlider: function() {
            var m = this, elem, __runSlider, base_source;
            isSimpleVersion = browserUtil.jfmore === '1.0.0';
        	if (isSimpleVersion) return;
            elem = mui('.mui-slider');
            base_source = "02000000";
            __runSlider = function(source) {
                pageData.getImages('bulter_exchange_success_' + source, function(data) {
                    if (data.length > 0) {
                        if (data.length < 2) {
                            elem.template({
                                slideList: data
                            }, m.tmpl.slider).slider().setStopped(true);
                            mui('.mui-slider-indicator').hide()
                        } else {
                            elem.template({
                                slideList: data,
                                firstSlide: data[0]
                            }, m.tmpl.slider).slider({
                                interval: 5000
                            });
                        }
                    } else {
                        source == base_source ? elem.hide() : __runSlider(base_source);
                    }
                });
            }
            __runSlider(spm.getSource());
            elem.show();
        },
        eventlist: function() {
        	var m, list, listCon, isSimpleVersion;
        	m = this;
        	list = $(".eventlist");
        	listCon = $(".eventlist p");
        	isSimpleVersion = browserUtil.jfmore === '1.0.0';
        	if (isSimpleVersion) return;
        	pageData.getProModule({
        		el : listCon,
        		tmpl : m.tmpl.promodule,
        		moduleName : '推荐列表',
        		codes : {
        			'h5' : "success_eventlist"
        		},
        		onAfter : function (params, data) {
        			data.length ? list.show() : list.hide();;
        		}
        	});
        	list.show();
        },
        goActivityHome: function() {
            var __keyId, elem, param, _endTime, _run, link, link_v1;
            elem = $('.btn-wrapper .btn-home');
            if (!spm.getParam() || !elem.length) {
                return;
            }
            param = spm.getParam().replace(/:/g, '=');
            link = spm.getQueryValue(param, "link");
            link=link.replace(/@@/g,"&");//多参数丢失修改
            link_v1 = spm.getQueryValue(param, "link_v1");
            link_v1 && (link = decodeURIComponent(link_v1));
            param=param.replace(/@@/g,"&");//多参数丢失修改
            if (spm.getSource() == spm.getQueryValue(param, "channel_source") && link) {
                _endTime = spm.getQueryValue(param, "endTime");
                //所有channel_source由/static/js/common/channel_source.js提供
                            
                var channel_source_current=spm.getSource();

                //以下渠道执行给定操作
                if(window.channel_source_arr_special && channel_source_arr_special.constructor.name=="Array"){
                    for(var i=0;i<channel_source_arr_special.length;i++){
                        if(channel_source_current==channel_source_arr_special[i].csc){
                            if(channel_source_arr_special[i].action){
                                switch(channel_source_arr_special[i].action.constructor.name){
                                    case "String":
                                        link=channel_source_arr_special[i].action.replace(/\s/g,'');
                                        break;
                                }
                            }
                            
                            break;
                        }
                    }
                }

                _run = function() {
                    elem[0].setAttribute('href', link);
                    elem[0].setAttribute('data-spm', "activitygohome");
                    elem[0].innerHTML = spm.getQueryValue(param, "text") || '返回活动首页';
                };
                if (_endTime) {
                    ajaxUtil.currTime(function(time) {
                        time.getTime() < _endTime && _run();
                    });
                } else {
                    _run();
                }
            }
        },
        // 太平抽奖活动
        otherAd : function () {
        	if (!/02002002|02002007|02000254/.test(spm.getSource())) {
        		return;
        	}
            ajaxUtil.loadData({
                url: '/pointgate/activity-web/getActivitySendRecordInfo',
                type: 'post',
                params: {login_token: userToken, activityCode: '02002002 || 02000254'},
                onSuccess: function (data) {
                    if (data.length == '0') {
                       if(spm.getSource() == '02002002'){
                         mui.alert('获得一次1积分抽奖机会！最高可获得50元话费。', '恭喜您', '点一下100%中奖', function() {
                                spm.refresh('/event/2018/0212tpjf/lucky.html');
                            })
                       }
                       // else if(spm.getSource() == '02000254'){
                       //      mui.alert('获得美团外卖券一张！', '恭喜您', '去领取', function() {
                       //          spm.refresh('https://activity.waimai.meituan.com/coupon/h5channel/7C802B27BAAD4480A11F0C36AB04926B');
                       //      })
                       // }
                    }
                },
                onError: function () {
                    mui.toast(data.msg, {duration: '1000', type: 'div'});
                }
            })
        },
        dhDalibao: function() {
            var dhVoucher, dhList,activityCode;
            dhVoucher = mui(".dh-voucher")
            dhList = mui(".dh-list")
            if(/02000340|02000341|02000344|02001765|02001766/.test(spm.getSource())){
                activityCode="DHBK"
            }else if(/02001819|02001821/.test(spm.getSource())){
                activityCode="02001819"
            }else{
                return;
            }
            ajaxUtil.loadData({
                url: "/pointgate/activity-web/getActivitySendRecordInfo",
                type: 'post',
                params: { login_token: userToken, type: 1, activityCode: activityCode },
                onSuccess: function(data) {
                    var html="";
                    var newArr=[];
                    if (data != '') {
                        newArr = data.filter(function (v,i) {
                            return v.bonusType=='01'
                        })
                        for (var i = 0; i < newArr.length; i++) {
                            newArr[i].expdate = newArr[i].expdate.substr(0, 10);
                            html += '<li><div class="pic-l"><img src="/' + newArr[i].smallpic + '"></div>';
                            html += '<div class="pic-name"><h5 class="tit">' + newArr[i].goodsname + '</h5><div class="date">有效期至' + newArr[i].expdate + '</div></div></li>'
                        }
                        dhList[0].innerHTML = html;
                        dhVoucher.show();
                    }
                },
                onError: function() {
                    dhVoucher.hide();
                }
            });
        },


        // 02006005兑换成功
        goOrder: function() {
            if(!/02006005/.test(spm.getSource())){
                return;
            }
            ajaxUtil.loadData({
                url: "/pointgate/activityRegister/checkIsBingForActivity",
                type: 'post',
                params: { login_token: userToken,channelSource:'02006005',  activityCode:'02006005' },
                onSuccess: function(data) {
                    if(data.exchangeTimes==1){
                      setTimeout(function(){
                        if(browserUtil.android){ //DD1-S1000084
                          spm.refresh('/confirm/confirmorder/1/DD1-S1000084/android.htm');
                        }else if(browserUtil.ios){
                          spm.refresh('/confirm/confirmorder/1/DD1-S1000084/ios.htm');
                        }                        
                      },3000)
                    }
                },
                onError: function(err) {
                    mui.toast(err.msg, {duration: '1000', type: 'div'});
                }
            });
        },
        isexchange: function() {
           var m = this;
            var _channel = spm.getSource();
            if (!/02003892/.test(_channel)) {///02000254|02003892/
                return;
            }
            if(_channel == '02003892'){//湖北
                spm.refresh('/event/2018/0605hb/prods.html');
            }
        }           
    }

    var pubMethod = {
    		data : {},
    		init : function () {
    			var m = this;
    			m.lottery();
            	m.clockIn();
    		},
    		clockIn : function (callback) {
    			var doc = document;
    			callback = callback || function () {}
    			var m = this, URL = '/sign/dosignin.htm', dkey = URL + userToken;
    			if (userToken && !spm.util.cookie.get(dkey)) {
    				mui.ajax(URL,{
    					data:{reqTime:+new Date()},
    					dataType:'json', //服务器返回json格式数据
    					type:'post', //HTTP请求类型
    					success:function(data){
    						if (!data || !data.data || data.ret != '0000') {
    							callback(false);
    							return;
    						};
    						// 添加弹出层
    						var div = doc.createElement('div');
    						div.className = 'clock-in';
    						div.innerHTML = '今日签到成功，积分+' + data.data || 0;
    						doc.body.appendChild(div);
    						setTimeout(function() {
    							doc.body.removeChild(div);
    						}, 5000);
    						ajaxUtil.currTime(function(d) {
    							spm.util.cookie.set(dkey, 'true', {'expires':new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)});
    						});
    						callback(true);
    					}
    				});
    			} else {
    				callback(false);
    			}
    		},
    		lottery : function (callback) {
    			var doc = document;
    			callback = callback || function () {}
    			var m = this, URL = '/lotteryv2/queryfreetimes', dkey = URL + userToken + 'tem';
        		if (userToken &&  !spm.util.cookie.get(dkey)) {
        			/*
    				pageData.getBaseReq({ url : URL, type : "payload", params : {login_token : userToken}}, function (data) {
    					if (!data || !data.surplusFreeTimes) {
    						callback(false);
    						ajaxUtil.currTime(function(d) {
	    			        	spm.util.cookie.set(dkey, 'true', {'expires':new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)});
	    					});
    						return;
    					}
    					mui.confirm("幸运女神降临！金条等你来赢！", "提示", [ "关闭", "立即前往" ], function(event) {
							event.index == 1 && spm.refresh('/lottery/game.htm');
						});
    			        callback(true);
    				});
    				*/
        			ajaxUtil.currTime(function(d) {
			        	spm.util.cookie.set(dkey, 'true', {'expires':new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)});
					    });
        			// mui.confirm("幸运女神降临！金条等你来赢！", "提示", [ "关闭", "立即前往" ], function(event) {
						  //    event.index == 1 && spm.refresh('/lottery/game.htm');
					    // });
			        callback(true);
    			} else {
    				callback(false);
    			}
    		},
           
    	};



    adList.init();
    pubMethod.init();

})(window.mui);
