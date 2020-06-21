hljs.initHighlightingOnLoad();

var mainnav = document.querySelector('#mainnav');
document.querySelector('#btnshownav').addEventListener('click', function(){
	var state = mainnav.getAttribute('data-state');
	if( state != 'show' ) mainnav.setAttribute('data-state', 'show');
	else mainnav.setAttribute('data-state', 'hide');
});
