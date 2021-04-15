window.addEventListener('DOMContentLoaded', function () {
    var Videoplayer = /** @class */ (function () {
        function Videoplayer(element) {
            this.url = null;
            this.data = null;
            this.videoElement = null;
            this.createVideoPlayer = function (xml) {
                var file = xml.querySelector('MediaFile[type="video/mp4"]'), videoElem = document.createElement('video');
                videoElem.setAttribute('src', file.textContent.trim());
                videoElem.setAttribute('type', file.getAttribute('type'));
                videoElem.setAttribute('width', file.getAttribute('width'));
                videoElem.setAttribute('height', file.getAttribute('height'));
                videoElem.setAttribute('delivery', file.getAttribute('delivery'));
                videoElem.setAttribute('bitrate', file.getAttribute('bitrate'));
                videoElem.setAttribute('autosound', file.getAttribute('autosound'));
                return videoElem;
            };
            this.domElem = document.getElementById(element);
        }
        Videoplayer.prototype.request = function (url) {
            var result = new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.responseType = 'document';
                xhr.send();
                xhr.addEventListener('load', function () {
                    if (xhr.status === 200 && xhr.readyState === 4) {
                        resolve(xhr.response);
                    }
                    else {
                        reject({
                            status: xhr.status,
                            text: xhr.statusText
                        });
                    }
                });
                xhr.addEventListener('error', function () {
                    reject({
                        status: xhr.status,
                        text: xhr.statusText
                    });
                });
            });
            return result;
        };
        Videoplayer.prototype.spinner = function () {
            this.domElem.innerHTML = "\n\t\t\t\t<div class=\"spin\">\n\t\t\t\t\t<div class=\"loadingio-spinner-spin-fdm4vfoi7b\"><div class=\"ldio-vmx490fjja8\">\n\t\t\t\t\t\t<div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div>\n\t\t\t\t\t</div></div>\n\t\t\t\t</div>\n\t\t\t\t";
        };
        Videoplayer.prototype.isValid = function (string) {
            var matcher = /(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i, value = '', protocol = 'https', result = false;
            if (/(^w{3})/.test(string)) {
                value = protocol + "://" + string.slice(4);
            }
            else if (/^\/\//.test(string)) {
                value = protocol + ":" + string;
            }
            else if (!/^https?:/.test(string) || !/(^w{3})/.test(string)) {
                value = protocol + "://" + string;
            }
            else {
                value = string;
            }
            if (matcher.test(value)) {
                console.log(this.isValidLink(value));
            }
            return {
                valid: matcher.test(value),
                value: value
            };
        };
        Videoplayer.prototype.isValidLink = function (link) {
            var request = fetch(link);
            var result = false;
            request.then(function (res) {
                result = res.ok;
                console.log('res.ok');
                console.log(res.ok);
            });
            return result;
        };
        Videoplayer.prototype.setVastUrl = function (url) {
            var valid = this.isValid(url);
            console.log(valid);
            if (!valid['valid']) {
                this.spinner();
                throw new Error('Требуется ввести корректный адрес ссылки');
            }
            this.url = valid['value'];
        };
        Videoplayer.prototype.load = function () {
            var _this = this;
            this.request(this.url)
                .then(function (res) {
                document.querySelector('p').textContent = 'Видео загруженно';
                _this.data = res;
                return res;
            })["catch"](function (error) {
                _this.spinner();
            });
        };
        Videoplayer.prototype.start = function () {
            var _this = this;
            var num = 0;
            var timerID = setInterval(function () {
                if (_this.data) {
                    _this.domElem.firstElementChild.remove();
                    _this.domElem.append(_this.createVideoPlayer(_this.data));
                    _this.videoElement = _this.domElem.querySelector('video');
                    clearInterval(timerID);
                }
                else {
                    _this.spinner();
                }
                num += timerID;
                if (num >= 10)
                    clearInterval(timerID);
            }, 50);
        };
        Videoplayer.prototype.play = function () {
            this.videoElement.play();
        };
        Videoplayer.prototype.pause = function () {
            this.videoElement.pause();
        };
        Videoplayer.prototype.close = function () {
            this.videoElement.remove();
            this.spinner();
            var btns = document.querySelectorAll('button');
            btns.forEach(function (item) { return item.remove(); });
        };
        return Videoplayer;
    }());
    var video = new Videoplayer('video');
    video.setVastUrl('inv-nets.admixer.net/dsp.aspx?rct=3&item=152bea5c-5635-4455-8cae-327b429cf376&pre=1');
    video.load();
    video.start();
    document.querySelector('.play').addEventListener('click', function () {
        video.play();
    });
    document.querySelector('.pause').addEventListener('click', function () {
        video.pause();
    });
    document.querySelector('.close').addEventListener('click', function () {
        video.close();
    });
});
