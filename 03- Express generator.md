# Express application generator

El generador de aplicaciones oficial de Express, llamado express-generator, que permite generar toda una estructura base o scafold predeterminada para iniciar un proyecto nuevo.

- Primero debemos instalarlo como una dependencia global con la instrucción:

        $ npm i express-generator -g

- Luego para generar una aplicación, ejecutamos la instrucción:

        $ express --view=pug <nombre-de-la-aplicacion>

- Se debe entrar a la carpeta creada e instalar las dependencias con 

        $ npm install

- luego para correr la aplicacion 

        $ SET DEBUG=<nombre-de-la-aplicacion>:* & npm start