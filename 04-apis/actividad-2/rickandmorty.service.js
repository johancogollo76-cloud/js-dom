// rickandmorty.service.js (reto)
// La misma estructura que pokeapi.service.js: solo cambian la URL base y las rutas.

const BASE_URL = "https://rickandmortyapi.com/api";

async function pedir(ruta) {
  const respuesta = await fetch(BASE_URL + ruta);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}`);
  }
  return respuesta.json();
}

// Un personaje por id
export function obtenerPersonaje(id) {
  return pedir(`/character/${id}`);
}

// Personajes cuyo nombre contiene el texto. La respuesta trae { info, results: [...] }
export function buscarPersonajes(nombre) {
  return pedir(`/character/?name=${nombre}`);
}
