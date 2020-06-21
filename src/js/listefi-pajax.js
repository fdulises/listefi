/*
* Listefi Frontend Framework v1.0
* Desarrollado por ULises Rendón
* https://twitter.com/fidelulises
* Licencia de uso: https://creativecommons.org/licenses/by-nc/4.0/deed.es
*/
//Detectar cuando se presiona CTRL
var isCtrl = false;
document.addEventListener("keyup", function(e){if(e.which == 17) isCtrl=false;});
document.addEventListener("keydown", function(e){if(e.which == 17) isCtrl=true;});

listefi.pajax = function(opt){
	if(typeof opt != "object") opt = {selector:opt};
	opt.beforeLoad = opt.beforeLoad || function(){};
	opt.affterLoad = opt.affterLoad || function(){};

	//Implementacion de Ajax History al hacer click
	document.querySelectorAll(opt.selector).forEach(function(item){
		item.addEventListener("click", function(e){
			//Descartamos si se usa ctrl+click o si la url es la misma que la actual
			if( this.href != window.location && !isCtrl && item.getAttribute("target") != "_blank" ){
				e.preventDefault();
				listefi.pajax.init(this.href, "push", opt);
			}
		});
	});

	//Implementamos evento popstate para permitir avanzar y regresar en el historial
	window.addEventListener("popstate", function(data){
		listefi.pajax.init(data.state, "pop", opt);
	});
}
listefi.pajax.init = function(itemhref, type, opt){
	//Ejecutamos callback beforeLoad
	opt.beforeLoad();

	//Procesamos la peticion por AJAX
	listefi.ajax({
		method: "get", url: itemhref,
		success: function(result){
			//Convertimos el codigo de la respuesta en nodos para su manejo
			var parser = new DOMParser();
			var doc = parser.parseFromString(result, "text/html");

			//Remplazamos el contenido de los elementos deseados
			if( opt.replacecont ){
				opt.replacecont.forEach(function(item){
					var lastcontent = document.querySelector(item);
					var newcontent = doc.querySelector(item);

					if( opt.imgpreload ){
						listefi.imgPreload(newcontent.querySelectorAll("img"), function(){
							lastcontent.innerHTML = newcontent.innerHTML;
						});
					}else lastcontent.innerHTML = newcontent.innerHTML;
				});
			}

			//Ejecutamos el cambio de la URL
			if( type == "push" ) history.pushState(itemhref, "", itemhref);
			else history.popstate(itemhref, "", itemhref);

			//Ejecutamos callback affterLoad
			opt.affterLoad();
		},
		complete: function(xhr){
			//En caso de error 404
			if( xhr.status != 200 ) window.location.href = itemhref;
		}
	});
}
//Algoritmo para precarga de imagenes
listefi.imgPreload = function(imgNodes, callback){
	var imgs = [], counter = 0, limit = imgNodes.length;
	if( limit ){
		var incrFn = function(){
			counter++;
			if(counter >= limit) callback();
		};
		for(var i = 0; i < limit; i++){
			imgs[i] = new Image();
			imgs[i].src = imgNodes[i].getAttribute('src');
			imgs[i].onload = incrFn;
			imgs[i].onerror = incrFn;
		}
	}else callback();
};
