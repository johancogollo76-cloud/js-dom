# Actividad 2: un service para la API (solución)

Separar en un archivo todo lo que habla con la API (el *service*) y usarlo desde otro archivo (`app.js`).

```
app.js  ──usa──▶  pokeapi.service.js  ──fetch──▶  PokéAPI
(muestra los datos)   (habla con la API)          (el servidor)
```

## Cómo ejecutarlo

Necesitas Node 18 o superior. Desde la raíz del curso:

```bash
cd 04-apis/actividad-2
node app.js
```

| Archivo | Qué hace |
|---|---|
| [package.json](package.json) | Activa `import` / `export` con `"type": "module"` |
| [pokeapi.service.js](pokeapi.service.js) | Las consultas a PokéAPI |
| [rickandmorty.service.js](rickandmorty.service.js) | Reto: las consultas a Rick and Morty |
| [app.js](app.js) | Usa los dos services y muestra los resultados |

---

## Paso 1: `package.json`

```json
{
  "name": "actividad-2",
  "type": "module"
}
```

`"type": "module"` le dice a Node que los archivos `.js` de esta carpeta usan `import` y `export`. Sin esta línea, según la versión de Node, verás una advertencia o el error `Cannot use import statement outside a module`.

---

## Pasos 2 a 4: el service

```js
const BASE_URL = "https://pokeapi.co/api/v2";

async function pedir(ruta) {
  const respuesta = await fetch(BASE_URL + ruta);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}`);
  }
  return respuesta.json();
}

export function obtenerPokemon(nombre) {
  return pedir(`/pokemon/${nombre}`);
}

export function listarPokemon(limite = 10) {
  return pedir(`/pokemon?limit=${limite}`);
}

export function obtenerTipo(tipo) {
  return pedir(`/type/${tipo}`);
}
```

**`pedir(ruta)`** es el corazón del service. Hace los tres pasos de la Actividad 1 (`fetch` → revisar `ok` → `json()`) **una sola vez**, y las demás funciones la reutilizan. Sin ella, tendrías que repetir esos pasos en cada función.

- **No se exporta**, así que es privada: solo existe dentro de este archivo. `app.js` no puede usarla, y tampoco la necesita.
- **`BASE_URL`** guarda la parte fija de todas las URLs. Si la API cambia de dirección, o cuando conectes tu propia API, solo cambias esta línea.

**`throw new Error(...)`** es la diferencia más importante con la Actividad 1. Allí, si había un error, el mismo archivo mostraba el mensaje con `console.log`. Ahora el service no muestra nada: **lanza el error** y deja que quien lo usa decida qué hacer. Un service no sabe si sus datos terminan en la consola, en una página web o en otro lado, así que no le toca mostrar mensajes.

`throw` hace que la promesa que devuelve `pedir` quede **rechazada**. Por eso, en `app.js`, el error se atrapa con `try / catch`.

**Las funciones exportadas** son muy cortas: cada una solo arma su ruta y llama a `pedir`.

| Función | Ruta | Qué devuelve la API |
|---|---|---|
| `obtenerPokemon("pikachu")` | `/pokemon/pikachu` | `{ name, height, weight, types, … }` |
| `listarPokemon(5)` | `/pokemon?limit=5` | `{ count, results: [{ name, url }] }` |
| `obtenerTipo("fire")` | `/type/fire` | `{ name, pokemon: [{ pokemon: { name, url } }] }` |

`limite = 10` es un **valor por defecto**: si llamas a `listarPokemon()` sin argumento, usa 10.

> ¿Por qué `return pedir(...)` y no `return await pedir(...)`? `pedir` ya devuelve una promesa, y la función simplemente la pasa hacia afuera. Quien la llama es quien hace el `await`.

---

## Pasos 5 y 6: `app.js`

```js
import { obtenerPokemon, listarPokemon, obtenerTipo } from "./pokeapi.service.js";

try {
  const pokemon = await obtenerPokemon("pikachu");
  const tipos = pokemon.types.map((t) => t.type.name);
  console.log(`${pokemon.name}: ${pokemon.height / 10} m, ${pokemon.weight / 10} kg, tipo ${tipos.join(", ")}`);
} catch (error) {
  console.log("No se pudo obtener el Pokémon:", error.message);
}
```

- **`import { ... } from "./pokeapi.service.js"`** trae las funciones exportadas. La ruta empieza con `./` (misma carpeta) e incluye `.js`.
- **En `app.js` no hay ningún `fetch`.** Solo pide datos al service y los muestra. Si mañana PokéAPI cambia, solo se modifica el service.
- **`await` sin función `async`**: en un módulo (`"type": "module"`) se puede usar `await` directamente, sin envolverlo en `async function main()`. Se llama *top-level await*.
- **Un `try / catch` por consulta**: así, si una falla, las demás se siguen ejecutando.
- **`error.message`** es el texto que el service puso en `new Error(...)`, en este caso `"Error 404"`.

Para la lista y el tipo, la respuesta trae arrays que hay que recorrer:

```js
const lista = await listarPokemon(5);
lista.results.forEach((p, i) => console.log(`${i + 1}. ${p.name}`));

const tipo = await obtenerTipo("fire");
const nombres = tipo.pokemon.slice(0, 5).map((p) => p.pokemon.name);
```

En el tipo, cada elemento es `{ pokemon: { name, url } }`, por eso se escribe `p.pokemon.name`. `slice(0, 5)` toma solo los primeros 5 para no llenar la consola.

---

## Reto: un segundo service

[rickandmorty.service.js](rickandmorty.service.js) tiene **exactamente la misma estructura**: `BASE_URL`, `pedir()` y funciones exportadas. Solo cambian la URL y las rutas.

```js
const BASE_URL = "https://rickandmortyapi.com/api";
// ...pedir() igual...

export function obtenerPersonaje(id) {
  return pedir(`/character/${id}`);
}

export function buscarPersonajes(nombre) {
  return pedir(`/character/?name=${nombre}`);
}
```

Y se usa desde el mismo `app.js`, con otro `import`:

```js
import { obtenerPersonaje, buscarPersonajes } from "./rickandmorty.service.js";
```

> `pedir()` quedó repetida en los dos services. Una mejora posible es moverla a un tercer archivo (por ejemplo `http.js`) que reciba la URL completa, y que los dos services la importen.

---

## Lo que verás en la terminal

```
$ node app.js
--- Un Pokémon ---
pikachu: 0.4 m, 6 kg, tipo electric

--- Los primeros 5 Pokémon ---
1. bulbasaur
2. ivysaur
3. venusaur
4. charmander
5. charmeleon

--- Tipo fire ---
Hay 109 Pokémon de este tipo. Algunos: charmander, charmeleon, charizard, vulpix, ninetales

--- Pokémon que no existe ---
No se pudo obtener el Pokémon: Error 404

--- Rick and Morty: personaje 1 ---
Rick Sanchez (Human, Alive)

--- Personajes "smith": 19 en total ---
Morty Smith, Summer Smith, Beth Smith, Jerry Smith, Beth Smith
```

---

## Resumen

| | Actividad 1 | Actividad 2 |
|---|---|---|
| Archivos | Todo en uno | Service + app |
| `fetch` | En cada consulta | Una sola vez, dentro de `pedir()` |
| Errores | Se muestran donde ocurren | El service los **lanza** (`throw`) y `app.js` los **atrapa** (`try / catch`) |
| Cambiar de API | Reescribir el archivo | Cambiar `BASE_URL` y las rutas |

- **El service habla con la API; `app.js` usa los datos.** Cada archivo tiene una sola responsabilidad.
- **`pedir()`** evita repetir `fetch` → `ok` → `json()` en cada función.
- **`export`** decide qué funciones son públicas. Lo que no se exporta queda privado.
- Este mismo service se puede reutilizar en la **Actividad 3** (página web): solo cambia la forma de mostrar los datos, de `console.log` al DOM.
