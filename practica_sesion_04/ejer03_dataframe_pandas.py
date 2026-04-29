# Ejercicio 03: Crear un DataFrame a partir de un 
# diccionario y filtrar datos según condiciones.

import pandas as pd

dic_lenguajes = {
    "lenguaje": ["Python", "JavaScript", "Java", "C#", "C++"],
    "creador": ["Guido van Rossum", "Brendan Eich", "James Gosling", "Anders Hejlsberg", "Bjarne Stroustrup"],
    "lanzamiento": [1991, 1995, 1995, 2000, 1985],
    "version": ["3.10.5", "ECMAScript 2021", "22", "10.0", "C++20"],
    "ranking": [1, 2, 3, 5, 4],
    "usuarios": [8000000, 12000000, 7000000, 6000000, 6000000]
}
df = pd.DataFrame(dic_lenguajes)
print(df)

print("Lenguajes que tienen 7M de usuarios o menos")
# Lenguajes que tienen 7M de usuarios o menos
print(df[df["usuarios"] <= 7000000])

print("Lenguajes creados antes del año 2000")
# Lenguajes creados antes del año 2000
print(df[df["lanzamiento"] < 2000])

print("Languajes creados por personas cuyo nombre inicia con 'B'")
# Languajes creados por personas cuyo nombre inicia con 'B'
print(df[df["creador"].astype(str).str[0] == "B"])

print("Lenguajes cuyo nombre inicia con 'C' o 'J'")
# Lenguajes cuyo nombre inicia con 'C' o 'J'
print(df[df["lenguaje"].str.startswith(("C","J"))])
