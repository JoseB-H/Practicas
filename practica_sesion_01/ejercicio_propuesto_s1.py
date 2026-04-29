# Ejercicio: Crear una lista de nombres y mostrar los que comiencen con una letra específica.

lista_nombres = ['Juan', 'Pedro', 'María', 'Roberto', 'Carla', 'Luis', 'Bernardo', 'Javier', 'Rocío']
continuar = True

while continuar:
    letra = input('Ingrese una letra: ').upper()
    contador = 0
    for nombre in lista_nombres:
        if (nombre.startswith(letra)):
            contador += 1
            print("- " + nombre)
    
    if contador == 0:
        print('No se encontraron nombres con la inicial proporcionada.')
    else:
        print(f'{contador} nombres encontrados.')

    continuar = input("Desea continuar? s/n: ") == 's'

"""
.upper() es para mayuculas 
.lower() es para minusculas
startswith() es para verificar si una cadena comienza con un texto específico
"""
print('Adiós!')
