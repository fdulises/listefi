/*
* Listefi Frontend Framework v1.0
* Desarrollado por ULises Rendón
* https://twitter.com/fidelulises
* Licencia de uso: https://creativecommons.org/licenses/by-nc/4.0/deed.es
*/
var listefi = function(e){return document.querySelector(e)};
/*
	Helpers
*/
//Get the position of any element relative to the viewport
listefi.offset = function(el){
	var rect = el.getBoundingClientRect(),
	scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}
//Get random int
listefi.getRand = function(){var nran = 0; nran = Math.ceil(Math.random()*1000000); return nran;}
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2; if (t < 1) return c/2*t*t + b; t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
/*
	AJAX
*/
listefi.ajax = function(conf){
	var url = conf.url;
	var method = conf.method.toLowerCase() || 'get';
	var data = null;
	var isFormData = conf.data instanceof FormData;
	conf.success || ( conf.success = function(a){} );

	//Preparamos los datos a enviar si son requeridos
	if( !isFormData && (typeof conf.data == 'object') ){
		data = Object.keys(conf.data).map(function(k){
			return encodeURIComponent(k) + '=' + encodeURIComponent(conf.data[k])
		}).join('&');
	}else data = conf.data || null;

	//Se agregan los datos a enviar a la url en caso de peticion get
	if( typeof data == 'string' && method == 'get' ) url += ((/\?/).test(url)?"&":"?")+data;

	//Evitamos que se guarde en cache la peticion
	if( !conf.cache ) url += ((/\?/).test(url)?"&":"?")+(new Date()).getTime();

	//Preparamos el objeto de la peticion ajax
	var xhr = new XMLHttpRequest();
	xhr.open( method, url );

	//Establecemos los encabezados necesarios para peticion post
	if( method == 'post' && !isFormData ){
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	}

	//Manejador de eventos para procesar respuesta
	if( typeof conf.success == 'function' ){
		xhr.addEventListener('readystatechange', function(){
			if(xhr.readyState > 3){
				if( xhr.status==200 ) conf.success(xhr.responseText);
				if( typeof conf.complete == 'function' ) conf.complete(xhr);
			}
		});
	}

	//Manejador de eventos inicio de transferencia
	if( typeof conf.loadstart == 'function' )
		xhr.addEventListener('loadstart', conf.loadstart);
	//Manejador de eventos rastreo de proceso de transferencia (Download)
	if( typeof conf.progress == 'function' )
		xhr.addEventListener('progress', conf.progress);
	//Manejador de eventos rastreo de proceso de transferencia (Upload)
	if( typeof conf.uploadProgress == 'function' )
		xhr.upload.addEventListener('progress', conf.uploadProgress);
	//Manejador de eventos transferencia completa
	if( typeof conf.load == 'function' )
		xhr.addEventListener('load', conf.load);
	//Manejador de eventos error de transferencia
	if( typeof conf.error == 'function' )
		xhr.addEventListener('error', conf.error);
	//Enviamos peticion y retornamos objeto ajax
	xhr.send(data);
	return xhr;
};
listefi.load = function(container, url){
	listefi.ajax({method: 'get', url: url, success: function(resultado){
		listefi(container).innerHTML = resultado;
	}});
};
/*
	ScrollTo
*/
var requestAnimFrame = (function(){
	return 	window.requestAnimationFrame || function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();
listefi.scrollTo = function(to, duration, callback) {
	function move(amount) {
		document.documentElement.scrollTop = amount;
		document.body.parentNode.scrollTop = amount;
		document.body.scrollTop = amount;
	}
	function position() {
		return document.documentElement.scrollTop ||
			document.body.parentNode.scrollTop ||
			document.body.scrollTop;
	}
	var start = position(),	change = to - start, currentTime = 0, increment = 20;
	duration = (typeof(duration) === 'undefined') ? 500 : duration;
	var animateScroll = function() {
		currentTime += increment;
		var val = Math.easeInOutQuad(currentTime, start, change, duration);
		move(val);
		if (currentTime < duration) requestAnimFrame(animateScroll);
		else {if (callback && typeof(callback) === 'function') callback();}
	};
	animateScroll();
};
/*
	Cookies - Set cookie, get cookie y delete cookie
*/
listefi.getCookie = function( name ){
	var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return v ? v[2] : null;
};
listefi.setCookie = function( name, value, days ){
	var d = new Date; d.setTime(d.getTime() + 24*60*60*1000*days);
	document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
};
listefi.deleteCookie = function(name) { listefi.setCookie(name, '', -1); };
/*
	lightbox
*/
listefi.lightbox = function(args){
	var contBlack = document.createElement('div');
	contBlack.setAttribute('class','cover hide');
	contBlack.setAttribute('data-state','inactive');

	var show = function(){
		contBlack.classList.remove('hide');
		contBlack.setAttribute('data-state','active');
	};

	var remove = function(){
		document.body.removeChild(contBlack);
	};

	var hide = function(){
		contBlack.setAttribute('data-state','inactive');
		setTimeout(function () {
			contBlack.classList.add('hide');
		}, 600);
	};

	var addContent = function(cont){
		if( typeof cont == 'string' ) contBlack.innerHTML += cont;
		else contBlack.appendChild(cont);
	};

	contBlack.addEventListener('click',hide);
	if(args != null) addContent(args);
	document.body.appendChild(contBlack);

	return {
		show:show,
		hide:hide,
		remove:remove,
		addContent:addContent,
		cover:contBlack,
	};
};
/*
	Modalwindows
*/
listefi.alert = function(body, head, controls, callback){
	var newlightbox = listefi.lightbox();
	function ccreate(){
		var cc = document.createElement('div');
		cc.setAttribute("class", "container cont-600 mg-sec");
		ccreate = function(){return cc.cloneNode();}
		return cc.cloneNode();
	}
	var cont = ccreate();
	listefi.alert = function(body, head, controls, callback){
		var continner = "";
		if( head != null ){
			continner = '<div class="card-header"><button type="button" class="mw-close">×</button><h4>'+head+'</h4></div>';
			continner += "<div class='card-frame'>"+body+"</div>";
		}else continner += "<div class='card-frame'><button type='button' class='mw-close'>×</button>"+body+"</div>";

		cont.addEventListener('click',function(e){e.stopPropagation();});
		cont.innerHTML = continner;

		if( controls != null ){
			var cfo = document.createElement("div");
			cfo.setAttribute("class", "card-footer tx-right");
			controls.forEach(function(i){
				var nbtn = document.createElement("button");
				nbtn.setAttribute("type", "button");
				nbtn.innerHTML = i.html;
				nbtn.setAttribute("class", i.class);
				nbtn.setAttribute("id", i.id);
				nbtn.addEventListener("click", function(){
					i.action(newlightbox);
				});
				cfo.appendChild(nbtn);
			});
			cont.appendChild(cfo);
		}

		cont.querySelector(".mw-close").addEventListener("click", newlightbox.hide);
		newlightbox.innerHTML = ""; newlightbox.addContent(cont);
		if( callback != null ) callback(newlightbox);
		newlightbox.show();
	}
	listefi.alert(body, head, controls, callback);
};
listefi.confirm = function(body, arg1, arg2){
	var header = arg1;
	var callback = arg2;
	if( typeof arg1 == "function" ){callback = arg1; header = 'Confirmar!';}
	function closeCallback(){
		callback(false);
		this.removeEventListener("click", closeCallback);
	}
	listefi.alert(body, header, [
		{
			html: "Aceptar",
			class: "btn btn-primary",
			id: "",
			action: function(l){callback(true); l.hide(); l.cover.querySelector(".mw-close").removeEventListener("click", closeCallback)}
		},
		{
			html: "Cancelar",
			class: "btn",
			id: "",
			action: function(l){callback(false); l.hide(); l.cover.querySelector(".mw-close").removeEventListener("click", closeCallback)}
		}
	], function(l){
		l.cover.querySelector(".mw-close").addEventListener("click", closeCallback);
	});
};
/*
	Pdrag - Hacer elemento arrastrable
*/
listefi.pdrag = function(e) {
   listefi.pdrag.data.startX = e.clientX;
   listefi.pdrag.data.startY = e.clientY;
   if( !listefi.pdrag.data.dactive ) listefi.pdrag.data.dactive = this;
   listefi.pdrag.data.startLeft = parseInt(window.getComputedStyle(listefi.pdrag.data.dactive).left, 10);
   listefi.pdrag.data.startTop = parseInt(window.getComputedStyle(listefi.pdrag.data.dactive).top, 10);
   document.addEventListener('mousemove', listefi.pdrag.doDrag);
   document.addEventListener('mouseup', listefi.pdrag.stopDrag);
   e.preventDefault();
}
listefi.pdrag.data = {startX: 0, startY: 0, startLeft: 0, startTop: 0, dactive: null};
listefi.pdrag.doDrag = function(e) {
   listefi.pdrag.data.dactive.style.left = (listefi.pdrag.data.startLeft + e.clientX - listefi.pdrag.data.startX) + 'px';
   listefi.pdrag.data.dactive.style.top = (listefi.pdrag.data.startTop + e.clientY - listefi.pdrag.data.startY) + 'px';
}
listefi.pdrag.stopDrag = function(e) {
	listefi.pdrag.data.dactive = null;
    document.removeEventListener('mousemove', listefi.pdrag.doDrag);
	document.removeEventListener('mouseup', listefi.pdrag.stopDrag);
}
/*
	Slideshow
*/
listefi.slideshow = function(args){
	var slist = document.querySelectorAll(args.selector+" li");
	var slidecont = document.querySelector(args.selector+" ul");
	var total = slist.length;
	var active = 0;
	if( args.auto == null ) args.auto = true;
	if( args.responsive == null ) args.responsive = true;
	var interval;

	var goingTo = function(number){
		slist[active].removeAttribute('data-state');
		slist[number].setAttribute('data-state','active');
		active = number;
		if( args.callback ) args.callback(slist[active]);
		if( args.responsive ) slidecont.style.height = slist[active].getAttribute('height');
	};

	var goingNext = function(){
		if( active+1 < total ) goingTo(active+1);
		else goingTo(0);
	};
	var goingPrev = function(){
		if( active-1 >= 0 ) goingTo(active-1);
		else goingTo(total-1);
	};

	var start = function(){
		if( interval == null ) interval = setInterval(goingNext,args.time || 2000);
	};

	var stop = function(){
		clearInterval(interval);
		interval = null;
	};

	var setAutoHeight = function(){
		slist.forEach(function(i){
			if(i.offsetHeight) i.setAttribute('height', i.offsetHeight+'px');
			//if(i.offsetWidth) i.setAttribute('width', i.offsetWidth+'px');
		});
		slidecont.style.height = slist[active].getAttribute('height');
		//slidecont.style.width = slist[active].getAttribute('width');
	};

	if( args.responsive ){
		window.addEventListener('resize', setAutoHeight);
		setAutoHeight();
	}else{
		var maxh = 0;
		slist.forEach(function(i){if(i.offsetHeight > maxh) maxh = i.offsetHeight;});
		if(maxh) slidecont.style.height = maxh+'px';
	}

	slist[active].setAttribute('data-state','active');
	if(args.next) document.querySelector(args.selector+' '+args.next).addEventListener('click',function(e){
		e.preventDefault();e.stopPropagation();
		if( args.auto === true ) stop();
		goingNext();
		if( args.auto === true ) start();
	});
	if(args.prev) document.querySelector(args.selector+' '+args.prev).addEventListener('click',function(e){
		e.preventDefault();e.stopPropagation();
		if( args.auto === true ) stop();
		goingPrev();
		if( args.auto === true ) start();
	});
	if( args.auto === true ) slist.forEach(function(i){
		i.addEventListener('mouseover',stop); i.addEventListener('mouseout',start);
	});
	if( args.auto === true ) start();

	return{
		goingTo: goingTo,
		next: goingNext,
		prev: goingPrev,
		start: start,
		stop: stop,
		setAutoHeight: setAutoHeight
	};
};
var imgalery = function(args){
	var list = document.querySelectorAll(args.selector);
	var slidecont = document.createElement('div');
	var slideul = document.createElement('ul');
	var slideli = document.createElement('li');
	var image = document.createElement('img');
	var newlightbox = listefi.lightbox('<button type="button" class="mw-close">×</button>');

	slideul.addEventListener('click',function(e){e.stopPropagation();});
	slidecont.setAttribute("class", "li-slide li-galery");
	slidecont.innerHTML = '<button type="button" class="li-slidebtn bsl">&laquo;</button><button type="button" class="li-slidebtn bsr">&raquo;</button>';
	slidecont.appendChild(slideul);
	newlightbox.addContent(slidecont);

	var setAutoHeight = function(){
		slide.setAutoHeight();
		console.log("auto");
		setAutoHeight = function(){};
	};

	list.forEach(function(i, index){
		var actualli = slideli.cloneNode();
		var actualimg = image.cloneNode();
		actualimg.src = i.getAttribute('data-src');
		actualli.appendChild(actualimg);
		slideul.appendChild(actualli);

		i.addEventListener('click',function(e){
			e.preventDefault();
			newlightbox.show();
			setAutoHeight();
			slide.goingTo(index);
		});
	});
	var slide = listefi.slideshow({
		selector: ".li-galery",
		prev:'.bsl',
		next:'.bsr',
		auto: false,
		responsive: true,
	});
};
/*
	Accordion
*/
listefi.accordion = function(conf){
	var elements = document.querySelectorAll(conf.selector);
	var tElements = elements.length;

	conf.event = conf.event || "click";
	conf.source = conf.source || "href";
	conf.callback = conf.callback || function(){};
	conf.activedefault = conf.activedefault || 0;
	conf.hiddenstate = conf.hiddenstate || "folded";
	conf.showstate = conf.showstate || "unfolded";
	conf.keep = conf.keep || 0;

	for(i=0; i<tElements; i++){
		//Seleccionamos el elemento fuente
		var source = document.querySelector(elements[i].getAttribute(conf.source));
		source.style.height = source.offsetHeight+"px";
		source.setAttribute("data-state", conf.hiddenstate);

		elements[i].addEventListener(conf.event, function(e){
			e.preventDefault();
			var source = document.querySelector(this.getAttribute(conf.source));
			var actualstate = source.getAttribute("data-state");

			if( actualstate == conf.showstate ) source.setAttribute("data-state", conf.hiddenstate);
			else{
				if(conf.keep) source.setAttribute("data-state", conf.showstate);
				else{
					//Cambiamos los estados de todos los elementos menos el activo
					for(j=0; j<tElements; j++) document.querySelector(
						elements[j].getAttribute(conf.source)
					).setAttribute("data-state", conf.hiddenstate);
					source.setAttribute("data-state", conf.showstate);
				}
			}

			//Ejecutamos la llamada de retorno
			conf.callback({element: this, source: source});
		});
	}
	//Mostramos un contenedor por defecto
	if( conf.activedefault > 0 ){
		var activoDefault = (elements[conf.activedefault-1]) ? conf.activedefault-1 : 0;
		document.querySelector(
			elements[activoDefault].getAttribute(conf.source)
		).setAttribute("data-state", conf.showstate);
	}
};
/*
	Inputtag
*/
listefi.taginput = function(el){
	var obtag = function(){};
	obtag.tinput = document.querySelector(el);
	obtag.tinput.setAttribute('type', 'hidden');

	var tagbox = document.createElement('div');
	tagbox.setAttribute('class', 'form-tag form-in');
	tagbox.setAttribute('data-intsel', el);
	tagbox.innerHTML = '<span class="tag-list"></span><span><input class="form-intag" type="text" value=""></span>';
	obtag.tinput.parentNode.insertBefore(tagbox, obtag.tinput.nextSibling);

	obtag.taglist = document.querySelector("div[data-intsel='"+el+"'] .tag-list");
	obtag.inputtag = document.querySelector("div[data-intsel='"+el+"'] .form-intag");

	var plcholder = obtag.tinput.getAttribute('placeholder');
	if(plcholder) obtag.inputtag.setAttribute('placeholder', plcholder);
	if(obtag.tinput.value){
		var inittags = obtag.tinput.value.split(',');
		for(i=0;i<inittags.length;i++) addTag(inittags[i]);
	}
	obtag.inputtag.addEventListener("keyup", function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if( code == 13 || this.value.lastIndexOf(',') != -1 ){
			var tt = this.value.replace(',','');
			if( tt ){
				addTag(tt);
				getTags();
			}
			this.value = "";
		}
	});
	function getTags(){
		var list = [];
		obtag.taglist.querySelectorAll('span[data-tag]').forEach(function(i){list.push(i.getAttribute('data-tag'))});
		obtag.tinput.value = list.join(',');
	}
	function addTag(t){
		var close = document.createElement('span');
		close.setAttribute('class', 'icon-close');
		close.addEventListener('click', function(){
			obtag.taglist.removeChild(this.parentNode);
			getTags();
		});
		var ta = document.createElement('span');
		ta.setAttribute('data-tag', t); ta.innerHTML = t;
		ta.appendChild(close);
		obtag.taglist.appendChild(ta);
	}
};
