# Crear Servidor con express

- Se debe crear primero el package.json

      $ npm init -y

- Instalar la dependencia de express y nodemon

      $ npm install express --save
      $ npm install nodemon --save-dev


- Crear archivo index.js y dentro de este 

```javascript
const express = require('express')
const app = express();

app.get('/',function(req,res,next){
    res.send('Hello world')
})


const server = app.listen(8000,()=>{
    console.log(`Listening http://localhost:${server.address().port}`);
})

```

- Luego se modifica en el pakage.json el script de inicio de la aplicacion

```json
 "scripts": {
    "start": "node index",
    "dev": "nodemon index"
  },
```

- Por ultimo se corre el siguiente comando para iniciar el server 

        $ npm run dev