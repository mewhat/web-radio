(function() {
    var obj = {
        audio: new Audio(songList[0].url),
        
    }
    var init = init;
    window.res = [];

    init();


    /**
    不使用doT，直接操作DOM完成项目
    */

    function init() {
        songCacheService.audioArr = [obj.audio];
        var songListDom = getElement('#song-list');

        // event handler

        getElement('.img').style = "animation-play-state: paused;";
        getElement('#play').onclick = audioPlay;
        getElement('#stop').onclick = audioPause;

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


    /**
    网易云音乐api分析：http://moonlib.com/606.html
    audio对象api：http://www.runoob.com/jsref/dom-obj-audio.html
    */
    function getLrc(songLink, index) {
        var arr = [];
        if (typeof songCacheService.lrcArr[index] !== 'string') {
            songService.getLrc(songLink, success, error);
        } else {
            getElement('#song-lrc').innerText = songCacheService.lrcArr[index].replace(/\[.+?\]/g, '');
        }

        function success(result) {
            songCacheService.lrcArr[index] = result;
            //res = result.split(/\n/).slice();
            //提取fetch返回的歌词，并切割得到每一行[00:00.00]string，然后通过getLrcListDom处理
            getElement('#song-lrc').innerHTML = renderView.getLrcListDom(result.split(/\n/));

        }

        function error() {
            //console.log('no lrc');
        }
    }

    function audioPause() {
        getElement('#play').style.display = "block";
        getElement('#stop').style.display = "none";
        getElement('.img').style = "animation-play-state: paused;";
        //获取伪元素，或者div中的属性对应的值
        //window.getComputedStyle(getElement('.disc'),':after').setProperty('', );
        if (!isAudioPaused(obj.audio)) {
            obj.audio.pause();
        }
    }

    function audioPlay() {
        getElement('#play').style.display = "none";
        getElement('#stop').style.display = "block";
        getElement('.img').style = "";
        //obj.audio.volume = getElement('#volume').value / 100;
        if (isAudioPaused(obj.audio)) {
            var itemsDom = getElements('#song-list .item');
            for (var i = 0, len = itemsDom.length; i < len; i++) {
                if (getElement('.active') === itemsDom[i]) {
                    getLrc(getElement('.active').getAttribute('data-song-lrc'), i);
                }
            }
            obj.audio.play();
        }

        songService.getLrc(songList[0].lrcLink, update, function() {});

        function update(data) {
            //模板已经获取歌词并返回了数据到DOM中，所有直接操作DOM就可以了
            var lrcObj = [];
            var arrayTime = [];
            var arrayLrc = [];
            //
            data.split(/\n/).map(function(elem) {
                elem.match(/\[(.+?)\]/);
                lrcObj.push({
                    time: RegExp.$1,
                    name: elem.replace(/\[.+?\]/g,'')
                });
            });

            for (var i = 0; i < lrcObj.length; i++) {
                var t = lrcObj[i];
                var min = parseFloat(t.time.split(':')[0]);
                var seconds = parseFloat(t.time.split(':')[1]);
                //console.log(seconds);
                var time = min * 60 + seconds;
                //time = time.toFixed(2);
                console.log(time);
                //array.push({time: Math.round(time),name: t.name});
                arrayTime.push(time);
                arrayLrc.push(t.name);
                console.log(arrayLrc);
            }

            /*
            //obj.audio.addEventListener('timeupdate', updateLrc(arrayTime));
            var j = 0;
            obj.audio.addEventListener('timeupdate', function(arrayTime) {
                //console.log(obj.audio.currentTime);
                var lrc_list = getElement('#song-lrc');
                var li = lrc_list.getElementsByTagName('li');
                var len = li.length;
                var current = obj.audio.currentTime.toFixed(2);
                console.log(current);

                while(j<arrayTime.length) {
                    if (arrayTime[j].toFixed(2) <= current) {
                        lrc_list.style.top += -24 + 'px';
                        break;
                    } else {
                        console.log('no');
                    }
                    j++;
                }
            });
            */
            //var timer  = null;
            for(var i = 0; i < arrayTime.length; i++) {
                //(function() {
                    setTimeout(function() {
                        var lrc_list = getElement('#song-lrc');
                        var current = obj.audio.currentTime;
                        //console.log(current);

                        lrc_list.style.top = parseInt(lrc_list.style.top) - 32 + 'px';
                        console.log(lrc_list.style.top);

                    }, arrayTime[i] * 1000);
                //})();
                
            }
            
        }
        
        function updateLrc(dataTime) {

            var lrc_list = getElement('#song-lrc');
            var li = lrc_list.getElementsByTagName('li');
            var len = li.length;
            var current = obj.audio.currentTime;
            console.log(current);
            
            for (i=0;i<dataTime.length;i++) {
                if (dataTime[i].toFixed(2) == current.toFixed(2)) {
                    lrc_list.style.top += -len*i + 'px';
                }
            }

            if (!(current in dataTime)) {
                
            };            
        }
        //console.log(obj.audio.duration);
        showTotalTime(obj.audio.duration);
        showCurrentTime(0);

        //console.log(LrcList);

        //清除定时器
        var time = setInterval(function() {
            showCurrentTime(obj.audio.currentTime);
            chanceProcess();

            if (obj.audio.ended) {
                getElement('.img').style = "animation-play-state: paused;";
                getElement('#play').style.display = "block";
                getElement('#stop').style.display = "none";
            };
        },1000);
    }
    function showTotalTime(seconds) {
        getElement('#total-time').innerText = formatTime(seconds);
    }

    function showCurrentTime(seconds) {
        getElement('#current-time').innerText = formatTime(seconds);
    }

    function chanceProcess(e) {
        /*
        获取进度条当前时刻宽度，相对歌曲时间求比值，控制歌曲位置
        实现拖拽改变进度
        自动跟随歌曲播放而移动
        */
        getElement('#btn').style.left = obj.audio.currentTime * 200 / obj.audio.duration + 'px';
        getElement('#volume-many').style.width = getElement('#btn').style.left;
        //console.log(obj.audio.currentTime + 'px');
    }

    function isAudioPaused(audioObj) {
        return audioObj.paused;
    }


    var ScrollBar = function(btn, bar) {
        this.btn = document.getElementById(btn);
        this.bar = document.getElementById(bar);
        this.step = this.bar.getElementsByTagName("div")[0];
        this.init();
    };

    ScrollBar.prototype = {
        init: function() {
            var f = this;
            f.step.style.width = f.btn.offsetLeft + 'px';

            f.btn.addEventListener('touchstart', function(e) {
                //移动端巨坑，eventX获取不到，需要通过e.changedTouches[0].clientX获取
                var x = e.changedTouches[0].clientX;
                //console.log(x);
                var l = this.offsetLeft;
                var max = f.bar.offsetWidth - this.offsetWidth;

                this.addEventListener('touchmove', function(e) {
                    obj.audio.currentTime = parseInt(this.style.left) * obj.audio.duration / 200;
                    var thisX = e.changedTouches[0].clientX;
                    //console.log(thisX);
                    var to = Math.min(max, Math.max(0, l + (thisX - x)));
                    f.btn.style.left = to + 'px';
                    f.ondrag(to);
                });
            });
            /*
            f.btn.onmousedown =  function(e) {
                console.log('x');
                //当前鼠标相对浏览器所在X轴的位置
                var x = e.clientX;
                //获取的是相对于父对象的左边距，按钮相对进度条所在的位置
                var l = this.offsetLeft;
                //offsetWidth:对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变
                //进度条宽度-按钮宽度=获取最大值宽度
                var max = f.bar.offsetWidth - this.offsetWidth;
                
                document.onmousemove = function(e) {
                    console.log('y');
                    //获取当前鼠标相对浏览器所在X轴的位置
                    var thisX = e.clientX;
                    //计算
                    var to = Math.min(max, Math.max(0, l + (thisX - x)));
                    f.btn.style.left = to + 'px';
                    f.ondrag(to);
                };
                document.onmouseup = new Function('this.onmousemove=null');
            };
            */
        },
        ondrag: function(x) {
            this.step.style.width = Math.max(0, x) + 'px';
        }
    }
    new ScrollBar('btn', 'bar');


    var VolumeBar = function(btn, bar) {
        this.btn = document.getElementById(btn);
        this.bar = document.getElementById(bar);
        this.step = this.bar.getElementsByTagName("div")[0];
        this.init();
    };

    VolumeBar.prototype = {
        init: function() {
            var f = this;
            f.step.style.width = f.btn.offsetLeft + 'px';

            f.btn.addEventListener('touchstart', function(e) {
                var x = e.changedTouches[0].clientX;
                var l = this.offsetLeft;
                var max = f.bar.offsetWidth - this.offsetWidth;

                this.addEventListener('touchmove', function(e) {
                    var thisX = e.changedTouches[0].clientX;
                    var to = Math.min(max, Math.max(0, l + (thisX - x)));
                    f.btn.style.left = to + 'px';
                    obj.audio.volume = parseFloat(f.btn.style.left) / 200;
                    f.ondrag(to);
                });
            });
        },
        ondrag: function(x) {
            this.step.style.width = Math.max(0, x) + 'px';
        }
    }
    new VolumeBar('volume-btn', 'volume-bar');

})(window);