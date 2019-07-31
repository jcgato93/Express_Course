# Cómo usar las variables de entorno para diferente ambientes

Ya vimos cómo en nuestro ambiente local podemos hacer uso de las variables de entorno usando el archivo .env y la libreria dotenv. Generalmente lo que se recomienda es usar el mismo para los diferentes ambientes como Staging (Pruebas) y Producción.

Para ello se debe acceder al servidor remoto:

- Duplicar el archivo .env.example y renombrarlo por .env.
- Cargar las respectivos valores de las variables de entorno.
- Usar valores y servicios diferentes para cada ambiente, esto quiere decir que las credenciales de desarrollo, staging y producción deben ser completamente diferentes.
- Si se quiere tener un backup de estos valores se recomienda usar las notas seguras de aplicaciones como <a href="https://1password.com/">1Password</a> o <a href="https://www.lastpass.com/es">LastPass</a>.

Como lo hemos dicho antes, no se debe hacer commit del archivo .env y este debe estar en el .gitignore, ademas se recomienda manejar solo un archivo .env. Más información: https://github.com/motdotla/dotenv#faq

## Cuando no es posible acceder al servidor remoto
Algunos servicios como <a href="https://www.heroku.com/">Heroku</a> o <a href="https://zeit.co/now">Now</a> no nos permiten acceder a un servidor remoto pues la administración del servidor es controlada por los mismos servicios, sin embargo cada servicio tiene sus mecanismos para establecer las variables de entorno:

- <a href="https://devcenter.heroku.com/articles/config-vars">Configuración de variables de entorno en Heroku</a>
- <a href="https://zeit.co/blog/environment-variables-secrets">Configuración de variables de entorno en Now</a>

## Variables de entorno de forma nativa
El uso del archivo .env junto con la librería dotenv es un mecanismo que nos facilita la configuración de variables de entorno pero si por alguna razón las quisiéramos cargar de manera nativa, es decir desde el sistema operativo, recomiendo este tutorial de <a href="https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-a-linux-vps">Digital Ocean</a>