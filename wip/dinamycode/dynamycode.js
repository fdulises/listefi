let dynlist = {
    js: [
        'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
        'http://fronilla.test/liweditor/editor.js',
    ],
    css: [
        'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
        'http://fronilla.test/liweditor/editor.css'
    ],
    head: [
        'head.html'
    ],
    footer: [
        'footer.html'
    ]
};

document.addEventListener('DOMContentLoaded', ()=>{
    dynlist.css.forEach((el)=>{
        let n = document.createElement('link');
        n.href = el;
        n.rel = 'stylesheet';
        document.head.appendChild(n);
    });
    dynlist.js.forEach((el) => {
        let n = document.createElement('script');
        n.src = el;
        document.body.appendChild(n);
    });
    dynlist.head.forEach((el) => {
        fetch(el).then(function (response) {
            return response.text();
        }).then(function (response) {
            document.body.innerHTML = response + document.body.innerHTML;
        }).catch(function (err) {
            console.log('Fetch problem: ' + err.message);
        });
    });
    dynlist.footer.forEach((el) => {
        fetch(el).then(function (response) {
            return response.text();
        }).then(function (response) {
            document.body.innerHTML += response;
        }).catch(function (err) {
            console.log('Fetch problem: ' + err.message);
        });
    });
});