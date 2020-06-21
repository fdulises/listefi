//Definimos funcionamiento de barra de navegacion
document.addEventListener('DOMContentLoaded',function(){
	var btn = document.querySelector('#actionNav');
	var nav = document.querySelector('#leftNav');
	var cont = document.querySelector('#cont');
	function showNav(){
		btn.setAttribute('data-estado','open');
		nav.setAttribute('data-estado','open');
		cont.setAttribute('data-estado','open');
	}
	function hideNav(){
		btn.setAttribute('data-estado','close');
		nav.setAttribute('data-estado','close');
		cont.setAttribute('data-estado','close');
	}
	document.querySelector('#actionNav').addEventListener('click',function(){
		if( btn.getAttribute('data-estado') == "open" ){
			hideNav();
			listefi.setCookie('navshow', 0, 30);
		}else{
			showNav();
			listefi.setCookie('navshow', 1, 30);
		}
	});
	if( listefi.getCookie('navshow') == 1 ) showNav();
	else hideNav();
});