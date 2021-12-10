/**
 * Création d'un plugin jQuery permettant l'exploitation d'un fichier JSON permettant de faire une barre de navigation bootstrap dynamique.  
 * 
 * @param {JSON} options : élément JSON avec deux clés
 *                                         - url : url du menu JSON
 *                                         - theme : facultatif (light par defaut) => theme bootstrap du menu (light / dark)
 */

jQuery.fn.menu = function (options) {
    var defaut = { url: 'js/menu.json', theme: 'light' };
    let opts = jQuery.extend(defaut, options);
    if (opts.theme !== 'dark') opts.theme = 'light';
    let parent = this;
    jQuery.getJSON(opts.url, function (json) {
        let nav = jQuery(`<nav class="navbar navbar-expand-lg navbar-${opts.theme} bg-${opts.theme}">`).appendTo(parent);
        let div1 = jQuery('<div class="container-fluid">').appendTo(nav);
        jQuery('<a class="navbar-brand" href="#">').appendTo(div1).text(json.title);
        let btn = jQuery(`<button class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
        aria-expanded="false" aria-label="Toggle navigation">`).appendTo(div1);
        jQuery('<span class="navbar-toggler-icon">').appendTo(btn);
        let div2 = jQuery('<div class="collapse navbar-collapse" id="navbarSupportedContent">').appendTo(div1);
        let ul1 = jQuery('<ul class="navbar-nav me-auto mb-2 mb-lg-0">').appendTo(div2);

        let compteur = 1;
        for (key in json.data) {
            let value = json.data[key];
            if (typeof (value) == 'string') {
                let li = jQuery('<li class="nav-item">').appendTo(ul1);
                jQuery('<a class="nav-link active" aria-current="page">').appendTo(li).attr('href', value).text(key);
            } else {
                let submenu = json.data[key];
                let li2 = jQuery('<li class="nav-item dropdown">').appendTo(ul1);
                jQuery('<a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">').appendTo(li2).attr('href', value).text(key);
                let ul2 = jQuery('<ul class="dropdown-menu" aria-labelledby="navbarDropdown">').appendTo(li2);
               compteur++;

                for (subkey in submenu){
                    let li3 = jQuery('<li>').appendTo(ul2);
                    jQuery('<a class="dropdown-item">').appendTo(li3).attr('href', submenu[subkey]).text(subkey);
                }
            
            }
        }
    });
};



