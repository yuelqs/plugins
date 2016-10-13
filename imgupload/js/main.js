require.config({
	baseUrl:'../',
	paths:{
		jquery:"lib/jquery/jquery-1.12.0.min",
		zoomImg:'zoomImg/js/zoomImg',
		imgUpload:'imgupload/js/imgUpload'
	}
})
require(['jquery','zoomImg','imgUpload'],function($,zoomImg,imgUpload){
	new imgUpload();
	new zoomImg({imgContainerSelector:'.img-container'});

})