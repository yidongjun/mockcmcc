'use strict';
$(document).ready(function(){
    FastClick.attach(document.body);
    var path = contextPath+"/randomCode/getImage.do?tokenId="+tokenId+"&t="+ (new Date().getTime().toString(36));
    $(".keyboard li b").css("background-image","url("+path+")");
});

var testApp = angular.module('BindApp',[]);
testApp.filter('trustHtml',['$sce',function($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
}]);

testApp.filter('formatMobile',function(){
    return function(inputStr){
        var str = "";
        $.each(inputStr,function(i,v){
            if(i == 2 || i == 6){
                str += (v+" ");
            }else{
                str += v;
            }
        })
        return str;
    }
});

testApp.controller("bindController",["$scope","$http","$interval","$httpParamSerializerJQLike",function($scope,$http,$interval,$httpParamSerializerJQLike){
    //自定义input数据模型
    $scope.inputModel = {
        phone:{
            className:".phone p",
            onfocus:false,
            value:"",
            placeholder:true,
            maxLength:11
        },
        pwd:{
            className:".pwd p",
            onfocus:false,
            value:"",
            secret:"",
            placeholder:true,
            maxLength:8
        },
        sms:{
            className:".sms-code p",
            onfocus:false,
            value:"",
            placeholder:true,
            maxLength:6
        },
        setFasle:function(){
            this.phone.onfocus = false;
            this.pwd.onfocus = false;
            this.sms.onfocus = false;
        },
        user:{
            tokenId:''
        }
    }
    if(tokenId){
        $scope.inputModel.user.tokenId = tokenId;
    }
    $scope.inputObjToKB = null;//存放触发键盘的input对象
    $scope.bindFail = false;//绑定失败标志
    $scope.bindRetVal = "";//绑定操作,返回值
    $scope.authBtnInfo = "获取短信验证码";//验证码按钮文字内容
    $scope.isSend = false;//是否发送短信验证码加锁
    $scope.isBinding = false;//防止表单重复提交
    $scope.authTimer = "";//短信验证码定时器
    $scope.resetPwdTip = "";//重置密码第三点提示信息
    $scope.pro="";//重置密码的手机号归属省
    $scope.partnerId = "";//用来保存partnerId
    $scope.interCode = "";//用来保存interCode
    //短信验证码计时器设置
    $scope.goAuthTimer = function(){
        $scope.authBtnInfo = '60s';
        var secs = 60;
        $scope.authTimer = $interval(function () {
            secs--;
            if (secs < 10) {
                $scope.authBtnInfo = '0' + secs + 's';
            } else {
                $scope.authBtnInfo = secs+'s';
            }
        }, 1000, 60);
        $scope.authTimer.then(function () {
            $scope.authBtnInfo = '获取短信验证码';
        });
    }

    //清除短信验证码定时器
    $scope.cancel = function(){
        $interval.cancel($scope.authTimer);
    }

    //获取短信验证码
    $scope.getConfirmCode = function() {
        if(!$scope.isSend && $scope.validPhone() && $scope.validPwd()){
            $scope.isSend = true;
            $http({
                method: "POST",
                url: contextPath+"/sendSms/sendBind.service",
                data: $httpParamSerializerJQLike({
                    mobile:$scope.inputModel.phone.value
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data){
                if (data != "") {
                    if(data.retVal === '888'){
                        $scope.goAuthTimer();
                    }
                    $scope.showDialog(data.msg);
                    $scope.isSend = false;
                }
            })
        }
    };

    $scope.isDialogShow = false;//展示弹框
    $scope.dialogMsg = "";//弹窗提示的消息
    $scope.returnMsg = "";//返回给畅由的消息

    $scope.showDialog = function(str,flag,retVal,returnMessage){
        $scope.isDialogShow = true;
        if(flag && retVal !=""){
            $scope.bindFail = true;
            $scope.bindRetVal = retVal;
        }
        $scope.dialogMsg = str;
        $scope.returnMsg = returnMessage;
    }

    $scope.closeDialog = function(){
        var msg=$scope.returnMsg;
        $scope.dialogMsg = "";
        if($scope.bindFail && $scope.bindRetVal !=""){
            $scope.forward($scope.bindRetVal,msg);//绑定失败，点击确定，跳转页面
            $scope.bindFail = false;
            $scope.bindRetVal = "";
        }
        $scope.isDialogShow = false;
    }

    //校验手机号
    $scope.validPhone = function(){
        var reg = /^1[0-9]{10}$/;
        var phone = $scope.inputModel.phone.value
        if(phone.length == 0){
            $scope.showDialog("请输入11位中国移动手机号码！");
            return false;
        }else if(!reg.test(phone)){
            $scope.showDialog("请输入正确的手机号码！");
            return false;
        }else{
            return true;
        }
    }

    //校验客服密码
    $scope.validPwd = function(){
        var reg = /^([0-9]{6}|[0-9]{8})$/;
        var pwd = $scope.inputModel.pwd.value
        if(pwd.length == 0){
            $scope.showDialog("请输入客服密码！");
            return false;
        }else if(!reg.test(pwd)){
            $scope.showDialog("客服密码格式为6或8位数字！");
            return false;
        }else{
            return true;
        }
    }

    //校验短信验证码
    $scope.validSms = function(){
        var sms = $scope.inputModel.sms.value
        if(sms.length == 0){
            $scope.showDialog("请输入短信验证码！");
            return false;
        }else{
            return true;
        }
    }

    //校验勾选协议
    $scope.validProtocol = function(){
        if(!$scope.isCheck){
            $scope.showDialog("请查看并同意服务协议！");
            return false;
        }else{
            return true;
        }
    }

    //键盘输入数字(输入只修改页面展示内容，不对实际对象进行修改)
    $scope.inputNum = function(str){
        if($scope.inputObjToKB!=null){
            var inputOKB = $scope.inputObjToKB;
            inputOKB.placeholder = false;
            if(inputOKB.value.length < inputOKB.maxLength){
                if(inputOKB.className == ".pwd p"){
                    inputOKB.secret = inputOKB.secret + "*";
                }
                inputOKB.value = inputOKB.value + parseInt(str);
            }
        }
    }

    //删除一个字符
    $scope.del = function($event){
        if($scope.inputObjToKB!=null){
            var inputOKB = $scope.inputObjToKB;
            var str = inputOKB.value;
            inputOKB.value = str.substr(0,str.length-1);
            if(inputOKB.className == ".pwd p"){//客服密码显示"*"号
                var smsStr = inputOKB.secret;
                inputOKB.secret = smsStr.substr(0,smsStr.length-1);
            }
            if(inputOKB.value == ""){//删除后为空时，显示提示语
                inputOKB.placeholder = true;
            }
        }
    }

    //清空所有输入内容
    $scope.clear = function(){
        if($scope.inputObjToKB!=null){
            var inputOKB = $scope.inputObjToKB;
            inputOKB.value = "";
            if(inputOKB.className == ".pwd p"){
                inputOKB.secret = "";
            }
            inputOKB.placeholder = true;
        }
    }

    //模拟点击input以外区域，隐藏虚拟键盘
    $(document).bind("click",function(e){
        if($scope.inputObjToKB!=null){
            var target = $(e.target);
            if(target.closest(".phone").length == 0 && target.closest(".pwd").length == 0 && target.closest(".sms-code").length == 0 && target.closest(".keyboard").length == 0){
                $(".content li p span").removeClass("cursor");//清除输入框光标样式
                clearInterval(timer);//清除光标闪烁定时
                $scope.inputModel.setFasle();//格式化所有input失去焦点
                $scope.hideKeyboard();
            }
        }
    });

    //阻止键盘随手指滑动
    var keyb = document.getElementById('keyb');
    keyb.addEventListener('touchmove', function(event) {
        //如果这个元素的位置内只有一个手指的话
        if (event.targetTouches.length >= 1) {
            event.preventDefault();//阻止浏览器默认事件
        }
    }, false);

    //光标闪烁
    var timer = null;
    function cursorBlink(el){
        timer = setInterval(function() {
            $(el).find("span").toggleClass("cursor");
        }, 500);
    }

    //显示数字键盘
    $scope.showKeyboard = function(obj){
        if(!obj.onfocus){
            //格式化键盘
            if(obj.className == ".pwd p"){
                $(".keyboard li span b").css("display","inline-block");
                $(".keyboard li span em").css("display","none");
            }else{
                $(".keyboard li span b").css("display","none");
                $(".keyboard li span em").css("display","inline-block");
            }
            $(".content li p span").removeClass("cursor");
            clearInterval(timer);
            $scope.inputModel.setFasle();
            //显示数字键盘
            $(".blank").addClass("blankShow");
            $("#keyb").animate({bottom:0},400);
            $scope.inputObjToKB = obj
            $(obj.className).find("span").addClass("cursor");
            cursorBlink(obj.className);
            obj.onfocus = true;//input获得焦点
        }
    }
    //隐藏数字键盘
    $scope.hideKeyboard = function(){
        $scope.inputObjToKB = null;
        var height = $("#keyb").height();
        $("#keyb").animate({bottom:-height},400);
        $(".blank").removeClass("blankShow");
    }

    //勾选协议
    $scope.isCheck = true;
    $scope.checkPro = function(){
        $scope.isCheck = !$scope.isCheck;
    }

    $scope.showResetPwd = false;//展示“如何重置服务密码”弹框
    $scope.showResetPwdTip = function(){
        if($scope.validPhone()){
            if($scope.showResetPwd==false){
                $http({
                    method: "POST",
                    url: contextPath+"/bind/resetPwd.service",
                    data: $httpParamSerializerJQLike({
                        mobile:$scope.inputModel.phone.value,
                        tokenId:$scope.inputModel.user.tokenId
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (data){
                    if (data != "") {
                        if(data.retVal === '888'){
                            $scope.resetPwdTip=data.msg;
                            $scope.pro=data.pro;
                        }else if(data.retVal === '887'||data.retVal === '801'||data.retVal === 'D101'||data.retVal === '1002'){
                            $scope.resetPwdTip=data.msg;
                        }else{
                            $scope.resetPwdTip="系统查询中，请稍后再试。";
                        }
                    }else{
                        $scope.resetPwdTip="系统查询中，请稍后再试。";
                    }
                    $scope.showResetPwd = true;
                })
            }else{
                $scope.showResetPwd = false;
            }
        }

    }

    //确认提交绑定
    $scope.commit = function(){
        if(!$scope.isBinding && $scope.validPhone() && $scope.validPwd() && $scope.validSms() && $scope.validProtocol()){//防止绑定事件重复触发
            $scope.isBinding = true;
            $http({
                method: "POST",
                url: contextPath+"/bind/bindInfo.service",
                data: $httpParamSerializerJQLike({
                    mobile:$scope.inputModel.phone.value,
                    pwd:$scope.inputModel.pwd.value,
                    smsCode:$scope.inputModel.sms.value,
                    tokenId:$scope.inputModel.user.tokenId,
                    partnerId:partnerId,
                    interCode:interCode
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data){
                if (data != "") {
                    if(data.retVal === '802' || data.retVal === '809'||data.retVal === '810'||data.retVal ===''){
                        $scope.showDialog(data.msg);
                    }else if(data.retVal === 'D001'){
                        $scope.showDialog('尊敬的客户您好，您的手机号输入有误，请您核对手机号后在尝试，谢谢！');
                    }else if(data.retVal === 'D002'){
                        $scope.showDialog('尊敬的客户您好，您输入的密码有误，请您输入正确的密码，谢谢！');
                    }else if(data.retVal === 'D003'){
                        $scope.showDialog('尊敬的客户您好，您的手机号已被锁定，您可以拨打10086客服热线进行咨询，谢谢！',true,data.retVal,data.msg);
                    }else if(
                        data.retVal === 'D095' ||
                        data.retVal === 'D096' ||
                        data.retVal === 'D097' ||
                        data.retVal === 'D098' ||
                        data.retVal === 'D099'){
                        $scope.showDialog('其他错误，请您稍后再试！',true,data.retVal,data.msg);
                    }else{
                        $scope.showDialog(data.msg,true,data.retVal);
                    }
//                    if (data.retVal === '801') {
//                    	$scope.showDialog(data.msg,true,data.retVal);
//                    } else if (data.retVal === '802') {
//                    	$scope.showDialog(data.msg);
//                    } else if (data.retVal === '803') {
//                    	$scope.showDialog(data.msg,true,data.retVal);
//                    } else if (data.retVal === '804') {
//                    	$scope.showDialog(data.msg,true,data.retVal);
//                    } else if (data.retVal === '805') {
//                    	$scope.showDialog(data.msg,true,data.retVal);
//                    } else if (data.retVal === '806') {
//                    	$scope.showDialog(data.msg,true,data.retVal);
//                    } else if (data.retVal === '807') {
//                    	$scope.showDialog(data.msg,true,data.retVal);
//                    } else if (data.retVal === '808') {
//                    	$scope.showDialog(data.msg,true,data.retVal);
//                    } else if (data.retVal === '809') {
//                    	$scope.showDialog(data.msg);
//                    } else if (data.retVal === '810') {
//                    	$scope.showDialog(data.msg);
//                    }else if (data.retVal === '887') {
//                    	$scope.showDialog(data.msg,true,data.retVal);
//                    } else if (data.retVal === '888') {
//                    	$scope.showDialog(data.msg,true,data.retVal);
//                    }
                    $scope.cancel();//清除正在倒计时的短信验证码
                    $scope.authBtnInfo = '获取短信验证码';//复原短信验证码
                    $scope.inputModel.sms.value = '';//清空短信验证码
                    $scope.inputModel.sms.placeholder = true;
                    $scope.isBinding = false;//复原锁
                }
                $scope.partnerId=data.partnerId;
                $scope.interCode=data.interCode;
            });
        }
    }
    //绑定后，跳转页面
    $scope.forward = function(retVal,msg){
        window.location.href=contextPath+"/bind/goDestination.service?retVal="+retVal+"&msg="+msg+"&tokenId="+$scope.inputModel.user.tokenId+"&partnerId="+$scope.partnerId+"&interCode="+$scope.interCode
    }
}]);