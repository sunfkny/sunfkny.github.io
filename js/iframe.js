var strDOM = "<div style=\"width: 100%;z-index: 999999;position: fixed;top: -100%;transition-duration: 0.4s;\"id=\"iframeResulToolbar\"><div style=\"width: auto;height: auto;background-color: #000000cc;\"><div id=\"iframeResulToolbarContentArea\"style=\"padding: 16px;\"></div></div></div>";
var floatButton = "<button class=\"floatButton\"onclick=\"iframeToolbarClose();\">×<style>.floatButton{background-color:#000000cc;border-radius:50%;border:none;width:64px;height:64px;color:#FFFFFFcc;font-size:48px;transition-duration:0.4s;outline:none;transform:translate(-50%,20px);position:relative;left:50%;box-shadow:0px 2px 2px 0#00000099}.floatButton:hover{box-shadow:0px 8px 8px 0#00000099}</style></button>";
var fl = document.querySelectorAll("iframe");
var toastTip = document.createElement("p");
toastTip.innerText = "iframe not fount";
toastTip.style = "color: white;font-size: 20px;margin: 5px;";
function list(link) {
    var a = document.createElement("a");
    a.href = link;
    a.text = link;
    a.target = "_blank";
    a.style = "color: white;font-size: 20px;";
    var li = document.createElement("li");
    li.appendChild(a);
    li.style = "padding: 10px;";
    return li
}
function parseDom(arg) {
    var objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.childNodes
}
function iframeToolbarClose() {
    tb = document.querySelectorAll("#iframeResulToolbar");
    for (i of tb) {
        i.style.top = "-100%"
    }
    setTimeout(function () {
        for (i of tb) {
            i.remove();
        }
    }, 400);
}
function iframeToolbarOpen() {
    document.body.appendChild(parseDom(strDOM)[0]);
    setTimeout(function () {
        tb = document.querySelectorAll("#iframeResulToolbar");
        for (i of tb) {
            i.style.top = "0px"
        }
    }, 400);
}
function iframeToolbarExist() {
    return document.querySelectorAll("#iframeResulToolbar").length
}
function iframeToolbarContentAreaInit(obj) {
    ca = document.querySelectorAll("#iframeResulToolbarContentArea");
    for (i of ca) {
        i.appendChild(obj);
    }
}
function iframeToolbarFloatButtonInit(obj) {
    tb = document.querySelectorAll("#iframeResulToolbar");
    for (i of tb) {
        i.appendChild(obj);
    }
}
function main() {
    if (fl.length > 0) {
        var ul = document.createElement("ul");
        for (f of fl) {
            ul.appendChild(list(f.src));
            console.log(f.src);
        }
        iframeToolbarOpen();
        iframeToolbarContentAreaInit(ul);
        iframeToolbarFloatButtonInit(parseDom(floatButton)[0])
    } else {
        iframeToolbarOpen();
        iframeToolbarContentAreaInit(toastTip);
        setTimeout(function () {
            iframeToolbarClose();
        }, 2000);
    }
}
if (iframeToolbarExist()) {
    iframeToolbarClose();
} else {
    main();
}