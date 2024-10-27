let lista;
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch("../data.json")
  .then((resp) => {
    if (!resp.ok) {
      console.log("Error al cargar el archivo json.");
    } else {
      return resp.json();
    }
  })
  .then((data) => {
    lista = data;
  })
  .catch((error) => {
    console.log("Hubo un problema con el fetch.", error);
  });

function mostrarLista(list) {
  const listaDiv = document.getElementById("lista");
  listaDiv.innerHTML = "";

  list.forEach((element) => {
    let div = document.createElement("div");
    div.innerHTML = `
      <ul>
        <li>${element.nombre} - Precio: $${element.precio}</li>
        <button onclick="agregarAlCarrito(${element.id})">Agregar</button>
      </ul>
    `;
    listaDiv.append(div);
  });

  document.getElementById("load-button").style.display = "none";
  actualizarCarrito();
}

function agregarAlCarrito(id) {
  const producto = lista.find((item) => item.id === id);
  const itemEnCarrito = carrito.find((item) => item.id === id);

  if (itemEnCarrito) {
    itemEnCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarrito();
}

function eliminarDelCarrito(id) {
  const index = carrito.findIndex((item) => item.id === id);

  if (index !== -1) {
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad--;
    } else {
      carrito.splice(index, 1);
    }
  }

  guardarCarrito();
  actualizarCarrito();
}

function actualizarCarrito() {
  const carritoDiv = document.getElementById("carrito");
  carritoDiv.innerHTML = "<h3>Carrito de Compras</h3>";

  carrito.forEach((item) => {
    let div = document.createElement("div");
    div.innerHTML = `
      <p>${item.nombre} - Precio: $${item.precio} - Cantidad: ${item.cantidad}</p>
      <button onclick="eliminarDelCarrito(${item.id})">Quitar</button>
    `;
    carritoDiv.append(div);
  });

  actualizarTotal();
}

function actualizarTotal() {
  const totalDiv = document.getElementById("total");
  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  totalDiv.innerHTML = `<h3>Total: $${total}</h3>`;
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
