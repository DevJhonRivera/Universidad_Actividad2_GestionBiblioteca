// Estructuras de datos
const libros = []; // Array para almacenar libros
const usuarios = []; // Array para almacenar usuarios
const prestamos = []; // Array para almacenar préstamos
const librosPrestados = []; // Pila para libros prestados (podría usarse para historial)
const reservas = []; // Cola para reservas de libros

// Funciones para mostrar/ocultar secciones
function mostrarSeccion(seccionId) {
    document.querySelectorAll('.seccion').forEach(seccion => {
        seccion.style.display = 'none';
    });
    document.getElementById(seccionId).style.display = 'block';
}

// Funciones para Libros
function agregarLibro() {
    // Obtener valores
    const titulo = document.getElementById('titulo').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const codigo = document.getElementById('codigo').value.trim();

    // Validar campos vacíos
    if (!titulo || !autor || !codigo) {
        alert('Por favor complete todos los campos del libro');
        return;
    }

    // Validar que el código sea un número válido
    if (isNaN(codigo) || codigo === '') {
        alert('El código debe ser un número válido');
        return;
    }

    // Convertir y validar que sea un número entero positivo
    const codigoNumerico = Number(codigo);
    if (!Number.isInteger(codigoNumerico)){
        alert('El código debe ser un número entero');
        return;
    }
    
    if (codigoNumerico <= 0) {
        alert('El código debe ser un número positivo');
        return;
    }

    // Validar que el código no exista ya en el sistema
    const codigoExistente = libros.some(libro => libro.codigo === codigoNumerico);
    if (codigoExistente) {
        alert('Este código de libro ya existe en el sistema');
        return;
    }

    // Validar longitud mínima del título y autor
    if (titulo.length < 3) {
        alert('El título debe tener al menos 3 caracteres');
        return;
    }

    if (autor.length < 3) {
        alert('El autor debe tener al menos 3 caracteres');
        return;
    }

    // Si todas las validaciones pasan, crear el libro
    const libro = {
        titulo,
        autor,
        codigo: codigoNumerico,
        estado: "disponible"
    };
    
    libros.push(libro);
    actualizarListaLibros();
    limpiarFormularioLibros();
    alert('Libro agregado con éxito');
}

function buscarLibro() {
    const codigo = document.getElementById('codigo').value;
    const libroEncontrado = libros.find(libro => libro.codigo === codigo);
    
    if (libroEncontrado) {
        alert(`Libro encontrado:\nTítulo: ${libroEncontrado.titulo}\nAutor: ${libroEncontrado.autor}\nEstado: ${libroEncontrado.estado}`);
    } else {
        alert(' Libro no encontrado \nPor favor ingresa el codigo o no existe');
    }
}

function actualizarListaLibros() {
    const lista = document.getElementById('lista-libros');
    lista.innerHTML = '';
    
    libros.forEach(libro => {
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

// Funciones para Usuarios
function agregarUsuario() {
    // Obtener y limpiar valores
    const nombre = document.getElementById('nombre').value.trim();
    const idUsuario = document.getElementById('idUsuario').value.trim();

    // Validar campos vacíos
    if (!nombre || !idUsuario) {
        alert('Por favor complete todos los campos del usuario');
        return;
    }

    // Validar que el ID sea un número
    if (isNaN(idUsuario)) {
        alert('El ID de usuario debe ser un número');
        return;
    }

    // Convertir a número y validar que sea entero positivo
    const idNumerico = Number(idUsuario);
    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
        alert('El ID de usuario debe ser un número entero positivo');
        return;
    }

    // Validar longitud mínima del nombre
    if (nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres');
        return;
    }

    // Validar que el ID no exista ya en el sistema
    const idExistente = usuarios.some(usuario => usuario.id === idNumerico);
    if (idExistente) {
        alert('Este ID de usuario ya existe en el sistema');
        return;
    }

    // Si todas las validaciones pasan, crear el usuario
    const usuario = {
        nombre,
        id: idNumerico
    };
    
    usuarios.push(usuario);
    actualizarListaUsuarios();
    limpiarFormularioUsuarios();
    alert('Usuario registrado con éxito');
}

function buscarUsuario() {
    const idUsuario = document.getElementById('idUsuario').value;
    const usuarioEncontrado = usuarios.find(usuario => usuario.id === idUsuario);
    
    if (usuarioEncontrado) {
        alert(`Usuario encontrado:\nNombre: ${usuarioEncontrado.nombre}\nID: ${usuarioEncontrado.id}`);
    } else {
        alert('Usuario no encontrado \n Por favor ingresa el Id o usuario no existe');
    }
}

function actualizarListaUsuarios() {
    const lista = document.getElementById('lista-usuarios');
    lista.innerHTML = '';
    
    usuarios.forEach(usuario => {
        const usuarioElement = document.createElement('div');
        usuarioElement.className = 'usuario';
        usuarioElement.innerHTML = `
            <h3>${usuario.nombre}</h3>
            <p><strong>ID:</strong> ${usuario.id}</p>
        `;
        lista.appendChild(usuarioElement);
    });
}

// Funciones para Préstamos
function realizarPrestamo() {
    const idUsuario = document.getElementById('idPrestamo').value;
    const codigo = document.getElementById('codigoPrestamo').value;
    
    const usuario = usuarios.find(u => u.id === idUsuario);
    const libro = libros.find(l => l.codigo === codigo);
    
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
    
    // Actualizar estado del libro
    libro.estado = 'prestado';
    
    // Registrar préstamo
    const prestamo = {
        idUsuario,
        codigo,
        fechaPrestamo: new Date().toLocaleDateString()
    };
    
    prestamos.push(prestamo);
    librosPrestados.push(libro); // Agregar a la pila de libros prestados
    
    actualizarListaLibros();
    actualizarListaPrestamos();
    limpiarFormularioPrestamos();
    
    alert(`Préstamo realizado con éxito a ${usuario.nombre}`);
}

function devolverLibro() {
    const codigo = document.getElementById('codigoPrestamo').value;
    const libro = libros.find(l => l.codigo === codigo);
    
    if (!libro) {
        alert('Libro no encontrado');
        return;
    }
    
    if (libro.estado === 'disponible') {
        alert('Este libro ya está disponible');
        return;
    }
    
    // Actualizar estado del libro
    libro.estado = 'disponible';
    
    // Buscar y marcar préstamo como devuelto
    const prestamo = prestamos.find(p => p.codigo === codigo && !p.fechaDevolucion);
    if (prestamo) {
        prestamo.fechaDevolucion = new Date().toLocaleDateString();
    }
    
    // Quitar de la pila de libros prestados
    const index = librosPrestados.findIndex(l => l.codigo === codigo);
    if (index !== -1) {
        librosPrestados.splice(index, 1);
    }
    
    actualizarListaLibros();
    actualizarListaPrestamos();
    limpiarFormularioPrestamos();
    
    alert('Libro devuelto con éxito');
}

function actualizarListaPrestamos() {
    const lista = document.getElementById('lista-prestamos');
    lista.innerHTML = '';
    
    prestamos.forEach(prestamo => {
        const usuario = usuarios.find(u => u.id === prestamo.idUsuario);
        const libro = libros.find(l => l.codigo === prestamo.codigo);
        
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

// Funciones auxiliares
function limpiarFormularioLibros() {
    document.getElementById('titulo').value = '';
    document.getElementById('autor').value = '';
    document.getElementById('codigo').value = '';
    document.getElementById('estado').value = 'disponible';
}

function limpiarFormularioUsuarios() {
    document.getElementById('nombre').value = '';
    document.getElementById('idUsuario').value = '';
}

function limpiarFormularioPrestamos() {
    document.getElementById('idPrestamo').value = '';
    document.getElementById('codigoPrestamo').value = '';
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Datos de ejemplo
    libros.push(
        { titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', codigo: '1', estado: 'disponible' },
        { titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', codigo: '2', estado: 'disponible' },
        { titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', codigo: '3', estado: 'disponible' }
    );
    
    usuarios.push(
        { nombre: 'Jhon Rivera', id: '001' },
        { nombre: 'Maria Rodriguez', id: '002' },
    );
    
    actualizarListaLibros();
    actualizarListaUsuarios();
});