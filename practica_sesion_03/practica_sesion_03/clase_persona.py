class Persona:
    # _nombre = ""
    # _edad = 0

    # protegemos el atributo edad para que solo 
    # se pueda modificar a través de métodos de 
    # la clase.
    @property
    def nombre(self):
        return self.__nombre

    @nombre.setter
    def nombre(self, valor):
        if len(valor) > 0:
            self.__nombre = valor
        else:
            raise ValueError("Nombre no válido")

    @property
    def edad(self):
        return self.__edad
    
    @edad.setter
    def edad(self, valor):
        if valor >= 0:
            self.__edad = valor
        else:
            raise ValueError("La edad debe ser positiva")

    # constructor
    def __init__(self, nombre, edad):
        self.__nombre = nombre
        self.__edad = edad

    def __str__(self):
        return f"{self.__nombre} ({self.__edad})"


# persona1 = Persona("Sandra", 44)
# print(persona1)
# print(persona1.nombre)
# print(persona1.edad)

# persona1.nombre = 'María Teresa'
# persona1.edad = 32
# print(persona1)
# print(persona1.nombre)
# print(persona1.edad)
