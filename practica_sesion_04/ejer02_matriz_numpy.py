# Ejercicio 02
# Usa NumPy para generar una matriz de números aleatorios y calcular su media.

import numpy as np

# Creamos una matriz 4x4 de enteros entre 1-100
matriz = np.random.randint(1, 100, (4, 4))
print(matriz)

# Media de toda la matriz
print("Media de la matriz:", np.mean(matriz))

# Media por columna
print("Media por columna:", np.mean(matriz, axis = 0))

# Media por fila
print("Media por fila:", np.mean(matriz, axis = 1))
