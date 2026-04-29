total = 0.0
ventas = []

for ventas in range(1,8):
    venta = float(input(f"Ingrese el monto de la venta {ventas}: "))
    total += venta
    promedio = total / 7
    
print(f"La suma total de las ventas a lo largo de las 7 semanas es: ${total:.2f}")
print(f"El promedio de las ventas a lo largo de las 7 semanas es: ${promedio:.2f}")
