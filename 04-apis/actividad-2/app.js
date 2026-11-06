// app.js
// Usa los services y muestra los datos. Aquí no hay ningún fetch.

import { obtenerPokemon, listarPokemon, obtenerTipo } from "./pokeapi.service.js";
import { obtenerPersonaje, buscarPersonajes } from "./rickandmorty.service.js";

// Con "type": "module" se puede usar await fuera de una función (top-level await)

// 1. Un Pokémon
try {
  const pokemon = await obtenerPokemon("pikachu");
  const tipos = pokemon.types.map((t) => t.type.name);
  console.log("--- Un Pokémon ---");
  console.log(`${pokemon.name}: ${pokemon.height / 10} m, ${pokemon.weight / 10} kg, tipo ${tipos.join(", ")}`);
} catch (error) {
  console.log("No se pudo obtener el Pokémon:", error.message);
}

// 2. Una lista de Pokémon
try {
  const lista = await listarPokemon(5);
  console.log("\n--- Los primeros 5 Pokémon ---");
  lista.results.forEach((p, i) => console.log(`${i + 1}. ${p.name}`));
} catch (error) {
  console.log("No se pudo obtener la lista:", error.message);
}

// 3. Un tipo
try {
  const tipo = await obtenerTipo("fire");
  const nombres = tipo.pokemon.slice(0, 5).map((p) => p.pokemon.name);
  console.log(`\n--- Tipo ${tipo.name} ---`);
  console.log(`Hay ${tipo.pokemon.length} Pokémon de este tipo. Algunos: ${nombres.join(", ")}`);
} catch (error) {
  console.log("No se pudo obtener el tipo:", error.message);
}

// 4. Un error a propósito: el service lanza el error y aquí lo atrapamos
try {
  console.log("\n--- Pokémon que no existe ---");
  await obtenerPokemon("pokemonfalso");
} catch (error) {
  console.log("No se pudo obtener el Pokémon:", error.message);
}

// Reto: el mismo app.js usando el service de Rick and Morty
try {
  const rick = await obtenerPersonaje(1);
  console.log("\n--- Rick and Morty: personaje 1 ---");
  console.log(`${rick.name} (${rick.species}, ${rick.status})`);

  const busqueda = await buscarPersonajes("smith");
  const nombres = busqueda.results.slice(0, 5).map((p) => p.name);
  console.log(`\n--- Personajes "smith": ${busqueda.info.count} en total ---`);
  console.log(nombres.join(", "));
} catch (error) {
  console.log("No se pudo consultar Rick and Morty:", error.message);
}
