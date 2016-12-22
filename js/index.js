(function() {
    var obj = {
        audio: new Audio(songList[0].url)
    }
    var init = init;

    init();

    /**
    不使用doT，直接操作DOM完成项目
    */

    function init() {
        songCacheService.audioArr = [obj.audio];
        var songListDom = getElement('#song-list');

        // event handler

        getElement('#play').onclick = audioPlay;
        getElement('#stop').onclick = audioPause;
        getElement('#volume').oninput = audioVolume;
        getElement('#process').oninput = audioProcess;
        
        songListDom.innerHTML = renderView.getSongListDom(songList);
        songListDom.addEventListener('click', songListSelect);
    }

    function songListSelect(e) {
        if (e.target && e.target.className.indexOf('item') !== -1) {
            var itemsDom = getElements('#song-list .item');
            itemsDom.removeClass('active');
            addClass(e.target, 'active');

            obj.audio.load();
            for (var i = 0, len = itemsDom.length; i < len; i++) {
                if (itemsDom[i] === e.target) {
                    if (typeof songCacheService.audioArr[i] !== 'object') {
                        songCacheService.audioArr[i] = new Audio(e.target.getAttribute('data-song-link'));
                    }
                    obj.audio = songCacheService.audioArr[i];
                }
                getElement('#song-lrc').innerText = '';
            }
        }
    }

    function getLrc(songLink, index) {
        if (typeof songCacheService.lrcArr[index] !== 'string') {
            songService.getLrc(songLink, success, error);
        } else {
            getElement('#song-lrc').innerText = songCacheService.lrcArr[index].replace(/\[.+?\]/g, '');
        }

        function success(result) {
            songCacheService.lrcArr[index] = result;
            getElement('#song-lrc').innerHTML = renderView.getLrcListDom(result.split(/\n/));
        }

        function error() {

        }
    }

    function audioPause() {
        getElement('#play').style.display = "block";
        getElement('#stop').style.display = "none";
        if (!isAudioPaused(obj.audio)) {
            obj.audio.pause();
        }
    }

    function audioPlay() {
        getElement('#play').style.display = "none";
        getElement('#stop').style.display = "block";
        //getElement('#play').style = "background-top-position: -168px";
        //getElement('#play').style.backgroundPosition = "0 -145px";
        obj.audio.volume = getElement('#volume').value / 100;
        if (isAudioPaused(obj.audio)) {
            var itemsDom = getElements('#song-list .item');
            for (var i = 0, len = itemsDom.length; i < len; i++) {
                if (getElement('.active') === itemsDom[i]) {
                    getLrc(getElement('.active').getAttribute('data-song-lrc'), i);
                }
            }
            obj.audio.play();
        }
        showTotalTime(obj.audio.duration);
        showCurrentTime(0);
        setInterval(function() {
            showCurrentTime(obj.audio.currentTime);
        },1000);
    }
    function showTotalTime(seconds) {
        getElement('#total-time').innerText = formatTime(seconds);
    }

    function showCurrentTime(seconds) {
        getElement('#current-time').innerText = formatTime(seconds);
    }

    function audioProcess(e) {
        obj.audio.currentTime = getElement('#process').value * obj.audio.duration / 100;
    }

    function audioVolume(e) {
        obj.audio.volume = getElement('#volume').value / 100;
    }

    function isAudioPaused(audioObj) {
        return audioObj.paused;
    }
})();
