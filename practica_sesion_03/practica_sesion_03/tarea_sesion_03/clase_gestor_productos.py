from clase_producto import Producto

class GestorProductos(object):
    def __init__(self):
        self.__lista_productos = []
    
    def agrega_producto(self, nuevo_producto):
        if isinstance(nuevo_producto, Producto):
            self.__lista_productos.append(nuevo_producto)

    def buscar_producto(self, codigo):
        for i in range(len(self.__lista_productos)):
            if self.__lista_productos[i].codigo == codigo:
                return i
        return -1

    def modificar_producto(self, codigo, nuevo_producto):
        indice = self.buscar_producto(codigo)
        if indice >= 0:
            self.__lista_productos[indice] = nuevo_producto

    def remover_producto(self, codigo):
        indice = self.buscar_producto(codigo)
        if indice >= 0:
            del(self.__lista_productos[indice])
    
    def mostrar_productos(self):
        for producto in self.__lista_productos:
            print(producto)
