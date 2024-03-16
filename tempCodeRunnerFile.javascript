const data = JSON.stringify({
	imageUrl: 'https://i.ibb.co/jgK5Fpx/contentful.png'
});

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener('readystatechange', function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open('POST', 'https://ocr-extract-text-from-image.p.rapidapi.com/');
xhr.setRequestHeader('content-type', 'application/json');
xhr.setRequestHeader('X-RapidAPI-Key', '729bcf2dbdmsh5a2af2b8bf4aa27p16cd10jsncba1a50e7db5');
xhr.setRequestHeader('X-RapidAPI-Host', 'ocr-extract-text-from-image.p.rapidapi.com');

xhr.send(data);