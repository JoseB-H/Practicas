# df["ldni"] = df["dni"].str.len()
# df_dni_invalido = df[df["dni"].str.len() > 8]
# df = df[df["dni"].str.len() == 8]  # solo obtenemos filas con longitud de DNI = 8 -> 1671 filas


# df_exs = df.groupby("sexo").size().reset_index(name = "nro_empleados")
# print(df_exs.pivot_table(values="nro_empleados", columns="sexo"))


# SELECT E.dni_emp as dni, nombre_Emp as nombre, apellidoPat_Emp + ' ' + apellidoMat_Emp as apellidos, 
# 	ISNULl(telefono_Emp, 'None') as telefono, 
# 	case sexo_Emp 
# 		when 1 then 'M' else 'F'
# 	end as sexo, salario_Emp as salario, ISNULL(nombre_Dep, 'None') as departamento
# FROM Empleado As E LEFT JOIN Departamento As D
# 	ON E.numero_Dep = D.numero_Dep

