# Ejercicio 01
# Crear un array NumPy y realizar operaciones de suma, resta y promedio

import numpy as np

# Creamos un array de 10 números aleatorios entre 1-100
arr_aleatorios = np.random.randint(1, 100, 10)
print("arr_aleatorios: ", arr_aleatorios)

# Sumando todos los valores del arreglo
sum = np.sum(arr_aleatorios)
print("Suma total: ", sum)

# Sumando solo los valores de índices pares
arr_indices_pares = arr_aleatorios[0:len(arr_aleatorios):2]
print("Suma de valores en índices pares: ", \
      arr_indices_pares, "=", np.sum(arr_indices_pares))

# Hallamos el promedio de los valores
print("Valor promedio:", np.mean(arr_aleatorios))

# Creamos un segundo array de 10 números aleatorios entre 1-100
arr_aleatorios2 = np.random.randint(1, 100, 10)
print("arr_aleatorios2: ", arr_aleatorios2)

# Sumando los arreglos
print("Suma de arreglos: ", arr_aleatorios + arr_aleatorios2)

# Restando los arreglos
print("Resta de arreglos: ", arr_aleatorios - arr_aleatorios2)

# Multiplicando los arreglos
print("Producto de arreglos: ", arr_aleatorios * arr_aleatorios2)
