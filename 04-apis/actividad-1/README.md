# Actividad 1: tu primera petición con Node.js (solución)

Consumir una API REST desde la terminal, solo con JavaScript y Node. Sin HTML ni navegador.

## Antes de empezar

Comprueba tu versión de Node:

```bash
node -v
```

Necesitas **Node 18 o superior**: desde esa versión `fetch` viene incluido y no hay que instalar nada. Si tienes una versión anterior, actualiza Node desde [nodejs.org](https://nodejs.org).

Para ejecutar cada archivo, la terminal tiene que estar **en esta carpeta**. Desde la raíz del curso:

```bash
cd 04-apis/actividad-1
node 01-api.js
```

Si ves `Error: Cannot find module '.../01-api.js'`, la terminal está en otra carpeta: Node busca el archivo en la carpeta actual. Revisa dónde estás con `pwd` (Linux, Mac, Git Bash) o `cd` (CMD de Windows) y entra a la carpeta correcta.

| Archivo | Qué resuelve |
|---|---|
| [01-api.js](01-api.js) | Código base de la actividad |
| [02-reto-peso-tipos.js](02-reto-peso-tipos.js) | Reto 1: peso y tipos |
| [03-reto-no-existe.js](03-reto-no-existe.js) | Reto 2: Pokémon que no existe |
| [04-reto-manejo-error.js](04-reto-manejo-error.js) | Reto 3: mensaje de error con `respuesta.ok` |
| [05-reto-rick-and-morty.js](05-reto-rick-and-morty.js) | Reto 4: otra API |

---

## Código base

```js
const url = "https://pokeapi.co/api/v2/pokemon/pikachu";

async function main() {
  const respuesta = await fetch(url);
  console.log("Código:", respuesta.status);

  const datos = await respuesta.json();
  console.log("Nombre:", datos.name);
  console.log("Altura:", datos.height);
}

main();
```

```
$ node 01-api.js
Código: 200
Nombre: pikachu
Altura: 4
```

Línea por línea:

1. **`fetch(url)`** hace una petición **GET** a la URL, igual que el botón *Send* de Postman.
2. **`await`** espera a que llegue la respuesta. `fetch` tarda (va a Internet y vuelve), así que devuelve una **promesa**: un valor que llegará más tarde.
3. **`await` solo se puede usar dentro de una función `async`**. Por eso el código está dentro de `main()`, y al final se llama a `main()`.
4. **`respuesta.status`** es el código de estado: 200 significa que todo salió bien.
5. **`respuesta.json()`** convierte el *body* de la respuesta (texto en formato JSON) en un objeto de JavaScript. También tarda, por eso lleva su propio `await`.
6. Con el objeto ya listo, accedes a sus propiedades con el punto: `datos.name`, `datos.height`.

> Para saber qué propiedades trae la respuesta, abre la petición **4. APIs públicas › PokéAPI: un Pokémon** en la colección de Postman y mira el body.

---

## Reto 1: mostrar también el peso y los tipos

```js
console.log("Altura:", datos.height / 10, "m");
console.log("Peso:", datos.weight / 10, "kg");

const tipos = datos.types.map((t) => t.type.name);
console.log("Tipos:", tipos.join(", "));
```

```
$ node 02-reto-peso-tipos.js
Código: 200
Nombre: pikachu
Altura: 0.4 m
Peso: 6 kg
Tipos: electric
```

- **El peso** está en `datos.weight`.
- **Unidades:** PokéAPI da la altura en decímetros y el peso en hectogramos. Al dividir entre 10 quedan en metros y kilos. Este dato está en la documentación de la API: leerla es parte de trabajar con APIs.
- **Los tipos** no son un texto: son un **array de objetos**, porque un Pokémon puede tener uno o dos tipos.

  ```json
  "types": [
    { "slot": 1, "type": { "name": "electric", "url": "https://pokeapi.co/api/v2/type/13/" } }
  ]
  ```

  Con `map` sacamos solo el nombre de cada uno (`t.type.name`) y con `join(", ")` los unimos en un texto. Prueba con `bulbasaur`, que tiene dos tipos: `grass, poison`.

---

## Reto 2: pedir un Pokémon que no existe

```js
const url = "https://pokeapi.co/api/v2/pokemon/pokemonfalso";
```

```
$ node 03-reto-no-existe.js
Código: 404
¿ok?: false
Cuerpo: { status: 404, message: 'Not Found' }
Nombre: undefined
```

- El servidor responde **404 Not Found**: la petición llegó bien, pero el recurso no existe.
- **`respuesta.ok`** vale `true` cuando el código está entre 200 y 299, y `false` en cualquier otro caso.
- **`fetch` no lanza un error con un 404.** Para `fetch`, el servidor respondió, así que la petición "funcionó". El programa sigue, lee un JSON que no tiene los datos del Pokémon y muestra `undefined`.

Eso es justo lo que corrige el siguiente reto.

---

## Reto 3: mostrar un mensaje de error si `!respuesta.ok`

```js
const nombre = process.argv[2] ?? "pikachu";
const url = `https://pokeapi.co/api/v2/pokemon/${nombre}`;

async function main() {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      console.log(`Error ${respuesta.status}: no existe un Pokémon llamado "${nombre}".`);
      return;
    }

    const datos = await respuesta.json();
    // ...mostrar los datos
  } catch (error) {
    console.log("No se pudo conectar con la API:", error.message);
  }
}
```

```
$ node 04-reto-manejo-error.js charmander
Nombre: charmander
Altura: 0.6 m
Peso: 8.5 kg
Tipos: fire

$ node 04-reto-manejo-error.js pokemonfalso
Error 404: no existe un Pokémon llamado "pokemonfalso".
```

- **`if (!respuesta.ok)`** revisa el código de estado **antes** de leer los datos. Si falló, muestra el error y `return` termina la función.
- **`try / catch`** atrapa otro tipo de fallo: cuando no hay respuesta, por ejemplo sin Internet o con una URL mal escrita. Prueba a desconectarte y ejecutarlo.
- **Hay dos errores distintos:**

  | Situación | Qué pasa | Cómo se detecta |
  |---|---|---|
  | El servidor responde con 404, 500… | `fetch` termina normal | `respuesta.ok` es `false` |
  | No hay respuesta (sin red) | `fetch` lanza un error | `catch` |

- **`process.argv`** guarda lo que escribes en la terminal. La posición `[2]` es el primer dato después del nombre del archivo. Así eliges el Pokémon sin editar el código. Si no escribes nada, `??` usa `"pikachu"`.

---

## Reto 4: cambiar a otra API

El mismo programa sirve para cualquier API REST. Solo cambian la URL y los nombres de las propiedades.

```js
const id = process.argv[2] ?? "1";
const url = `https://rickandmortyapi.com/api/character/${id}`;
// ...
console.log("Nombre:", personaje.name);
console.log("Estado:", personaje.status);
console.log("Especie:", personaje.species);
console.log("Origen:", personaje.origin.name);
console.log("Aparece en", personaje.episode.length, "episodios");
```

```
$ node 05-reto-rick-and-morty.js 1
Nombre: Rick Sanchez
Estado: Alive
Especie: Human
Origen: Earth (C-137)
Aparece en 51 episodios

$ node 05-reto-rick-and-morty.js 9999
Error 404: no existe el personaje con id 9999.
```

- **`personaje.origin.name`**: `origin` es un objeto dentro del objeto, así que se encadenan los puntos.
- **`personaje.episode.length`**: `episode` es un array con las URLs de cada episodio. Su `length` dice en cuántos aparece.
- La estructura es la misma que con PokéAPI: `fetch` → revisar `ok` → `json()` → usar los datos.

---

## Resumen

```js
const respuesta = await fetch(url);      // 1. hacer la petición
if (!respuesta.ok) { /* error */ }       // 2. revisar el código de estado
const datos = await respuesta.json();    // 3. convertir el body en objeto
console.log(datos.propiedad);            // 4. usar los datos
```

- `fetch` hace la petición y devuelve una **promesa**. Se espera con `await` dentro de una función `async`.
- `respuesta.status` y `respuesta.ok` dicen cómo salió la petición.
- **Un 404 no hace fallar a `fetch`**: hay que revisar `respuesta.ok`. Los fallos de red se atrapan con `try / catch`.
- `respuesta.json()` convierte el body en un objeto de JavaScript.
- Para saber qué propiedades trae una respuesta, pruébala primero en Postman o mira la documentación de la API.
