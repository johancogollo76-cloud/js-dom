// Reto 4: el mismo programa con otra API (Rick and Morty)
//
//   node 05-reto-rick-and-morty.js 1
//   node 05-reto-rick-and-morty.js 9999

const id = process.argv[2] ?? "1";
const url = `https://rickandmortyapi.com/api/character/${id}`;

async function main() {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      console.log(
        `Error ${respuesta.status}: no existe el personaje con id ${id}.`,
      );
      return;
    }

    const personaje = await respuesta.json();
    // console.log(personaje);
    console.log("Nombre:", personaje.name);
    console.log("Estado:", personaje.status);
    console.log("Especie:", personaje.species);
    console.log("Origen:", personaje.origin.name);
    console.log("Aparece en", personaje.episode.length, "episodios");
  } catch (error) {
    console.log("No se pudo conectar con la API:", error.message);
  }
}

main();
