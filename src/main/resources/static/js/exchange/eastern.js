(function () {
    var rate=sfrate/lmrate;
    var exchange = {
        elIpt: $("#exchangepoints"),//积分输入框
        elAdd: $('#add'),//加按钮
        elReduce: $('#reduce'),//减按钮
        elExchange: $('#exchange'),
        elSendCode: $('#sendcode'),
        elClose: $('#close'),
        elSbm: $('#confirm'),
        elCode: $('#code'),
        urlSbm: '/butler/exchange/ceair/pointsdecut.htm',//对换提交接口
        urlResend: '/butler/exchange/ceair/sendcode.htm',//重发短信接口
        urlSendMsg: '/butler/exchange/ceair/confirm/CEAIR.htm',//下发短信接口
        init: function () {
            this.initData();
            this.setEvent();
        },
        setEvent: function () {//设置事件
            var m = this,
                data = this.data;
            m.elIpt.on('focus', function () {
                $("#bottom").hide();
            }).on('blur', function () {
                var v = this.value.trim();
                m.iptBlur(v);
                $("#bottom").show();
            });
            m.elReduce.on('tap', function () {
                m.reduce(data);
            });
            m.elAdd.on('tap', function () {
                m.add(data);
            });
            m.elSendCode.on('tap', function () {
                m.sendMsg(1);
            });
            m.elClose.on('tap', function () {
                m.closeVerBox();
            });
            m.elCode.on('keyup', function () {
                m.checkVerCode();
            });
            m.elSbm.on('tap', function () {
                if (m.checkVerCode()) {
                    m.submit();
                }
            });
            m.elExchange.on('tap', function () {
                if(data.esRemainPoint<0){
                    mui.toast('您的积分不足', { duration: '1', type: 'div' });
                    return;
                }
                if (!m.check(data)) {
                    return;
                }
                if (m.isclicked) { 
                    $("#message").show();
                    return;
                }else{
                    m.elCode.val('');
                }
                if (m.isSendMsg) {
                    m.isSendMsg = false;
                    m.sendMsg(0);
                }
            });
        },
        initData: function () {
            this.isSendMsg = true;
            this.isSubmit = true;
            this.data = {//变值
                exchangePoint: mintracepoints,//要兑换的积分
                consumePoint: mintracepoints * sfrate/lmrate + servicefee,//消耗的积分
                esRemainPoint: sfpoints - mintracepoints * sfrate/lmrate - servicefee,//东航余额积分
                cyRemainPoint: cyPoint + mintracepoints//畅由余额积分
            }
            this.fill();
        },
        fill: function () {//填充数据
            var data = this.data;
            data.consumePoint = data.exchangePoint * sfrate/lmrate + servicefee;
            data.esRemainPoint = sfpoints - data.consumePoint;
            data.cyRemainPoint = cyPoint + data.exchangePoint;
            this.elIpt.val(data.exchangePoint);
            $('#eaRemain').html(window.stringUtil.comma(data.esRemainPoint));
            $('#cyRemain').html(window.stringUtil.comma(data.cyRemainPoint));
            $('#consumepoints,#paypoints').html(window.stringUtil.comma(data.consumePoint));
        },
        iptBlur: function (v) {//输入后处理
            var m = this,
                data = this.data;
            if (/^[0-9]*$/.test(v)) {
                if (v % pointsstep) {
                    v = v - v % pointsstep;
                }
                if (v < mintracepoints) {
                    v = mintracepoints;
                }
            } else {
                v = mintracepoints;
            }
            var cData = Object.create(null);
            for (var i in data) {
                cData[i] = data[i];
            }
            cData.exchangePoint = +v;
            if (cData.esRemainPoint < mintracepoints * sfrate/lmrate) {
                mui.toast('您的积分不足', { duration: '1', type: 'div' });
            }
            if (cData.consumePoint > sfpoints) {
                mui.toast('您的积分不足', { duration: '1', type: 'div' });
            }
            if (cData.exchangePoint > maxtracepoints) { //如果大于单笔最多兑换积分
                mui.toast('单笔兑换最多' + maxtracepoints + '积分', { duration: '1', type: 'div' });
                v = maxtracepoints;
            }
            data.exchangePoint = +v;
            m.fill();
        },
        add: function (data) {
            var m = this;
            if (mintracepoints) {
                if (data.esRemainPoint < mintracepoints * sfrate/lmrate) {
                    mui.toast('您的积分不足', { duration: '1', type: 'div' });
                    return;
                }
            }
            if (data.consumePoint > sfpoints) {
                mui.toast('您的积分不足', { duration: '1', type: 'div' });
                return;
            }
            if (maxtracepoints) {
                if (data.exchangePoint >= maxtracepoints) { //如果大于单笔最多兑换积分
                    mui.toast('单笔兑换最多' + maxtracepoints + '积分', { duration: '1', type: 'div' });
                    return;
                }
            }
            data.exchangePoint += pointsstep;
            this.fill();
        },
        reduce: function (data) {
            var m = this;
            if (mintracepoints) {
                if (data.exchangePoint <= mintracepoints) {
                    mui.toast('最少兑换' + mintracepoints + '积分', { duration: '1', type: 'div' });
                    return;
                }
            }
            data.exchangePoint -= pointsstep;
            this.fill();
        },
        check: function (data) {//检查输入的积分是否满足条件
            if (maxdaypointstimes) {
                if (daypointstimes >= maxdaypointstimes) {
                    mui.toast('当日兑换最多' + maxdaypointstimes + '笔数，请明日再来', { duration: '1', type: 'div' });
                    return 0;
                }
            }
            if (maxdaypoints) {
                if (daypointsnum >= maxdaypoints) {
                    mui.toast('当日兑换最多' + maxdaypoints + '积分，请明日再来', { duration: '1', type: 'div' });
                    return 0;
                }
            }
            if (maxmonthpoints) {
                if (monthpointsnum > maxmonthpoints) {
                    mui.toast('当月兑换最多' + maxmonthpoints + '积分', { duration: '1', type: 'div' });
                    return 0;
                }
            }
            return 1;
        },
        sendMsg: function (type) {//发送验证处理
            var m = this,
                data = this.data,
                url = '',
                param = null;
            //type 0弹出时发   1重发验证
            if (type) {
                url = m.urlResend;
                param = { otptype: "decut", orderid: m.orderid };
            } else {
                url = m.urlSendMsg
                param = { outerpoints: data.consumePoint - servicefee, points: data.exchangePoint, servicefee: servicefee, pointstype: pointstype, rate:rate};
            }
            mui.ajax(url, {
                data: param,
                dataType: 'json', //服务器返回json格式数据
                type: 'get', //HTTP请求类型
                success: function (data) {
                    var ret = data.ret;
                    var msg = data.msg;
                    m.isSendMsg = true;
                    if (ret == "200") {
                        if (!type) {
                            var mobileid = data.mobileid;
                            m.orderid = data.orderid;
                            m.rpid = data.rpid;
                            $("#message").show();
                        }
                        m.countTime(60, m.elSendCode);
                    }
                    mui.toast(msg, { duration: '1', type: 'div' });
                },
                error: function (xhr, type, errorThrown) {
                    m.isSendMsg = true;
                    mui.toast('网络异常，请稍后再试！', { duration: '1', type: 'div' });
                }
            });
        },
        checkVerCode: function () {//检查验证码
            var code = $("#code").val();
            if (!/^[0-9]*$/.test(code)) {
                mui.toast('请输入6位数字验证码', { duration: '1', type: 'div' });
                return false;
            }
            return true;
        },
        closeVerBox: function () {
            $("#message").hide();
            $('html').css({ "height": "100%", "overflow": "auto" });
            $('body').css({ "height": "100%", "overflow": "auto" });
        },
        countTime: function (time, elm) {//倒计器
            var m = this,
                t = time;
            m.isclicked = 1;
            elm.attr("disabled", true).text(t + '秒后重新获取');
            t--;
            var setint = setInterval(function () {
                if (t > 0) {
                    elm.text(t + '秒后重新获取');
                } else {
                    elm.text('获取验证码').removeAttr('disabled');
                    clearInterval(setint);
                    m.isclicked = 0;
                }
                t--;
            }, 1000);
        },
		timer:function(diff,callback,endFn){//计时器 diff时间差(毫秒)/callback每秒执行的函数,endfn结束时的函数
            var startTime = +new Date();
            var count = 0;
            _timeAdjust();
            function _timeAdjust() {
                count++;
                var offset = +new Date() - (startTime + count * 1000);
                var nextTime = 1000 - offset;
                if(nextTime < 0) {
                    nextTime = 0;
                } else {
                    diff -= 1000;
                    if(callback) callback();
                }
                if(diff <= 0) {
                    if(endFn) endFn();
                    startTime = null;
                    count = null;
                } else {
                    setTimeout(arguments.callee, nextTime);
                }
            }
		},
        submit: function () {//兑换提交 
            var m = this;
            //校验验证码
            var code = m.elCode.val().trim();
            var exchangepoints = this.data.exchangePoint;//兑换畅由积分
            //验证码验证
            if (!/^\d{6}$/.test(code)) {
                mui.toast('请输入6位数字验证码', { duration: '1', type: 'div' });
                return;
            }
            if (m.isSubmit) {
                m.isSubmit = false;
                mui.ajax(m.urlSbm, {
                    data: { idcode: code, orderid: m.orderid, rpid: m.rpid },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'get', //HTTP请求类型
                    success: function (data) {
                        var ret = data.ret;
                        var msg = data.msg;
                        spm = spm|| [];
                        $("#code").val('')
                        spm.push([ '_trackEvent', '/butler/exchange/ceair/pointsdecut', '02', ret||msg ]);
                        if (ret == "200") {
                            mui.toast(msg, { duration: '1', type: 'div' });
                            m.timer(1500,null,function(){
                                location.href = spm.addSpm("/butler/exchange/success/" + exchangepoints + ".htm");
                            });
                        } else if (ret == "401" || ret == "402") {//验证码验证失效 验证码错误
                            mui.toast(msg, { duration: '1', type: 'div' });
                            
                            setTimeout(function() {
                            	m.isSubmit = true;
    						}, 1000);
                        } else if (ret == "300"){//过渡页
                            $('#msgWait').show();
                            $('#cardMain,#bottom,#message').hide();
                            var waitDom=$('#waitNum'),
                                s=16;
                            m.timer(15000,function(){
                                s-=1;
                                waitDom.html(s+'<span>秒</span>');
                            },function(){
                                location.href = spm.addSpm("/butler/index.htm");
                            });
                        }else {
                            mui.toast(msg, { duration: '1', type: 'div' });
                            m.timer(1500,null,function(){
                                location.href = spm.addSpm("/butler/index.htm");
                            });
                        }
                    }
                });
            }
        }
    }
    exchange.init();
})();