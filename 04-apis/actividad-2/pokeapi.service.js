// pokeapi.service.js
// Todo lo que habla con PokéAPI está aquí. Quien use este archivo no necesita saber de fetch.

const BASE_URL = "https://pokeapi.co/api/v2";

// Función privada (no se exporta): hace la petición, revisa el código de estado y convierte a JSON
async function pedir(ruta) {
  const respuesta = await fetch(BASE_URL + ruta);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}`);
  }
  return respuesta.json();
}

// Un Pokémon por nombre o número
export function obtenerPokemon(nombre) {
  return pedir(`/pokemon/${nombre}`);
}

// Una lista de Pokémon. La respuesta trae { count, next, previous, results: [{ name, url }] }
export function listarPokemon(limite = 10) {
  return pedir(`/pokemon?limit=${limite}`);
}

// Un tipo (fire, water, grass…). La respuesta trae { name, pokemon: [{ pokemon: { name, url } }] }
export function obtenerTipo(tipo) {
  return pedir(`/type/${tipo}`);
}
