# Buenas practicas para produccion

- Remove hardcoded keys
Este es el link se explica como borrar commits en github por si se nos fue algun archivo con datos sensibles: https://help.github.com/articles/removing-sensitive-data-from-a-repository/

- Encapsulate spaghetti code
Encapsular funciones dispersas, logica pesada en funciones separadas y facil de mantener

- Review project structure
Buena estructura de carpetas, que sea facil de entender

- Config build scripts
crear si es necesario los scripts de build

- Add cache support
añadir soporte de cache para mejorar el rendimiento

- Add HTTPS and CORS
Añadir HTTPS para tener una conexion segura y CORS para definir los dominios que tienen permitida la conexion

- Review security practices
Practicas de seguridad : owasp