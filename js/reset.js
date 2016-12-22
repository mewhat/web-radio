
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
            document.addEventListener('touchmove', function(e) {
                var thisX = e.changedTouches[0].clientX;
                //console.log(thisX);
                var to = Math.min(max, Math.max(0, l + (thisX - x)));
                f.btn.style.left = to + 'px';
                f.ondrag(to);
            })
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

/*
ScrollBar.prototype = {
    init: function() {
        var f = this;
        f.step.style.width = f.btn.offsetLeft + 'px';
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
    },
    ondrag: function(x) {
        this.step.style.width = Math.max(0, x) + 'px';
    }
}
new ScrollBar('btn', 'bar');
*/