"""
desc = 0.10
precio = float(input("Ingrese el precio del producto: "))
aplica = precio * desc
total = precio - aplica
if precio > 100:
    print(f"aplicamos un descuento del 10%: {total}")
else:
    print("No se aplica descuento")
"""
productos = []
precios = []
total = 0

for numero in range(1, 4):
    producto = input(f"Ingrese el nombre del producto {numero}: ")
    precio = float(input(f"Ingrese el precio de {producto}: "))
    productos.append(producto)
    precios.append(precio)
    total += precio

for i in range(3):
    print(f"{productos[i]}: ${precios[i]}")

print(f"La suma total es: ${total}")
