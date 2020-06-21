/*
* Listefi Frontend Framework v1.0
* Desarrollado por ULises Rendón
* https://twitter.com/fidelulises
* Licencia de uso: https://creativecommons.org/licenses/by-nc/4.0/deed.es
*/
//Definimos el contstructor
var liweditor = function( opt ){
	if(typeof opt != "object") opt = {selector:opt};
	var w = {container: document.querySelector(opt.selector)};
	w.textarea = w.container.querySelector("textarea");
	w.container.classList.add('liwedit-cont');

	//Insertamos el contenteditable y ocultamos el textarea
	w.textarea.setAttribute("data-state", "hidden");
	w.container.insertBefore(liweditor.createEditor(w.textarea.value), w.textarea);
	w.editable = w.container.querySelector(".liwedit-area");

	//Generamos y agregamos el toolbar
	w.container.insertBefore(liweditor.createToolbar(w), w.editable);

	//Definimos funcionamiento del metodo update
	w.update = function(){if( w.textarea.getAttribute("data-state") == "hidden" ) w.textarea.value = w.editable.innerHTML;};

	liweditor.floating(w);

	liweditor.comand('styleWithCSS', true);
	return w;
};
liweditor.comand = function(c,v){document.execCommand(c,false,v)};
//Metodo para validar url
liweditor.validURL = function(str){
	var a  = document.createElement('a'); a.href = str;
	return (a.host && a.host != window.location.host);
};
//Metodo para obtener html seleccionado
liweditor.getSelection = function(){
	var range = document.getSelection().getRangeAt(0),
	htf = document.createElement("div");
	htf.appendChild(range.cloneContents());
	return htf.innerHTML;
};
//Metodo para obtener html seleccionado
liweditor.float = function(d){
	liweditor.comand('insertHTML','<div class="bx-'+d+'">'+liweditor.getSelection()+'</div>');
};
liweditor.floating = function(w){
	w.container.addEventListener("keydown", function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if( code == 76 && e.altKey ) liweditor.float('left');
		else if( code == 82 && e.altKey ) liweditor.float('right');
	});
};
//Metodo para escapar html
liweditor.escapeHTML = function(c){
	var t = document.createTextNode(c);
	var p = document.createElement('p');
	p.appendChild(t);
	return p.innerHTML;
};
//Metodo para obtener id video Youtube
liweditor.youtubeId = function(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
};
//Generamos el contenteditable
liweditor.createEditor = function(html){
	var editor = document.createElement("div");
	editor.setAttribute("contenteditable", "true");
	editor.setAttribute("class", "liwedit-area");
	editor.setAttribute("data-state", "showed");
	editor.innerHTML = html ? html : "<p>&nbsp</p>";
	return editor;
};
//Generamos el toolbar
liweditor.createToolbar = function(w){
	var el = document.createElement("div");
	el.setAttribute("class", "liwedit-toolbar");
	Object.keys(liweditor.inp).map(function(k){
		var v = liweditor.inp[k];
		var ael = document.createElement(v.type);
		if( v.type == "button" ) ael.setAttribute("type", "button");
		ael.setAttribute("title", v.title);
		ael.setAttribute("class", v.class);
		ael.innerHTML = v.html;
		ael.addEventListener(v.event, function(){v.action(w,this)});
		el.appendChild(ael);
	});
	return el;
};
//Definimos las caracteristicas de los inputs
liweditor.inp = {
	bold: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('bold','');},
		title: 'Negrita',
		html: '<span class="icon-bold"></span>'
	},
	italic: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('italic','');},
		title: 'Negrita',
		html: '<span class="icon-italic"></span>'
	},
	strike: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('strikethrough','');},
		title: 'Techado',
		html: '<span class="icon-strikethrough"></span>'
	},
	underline: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('underline','');},
		title: 'Subrayado',
		html: '<span class="icon-underline"></span>'
	},
	eraser: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('removeFormat','');},
		title: 'Borrar Formato',
		html: '<span class="icon-eraser"></span>'
	},
	formatblock: {
		class: 'form-in', type: 'select', event: 'change',
		action: function(w, sel){
			if( sel.value == "<p>" ) liweditor.comand('insertHTML','<p>'+liweditor.getSelection()+'</p>');
			else liweditor.comand('formatBlock',sel.value);
			sel.value = "";
		},
		title: 'Formatblock',
		html: '<option value="">Añadir Formato</option>'+
		'<option value="<p>">Parrafo</option>'+
		'<option value="<h1>">Encabezado #1</option>'+
		'<option value="<h2>">Encabezado #2</option>'+
		'<option value="<h3>">Encabezado #3</option>'+
		'<option value="<h4>">Encabezado #4</option>'+
		'<option value="<h5>">Encabezado #5</option>'+
		'<option value="<h6>">Encabezado #6</option>'+
		'<option value="<pre>">Etiqueta de Preformateo</option>'
	},
	aleft: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('justifyLeft','');},
		title: 'Alinear a la izquierda',
		html: '<span class="icon-align-left"></span>'
	},
	acenter: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('justifyCenter','');},
		title: 'Alinear al centro',
		html: '<span class="icon-align-center"></span>'
	},
	aright: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('justifyRight','');},
		title: 'Alinear a la derecha',
		html: '<span class="icon-align-right"></span>'
	},
	afull: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('justifyFull','');},
		title: 'Justificar',
		html: '<span class="icon-align-justify"></span>'
	},
	img: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){
			var selection = liweditor.getSelection(), url;
			if( liweditor.validURL(selection) ) url = selection;
			else url = prompt("Ingrese URL de la imagen");
			if( url ) liweditor.comand('insertImage',url);
		},
		title: 'Insertar Imágen',
		html: '<span class="icon-image"></span>'
	},
	ytvid: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){
			var selection = liweditor.getSelection(), url;
			if( liweditor.validURL(selection) ) url = selection;
			else url = prompt("Ingrese URL del video");
			if( url ){
				var ht = '<iframe width="650" height="405" src="https://www.youtube.com/embed/'+liweditor.youtubeId(url)+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n';
				console.log(ht);
				liweditor.comand('insertHTML',ht);
			}
		},
		title: 'Insertar Video Youtube',
		html: '<span class="icon-youtube-square"></span>'
	},
	link: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){
			var selection = liweditor.getSelection(), url;
			if( liweditor.validURL(selection) ) url = selection;
			else url = prompt("Ingrese URL del enlace");
			if( url ){
				if( selection ) url = '<a href="'+url+'">'+selection+'</a>';
				else url = '<a href="'+url+'">'+url+'</a>';
				liweditor.comand('insertHTML',url);
			}
		},
		title: 'Insertar Enlace',
		html: '<span class="icon-link"></span>'
	},
	unlink: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('unlink','');},
		title: 'Quitar enlace',
		html: '<span class="icon-unlink"></span>'
	},
	orderedlist: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('insertOrderedList','');},
		title: 'Insertar Lista Ordenada',
		html: '<span class="icon-list-ol"></span>'
	},
	unorderedlist: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('insertUnorderedList','');},
		title: 'Insertar Lista No Ordenada',
		html: '<span class="icon-list-ul"></span>'
	},
	quote: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){liweditor.comand('formatBlock',"<blockquote>");},
		title: 'Insertar Cita',
		html: '<span class="icon-quote-left"></span>'
	},
	code: {
		class: 'btn', type: 'button', event: 'click',
		action: function(){
			var selection = liweditor.getSelection(),
			hcode = selection ? selection : '<br>';
			hcode = "<pre><code>"+hcode+"</code></pre><p></p>";
			liweditor.comand('insertHTML',hcode);
		},
		title: 'Insertar Código',
		html: '<span class="icon-code"></span>'
	},
	changeview: {
		class: 'btn', type: 'button', event: 'click',
		action: function(w){
			if( w.textarea.getAttribute("data-state") == "hidden" ){
				w.textarea.value = w.editable.innerHTML;
				w.textarea.setAttribute("data-state", "showed");
				w.editable.setAttribute("data-state", "hidden");
			}else{
				w.editable.innerHTML = w.textarea.value;
				w.textarea.setAttribute("data-state", "hidden");
				w.editable.setAttribute("data-state", "showed");
			}
		},
		title: 'Cambiar vista',
		html: '<span class="icon-eye"></span>'
	},
	fullscreen: {
		class: 'btn', type: 'button', event: 'click',
		action: function(w){
			if( w.container.getAttribute("data-state") ){
				w.container.removeAttribute("data-state");
			}else w.container.setAttribute("data-state", "full");
		},
		title: 'Expandir/Contraer editor',
		html: '<span class="icon-arrows-alt"></span>'
	}
};
