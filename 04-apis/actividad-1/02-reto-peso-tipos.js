// Reto 1: mostrar también el peso y los tipos
const url = "https://pokeapi.co/api/v2/pokemon/pikachu";

async function main() {
  const respuesta = await fetch(url);
  console.log("Código:", respuesta.status);

  const datos = await respuesta.json();

  // PokéAPI da la altura en decímetros y el peso en hectogramos: dividimos entre 10
  console.log("Nombre:", datos.name);
  console.log("Altura:", datos.height / 10, "m");
  console.log("Peso:", datos.weight / 10, "kg");

  // types es un array de objetos: [{ slot: 1, type: { name: "electric", url: "..." } }]
  const tipos = datos.types.map((t) => t.type.name);
  console.log("Tipos:", tipos.join(", "));
}

main();
