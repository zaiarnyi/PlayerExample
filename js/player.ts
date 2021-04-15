window.addEventListener('DOMContentLoaded', (): void => {
	class Videoplayer {
		private url: string = null;
		private data: XMLDocument = null;
		private videoElement: any = null;
		domElem: HTMLElement;

		constructor(element: string) {
			this.domElem = document.getElementById(element);
		}

		private request(url: string): Promise<any> {
			let result = new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.responseType = 'document';
				xhr.send();
				xhr.addEventListener('load', () => {
					if (xhr.status === 200 && xhr.readyState === 4) {
						resolve(xhr.response);
					} else {
						reject({
							status: xhr.status,
							text: xhr.statusText,
						});
					}
				});
				xhr.addEventListener('error', () => {
					reject({
						status: xhr.status,
						text: xhr.statusText,
					});
				});
			});
			return result;
		}

		private createVideoPlayer = (xml: XMLDocument): HTMLElement => {
			const file = xml.querySelector('MediaFile[type="video/mp4"]'),
				videoElem = document.createElement('video');

			videoElem.setAttribute('src', file.textContent.trim());
			videoElem.setAttribute('type', file.getAttribute('type'));
			videoElem.setAttribute('width', file.getAttribute('width'));
			videoElem.setAttribute('height', file.getAttribute('height'));
			videoElem.setAttribute('delivery', file.getAttribute('delivery'));
			videoElem.setAttribute('bitrate', file.getAttribute('bitrate'));
			videoElem.setAttribute('autosound', file.getAttribute('autosound'));

			return videoElem;
		};

		private spinner(): void {
			this.domElem.innerHTML = `
				<div class="spin">
					<div class="loadingio-spinner-spin-fdm4vfoi7b"><div class="ldio-vmx490fjja8">
						<div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div>
					</div></div>
				</div>
				`;
		}

		private isValid(string: string): object {
			let matcher = /(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i,
				value: string = '',
				protocol = 'https';

			if (/(^w{3})/.test(string)) {
				value = `${protocol}://` + string.slice(4);
			} else if (/^\/\//.test(string)) {
				value = `${protocol}:` + string;
			} else if (!/^https?:/.test(string) || !/(^w{3})/.test(string)) {
				value = `${protocol}://` + string;
			} else {
				value = string;
			}

			return {
				valid: matcher.test(value),
				value,
			};
		}

		public setVastUrl(url: string): void {
			let valid = this.isValid(url);
			console.log(valid);

			if (!valid['valid']) {
				this.spinner();
				throw new Error('Требуется ввести корректный адрес ссылки');
			}
			this.url = valid['value'];
		}

		public load() {
			this.request(this.url)
				.then((res) => {
					document.querySelector('p').textContent = 'Видео загруженно';
					this.data = res;
					return res;
				})
				.catch((error) => {
					this.spinner();
				});
		}

		public start() {
			let num: number = 0;
			let timerID = setInterval((): void => {
				if (this.data) {
					this.domElem.firstElementChild.remove();
					this.domElem.append(this.createVideoPlayer(this.data));
					this.videoElement = this.domElem.querySelector('video');
					clearInterval(timerID);
				} else {
					this.spinner();
				}
				num += timerID;

				if (num >= 10) clearInterval(timerID);
			}, 50);
		}

		public play(): void {
			this.videoElement.play();
		}

		public pause(): void {
			this.videoElement.pause();
		}

		public close(): void {
			this.videoElement.remove();
			this.spinner();
			const btns = document.querySelectorAll('button');
			btns.forEach((item) => item.remove());
		}
	}

	const video = new Videoplayer('video');
	video.setVastUrl(
		'inv-nets.admixer.net/dsp.aspx?rct=3&item=152bea5c-5635-4455-8cae-327b429cf376&pre=1',
	);
	video.load();
	video.start();
	document.querySelector('.play').addEventListener('click', (): void => {
		video.play();
	});
	document.querySelector('.pause').addEventListener('click', (): void => {
		video.pause();
	});
	document.querySelector('.close').addEventListener('click', (): void => {
		video.close();
	});
});
