// api.js
const url = "https://pokeapi.co/api/v2/pokemon/pikachu";

async function main() {
  const respuesta = await fetch(url);
  console.log("Código:", respuesta.status);

  const datos = await respuesta.json();
  // console.log("Datos:", datos);
  console.log("Nombre:", datos.name);
  console.log("Altura:", datos.height);
  console.log("HABILIDADES:", datos.abilities[1].ability.name);
}

main();
