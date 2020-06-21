//Auxiliar para iterar sobre resultado querySelectorAll
function selectorMultiple(selector, callback){
	var elementos = document.querySelectorAll(selector);
	Object.keys(elementos).map(function(k){
		callback(k, elementos);
	});
}
//Manejadores de eventos que itera sobre resultado querySelectorAll
function addEvent(selector, evento, callback){
	selectorMultiple(selector, function(k, elementos){
		elementos[k].addEventListener(evento, callback);
	});
}
function removeEvent(selector, evento, callback){
	selectorMultiple(selector, function(k, elementos){
		elementos[k].removeEventListener(evento, callback);
	});
}
//Previsualizacion de subida de imagenes
var imgupload = function(conf){
	conf.filein = document.querySelector(conf.filein);
	conf.container = document.querySelector(conf.container);
	conf.filein.addEventListener('change', function(){
		conf.container.innerHTML = '';
		var total = this.files.length;
		for(i=0; i<total; i++ ){
			var file = this.files[i];
			if(file.type.match(/image.*/)){
				var reader = new FileReader();
				reader.onloadend = function(e){
					var	img  = document.createElement('img');
					img.src = e.target.result;
					conf.container.appendChild(img);
				};
				reader.readAsDataURL(file);
			}
		}
	});
};

//Permite obtener slug valido a partir de una cadena
function getSlug(url) {
	var encodedUrl = url.toString().toLowerCase();
	encodedUrl = encodedUrl.split(/\&+/).join("-and-")
	encodedUrl = encodedUrl.split(/[^a-z0-9]/).join("-");
	encodedUrl = encodedUrl.split(/-+/).join("-");
	encodedUrl = encodedUrl.trim('-');
	return encodedUrl;
}

//Auxiliar para envio de formularios
function formProccess(data){
	document.querySelector(data.selector).addEventListener("submit", function(e){
		e.preventDefault();
		listefi.ajax({
			url:this.action, method:this.method, data:new FormData(this),
			success: function(result){
				data.success(JSON.parse(result));
			}
		});
	});
}

//Auxiliar para comprobar existencia de elemento dentro de array
function in_array( needle, haystack ){
	if( haystack.indexOf(needle) != -1 ) return 1;
	return 0;
}
