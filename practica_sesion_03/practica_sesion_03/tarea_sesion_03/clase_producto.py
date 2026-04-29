class Producto(object):
    def __init__(self, codigo, nombre, precio, stock):
        self.__codigo = codigo
        self.__nombre = nombre
        self.__precio = precio
        self.__stock = stock

    @property
    def codigo(self):
        return self.__codigo
    
    @codigo.setter
    def codigo(self, codigo):
        self.__codigo = codigo

    @property
    def nombre(self):
        return self.__nombre
    
    @nombre.setter
    def nombre(self, nombre):
        self.__nombre = nombre

    @property
    def precio(self):
        return self.__precio
    
    @precio.setter
    def precio(self, precio):
        if (precio > 0):
            self.__precio = precio

    @property
    def stock(self):
        return self.__stock
    
    @stock.setter
    def stock(self, stock):
        if (stock > 0):
            self.__stock = stock

    def __str__(self):
        return f"{self.__codigo}: {self.__nombre} " + \
            f"[S/.{self.__precio}] ({self.__stock})"
