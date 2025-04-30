class Libro:
    def __init__(self, isbn, titulo, autor):
        self.isbn = isbn
        self.titulo = titulo
        self.autor = autor
        self.disponible = True

    def __str__(self):
        estado = "Disponible" if self.disponible else "Prestado"  
        return f"{self.isbn} - {self.titulo} ({self.autor}) ({estado})"

class Usuario:
    def __init__(self, id_usuario, nombre):
        self.id = id_usuario
        self.nombre = nombre
        self.libros_prestados = []

    def __str__(self):
        return f"{self.id} - {self.nombre} ({len(self.libros_prestados)} libros prestados)"

class NodoLibro:
    def __init__(self, libro):
        self.libro = libro
        self.izquierda = None
        self.derecha = None

class NodoUsuario:
    def __init__(self, usuario):
        self.usuario = usuario
        self.izquierda = None
        self.derecha = None

class ArbolLibros:
    def __init__(self):
        self.raiz = None

    def insertar(self, libro):
        self.raiz = self._insertar_rec(self.raiz, libro)

    def _insertar_rec(self, nodo, libro):
        if nodo is None:
            return NodoLibro(libro)
        
        if libro.titulo.lower() < nodo.libro.titulo.lower():
            nodo.izquierda = self._insertar_rec(nodo.izquierda, libro)
        else:
            nodo.derecha = self._insertar_rec(nodo.derecha, libro)
        return nodo

    def buscar(self, titulo):
        return self._buscar_rec(self.raiz, titulo.lower())

    def _buscar_rec(self, nodo, titulo):
        if nodo is None:
            return None
        if titulo == nodo.libro.titulo.lower():
            return nodo.libro
        elif titulo < nodo.libro.titulo.lower():
            return self._buscar_rec(nodo.izquierda, titulo)
        else:
            return self._buscar_rec(nodo.derecha, titulo)

    def mostrar_inorder(self):
        self._inorder_rec(self.raiz)

    def _inorder_rec(self, nodo):
        if nodo:
            self._inorder_rec(nodo.izquierda)
            print(nodo.libro)
            self._inorder_rec(nodo.derecha)

class ArbolUsuarios:
    def __init__(self):
        self.raiz = None

    def insertar(self, usuario):
        self.raiz = self._insertar_rec(self.raiz, usuario)

    def _insertar_rec(self, nodo, usuario):
        if nodo is None:
            return NodoUsuario(usuario)
        
        if usuario.id < nodo.usuario.id:
            nodo.izquierda = self._insertar_rec(nodo.izquierda, usuario)
        else:
            nodo.derecha = self._insertar_rec(nodo.derecha, usuario)
        return nodo

    def buscar(self, id_usuario):
        return self._buscar_rec(self.raiz, id_usuario)

    def _buscar_rec(self, nodo, id_usuario):
        if nodo is None:
            return None
        if id_usuario == nodo.usuario.id:
            return nodo.usuario
        elif id_usuario < nodo.usuario.id:
            return self._buscar_rec(nodo.izquierda, id_usuario)
        else:
            return self._buscar_rec(nodo.derecha, id_usuario)

class Biblioteca:
    def __init__(self):
        self.libros = ArbolLibros()
        self.usuarios = ArbolUsuarios()

    def registrar_usuario(self, id_usuario, nombre):
        if self.usuarios.buscar(id_usuario):
            print("Error: ID de usuario ya existe")
            return False
        self.usuarios.insertar(Usuario(id_usuario, nombre))
        print("Usuario registrado exitosamente")
        return True

    def agregar_libro(self, isbn, titulo, autor):
        # Verificar si el libro ya existe (podríamos buscar por ISBN si lo agregamos)
        self.libros.insertar(Libro(isbn, titulo, autor))
        print("Libro agregado exitosamente")
        return True

    def prestar_libro(self, id_usuario, titulo_libro):
        usuario = self.usuarios.buscar(id_usuario)
        libro = self.libros.buscar(titulo_libro)
        
        if not usuario:
            print("Error: Usuario no encontrado")
            return False
        if not libro:
            print("Error: Libro no encontrado")
            return False
        if not libro.disponible:
            print("Error: Libro no disponible")
            return False
            
        libro.disponible = False
        usuario.libros_prestados.append(libro)
        print(f"Libro '{libro.titulo}' prestado a {usuario.nombre}")
        return True

    def devolver_libro(self, id_usuario, titulo_libro):
        usuario = self.usuarios.buscar(id_usuario)
        libro = self.libros.buscar(titulo_libro)
        
        if not usuario:
            print("Error: Usuario no encontrado")
            return False
        if not libro:
            print("Error: Libro no encontrado")
            return False
        if libro.disponible:
            print("Error: Este libro no estaba prestado")
            return False
            
        libro.disponible = True
        usuario.libros_prestados = [l for l in usuario.libros_prestados if l.titulo != titulo_libro]
        print(f"Libro '{libro.titulo}' devuelto por {usuario.nombre}")
        return True

def main():
    biblioteca = Biblioteca()
    
    # Datos de prueba
    biblioteca.agregar_libro("001", "Cien años de soledad", "Gabriel García Márquez")
    biblioteca.agregar_libro("002", "El principito", "Antoine de Saint-Exupéry")
    biblioteca.agregar_libro("003", "1984", "George Orwell")
    
    while True:
        print("\n=== SISTEMA DE BIBLIOTECA ===")
        print("1. Registrar nuevo usuario")
        print("2. Agregar nuevo libro")
        print("3. Prestar libro")
        print("4. Devolver libro")
        print("5. Mostrar todos los libros")
        print("6. Salir")
        
        opcion = input("Seleccione una opción: ")
        
        if opcion == "1":
            id_usuario = input("ID del usuario: ")
            nombre = input("Nombre del usuario: ")
            biblioteca.registrar_usuario(id_usuario, nombre)
            
        elif opcion == "2":
            isbn = input("ISBN del libro: ")
            titulo = input("Título del libro: ")
            autor = input("Autor del libro: ")
            biblioteca.agregar_libro(isbn, titulo, autor)
            
        elif opcion == "3":
            id_usuario = input("ID del usuario: ")
            titulo = input("Título del libro a prestar: ")
            biblioteca.prestar_libro(id_usuario, titulo)
            
        elif opcion == "4":
            id_usuario = input("ID del usuario: ")
            titulo = input("Título del libro a devolver: ")
            biblioteca.devolver_libro(id_usuario, titulo)
            
        elif opcion == "5":
            print("\n=== CATÁLOGO DE LIBROS ===")
            biblioteca.libros.mostrar_inorder()
            
        elif opcion == "6":
            print("Saliendo del sistema...")
            break
            
        else:
            print("Opción no válida. Intente nuevamente.")

if __name__ == "__main__":
    main()