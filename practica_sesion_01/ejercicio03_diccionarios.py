dicProductos = {'Teclado': 128.50, 'Monitor': 368.00, 'Mouse': 58.7, 'Cámara Web': 284.30}
print(dicProductos)

dicProductos.update({'Mouse': 62.53})  # actualizamos un elemento
dicProductos.update({'Impresora': 690.20})  # agregamos un elemento
print(dicProductos)

print(dicProductos['Cámara Web'])  # accedemos a los valores mediante la clave
print(dicProductos.get("Monitor"))

print(dicProductos.pop('Teclado'))
print(dicProductos)

ultimoItem = dicProductos.popitem()
print(f"{ultimoItem[0]} = {ultimoItem[1]}")

print(dicProductos.keys())
print(dicProductos.values())

# Imprimimos las claves del diccionario
for clave in dicProductos.keys():
    print(clave)

# Imprimimos los valores del diccionario
for valor in dicProductos.values():
    print(valor)

# Accedememos a los elementos (tuplas)
for elemento in dicProductos.items():
    print(elemento)  # tupla
    print(elemento[0])  # clave
    print(elemento[1])  # valor
