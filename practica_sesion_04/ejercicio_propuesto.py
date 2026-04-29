import pandas as pd

df = pd.read_csv("D:\\UTP\Material Estandarizado\\Taller Python\\Practica_Python\\practica_sesion_04\\sismos.csv", index_col = "ID")
print(df)

# ---------------------------------------------------

# Número de sismos de al menos 6 grados de magnitud
print(len(df[df["MAGNITUD"] >= 6.0]))

# ---------------------------------------------------

# Listar los sismos de magnitud entre 7 y 8 grados con
# profundidad de 60 km o menos
print(df[(df["MAGNITUD"].between(7, 8)) & (df["PROFUNDIDAD"] <= 60)])

# ---------------------------------------------------

# Desafío: contar el número de sismos por año desde el 2015
# a. Creamos una nueva columna solo con el año del evento sísmico
df['AÑO_SISMO'] = df["FECHA_UTC"].astype(str).str[:4].astype(int)
# b. Agrupamos las filas por año de sismo y obtenemos su tamaño (longitud)
print(df[df["AÑO_SISMO"] >= 2015].groupby("AÑO_SISMO").size())

