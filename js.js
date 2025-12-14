window.onload = function () {
    // 1. 获取核心元素
    var container = document.querySelector(".container");
    var img_box = document.querySelector(".container .img_box");
    var img_box_li = document.querySelectorAll(".img_box li");
    var imgCount = img_box_li.length;
    var imgWidth = 800;

    // 2. 无缝轮播：克隆图片
    var firstLi = img_box.firstElementChild.cloneNode(true);
    var lastLi = img_box.lastElementChild.cloneNode(true);
    img_box.insertBefore(lastLi, img_box.firstElementChild);
    img_box.appendChild(firstLi);
    var newImgBoxLi = document.querySelectorAll(".img_box li");

    // 3. 初始化图片盒子
    img_box.style.width = newImgBoxLi.length * imgWidth + "px";
    img_box.style.left = -imgWidth + "px";

    // 新增：初始化容器高度为第一张图片的高度
    var initHeight = img_box_li[0].querySelector("img").offsetHeight;
    container.style.height = initHeight + "px";
    img_box.style.height = initHeight + "px";

    // 4. 获取按钮和指示器
    var leftBtn = document.querySelector(".btns .prev");
    var rightBtn = document.querySelector(".btns .next");
    var dottsLi = document.querySelectorAll(".dotts li");

    // 5. 全局变量
    var index = 0;
    var timer;

    // 6. 高亮指示器
    var highlight = function () {
        for (var k = 0; k < dottsLi.length; k++) {
            dottsLi[k].className = k === index ? "current" : "";
        }
    };

    // 新增：更新容器高度的函数
    var updateContainerHeight = function (imgIndex) {
        // imgIndex：原始图片的索引（0-9）
        var currentImg = img_box_li[imgIndex].querySelector("img");
        var height = currentImg.offsetHeight;
        container.style.height = height + "px";
        img_box.style.height = height + "px";
    };

    // 7. 轮播核心
    var change = function (offset) {
        var newLeft = parseInt(img_box.style.left) + offset;
        img_box.style.left = newLeft + "px";

        // 无缝切换临界值
        if (newLeft === -(imgCount + 1) * imgWidth) {
            setTimeout(function () {
                img_box.style.transition = "left 0s";
                img_box.style.left = -imgWidth + "px";
                setTimeout(function () {
                    img_box.style.transition = "left 0.5s ease";
                }, 10);
            }, 500);
        } else if (newLeft === 0) {
            setTimeout(function () {
                img_box.style.transition = "left 0s";
                img_box.style.left = -imgCount * imgWidth + "px";
                setTimeout(function () {
                    img_box.style.transition = "left 0.5s ease";
                }, 10);
            }, 500);
        }

        // 切换后更新高度
        updateContainerHeight(index);
    };

    // 8. 绑定左按钮
    leftBtn.onclick = function () {
        index--;
        if (index < 0) index = imgCount - 1;
        change(imgWidth);
        highlight();
        updateContainerHeight(index); // 手动更新高度
    };

    // 9. 绑定右按钮
    rightBtn.onclick = function () {
        index++;
        if (index >= imgCount) index = 0;
        change(-imgWidth);
        highlight();
        updateContainerHeight(index); // 手动更新高度
    };

    // 10. 绑定指示器
    for (var i = 0; i < dottsLi.length; i++) {
        dottsLi[i].onclick = function () {
            var newIndex = this.innerText - 1;
            var offset = (index - newIndex) * imgWidth;
            change(offset);
            index = newIndex;
            highlight();
            updateContainerHeight(index); // 手动更新高度
        };
    }

    // 11. 自动轮播
    var autoPlay = function () {
        timer = setInterval(function () {
            rightBtn.onclick();
        }, 4000);
    };
    autoPlay();

    // 12. 鼠标移入暂停
    container.onmouseenter = function () {
        clearInterval(timer);
    };
    container.onmouseleave = function () {
        autoPlay();
    };
};