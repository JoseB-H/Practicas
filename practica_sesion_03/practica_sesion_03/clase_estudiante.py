from clase_persona import Persona

class Estudiante(Persona):
    curso = ''

    def __init__(self, nombre, edad, curso):
        super().__init__(nombre, edad)
        self.curso = curso
    """ sirve para acceder a métodos de la clase padre (la que heredas). como su nomnbre edad y el constructor. """
    def __str__(self):
        return f"{super().__str__()} - {self.curso}"

# estudiante1 = Estudiante("Sandra Villar", 22, "Python")
# print(estudiante1)
