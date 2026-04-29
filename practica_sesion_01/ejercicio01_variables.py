# Ejercicio 01: 
# escribir un programa en Python que solicite el nombre de un alumno 
# y tres calificaciones (enteros). El programa debe calcular y mostrar 
# el promedio (con dos decimales) con el siguiente formato: 
# (ejemplo) “Juan, su promedio es: 16.50”

for nombres in range(1, 4):
    nombre = input(f"Ingrese el nombre del alumno {nombres}: ")
    total = 0
    notas = []
    
    for i in range(1, 4):
        nota = int(input(f"Ingrese la nota {i} de {nombre}: "))
        notas.append(nota)
        total += nota
        
    promedio = total / 3
    print(f"{nombre}, su promedio es {promedio:.2f}")


"""
total = 0
for nombres in ranbe(1, 4):
    nombre = input(f"Ingrese el nombre del alumno {nombres}: ")
    for notas in range(1, 4):
        nota = int(input(f"Ingrese la nota {notas} de {nombre}: "))
        total += nota

        print(f"{nombre}, su promedio es {promedio}")
        print(f"{nombre}, su promedio es " + "{0:.2f}".format(promedio))
        print(f"{nombre}, su promedio es {promedio:.2f}")
        print(f"{nombre}, su promedio es %.2f" % promedio)

"""


