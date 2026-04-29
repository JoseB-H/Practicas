import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Paso 1. Cargar datos desde un archivo CSV utilizando Pandas.
# 1687 filas
df = pd.read_csv("D:\\UTP\\Material Estandarizado\\Taller Python\\Practica_Python\\practica_sesion_05\\empleados.csv", \
                 dtype = {"telefono": str})
df.info()
# print(df.head())
# print(df.shape)

# Paso 2. Limpiar los datos y realizar análisis exploratorio básico 
# (e.g., calcular promedio, encontrar valores máximos y mínimos).

# 2.1 Limpieza de datos
# Verificar si hay valores nulos o datos inconsistentes
# - Eliminamos las filas que tienen DNI no válidos
#  (existen DNIs con más de 8 caracteres y algunos tienen letras)

df = df[df["dni"].str.match("^\d{8}$")]  # solo obtenemos filas con DNIs válidos -> 1668 filas
# print(df)

# - Eliminamos filas que tienen valores nulos o vacíos en alguno de sus campos
df = df.dropna()  # -> 1574 filas
# print(df)

# Eliminamos filas duplicadas
df = df.drop_duplicates()
# print(df)  # -> 1570 filas

# 2.2 Análisis exploratorio básico
# - Número de registro luego de la limpieza de los datos
print("Registros válidos: ", df.shape[0])

# - Salarios máximo, mínimo y promedio
print("---------------------------------------")
print("Salario máximo: ", df["salario"].max())
print("Salario promedio: ", df["salario"].mean())
print("Salario mínimo: ", df["salario"].min())

print("---------------------------------------")

print("Salario máximo: ", np.max(df["salario"]))
print("Salario promedio: ", np.mean(df["salario"]))
print("Salario mínimo: ", np.min(df["salario"]))
print("---------------------------------------")

# - Cantidad de empleados por sexo
#   a. Forma básica
print("Nro. de empleados hombres: ", len(df[df["sexo"] == 'M']))
print("Nro. de empleados mujeres: ", len(df[df["sexo"] == 'F']))
#   b. Realizando agrupamiento
print(df.groupby("sexo").size().reset_index(name = "nro_empleados"))
#   c. Realizando agrupamiento y renombrando valores de grupo
print(df.groupby("sexo").size().rename(index = {'M':'Masculino','F':'Femenino'}).reset_index(name = "nro_empleados"))

# - Cantidad de empleados por departamento
print(df.groupby("departamento").size().reset_index(name = "nro_empleados"))

# - Cantidad de empleados por sexo por departamento
print(df.groupby(["departamento", "sexo"]).size())
# print(df.groupby(["departamento", "sexo"]).size().reset_index(name = "nro_empleados"))

# Agrupando empleados por rangos de salario
# rangos = [400, 1000, 2000, 3000, 4000, 5000]
arrRangos = np.array([400, 1000, 2000, 3000, 4000, 5000])
arrEtiquetas = np.array(['400-1000', '1001-2000', '2001-3000', '3001-4000', '4001-5000'])
df['rango_salario'] = pd.cut(df['salario'], bins = arrRangos, labels = arrEtiquetas)
print(df)

# print(df.groupby(["rango_salario", "sexo"]).size())

# Uso de matplotlib
plt.plot([1, 2, 3, 4, 5], [10, 20, 30, 40, 50])
plt.show()
