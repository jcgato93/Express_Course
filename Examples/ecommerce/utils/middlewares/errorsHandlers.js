const { config } = require('../../config');

const boom = require('boom');
const isRequestAJAXOrApi = require('../../utils/isRequestAJAXOrApi');


/**
 * si esta en desarrollo incluir el stack de errores
 */
function withErrorStack(err,stack){
    if(config.dev){
        return {... err,stack}
    }
}


function logErrors(err,req,res,next){
    console.log(err.stack);
    next(err)
}

function wrapErrors(err,req,res,next){
    // Verifica si no es un error con el formato de boom
    if(!err.isBoom){
        next(boom.badImplementation(err));
    }

    // si ya esta con el formato de boom simplemente lo pasa al siguiente middleware
    next(err);
}

function clientErrorHandler(err,req,res,next){

    const{
        output : { statusCode, payload } // estraer de un error de boom
    } = err;

    // catch errors for AJAX request or an error ocurrs while streaming
    if(isRequestAJAXOrApi(req) || res.headersSent){
        res.status(statusCode).json(withErrorStack(payload,err.stack));
    }else{
        next(err)
    }
}


function errorHandler(err,req,res,next){
    const{
        output : { statusCode, payload } // estraer de un error de boom
    } = err;


    res.status(statusCode);
    res.render("error",withErrorStack(payload,err.stack));
}

module.exports = {
    logErrors,
    wrapErrors,
    clientErrorHandler,
    errorHandler
}