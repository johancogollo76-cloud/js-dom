// Reto 2: pedir un Pokémon que no existe. ¿Qué código de estado devuelve?
const url = "https://pokeapi.co/api/v2/pokemon/kaleth";

async function main() {
  const respuesta = await fetch(url);
  console.log("Código:", respuesta.status);
  console.log("¿ok?:", respuesta.ok);
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    console.log("KALETH NOT EXISTE");
    return;
  }

  console.log("Nombre:", datos.name);
}

main();
