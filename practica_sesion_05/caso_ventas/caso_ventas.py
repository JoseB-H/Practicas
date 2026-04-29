import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# ----------------------------------------------------

# 1. Carga de datos desde el archivo .csv
df = pd.read_csv("D:\\UTP\\Material Estandarizado\\Taller Python\\Practica_Python\\practica_sesion_05\\caso_ventas\\ventas.csv")

print(df.head()) # Mostramos los primeros registros

print("Nro de registros: ", df.shape[0])  # Usando Pandas
print("Nro de registros: ", np.shape(df)[0])  # Usando NumPy
# ----------------------------------------------------

# 2. Limpieza de los datos
# Verificamos valores nulos
print(df.isnull())
print(df.isnull().sum())

# Eliminamos filas con valores nulos en columnas críticas.
df = df.dropna(subset = ['producto', 'cantidad', 'precio_unitario'])
print("Nro de registros: ", df.shape[0])

# Verificar duplicados
print("Filas duplicadas: ", df.duplicated().sum())

# Eliminación de filas duplicadas
df = df.drop_duplicates()
print("Nro de registros: ", df.shape[0])
# print(df)

# Convertimos la columna fecha a tipo datetime
df['fecha'] = pd.to_datetime(df["fecha"])
# print("////")
# Mostramos la información del DataFrame luego de la limpieza
df.info()

# ----------------------------------------------------

print(df)

# 3. Análisis de los datos

# Pregunta 1: ¿Cuál es el producto más vendido?
productos_vendidos = df.groupby('producto')['cantidad'].sum().sort_values(ascending = False)
print(productos_vendidos)
print(productos_vendidos.idxmax(), 'con', productos_vendidos.max(), 'unidades vendidas')

# Pregunta 2: ¿Cuál es el total recaudado en ventas por categoría?
df['total'] = df["cantidad"] * df["precio_unitario"]
df_ventas_x_categoria = df.groupby("categoria")['total'].sum() \
         .sort_values(ascending = False) #.reset_index(name = 'total_ventas')
print(df_ventas_x_categoria)

# Pregunta 3: ¿Cuál es el día de la semana con más ventas?
df['dia_semana'] = df['fecha'].dt.day_name()
df_ventas_por_dia = df.groupby('dia_semana')['total'].sum().sort_values(ascending = False)
print(df_ventas_por_dia)
print(df_ventas_por_dia.idxmax(), 'con S/.', df_ventas_por_dia.max(), 'en ventas')


# GRÁFICOS
# Gráfico de barras: Productos más vendidos
# plt.figure(figsize=(10, 6))
# plt.bar(productos_vendidos.index, productos_vendidos.values)
# plt.title('Productos más vendidos')
# plt.xlabel('Producto')
# plt.ylabel('Cantidad vendida')
# plt.xticks(rotation=45)
# plt.show()

# Gráfico de barras: Ventas por categoría
# plt.figure(figsize=(10, 6))
# plt.bar(df_ventas_x_categoria.index, df_ventas_x_categoria.values)
# plt.title('Ventas por categoría')
# plt.xlabel('Categoría')
# plt.ylabel('Ventas totales')
# plt.xticks(rotation=45)
# plt.show()

# Gráfico de barras: Ventas por día de la semana
# plt.figure(figsize=(10, 6))
# plt.bar(df_ventas_por_dia.index, df_ventas_por_dia.values)
# plt.title('Ventas por día de la semana')
# plt.xlabel('Día de la semana')
# plt.ylabel('Ventas totales')
# plt.show()
