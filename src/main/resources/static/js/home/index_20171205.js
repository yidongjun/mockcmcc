	var setTips = function(msg, time, tag) {
	    mui.toast(msg, { duration: time || "1", type: tag || "div" });
	};
	var showLoading = function() {
	    $("#tost").show();
	};
	var hideLoading = function() {
	    $("#tost").hide();
	};
	var userToken = cookieUtil.get('login_token') || '';

	function tochange() {
	    location.href = "/butler/exchange/thirdpart.htm";
	}
	$(document).ready(function() {
	    tips && setTips(tips);
	    var outers = ["BOC", "CEAIR"];
	    outers.map(function(val) {
	        getOuterInfo(val);
	    });
	    getCMCCInfo();
	    // queryNameList();
	    showActivity();
	});

	var pointsObj = {}; // 存放积分数据
	// 中国银行
	function getOuterInfo(outer) {
	    var $li, $info, $query, $eye, $btn1, $btn2;
	    $li = $("#" + outer + "_li");
	    $info = $li.find(".info");
	    $query = $li.find(".query");
	    $eye = $li.find(".eye");
	    $btn1 = $li.find(".btn1");
	    $btn2 = $li.find(".btn2");

	    $.getJSON("/butler/getbindinginf/" + outer + ".htm", function(data) {
	        if (data.ret == "0000") {
	            if (data.isbinding == "true") {
	                pointsObj[outer] = data.outer_points;
	                $info.show();
	                $info.html(pointsObj[outer]);
	                $btn2.show();
	            } else {
	                $btn1.show();
	            }
	        } else {
	            // $query.show();
	            // $query.click(function() {
	            // 	getOuterInfo(outer);
	            // });
	        }
	        spm.push(['_trackEvent', "/butler/getbindinginf/" + outer, '02', data.ret]);
	    });
	}
	var bindTips = function() {
	        /*!
	             	  <div class="bind-tips">
	        	        	<div class="img">
	        	        		<a class="more" href="/event/2017/1104/index.html">查看全国规则</a>
	        	        		<img src="/static/css/index/171103/zjl_icon_001.png">
	        	        	</div>
	        	        	<div class="img"><img src="/static/css/index/171103/zjl_icon_002.jpg"></div>
	        	        	<div class="inner">
	        	        		{#servicePasswordText}
	           	        			<div class="des">亲爱的<a style="color: #1aa0ff;">{text}</a>用户，移动积分兑入需正确填写服务密码，如您忘记服务密码，请按照以下方式重置：</div>
	           	        		{/servicePasswordText}
	           	        		{#!servicePasswordText}
	           	        			<div class="des">亲爱的<a style="color: #1aa0ff;">{text}</a>用户，移动积分兑入需正确填写服务密码，如您忘记服务密码，可点击右上角“查看全国规则”查询具体重置方式</div>
	           	        		{/servicePasswordText}
	        	        		<div class="con">
	        	        			<div class="mui-scroll-wrapper">
	        	        				<div class="mui-scroll">
	        	        					{servicePasswordText}
	        	        				</div>
	        	        			</div>
	        	        		</div>
	        	        	</div>
	        	        	<div class="tool-bar">
	        	        		<a class="btn">继续绑定</a>
	        	        	</div>
	        	        </div>
	              */
	    }
	    // 绑定前提示找回密码
	function showBindTips(callback) {
	    var that = this,
	        __run, __data, dkey = userToken,
	        mask, d;
	    d = document;
	    __run = function(data) {
	        var isClose = false,
	            div, mui_div, wrapper, length = 0,
	            base = 38,
	            height = 0;
	        div = d.createElement('div');
	        d.body.appendChild(div);
	        mui_div = mui(div);
	        data.servicePasswordText = data.extend.servicePasswordText || '';
	        data.text = data.province;
	        data.operator = data.operator || '';
	        if (/移动/.test(data.operator)) {
	            data.text += '移动';
	        } else if (/联通/.test(data.operator)) {
	            data.text += '联通';
	        } else if (/电信/.test(data.operator)) {
	            data.text += '电信';
	        }
	        mui_div.template(data, bindTips);
	        mask = mui.createMask(function() {
	            return isClose;
	        });
	        mui_div.find('.btn').tap(function() {
	            isClose = true;
	            mask.close();
	            div.parentNode.removeChild(div);
	            callback();
	        });
	        mask.show();
	        length = data.servicePasswordText.replace(/[^\x00-\xff]/ig, 'xx').length; // 38
	        if (length > base * 2) {
	            height = 0.36 * 3;
	        }
	        if (length > base * 3) {
	            height = 0.36 * 4;
	        }
	        if (length > base * 4) {
	            height = 0.36 * 5;
	        }
	        if (height > 0) {
	            mui_div.find('.mui-scroll-wrapper')[0].style.height = height + "rem";
	            mui_div.find('.con')[0].style.height = height + 0.1 + "rem";
	        }
	        mui_div.find('.mui-scroll-wrapper').scroll({
	            deceleration: 0.0005
	        });
	    };
	    if (window.cache.get(dkey)) {
	        __run(window.cache.get(dkey));
	        return false;
	    }
	    __data = {
	        login_token: userToken
	    };
	    ajaxUtil.loadData({
	        url: '/pointgate/mobile/info/getMobileInfo',
	        type: "get",
	        params: __data,
	        onSuccess: function(data) {
	            window.cache.set(dkey, data);
	            __run(data);
	        },
	        onError: function() { callback(null); }
	    });

	}
	// 查询cmcc绑定信息(移动)
	function getCMCCInfo() {
	    var $li, $info, $query, $eye, $btn1, $btn2;
	    $li = $("#CMCC_li");
	    $info = $li.find(".info");
	    $query = $li.find(".query");
	    $eye = $li.find(".eye");
	    $btn1 = $li.find(".btn1");
	    $btn2 = $li.find(".btn2");
	    $btn3 = $li.find(".btn3");

	    $.getJSON("/butler/cmcc/getbindinfo.htm", function(data) {
	        if (data.ret == "0000") { // 绑定状态 0 初始 1有效 2 冻结 3 解绑
	            if (data.msg == 1) {
	                $query.show();
	                $btn3.show();
	                $query.click(function() {
	                    qureyPoints("CMCC");
	                });
	            } else if (data.msg == 2) {
	                $btn1.show();
	                $btn1.click(function() {
	                    bindCmcc('active');
	                });
	            } else {
	                $btn2.show();
	                $btn2.click(function() {
	                    bindCmcc('binding');
	                    // showBindTips(function () {	
	                    // });
	                });
	            }
	        } else {
	            $query.show();
	            $query.click(function() {
	                getCMCCInfo();
	            });
	        }
	        spm.push(['_trackEvent', '/butler/cmcc/getbindinfo', '02', data.ret]);
	    });
	}

	// 查询移动积分
	function qureyPoints(outer) {
	    var $li, $info, $query, $eye, $btn1, $btn2, _html1;
	    $li = $("#" + outer + "_li");
	    $info = $li.find(".info");
	    $query = $li.find(".query");
	    $eye = $li.find(".eye");
	    $btn1 = $li.find(".btn1");
	    $btn2 = $li.find(".btn2");
	    $btn3 = $li.find(".btn3");

	    showLoading();
	    if (pointsObj[outer] == undefined) {
	        $.getJSON("/butler/cmcc/getuserpoint/" + outer + ".htm", function(data) {
	            spm.push(['_trackEvent', "/butler/cmcc/getuserpoint/" + outer, '02', data.ret]);
	            if (data.ret == "0000" && data.isbinding == "true") {
	                pointsObj[outer] = data.outer_points;
	                $btn3.show();
	                $info.html(pointsObj[outer]);
	                $query.hide();
	                $info.show();
	            } else {
	                //					setTips("系统繁忙，请稍候再试");
	                location.href = spm.addSpm("/butler/cmcc/busy.htm?ret=" + data.ret);
	            }
	            hideLoading();
	        });
	    }
	}

	// 绑定||激动移动账户
	function bindCmcc(url) {
	    $.getJSON("/butler/cmcc/" + url + "/CMCC.htm", function(data) {
	        spm.push(['_trackEvent', "/butler/cmcc/" + url + "/CMCC", '02', data.ret]);
	        if (data.ret == "0000") {
	            location.href = spm.addSpm(data.mobileurl, spm.getModuleCode('4'));
	        } else {
	            setTips(data.msg);
	        }
	    });
	}

	function queryNameList() {
	    var userToken = cookieUtil.get('login_token') || '';
	    if (userToken) {
	        mui.getJSON('/butler/ceair/binding/CEAIR.htm', function(data) {
	            var flag = 0,
	                url = '';
	            if (data.ret === '0000') {
	                flag = 1;
	                url = data.url;
	            } else {
	                msg = data.msg
	                mui('#CEAIR_li .btn-bind').tap(function() {
	                    mui.toast(msg, { duration: '1', type: 'div' });
	                }).attr('href', 'javascript:void(0)');
	            }
	        });
	    }
	}

	function showActivity() {
	    var login_token = cookieUtil.get('login_token');
	    var _channel = stringUtil.getQueryValue('channel_source'),
	        channel_source = (_channel ? '?channel_source=' + _channel : "");
	    ajaxUtil.loadData({
	        type: 'post',
	        url: '/pointgate/treasurebox/period',
	        params: { login_token: login_token },
	        onSuccess: function(data) {
	            mui('#activityBar').show();
	            mui('#activityBar a').attr('href', '/event/2017/1020/index.html' + channel_source);
	        }
	    });
	}