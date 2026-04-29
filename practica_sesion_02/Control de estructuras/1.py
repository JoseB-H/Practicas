asistieron = 0
faltaron = 0

for alumno in range(1, 6):
    while True:
        asistencia = int(input(f"Ingrese la asistencia del estudiante {alumno} (1 = asistió, 0 = faltó): "))

        if asistencia == 1:
            asistieron += 1
            break
        elif asistencia == 0:
            faltaron += 1
            break
        else:
            print("Valor inválido. Solo se acepta 1 o 0.")

print(f"Asistieron: {asistieron}")
print(f"Faltaron: {faltaron}")