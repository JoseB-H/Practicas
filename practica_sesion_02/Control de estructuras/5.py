#Registrar precios de productos hasta que el usuario ingrese 0. 
#Mostrar: Total a pagar, Cantidad de productos 


total = 0
cant = 0
precio = -1
print(" 0 para temrinar la compra")
while precio != 0:
    precio = float(input("Ingrese el precio del producto: "))
    
    if precio != 0:
        total += precio
        cant += 1

print(f"Total a pagar: ${total:.2f}")
print(f"Cantidad de productos: {cant}")
    
    
