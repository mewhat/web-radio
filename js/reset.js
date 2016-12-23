
//封装函数，获取DOM节点
function getElement(selector) {
    var selector = document.querySelector(selector);
    selector.addClass = function(className) {
        selector.className += ' ' + className;
    }
    return selector;
}

function addClass(element, className) {
	element.className += ' ' + className;
}

//相当于getElementsByTagName()，函数中封装了addClass和removeClass
function getElements(selector) {
    var selectors = document.querySelectorAll(selector);

    selectors.removeClass = function(className) {
        for (var i = 0; i < selectors.length; i++) {
            var classNames = selectors[i].className;
            selectors[i].className = classNames.replace(className, '');
        }
    }

    //这里的addClass有点多余，因为已经有addClass的函数了，同时循环遍历节点添加class没什么用这里
    /*
    selectors.addClass = function(className) {
        for (var i = 0; i < selectors.length; i++) {
            var classNames = selectors[i].className;
            selectors[i].className = classNames.replace(className, '');
        }
    }
    */
    return selectors;
}

/*
var xmlhttp;
function loadLrc(url) {
    xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    if (xmlhttp !== null) {
        xmlhttp.onreadystatechange = getLrc;
        xmlhttp.open('GET',url,true);
        xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xmlhttp.send(null);
    } else {
        console.log('error ajax');
    }
}

function getLrc() {
    if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
            var Lrc = xmlhttp.responseText;
            console.log(Lrc);
        };
    };
}

loadLrc('http://music.163.com/api/song/lyric?os=pc&id=93920&lv=-1&kv=-1&tv=-1');
*/