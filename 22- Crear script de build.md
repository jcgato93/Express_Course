# Crear script de build

- En el package.json en la seccion de script añadir lo siguiente

```json
{
    "scripts":{
        "start":"NODE_ENV=production node index", // para correr en modo produccion
        //...        
    }
}
```