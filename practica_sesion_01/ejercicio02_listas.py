listaPaises = ['Perú', 'Argentina', 'Chile', 'Brasil', 'Colombia', 'Venezuela']

print(listaPaises)
print("Fin del recorrido")
listaPaises.append('Bolivia')
listaPaises.append('Cuba')
print("Fin del recorrido")
print(listaPaises)
print("Fin del recorrido")
listaPaises.insert(2, 'Ecuador')
listaPaises.insert(2, 'Ecuador')  # Pueden repetirse los elementos
listaPaises.insert(5, 'El Salvador')
print(listaPaises)
print("Fin del recorrido")
listaPaises.extend(['México', 'Estados Unidos', 'Canadá'])
"""sirve para agregar varios elementos de una colección (lista, tupla, etc.) a la lista"""
print(listaPaises)
print("Fin del recorrido")
listaPaises.sort()
print(listaPaises)
"""sirve para ordenar la misma lista por default de menor a mayor, si queremos ordenarla de mayor a menor se puede usar el argumento reverse=True"""
print("Fin del recorrido")
listaPaises.reverse()
print(listaPaises)
print("Fin del recorrido")
listaPaises.remove('Chile')
listaPaises.remove('Estados Unidos')
# listaPaises.remove('Francia') # Error! elemento no existe
print(listaPaises)
print("Fin del recorrido")
print(len(listaPaises))
"""cantidad de elementos de la lista"""
# Hacemos uso de bucles para recorrer la lista
# Usamos la estructura while
i = 0
while i < len(listaPaises):
    print(listaPaises[i])
    i += 1
print("Fin del recorrido")
# Recorrido de colección
for pais in listaPaises:
    print(pais)
print("Fin del recorrido")
# Recorrido usando un rango
for i in range(0, len(listaPaises)):
    print(listaPaises[i])
print("Fin del recorrido")
# Formateando la salida
print("Lista numerada")
for idx in range(0, len(listaPaises)):
    print(f"{idx + 1}. {listaPaises[idx]}")
