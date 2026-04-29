"""
combustible = -1
total = 0
while combustible != 0:
    cantidad = float(input("Ingrese la cantidad de combustible: "))

    if cantidad == 0:
        print("No se ha ingresado combustible.")
        break
    elif cantidad < 0:
        print("Cantidad inválida. Por favor, ingrese un valor positivo.")
    else:
        combustible = cantidad
        print(f"Cantidad de combustible ingresada: {combustible}")
        total += combustible
print(f"Total de combustible ingresado: {total}")
"""


galones = int(input("Ingrese la cantidad de galones disponibles: "))

while galones > 0:
    combustible = int(input("Ingrese la cantidad de combustible a consumir: "))
    
    if combustible < 0:
        print("No se puede ingresar cosas negativas.")
        continue
    galones -= combustible
    if combustible > 0:
        print(f"Galones restantes: {galones}")
    else:
        galones -= combustible

print(f"SIn combustible, no se puede continuar.")
print(f"Ya no avanzamos más.")


