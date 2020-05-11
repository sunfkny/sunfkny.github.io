```js
(function () {
    var hm = document.createElement("script");
    hm.src = "外部答.js";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();
})();
```
