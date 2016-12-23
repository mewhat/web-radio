
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

