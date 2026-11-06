// Reto 3: si la respuesta no es correcta (!respuesta.ok), mostrar un mensaje de error
//
// Prueba con distintos nombres:
//   node 04-reto-manejo-error.js charmander
//   node 04-reto-manejo-error.js pokemonfalso

// process.argv guarda lo que escribes en la terminal; la posición 2 es el primer dato después del archivo
const nombre = process.argv[2] ?? "pikachu";
const url = `https://pokeapi.co/api/v2/pokemon/${nombre}`;

async function main() {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      console.log(`Error ${respuesta.status}: no existe un Pokémon llamado "${nombre}".`);
      return; // salimos sin intentar leer el JSON
    }

    const datos = await respuesta.json();
    const tipos = datos.types.map((t) => t.type.name);

    console.log("Nombre:", datos.name);
    console.log("Altura:", datos.height / 10, "m");
    console.log("Peso:", datos.weight / 10, "kg");
    console.log("Tipos:", tipos.join(", "));
  } catch (error) {
    // Llega aquí si no hay Internet o el servidor no responde
    console.log("No se pudo conectar con la API:", error.message);
  }
}

main();
