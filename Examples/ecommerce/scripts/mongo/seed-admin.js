const bcrypt = require('bcrypt');
const chalk = require('chalk');
const MongoLib = require('../../lib/mongo');
const { config } = require('../../config/index');


// Retorna un objeto la estructura de un usuario
function buildAdminUser(password){
    return{
        password,
        username: config.authAdminUsername,
        email: config.authAdminEmail
    }
}

// Verifica si existe en usuario en la base de datos
async function hasAdminUser(mongoDB){
    const adminUser = await mongoDB.getAll('users',{
        username: config.authAdminUsername
    })

    return adminUser && adminUser.length;
}


// Crea la configuracion de usuario admin con el password hasheado
async function createAdminUser(mongoDB) {
    const hashedPassword = await bcrypt.hash(config.authAdminPassword, 10);
    const userId = await mongoDB.create("users", buildAdminUser(hashedPassword));
    return userId;
}


async function seedAdmin() {
    try {
      const mongoDB = new MongoLib();
  
      if (await hasAdminUser(mongoDB)) {
        console.log(chalk.yellow("Admin user already exists"));
        return process.exit(1);
      }
  
      const adminUserId = await createAdminUser(mongoDB);
      console.log(chalk.green("Admin user created with id:", adminUserId));
      return process.exit(0);
    } catch (error) {
      console.log(chalk.red(error));
      process.exit(1);
    }
  }
  
  seedAdmin();