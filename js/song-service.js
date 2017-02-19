(function() {
    var songService = {
        getLrc: getLrc
    }

    //获取歌词
    function getLrc(songLrcLink, success, error) {
    	//fetch原理？相比Ajax？
    	//https://segmentfault.com/a/1190000003810652
    	//http://web.jobbole.com/84924/
        //fetch获取歌词，了解fetch和ajax跨域
        fetch(songLrcLink, {
            method: 'get'
        }).then(function(result){
    		result.text().then(success)
        }).then(error);
    }

    window.songService = songService;
})(window);