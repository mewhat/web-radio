(function() {
	/*
	//doT模板？
	var tempFn = doT.template(getElement('#songListTmpl').innerText);
	//设置歌单列表第一首歌高亮
	if (songList.length > 0) {
		songList[0].active = 'active';
	};
	var resultText = tempFn(songList);
	//songListItemDom添加到全局
	window.songListItemDom = resultText;
	*/
	window.renderView = {
		getSongListDom: getSongListDom,
		getLrcListDom: getLrcListDom
	}
	var tempFn;

	function getSongListDom(data) {
		tempFn = doT.template(getElement('#songListTmpl').innerText);
		//设置歌单列表第一首歌高亮
		if (songList.length > 0) {
			songList[0].active = 'active';
		}
		return tempFn(data);
	}

	
	function getLrcListDom(data) {
		var arr = [];
		data.map(function(elem) {
			//匹配[]里面的内容
			elem.match(/\[(.+?)\]/);
			//将匹配到的添加到数组arr里面
			arr.push({
				time: RegExp.$1,
				name: elem.replace(/\[.+?\]/g,'')
			})
		});
		tempFn = doT.template(getElement('#lrcListTmpl').innerText);
		return tempFn(arr);
	}

})(window);