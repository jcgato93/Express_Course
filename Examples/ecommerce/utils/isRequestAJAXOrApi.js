// verificar si la peticion es AJAX o espera una pagina html
function isRequestAJAXOrApi(req){
    return !req.accepts("html") || req.xhr;
}

module.exports =  isRequestAJAXOrApi;