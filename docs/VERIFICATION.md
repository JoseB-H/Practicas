# Verificación del portal de manhwas

- `npm test`: **21 pruebas API correctas**; 11 de compatibilidad anterior y 10 del servicio de lectura.
- `npm run test:e2e`: **8 pruebas Chromium correctas**, sin omitidas ni fallos.
- `npm run build`: TypeScript y compilación de producción correctos.
- Comprobación visual en escritorio de 1440 px y móvil de 390 px: sin desbordamiento horizontal ni errores de JavaScript.
- Producción real: las 54 páginas SVG respondieron HTTP 200; biblioteca y progreso se conservaron tras detener y reiniciar el proceso.
- 6 portadas en atlas y banner originales; 54 páginas SVG de 800×1200 con 162 viñetas y diálogos, validadas y renderizadas.

La regresión de guardado retiene deliberadamente una petición de un capítulo anterior, cambia a otra sesión del lector y comprueba que el progreso final sigue apuntando al capítulo nuevo. El fallo se reprodujo antes de implementar una cola de escritura compartida por el portal.

Las pruebas también comprueban separación por cookie entre visitantes, persistencia al reabrir SQLite, índices de página y relación capítulo/serie, enlaces inexistentes y errores al guardar favoritos. El estado anterior se conservó antes de sustituir la interfaz.

La API recibió comprobación separada por un agente. La revisión adicional independiente de la nueva interfaz no pudo completarse por un límite de uso; se realizó revisión del autor y verificación funcional en navegador. Los resultados describen el código local de esta instancia, no una publicación.

Capturas disponibles en `artifacts/`: `manhwa-desktop.png`, `manhwa-mobile.png`, `manhwa-serie.png` y `manhwa-lector-mobile.png`. Consulta [DEVELOPMENT.md](DEVELOPMENT.md) para arrancar el servicio y conocer los límites del catálogo de muestra.
