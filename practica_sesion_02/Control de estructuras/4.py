
while True:
    contraseña = input("Ingrese su contraseña: ")
    
    if contraseña == "1234":
        print("Acceso concedido.")
        break
    else:
        print("Sigue intentando...")


"""
# 1. Definimos la condición inicial
continuar = True

# 2. Iniciamos el bucle
while continuar:
    # 3. Solicitamos el dato al usuario
    contraseña_ingresada = input("Ingrese su contraseña: ")

    # 4. La gran comparación (El "Portero")
    if contraseña_ingresada == "admin123":
        print("Contraseña correcta. Bienvenido.")
        # 5. Cambiamos el estado para salir
        continuar = False
    else:
        # 6. Acción en caso de error
        print("Contraseña incorrecta. Acceso denegado. Intente de nuevo.")
        
"""