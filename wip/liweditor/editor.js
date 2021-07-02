/*
* Desarrollado por ULises Rendón
* https://twitter.com/fidelulises
* Licencia de uso: https://creativecommons.org/licenses/by-nc/4.0/deed.es
*/
//Definimos el contstructor
class liweditor {
    constructor(opt) {
        if (typeof opt != "object")
            opt = { selector: opt };
        let w = { container: document.querySelector(opt.selector) };
        w.textarea = w.container.querySelector("textarea");
        w.container.classList.add('liwedit-cont');

        //Insertamos el contenteditable y ocultamos el textarea
        w.textarea.setAttribute("data-state", "hidden");
        w.container.insertBefore(liweditor.createEditor(w.textarea.value), w.textarea);
        w.editable = w.container.querySelector(".liwedit-area");

        //Generamos y agregamos el toolbar
        w.container.insertBefore(liweditor.createToolbar(w), w.editable);

        //Definimos funcionamiento del metodo update
        w.update = function () {
            if (w.textarea.getAttribute("data-state") == "hidden")
                w.textarea.value = w.editable.innerHTML;
        };

        liweditor.floating(w);

        liweditor.comand('styleWithCSS', true);
        return w;
    }
    static comand(c, v) { document.execCommand(c, false, v); }
    //Metodo para validar url
    static validURL(str) {
        let a = document.createElement('a'); a.href = str;
        return (a.host && a.host != window.location.host);
    }
    //Metodo para obtener html seleccionado
    static getSelection() {
        let range = document.getSelection().getRangeAt(0),
            htf = document.createElement("div");
        htf.appendChild(range.cloneContents());
        return htf.innerHTML;
    }
    //Metodo para obtener html seleccionado
    static float(d) {
        liweditor.comand('insertHTML', '<div class="bx-' + d + '">' + liweditor.getSelection() + '</div>');
    }
    static floating(w) {
        w.container.addEventListener("keydown", function (e) {
            let code = (e.keyCode ? e.keyCode : e.which);
            if (code == 76 && e.altKey)
                liweditor.float('left');
            else if (code == 82 && e.altKey)
                liweditor.float('right');
        });
    }
    //Metodo para escapar html
    static escapeHTML(c) {
        let t = document.createTextNode(c);
        let p = document.createElement('p');
        p.appendChild(t);
        return p.innerHTML;
    }
    //Metodo para obtener id video Youtube
    static youtubeId(url) {
        let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        let match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }
    //Generamos el contenteditable
    static createEditor(html) {
        let editor = document.createElement("div");
        editor.setAttribute("contenteditable", "true");
        editor.setAttribute("class", "liwedit-area");
        editor.setAttribute("data-state", "showed");
        editor.innerHTML = html ? html : "<p>&nbsp</p>";
        return editor;
    }
    //Generamos el toolbar
    static createToolbar(w) {
        let el = document.createElement("div");
        el.setAttribute("class", "liwedit-toolbar");
        Object.keys(liweditor.inp).map(function (k) {
            let v = liweditor.inp[k];
            let ael = document.createElement(v.type);
            if (v.type == "button")
                ael.setAttribute("type", "button");
            ael.setAttribute("title", v.title);
            ael.setAttribute("class", v.class);
            ael.innerHTML = v.html;
            ael.addEventListener(v.event, function () { v.action(w, this); });
            el.appendChild(ael);
        });
        return el;
    }
}
//Definimos las caracteristicas de los inputs
liweditor.inp = {
    bold: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('bold', ''); },
        title: 'Negrita',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18.287 11.121c1.588-1.121 2.713-3.018 2.713-5.093 0-2.946-1.918-5.951-7.093-6.028h-11.907v2.042c1.996 0 3 .751 3 2.683v14.667c0 1.689-.558 2.608-3 2.608v2h11.123c6.334 0 8.877-3.599 8.877-7.038 0-2.538-1.417-4.67-3.713-5.841zm-8.287-8.121h2.094c2.357 0 4.126 1.063 4.126 3.375 0 2.035-1.452 3.625-3.513 3.625h-2.707v-7zm2.701 18h-2.701v-8h2.781c2.26.024 3.927 1.636 3.927 3.667 0 2.008-1.226 4.333-4.007 4.333z"/></svg>'
    },
    italic: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('italic', ''); },
        title: 'Italica',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.565 20.827c-.361.732-.068 1.173.655 1.173h1.78v2h-9v-2h.897c1.356 0 1.673-.916 2.157-1.773l8.349-16.89c.403-.852-.149-1.337-.855-1.337h-1.548v-2h9v2h-.84c-1.169 0-1.596.646-2.06 1.516l-8.535 17.311z"/></svg>'
    },
    strike: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('strikethrough', ''); },
        title: 'Techado',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.271 14.521c.358.74.728 1.803.728 2.818 0 4.658-4 6.661-8.498 6.661-2.183 0-4.483-.472-6.5-1.341v-4.659h2c.227 1.809 1.875 3 4.444 3 2.503 0 4.415-1.046 4.63-3.28.127-1.321-.65-2.451-1.653-3.199h4.849zm-4.583-3.521c-3.124-1.398-6.281-2.75-5.639-5.669.714-3.244 7.265-3.206 7.951.669h1.979v-5.109c-2.028-.604-3.936-.891-5.649-.891-4.927 0-8.252 2.375-8.252 6.454 0 1.899.862 3.554 2.113 4.546h-7.191v2h24v-2h-9.312z"/></svg>'
    },
    underline: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('underline', ''); },
        title: 'Subrayado',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 24h-16v-2h16v2zm-5-24v1.973c1.619 0 2 .926 2 1.497v9.056c0 2.822-2.161 4.507-5 4.507s-5-1.685-5-4.507v-9.056c0-.571.381-1.497 2-1.497v-1.973h-7v1.973c1.66 0 2 .575 2 1.497v8.828c0 5.175 3.096 7.702 8 7.702 4.899 0 8-2.527 8-7.702v-8.828c0-.922.34-1.497 2-1.497v-1.973h-7z"/></svg>'
    },
    eraser: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('removeFormat', ''); },
        title: 'Borrar Formato',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5.662 23l-5.369-5.365c-.195-.195-.293-.45-.293-.707 0-.256.098-.512.293-.707l14.929-14.928c.195-.194.451-.293.707-.293.255 0 .512.099.707.293l7.071 7.073c.196.195.293.451.293.708 0 .256-.097.511-.293.707l-11.216 11.219h5.514v2h-12.343zm3.657-2l-5.486-5.486-1.419 1.414 4.076 4.072h2.829zm.456-11.429l-4.528 4.528 5.658 5.659 4.527-4.53-5.657-5.657z"/></svg>'
    },
    formatblock: {
        class: 'form-in', type: 'select', event: 'change',
        action: function (w, sel) {
            if (sel.value == "<p>") liweditor.comand('insertHTML', '<p>' + liweditor.getSelection() + '</p>');
            else liweditor.comand('formatBlock', sel.value);
            sel.value = "";
        },
        title: 'Formatblock',
        html: '<option value="">Añadir Formato</option>' +
            '<option value="<p>">Parrafo</option>' +
            '<option value="<h1>">Encabezado #1</option>' +
            '<option value="<h2>">Encabezado #2</option>' +
            '<option value="<h3>">Encabezado #3</option>' +
            '<option value="<h4>">Encabezado #4</option>' +
            '<option value="<h5>">Encabezado #5</option>' +
            '<option value="<h6>">Encabezado #6</option>' +
            '<option value="<pre>">Etiqueta de Preformateo</option>'
    },
    aleft: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('justifyLeft', ''); },
        title: 'Alinear a la izquierda',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 3h-24v-2h24v2zm-12 3h-12v2h12v-2zm12 5h-24v2h24v-2zm-12 5h-12v2h12v-2zm12 5h-24v2h24v-2z"/></svg>'
    },
    acenter: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('justifyCenter', ''); },
        title: 'Alinear al centro',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 3h-24v-2h24v2zm-6 3h-12v2h12v-2zm6 5h-24v2h24v-2zm-6 5h-12v2h12v-2zm6 5h-24v2h24v-2z"/></svg>'
    },
    aright: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('justifyRight', ''); },
        title: 'Alinear a la derecha',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 1h24v2h-24v-2zm12 7h12v-2h-12v2zm-12 5h24v-2h-24v2zm12 5h12v-2h-12v2zm-12 5h24v-2h-24v2z"/></svg>'
    },
    afull: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('justifyFull', ''); },
        title: 'Justificar',
        html: '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 21h-24v-2h24v2zm0-4.024h-24v-2h24v2zm0-3.976h-24v-2h24v2zm0-4h-24v-2h24v2zm0-6v2h-24v-2h24z"/></svg>'
    },
    img: {
        class: 'btn', type: 'button', event: 'click',
        action: function () {
            let selection = liweditor.getSelection(), url;
            if (liweditor.validURL(selection)) url = selection;
            else url = prompt("Ingrese URL de la imagen");
            if (url) liweditor.comand('insertImage', url);
        },
        title: 'Insertar Imágen',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z"/></svg>'
    },
    ytvid: {
        class: 'btn', type: 'button', event: 'click',
        action: function () {
            let selection = liweditor.getSelection(), url;
            if (liweditor.validURL(selection)) url = selection;
            else url = prompt("Ingrese URL del video");
            if (url) {
                let ht = '<iframe width="650" height="405" src="https://www.youtube.com/embed/' + liweditor.youtubeId(url) + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n';
                console.log(ht);
                liweditor.comand('insertHTML', ht);
            }
        },
        title: 'Insertar Video Youtube',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>'
    },
    link: {
        class: 'btn', type: 'button', event: 'click',
        action: function () {
            let selection = liweditor.getSelection(), url;
            if (liweditor.validURL(selection)) url = selection;
            else url = prompt("Ingrese URL del enlace");
            if (url) {
                if (selection) url = '<a href="' + url + '">' + selection + '</a>';
                else url = '<a href="' + url + '">' + url + '</a>';
                liweditor.comand('insertHTML', url);
            }
        },
        title: 'Insertar Enlace',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.723 18.654l-3.61 3.609c-2.316 2.315-6.063 2.315-8.378 0-1.12-1.118-1.735-2.606-1.735-4.188 0-1.582.615-3.07 1.734-4.189l4.866-4.865c2.355-2.355 6.114-2.262 8.377 0 .453.453.81.973 1.089 1.527l-1.593 1.592c-.18-.613-.5-1.189-.964-1.652-1.448-1.448-3.93-1.51-5.439-.001l-.001.002-4.867 4.865c-1.5 1.499-1.5 3.941 0 5.44 1.517 1.517 3.958 1.488 5.442 0l2.425-2.424c.993.284 1.791.335 2.654.284zm.161-16.918l-3.574 3.576c.847-.05 1.655 0 2.653.283l2.393-2.389c1.498-1.502 3.94-1.5 5.44-.001 1.517 1.518 1.486 3.959 0 5.442l-4.831 4.831-.003.002c-1.438 1.437-3.886 1.552-5.439-.002-.473-.474-.785-1.042-.956-1.643l-.084.068-1.517 1.515c.28.556.635 1.075 1.088 1.528 2.245 2.245 6.004 2.374 8.378 0l4.832-4.831c2.314-2.316 2.316-6.062-.001-8.377-2.317-2.321-6.067-2.313-8.379-.002z"/></svg>'
    },
    unlink: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('unlink', ''); },
        title: 'Quitar enlace',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.092 5.099l1.439-.205-.439-3.083-1.44.204.44 3.084zm-2.211 3.445l.205-1.44-3.084-.44-.205 1.441 3.084.439zm-.494-5.163l-1.03 1.03 2.203 2.204 1.029-1.03-2.202-2.204zm12.541 15.565l-1.439.205.438 3.083 1.441-.204-.44-3.084zm2.21-3.446l-.206 1.441 3.085.439.205-1.44-3.084-.44zm.495 5.163l1.028-1.029-2.204-2.204-1.027 1.03 2.203 2.203zm2.64-18.904c2.344 2.346 2.344 6.149.001 8.494l-3.896 3.896-1.417-1.417 3.895-3.895c1.562-1.562 1.562-4.101 0-5.662-1.562-1.562-4.101-1.562-5.662 0l-3.894 3.895-1.416-1.416 3.895-3.895c2.344-2.345 6.147-2.345 8.494 0zm-8.138 16.631l-3.852 3.851c-2.344 2.347-6.146 2.345-8.494.001-2.344-2.346-2.345-6.149 0-8.494l3.854-3.851 1.414 1.415-3.851 3.851c-1.562 1.562-1.562 4.102-.001 5.663 1.563 1.561 4.102 1.561 5.664-.001l3.85-3.851 1.416 1.416z"/></svg>'
    },
    orderedlist: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('insertOrderedList', ''); },
        title: 'Insertar Lista Ordenada',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 1h17v2h-17v-2zm0 7h17v-2h-17v2zm0 5h17v-2h-17v2zm0 5h17v-2h-17v2zm0 5h17v-2h-17v2zm-5.511-16h1.353v-6h-1.14c0 .91-.809 1.07-1.702 1.111v1h1.489v3.889zm2.433 6.667h-1.827c.823-.74 1.722-1.627 1.722-2.782 0-1.145-.762-1.885-1.941-1.885-.642 0-1.288.204-1.833.656l.423 1.148c.352-.279.715-.524 1.167-.524.486 0 .754.255.754.717-.008.774-.858 1.527-2.387 3.018v.958h3.922v-1.306zm-.87 6.124c.499-.266.771-.715.771-1.288 0-.748-.568-1.503-1.836-1.503-.571 0-1.241.142-1.74.482l.307 1.161c.432-.284.831-.394 1.15-.394.428 0 .674.174.674.478 0 .425-.52.538-.827.538h-.577v1.154h.601c.438 0 .949.183.949.701 0 .39-.329.633-.86.633-.451 0-.887-.163-1.282-.397l-.304 1.2c.5.322 1.11.444 1.675.444 1.344 0 2.247-.728 2.247-1.812 0-.646-.371-1.178-.948-1.397z"/></svg>'
    },
    unorderedlist: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('insertUnorderedList', ''); },
        title: 'Insertar Lista No Ordenada',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 1h20v2h-20v-2zm0 7h20v-2h-20v2zm0 5h20v-2h-20v2zm0 5h20v-2h-20v2zm0 5h20v-2h-20v2zm-2-22h-2v2h2v-2zm0 5h-2v2h2v-2zm0 5h-2v2h2v-2zm0 5h-2v2h2v-2zm0 5h-2v2h2v-2z"/></svg>'
    },
    quote: {
        class: 'btn', type: 'button', event: 'click',
        action: function () { liweditor.comand('formatBlock', "<blockquote>"); },
        title: 'Insertar Cita',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/></svg>'
    },
    code: {
        class: 'btn', type: 'button', event: 'click',
        action: function () {
            let selection = liweditor.getSelection(),
                hcode = selection ? selection : '<br>';
            hcode = "<pre><code>" + hcode + "</code></pre><p></p>";
            liweditor.comand('insertHTML', hcode);
        },
        title: 'Insertar Código',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23 10.826v2.349c-1.562 0-3 1.312-3 2.857 0 2.181 1.281 5.968-6 5.968v-2.002c4.917 0 3.966-1.6 3.966-3.967 0-2.094 1.211-3.5 2.278-4.031-1.067-.531-2.278-1.438-2.278-3.312 0-2.372.94-4.692-3.966-4.686v-2.002c7.285 0 6 4.506 6 6.688 0 1.544 1.438 2.138 3 2.138zm-19-2.138c0-2.182-1.285-6.688 6-6.688v2.002c-4.906-.007-3.966 2.313-3.966 4.686 0 1.875-1.211 2.781-2.278 3.312 1.067.531 2.278 1.938 2.278 4.031 0 2.367-.951 3.967 3.966 3.967v2.002c-7.281 0-6-3.787-6-5.969 0-1.545-1.438-2.857-3-2.857v-2.349c1.562.001 3-.593 3-2.137z"/></svg>'
    },
    changeview: {
        class: 'btn', type: 'button', event: 'click',
        action: function (w) {
            if (w.textarea.getAttribute("data-state") == "hidden") {
                w.textarea.value = w.editable.innerHTML;
                w.textarea.setAttribute("data-state", "showed");
                w.editable.setAttribute("data-state", "hidden");
            } else {
                w.editable.innerHTML = w.textarea.value;
                w.textarea.setAttribute("data-state", "hidden");
                w.editable.setAttribute("data-state", "showed");
            }
        },
        title: 'Ver código fuente',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13 12v1.649l3.229 1.351-3.229 1.347v1.653l5-2.201v-1.599l-5-2.2zm-7 2.201v1.599l5 2.2v-1.653l-3.229-1.347 3.229-1.351v-1.649l-5 2.201zm5.362-12.201c4.156 0 2.638 6 2.638 6s6-1.65 6 2.457v11.543h-16v-20h7.362zm.827-2h-10.189v24h20v-14.386c0-2.391-6.648-9.614-9.811-9.614z"/></svg>'
    },
    fullscreen: {
        class: 'btn', type: 'button', event: 'click',
        action: function (w) {
            if (w.container.getAttribute("data-state")) {
                w.container.removeAttribute("data-state");
            } else w.container.setAttribute("data-state", "full");
        },
        title: 'Expandir/Contraer editor',
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.426 10.668l-3.547-3.547-2.879 2.879v-10h10l-2.879 2.879 3.547 3.547-4.242 4.242zm11.148 2.664l3.547 3.547 2.879-2.879v10h-10l2.879-2.879-3.547-3.547 4.242-4.242zm-6.906 4.242l-3.547 3.547 2.879 2.879h-10v-10l2.879 2.879 3.547-3.547 4.242 4.242zm2.664-11.148l3.547-3.547-2.879-2.879h10v10l-2.879-2.879-3.547 3.547-4.242-4.242z"/></svg>'
    }
};