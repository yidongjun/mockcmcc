jQuery(function(){
	//当前加载状态，默认为没有加载
	var loading = false;
	$(window).scroll(function(){
		var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());// 浏览器的高度加上滚动条的高度
		if($(document).height() > totalheight){
			return;
		}
		var id = "#hasNext_" + $("#pageNo").val();
		var hasNext = $(id).val();
		if(hasNext != "true"){
			return;
		}

		if(!loading){
			loading = true;
			$("#loadingContent").show();
			var pageNo = $("#pageNo").val();
			$.ajax({
				url: "/butler/exchange/appendthird.htm",
				data: {"pageNo": pageNo},
				method: "post",
				success: function(data){
					$("#orderList").append(data);
					$("#pageNo").val(parseInt(pageNo) + 1);

				},
				complete: function(data){
					$("#loadingContent").hide();
					loading = false;
				}
			});
		}
	});
});
