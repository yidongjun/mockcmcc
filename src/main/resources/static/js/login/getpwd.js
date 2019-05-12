	$(function(){
		$("#sendcode").click(function(){
	    	var phone = $("#mobile").val();
	    	var ret =/^1(3|4|5|7|8)\d{9}$/;
	    	
	    	if(ret.test(phone)){
	      	}else{
	    	  mui.toast('请输入11位正确的手机号',{ duration:'1', type:'div' });
	        	return;
	      	}
	    	
			$.get("/login/sendauthcode.do",{"mobileid":phone},function(data){
				if(data.retCode == "success"){
					mui.toast("发送成功",{ duration:'1000', type:'div' });
					var count = 60;
					var countdown = setInterval(CountDown, 1000);
					function CountDown() {
						$("#sendcode").attr("disabled", true);
						$("#sendcode").text(count+"秒后重新发送");
						if (count == 0) {
						$("#sendcode").removeAttr("disabled");
						$("#sendcode").text("发送验证码");
						clearInterval(countdown);
						}
							count--;
						} 
					}else{
						mui.toast(data.retMsg,{ duration:'1000', type:'div' });
			    	}
				});	
		    });
			$("#getPwd").click(function(){
				
				var $phone = $("#mobile").val();
				var $authcode = $("#authcode").val();
				var $pwd = $("#password").val();
				var $pwd2 = $("#pwd").val();
				var exponent = $("#exponent").val();;
				var modulus = $("#modulu").val();
				
				var retphone =/^1(3|4|5|7|8)\d{9}$/;
		    	
		    	if(retphone.test($phone)){
		      	}else{
		    	  mui.toast('请输入11位正确的手机号',{ duration:'1', type:'div' });
		          return;
		      	}
		    	
				var ret =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
				
				
				 if(ret.test($pwd)){
			      }else{
			    	mui.toast('请输入字母和数字8-20位密码组合',{ duration:'1000', type:'div' });
			        return;
			      }
				 	if($pwd!=$pwd2){
				 		mui.toast('两次密码输入不一致',{ duration:'1000', type:'div' });
				 		return;
				 	}
				 	var ret2=/^\d{4}$/;
				 	if(ret2.test($authcode)){
				 	}else{
				 		mui.toast('请输入4位数字验证码',{ duration:'1000', type:'div' });
				 		return;
				 	}
				 	//前端加密
				 	var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);
					var pwd = RSAUtils.encryptedString(publicKey, $pwd);
					var pwd2 = RSAUtils.encryptedString(publicKey, $pwd);
				$.post(
						"/login/updatepwd.do",
						{mobileid:$phone,authcode:$authcode,password:pwd,pwd2:pwd2}
						,function(a){
							if(a.ret == "0000"){
								mui.toast('密码修改成功',{ duration:'1000', type:'div' });
								setTimeout(function(){ window.location.href = "/login/index.htm"; },1500);
								
							}else{
								mui.toast(a.msg,{ duration:'1000', type:'div' });
							}	
					},"json");
				
			});
			
		});

