const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const boom = require('boom');
const bcrypt = require('bcrypt');
const MongoLib= require('../../../lib/mongo');

passport.use(
    new BasicStrategy(async function(username,password, cb){
        const mongoDB = MongoLib();

        try {
            // Retorna de la base de datos el usuario con ese mismo username
            const [user] = await mongoDB.getAll("users", { username });

            // Si no retorna ningun usuario de la consulta 
            if(!user){
                return cb(boom.unauthorized(), false);
            }

            // Si el password no concuerda con el que retorna la base de datos
            if(!await bcrypt.compare(passport, user.password)){
                return cb(boom.unauthorized(),false);
            }

            // Si el usuario y el password concuerdan retorna el usuario
            return cb(null,user);

        } catch (error) {
            return cb(error)
        }
    })
)