# JSON Web Tokens

Es un estandar que nos permite representar datos llamados "claims"(peticiones o permisos)

un Json web token tiene la siguiente estructura

```javascript
Header{
    "alg": "HS256",
    "typ":"JWT"
}

// Informacion que se quiere compartir entre las partes
payload{
    "sub":"123456789",
    "name": "John Doe",
    "iat": 1520545641  // cuando se genero el token
}


signature
// se crea con el header + payload + string secreto
HMACSHA256(
    base64UrlEncode(header)+"."+
    base64UrlEncode(payload),
    vour-256-bit-secret
)

```

Encuentra mas informacion sobre JWT en : https://jwt.io/