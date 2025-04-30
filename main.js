// Clases para el sistema de árboles binarios
class Nodo {
    constructor(dato) {
      this.dato = dato;
      this.izquierda = null;
      this.derecha = null;
    }
  }
  
  class ArbolBinario {
    constructor(campoBusqueda) {
      this.raiz = null;
      this.campoBusqueda = campoBusqueda;
    }
  
    insertar(dato) {
      this.raiz = this._insertar(this.raiz, dato);
    }
  
    _insertar(nodo, dato) {
      if (nodo === null) {
        return new Nodo(dato);
      }
  
      const valorActual = nodo.dato[this.campoBusqueda];
      const valorNuevo = dato[this.campoBusqueda];
  
      if (valorNuevo < valorActual) {
        nodo.izquierda = this._insertar(nodo.izquierda, dato);
      } else if (valorNuevo > valorActual) {
        nodo.derecha = this._insertar(nodo.derecha, dato);
      }
  
      return nodo;
    }
  
    buscar(valor) {
      return this._buscar(this.raiz, valor);
    }
  
    _buscar(nodo, valor) {
      if (nodo === null) return null;
  
      const valorNodo = nodo.dato[this.campoBusqueda];
  
      if (valor === valorNodo) return nodo.dato;
      if (valor < valorNodo) return this._buscar(nodo.izquierda, valor);
      return this._buscar(nodo.derecha, valor);
    }
  
    recorrerInOrder(callback) {
      this._inOrder(this.raiz, callback);
    }
  
    _inOrder(nodo, callback) {
      if (nodo !== null) {
        this._inOrder(nodo.izquierda, callback);
        callback(nodo.dato);
        this._inOrder(nodo.derecha, callback);
      }
    }
  }
  
  // Estructuras de datos adaptadas
  const arbolLibrosPorCodigo = new ArbolBinario('codigo');
  const arbolLibrosPorTitulo = new ArbolBinario('titulo');
  const arbolUsuarios = new ArbolBinario('id');
  
  // Arrays originales (se mantienen para compatibilidad con tu HTML)
  const libros = []; 
  const usuarios = []; 
  const prestamos = []; 
  const librosPrestados = []; 
  const reservas = []; 
  
  // Funciones para mostrar/ocultar secciones (sin cambios)
  function mostrarSeccion(seccionId) {
      document.querySelectorAll('.seccion').forEach(seccion => {
          seccion.style.display = 'none';
      });
      document.getElementById(seccionId).style.display = 'block';
  }
  
  // Funciones para Libros (adaptadas para usar árboles)
  function agregarLibro() {
      const titulo = document.getElementById('titulo').value.trim();
      const autor = document.getElementById('autor').value.trim();
      const codigo = document.getElementById('codigo').value.trim();
  
      if (!titulo || !autor || !codigo) {
          alert('Por favor complete todos los campos del libro');
          return;
      }
  
      if (isNaN(codigo) || codigo === '') {
          alert('El código debe ser un número válido');
          return;
      }
  
      const codigoNumerico = Number(codigo);
      if (!Number.isInteger(codigoNumerico)){
          alert('El código debe ser un número entero');
          return;
      }
      
      if (codigoNumerico <= 0) {
          alert('El código debe ser un número positivo');
          return;
      }
  
      // Búsqueda más eficiente con árbol
      if (arbolLibrosPorCodigo.buscar(codigoNumerico)) {
          alert('Este código de libro ya existe en el sistema');
          return;
      }
  
      if (titulo.length < 3) {
          alert('El título debe tener al menos 3 caracteres');
          return;
      }
  
      if (autor.length < 3) {
          alert('El autor debe tener al menos 3 caracteres');
          return;
      }
  
      const libro = {
          titulo,
          autor,
          codigo: codigoNumerico,
          estado: "disponible"
      };
      
      // Insertar en ambas estructuras
      libros.push(libro);
      arbolLibrosPorCodigo.insertar(libro);
      arbolLibrosPorTitulo.insertar(libro);
      
      actualizarListaLibros();
      limpiarFormularioLibros();
      alert('Libro agregado con éxito');
  }
  
  function buscarLibro() {
      const codigo = document.getElementById('codigo').value;
      // Búsqueda más eficiente con árbol
      const libroEncontrado = arbolLibrosPorCodigo.buscar(Number(codigo));
      
      if (libroEncontrado) {
          alert(`Libro encontrado:\nTítulo: ${libroEncontrado.titulo}\nAutor: ${libroEncontrado.autor}\nEstado: ${libroEncontrado.estado}`);
      } else {
          alert('Libro no encontrado \nPor favor ingresa el código o no existe');
      }
  }
  
  function actualizarListaLibros() {
      const lista = document.getElementById('lista-libros');
      lista.innerHTML = '';
      
      // Recorrido in-order para mostrar ordenados por título
      arbolLibrosPorTitulo.recorrerInOrder(libro => {
          const libroElement = document.createElement('div');
          libroElement.className = `libro estado-${libro.estado}`;
          libroElement.innerHTML = `
              <h3>${libro.titulo}</h3>
              <p><strong>Autor:</strong> ${libro.autor}</p>
              <p><strong>Codigo:</strong> ${libro.codigo}</p>
              <p><strong>Estado:</strong> <span class="estado-${libro.estado}">${libro.estado}</span></p>
          `;
          lista.appendChild(libroElement);
      });
  }
  
  // Funciones para Usuarios (adaptadas para usar árboles)
  function agregarUsuario() {
      const nombre = document.getElementById('nombre').value.trim();
      const idUsuario = document.getElementById('idUsuario').value.trim();
  
      if (!nombre || !idUsuario) {
          alert('Por favor complete todos los campos del usuario');
          return;
      }
  
      if (isNaN(idUsuario)) {
          alert('El ID de usuario debe ser un número');
          return;
      }
  
      const idNumerico = Number(idUsuario);
      if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
          alert('El ID de usuario debe ser un número entero positivo');
          return;
      }
  
      if (nombre.length < 3) {
          alert('El nombre debe tener al menos 3 caracteres');
          return;
      }
  
      // Búsqueda más eficiente con árbol
      if (arbolUsuarios.buscar(idNumerico)) {
          alert('Este ID de usuario ya existe en el sistema');
          return;
      }
  
      const usuario = {
          nombre,
          id: idNumerico
      };
      
      // Insertar en ambas estructuras
      usuarios.push(usuario);
      arbolUsuarios.insertar(usuario);
      
      actualizarListaUsuarios();
      limpiarFormularioUsuarios();
      alert('Usuario registrado con éxito');
  }
  
  function buscarUsuario() {
      const idUsuario = document.getElementById('idUsuario').value;
      // Búsqueda más eficiente con árbol
      const usuarioEncontrado = arbolUsuarios.buscar(Number(idUsuario));
      
      if (usuarioEncontrado) {
          alert(`Usuario encontrado:\nNombre: ${usuarioEncontrado.nombre}\nID: ${usuarioEncontrado.id}`);
      } else {
          alert('Usuario no encontrado \n Por favor ingresa el Id o usuario no existe');
      }
  }
  
  function actualizarListaUsuarios() {
      const lista = document.getElementById('lista-usuarios');
      lista.innerHTML = '';
      
      // Recorrido in-order para mostrar ordenados por ID
      arbolUsuarios.recorrerInOrder(usuario => {
          const usuarioElement = document.createElement('div');
          usuarioElement.className = 'usuario';
          usuarioElement.innerHTML = `
              <h3>${usuario.nombre}</h3>
              <p><strong>ID:</strong> ${usuario.id}</p>
          `;
          lista.appendChild(usuarioElement);
      });
  }
  
  // Funciones para Préstamos (sin cambios en la lógica, solo adaptadas para usar árboles)
  function realizarPrestamo() {
      const idUsuario = document.getElementById('idPrestamo').value;
      const codigo = document.getElementById('codigoPrestamo').value;
      
      const usuario = arbolUsuarios.buscar(Number(idUsuario));
      const libro = arbolLibrosPorCodigo.buscar(Number(codigo));
      
      if (!usuario) {
          alert('Usuario no encontrado');
          return;
      }
      
      if (!libro) {
          alert('Libro no encontrado');
          return;
      }
      
      if (libro.estado === 'prestado') {
          alert('El libro ya está prestado');
          return;
      }
      
      libro.estado = 'prestado';
      
      const prestamo = {
          idUsuario: usuario.id,
          codigo: libro.codigo,
          fechaPrestamo: new Date().toLocaleDateString()
      };
      
      prestamos.push(prestamo);
      librosPrestados.push(libro);
      
      actualizarListaLibros();
      actualizarListaPrestamos();
      limpiarFormularioPrestamos();
      
      alert(`Préstamo realizado con éxito a ${usuario.nombre}`);
  }
  
  function devolverLibro() {
      const codigo = document.getElementById('codigoPrestamo').value;
      const libro = arbolLibrosPorCodigo.buscar(Number(codigo));
      
      if (!libro) {
          alert('Libro no encontrado');
          return;
      }
      
      if (libro.estado === 'disponible') {
          alert('Este libro ya está disponible');
          return;
      }
      
      libro.estado = 'disponible';
      
      const prestamo = prestamos.find(p => p.codigo === libro.codigo && !p.fechaDevolucion);
      if (prestamo) {
          prestamo.fechaDevolucion = new Date().toLocaleDateString();
      }
      
      const index = librosPrestados.findIndex(l => l.codigo === libro.codigo);
      if (index !== -1) {
          librosPrestados.splice(index, 1);
      }
      
      actualizarListaLibros();
      actualizarListaPrestamos();
      limpiarFormularioPrestamos();
      
      alert('Libro devuelto con éxito');
  }
  
  // Resto de funciones auxiliares (sin cambios)
  function actualizarListaPrestamos() {
      const lista = document.getElementById('lista-prestamos');
      lista.innerHTML = '';
      
      prestamos.forEach(prestamo => {
          const usuario = arbolUsuarios.buscar(prestamo.idUsuario);
          const libro = arbolLibrosPorCodigo.buscar(prestamo.codigo);
          
          const prestamoElement = document.createElement('div');
          prestamoElement.className = 'prestamo';
          prestamoElement.innerHTML = `
              <h3>${libro ? libro.titulo : 'Libro no encontrado'}</h3>
              <p><strong>Prestado a:</strong> ${usuario ? usuario.nombre : 'Usuario no encontrado'}</p>
              <p><strong>Fecha préstamo:</strong> ${prestamo.fechaPrestamo}</p>
              <p><strong>Fecha devolución:</strong> ${prestamo.fechaDevolucion || 'Pendiente'}</p>
          `;
          lista.appendChild(prestamoElement);
      });
  }
  
  function limpiarFormularioLibros() {
      document.getElementById('titulo').value = '';
      document.getElementById('autor').value = '';
      document.getElementById('codigo').value = '';
  }
  
  function limpiarFormularioUsuarios() {
      document.getElementById('nombre').value = '';
      document.getElementById('idUsuario').value = '';
  }
  
  function limpiarFormularioPrestamos() {
      document.getElementById('idPrestamo').value = '';
      document.getElementById('codigoPrestamo').value = '';
  }
  
  // Inicialización (adaptada para usar árboles)
  document.addEventListener('DOMContentLoaded', () => {
      const datosIniciales = [
          { titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', codigo: 1, estado: 'disponible' },
          { titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', codigo: 2, estado: 'disponible' },
          { titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', codigo: 3, estado: 'disponible' }
      ];
      
      const usuariosIniciales = [
          { nombre: 'Jhon Rivera', id: 1 },
          { nombre: 'Maria Rodriguez', id: 2 },
      ];
      
      // Insertar datos iniciales en ambas estructuras
      datosIniciales.forEach(libro => {
          libros.push(libro);
          arbolLibrosPorCodigo.insertar(libro);
          arbolLibrosPorTitulo.insertar(libro);
      });
      
      usuariosIniciales.forEach(usuario => {
          usuarios.push(usuario);
          arbolUsuarios.insertar(usuario);
      });
      
      actualizarListaLibros();
      actualizarListaUsuarios();
  });