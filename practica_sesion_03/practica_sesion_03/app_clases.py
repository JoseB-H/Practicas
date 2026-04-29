from clase_persona import Persona
from clase_estudiante import Estudiante

persona = Persona("Felipe Contreras", 28)
print(persona)
persona.nombre = "Felipe Carrasco"
persona.edad = 22
print(persona)

estudiante = Estudiante("Marisela Díaz", 32, "HTML5")
print(estudiante)
estudiante.nombre = "Mariela Díaz"
estudiante.edad = 25
estudiante.curso = "SQL Server"
print(estudiante)
