# Clasificar edades en categorías usando condicionales (if).

dicCategorias = {'No válido': 0, 'Niño': 0, 'Adolescente': 0, 'Adulto': 0, 'Adulto Mayor': 0}
continuar = True

while continuar:
    nombre = input('Ingrese el nombre de la persona: ')
    edad = int(input('Ingrese una edad: '))

    if edad < 0:
        dicCategorias['No válido'] += 1
    elif edad <= 12:
        dicCategorias['Niño'] += 1
    elif edad <= 17:
        dicCategorias['Adolescente'] += 1
    elif edad <= 64:
        dicCategorias['Adulto'] += 1
    else:
        dicCategorias['Adulto Mayor'] += 1

    continuar = input("Desea ingresar otra edad? s/n: ") == 's'

print("Edades ingresadas clasificadas:")
for categoria in dicCategorias.items():
    print(f'{nombre}: {categoria[0]}: {categoria[1]}')
