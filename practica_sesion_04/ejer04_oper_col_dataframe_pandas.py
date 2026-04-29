# Ejercicio 04: Realizar operaciones como sum() o mean() en columnas específicas de un DataFrame.

import pandas as pd

# Ejercicio 04: Realizar operaciones como sum() o mean() en columnas específicas de un DataFrame.

dic_liga_premier = pd.DataFrame({
    "equipo": ["Liverpool", "Arsenal", "Nottm Forest", "Man City", "Newcastle", "Chelsea"],
    "jugados": [22, 23, 23, 23, 23, 23],
    "ganados": [16, 13, 13, 12, 12, 11],
    "empatados": [5, 8, 5, 5, 5, 7],
    "perdidos": [1, 2, 5, 6, 6, 5],
    "goles_favor": [54, 44, 33, 47, 41, 45],
    "goles_contra": [21, 21, 27, 30, 27, 30],
    "dif_goles": [33, 23, 6, 17, 14, 15],
    "puntos": [53, 47, 44, 41, 41, 40]
})

df = pd.DataFrame(dic_liga_premier)
print(df)

# Suma: totalizar todas las columnas de la tabla, excepto "equipo"
print("Columnas totalizadas:\n", df.drop("equipo", axis = 1).sum())

# Suma: obtener la cantidad total de goles a favor obtenida por los equipos
print("Total de goles a favor:", df["goles_favor"].sum())

# Promedio: Obtener el promedio de partidos ganados
print("Promedio de partidos ganados:", round(df["ganados"].mean()))

# Promedio: Obtener el promedio de goles en contra de los 3 primeros equipos
print("Promedio de goles en contra de los 3 primeros equipos:", df.head(3)["goles_contra"].mean())
