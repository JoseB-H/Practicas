import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

ruta_archivo = "D:\\UTP\Material Estandarizado\\Taller Python\\Practica_Python\\practica_sesion_05\\caso_mi_vivienda\\mivivienda.csv"

df = pd.read_csv(ruta_archivo)

print(df.head())
print(df)  # 55568 filas
df.info()

# Limpieza de datos

# registros con alguna columna nula
nro_filas_invalidas = df.isna().all(axis=1).sum()
print("Filas no válidas: ", nro_filas_invalidas)
if nro_filas_invalidas > 0:
    df = df.dropna()
    print("Filas actuales: ", df.shape[0])

# # registros duplicados
nro_filas_duplicadas = df.duplicated().sum()
print("Filas duplicadas: ", nro_filas_duplicadas)
if nro_filas_duplicadas > 0:
    df = df.drop_duplicates()
    print("Filas actuales: ", df.shape[0])

# # removemos la columna FECHA_CORTE
df = df.drop("FECHA_CORTE", axis = 1)
print("Filas válidas finales: ", df.shape[0])

df["FECHA_DESEMBOLSO"] = pd.to_datetime(arg = df["FECHA_DESEMBOLSO"], format = "%Y%m%d")

# Creando una nueva columna para almacenar el año de desembolso del crédito
df["AÑO_DESEMBOLSO"] = df["FECHA_DESEMBOLSO"].dt.year
df["ENTIDAD_FINANCIERA"] = df["TIPO_IFI"].str.upper() + " " + df["IFI"].str.upper()

print(df.groupby(["AÑO_DESEMBOLSO"]).size())  # número de créditos otorgados por año

# número de créditos otorgados por departamento
df_creditos_departamento = df.groupby(["DEPARTAMENTO"]).size()
print(df_creditos_departamento.reset_index(name = 'NUMERO_CREDITOS'))  

plt.figure(figsize=(10, 6))
plt.bar(df_creditos_departamento.index, df_creditos_departamento.values)
plt.title('Distribución de los créditos por departamento')
plt.xlabel('Departamento')
plt.ylabel('Créditos otorgados')
plt.xticks(rotation=90)
plt.show()
# --

# print(df.groupby(["ENTIDAD_FINANCIERA"]).size())  # número de créditos otorgados por entidad financiera
# print(df.groupby(["DEPARTAMENTO"])["MONTO_VALOR_VIVIENDA"].mean())
# dfProductos = df["PRODUCTO"]
# dfProductos = dfProductos.drop_duplicates()
# print(dfProductos)

# Tipos de producto: NCMV, FCTP, NMIV, S-CRC

# Análisis de datos MiVivienda
# - Monto de crédito promedio por producto.
df_PromCredito_x_Producto = df.groupby(["PRODUCTO"])["MONTO_CREDITO"].mean()
print(df_PromCredito_x_Producto.reset_index(name = "PROMEDIO_CREDITO"))

plt.figure(figsize=(10, 6))
plt.bar(df_PromCredito_x_Producto.index, df_PromCredito_x_Producto.values)
plt.title('Crédito promedio por producto')
plt.xlabel('Producto')
plt.ylabel('Crédito promedio')
plt.show()

# --

# - Distribución de los créditos por departamento/provincia/distrito


# - Número de créditos por periodo de tiempo
df["AÑO_DESEMBOLSO"] = pd.to_datetime(arg = df["FECHA_DESEMBOLSO"], format = "%Y%m%d").dt.year
df_creditos_x_año = df.groupby(["AÑO_DESEMBOLSO"]).size()
df_creditos_x_año = df_creditos_x_año.reset_index(name = "NUMERO_CREDITOS")
# print(df_creditos_x_año)

arr_años = np.array(df_creditos_x_año["AÑO_DESEMBOLSO"]).astype(str)
arr_frecuencias = np.array(df_creditos_x_año["NUMERO_CREDITOS"])
# print(arr_años)

plt.title('Número de créditos otorgados por cada año')
plt.xlabel('Año')
plt.ylabel('Créditos otorgados')
plt.xticks(range(len(df_creditos_x_año)), arr_años)
plt.plot(arr_frecuencias, '.r-', linewidth = 1)
plt.show()

# --

# - Cantidad de dinero otorgado como crédito por departamento/provincia/distrito

pd.set_option('display.float_format', '{:.2f}'.format)
df_TotalCredito_x_Depto = df.groupby(["DEPARTAMENTO"])["MONTO_CREDITO"].sum()
df_TotalCredito_x_Depto = df_TotalCredito_x_Depto.reset_index(name = "TOTAL_CREDITO")
df_TotalCredito_x_Depto = df_TotalCredito_x_Depto.sort_values(by = "TOTAL_CREDITO", ascending = False)
print(df_TotalCredito_x_Depto)

arr_deptos = np.array(df_TotalCredito_x_Depto["DEPARTAMENTO"])
arr_totales = np.array(df_TotalCredito_x_Depto["TOTAL_CREDITO"])

grafico, ejes = plt.subplots()
sectores, textos, autotextos = ejes.pie(arr_totales[0:5], labels=arr_deptos[0:5], autopct='%1.1f%%')

ejes.legend(sectores, [f'{label}: {size} soles' for label, size in zip(arr_deptos[0:5], arr_totales[0:5])],
          title="Leyenda", loc="lower left", bbox_to_anchor=(1, 0, 0.5, 1))

plt.show()
