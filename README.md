# Criptosistema Clásico & Analizador Al-Kindi

Proyecto 1 — Seguridad en Sistemas de Cómputo
Ingeniería en Sistemas Computacionales, Universidad Autónoma de Aguascalientes
Autor: **Emmanuel De Jesús López García**

Sitio en vivo: https://emmanuellopezgarcia05.github.io/proyecto-cesar-atbash/

## ¿Qué hace este proyecto?

Aplicación web (HTML + CSS + JavaScript puro, sin backend ni dependencias) que permite:

1. **Definir un alfabeto/conjunto de caracteres** propio para cifrar y descifrar (letras, números, signos, símbolos fuera del ASCII estándar como "ñ").
2. **Cifrar** un mensaje con el método César o Atbash, eligiendo el módulo en el caso de César.
3. **Descifrar automáticamente** un mensaje cifrado: el sistema por sí solo determina si se usó César (y con qué desplazamiento) o Atbash, sin que el usuario indique nada — inspirado en el método de análisis de frecuencias desarrollado por el matemático árabe del siglo IX **Abū Yūsuf Yaʿqūb ibn Isḥāq al-Kindī**, considerado el primer criptoanálisis documentado en la historia.

## ¿Cómo funciona por dentro?

- **Base ASCII/Unicode:** cada carácter se traduce a su código numérico (`charCodeAt`) y toda la aritmética modular de César y Atbash se hace sobre esos códigos, no sobre el carácter en sí (`String.fromCharCode` al final). Esto permite que el alfabeto configurado incluya cualquier símbolo, esté o no en el ASCII de 7 bits.
- **Detección automática (`calculateChiSquared`):** compara la frecuencia de letras del español en cada candidato posible (Atbash + los N desplazamientos de César) contra la frecuencia real del idioma, y se queda con el candidato estadísticamente más parecido a español real. Los dígitos y signos de puntuación se excluyen del análisis (no se premian ni castigan), y si un candidato no tiene al menos 5 letras evaluables, se descarta por no ser una muestra confiable.
- El detalle línea por línea del código **no** está comentado dentro de `script.js` a propósito: el código solo tiene marcadores de sección numerados (`[1]`, `[2]`, `[3]`, `[4]`), y la explicación completa de qué hace cada uno vive en la Sección 7 ("Documentación del código") del reporte entregado. Esto se hizo así para mantener una separación clara entre código e implementación versionada en Git (con historial de cambios verificable) y su documentación, en vez de mezclar ambos en el mismo archivo.

## Estructura del repositorio

```
index.html    → estructura de la página (3 módulos: alfabeto, cifrado, descifrado automático)
styles.css    → estilos visuales
script.js     → toda la lógica de cifrado, descifrado y análisis estadístico (marcada por secciones [1]-[4]; ver el reporte para la explicación de cada una)
```

## Limitaciones conocidas (documentadas y probadas)

- El análisis de frecuencias necesita una muestra de texto razonablemente larga (idealmente 8-10 palabras o más) para ser estadísticamente confiable; con mensajes muy cortos, el sistema puede no tener suficiente información y lo indica explícitamente en vez de arriesgar una respuesta incorrecta.
- La tabla de frecuencias está calibrada para **español**; un mensaje en otro idioma no se detectará correctamente con el módulo automático (aunque el cifrado/descifrado manual sí funciona con cualquier idioma, al basarse en códigos ASCII/Unicode).

## Reporte completo

El reporte completo del proyecto (portada, introducción sobre al-Kindi, objetivo, desarrollo, conclusión y bibliografía) se entregó por separado según lo solicitado en la rúbrica del curso.
