/*
* Listefi Frontend Framework v1.0
* Desarrollado por ULises Rendón
* https://twitter.com/fidelulises
* Licencia de uso: https://creativecommons.org/licenses/by-nc/4.0/deed.es
*/
listefi.rprop = {startX:0, startY:0, startWidth:0, startHeight:0, dparent:null, dactual: [0,0]};
listefi.rdata = {n:[0,-1],s:[0,1],e:[1,0],w:[-1,0],ne:[1,-1],se:[1,1],sw:[-1,1],nw:[-1,-1]};
listefi.resize = function(e) {
	e.preventDefault();
	e.stopPropagation();
	listefi.rprop.startX = e.clientX; listefi.rprop.startY = e.clientY;
    listefi.rprop.startWidth = parseInt(document.defaultView.getComputedStyle(listefi.rprop.dparent).width, 10);
    listefi.rprop.startHeight = parseInt(document.defaultView.getComputedStyle(listefi.rprop.dparent).height, 10);
    document.addEventListener('mousemove', listefi.rdoDrag);
    document.addEventListener('mouseup', listefi.rstopDrag);
};
listefi.rstopDrag = function (e) {
    document.removeEventListener('mousemove', listefi.rdoDrag);
	document.removeEventListener('mouseup', listefi.rstopDrag);
};
listefi.rdoDrag = function(e) {
   if(listefi.rprop.dactual[0]) listefi.rprop.dparent.style.width = ( listefi.rprop.startWidth + ( e.clientX - listefi.rprop.startX ) * listefi.rprop.dactual[0] ) + 'px';
   if(listefi.rprop.dactual[1]) listefi.rprop.dparent.style.height = ( listefi.rprop.startHeight + ( e.clientY - listefi.rprop.startY ) * listefi.rprop.dactual[1] ) + 'px';
}
listefi.resizerHandler = function(elm){
	elm.addEventListener('mousedown', function(e){
		var a, b, type = listefi.rdata[this.getAttribute("data-type")], parentn = this.parentNode;
		if( type[0] ){
			if(type[0]==1){a = "left"; b="right";}else{a = "right"; b="left";}
			parentn.style[a] = document.defaultView.getComputedStyle(parentn)[a];
			parentn.style.removeProperty(b);
		}
		if( type[1] ){
			if(type[1]==1){a = "top"; b="bottom";}else{a = "bottom"; b="top";}
			parentn.style[a] = document.defaultView.getComputedStyle(parentn)[a];
			parentn.style.removeProperty(b);
		}
		listefi.rprop.dparent = parentn;
		listefi.rprop.dactual = type;
		listefi.resize(e);
	});
	return elm;
};
listefi.createResizer = function(type){
	var r = document.createElement("div");
	r.setAttribute("class", "fres-"+type);
	r.setAttribute("data-type", type);
	r = listefi.resizerHandler(r);
	return r;
};
listefi.initResize = function(selector){
	listefi(selector).appendChild(listefi.createResizer("n"));
	listefi(selector).appendChild(listefi.createResizer("s"));
	listefi(selector).appendChild(listefi.createResizer("e"));
	listefi(selector).appendChild(listefi.createResizer("w"));
	listefi(selector).appendChild(listefi.createResizer("nw"));
	listefi(selector).appendChild(listefi.createResizer("ne"));
	listefi(selector).appendChild(listefi.createResizer("se"));
	listefi(selector).appendChild(listefi.createResizer("sw"));
};
