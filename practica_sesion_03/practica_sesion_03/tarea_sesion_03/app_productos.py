from clase_producto import Producto
from clase_gestor_productos import GestorProductos

gestor = GestorProductos()

gestor.agrega_producto(Producto('DT254', 'Detergente Potente', 25.0, 120))
gestor.agrega_producto(Producto('AC254', 'Aceite Pureza', 35.50, 87))
gestor.agrega_producto(Producto('MR014', 'Mermelada Dulzura', 18.30, 50))
gestor.agrega_producto(Producto('LE988', 'Leche Mi Vaquita', 6.25, 265))
gestor.agrega_producto(Producto('QS820', 'Queso Fresco', 14.10, 22))

gestor.modificar_producto('MR014', Producto('MR014', 'Mermelada Dulzura', 14.30, 75))
gestor.remover_producto('AC254')

gestor.mostrar_productos()
