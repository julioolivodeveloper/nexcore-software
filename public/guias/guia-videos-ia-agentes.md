# Cómo creo videos con Inteligencia Artificial y cómo automatizo todo el proceso con agentes de IA

*Guía práctica de producción audiovisual asistida por IA*

---

## Introducción

Producir un video con IA ya no consiste en "pedirle un clip a un modelo". Consiste en encadenar decisiones: un personaje que se mantenga igual en todas las escenas, imágenes coherentes, prompts cinematográficos precisos, audio sincronizado y un montaje final que se sienta intencional.

Esta guía describe mi flujo de trabajo completo en seis etapas y, al final, cómo delego cada etapa a agentes de IA para que el proceso se ejecute prácticamente solo.

---

## Diagrama del flujo de trabajo

```
   [1] INVESTIGACIÓN  ──►  [2] GUION  ──►  [3] PERSONAJE
                                                │
                                                ▼
   [4] IMÁGENES POR ESCENA  ──►  [5] PROMPTS CINEMATOGRÁFICOS (Flow AI)
                                                │
                                                ▼
                          [6] GENERACIÓN DE CLIPS DE VIDEO
                                                │
                                                ▼
              [7] AUDIO + LIP SYNC  ──►  [8] MONTAJE Y EDICIÓN
                                                │
                                                ▼
                        [9] PUBLICACIÓN EN REDES SOCIALES
                                                │
                                                ▼
                    [10] MÉTRICAS ──► retroalimenta [1]
```

Cada bloque es una tarea que un humano puede hacer... o que un agente puede hacer por ti. Volveremos a esto en la sección 6.

---

## 1. Cómo creo un personaje consistente

El personaje es el activo más valioso del proyecto. Si cambia de cara entre escenas, el video pierde credibilidad de inmediato.

**Mi método:**

1. **Escribo una "biblia de personaje"**: un párrafo fijo que describe rasgos inmutables (edad, etnia, forma del rostro, color y corte de pelo, ojos, complexión, vestuario base, marcas distintivas). Este texto no se improvisa nunca: se copia y pega igual en todos los prompts.
2. **Genero una hoja de referencia (character sheet)**: 4–6 imágenes del mismo personaje en frontal, perfil izquierdo, perfil derecho, tres cuartos y plano medio, con luz neutra y fondo liso.
3. **Fijo la semilla (seed)** en el generador de imágenes para que las variaciones no alteren la identidad.
4. **Uso las referencias como entrada** en las herramientas que aceptan *image-to-image* o "ingredientes" visuales (como Flow AI), en lugar de describir la cara de nuevo con palabras.

**Ejemplo de biblia de personaje:**

> "Mariana, mujer latina de 32 años, rostro ovalado, piel morena clara, ojos color avellana ligeramente rasgados, cejas gruesas, cabello negro ondulado a la altura del hombro con raya al centro, lunar pequeño bajo el ojo derecho, complexión atlética. Viste chaqueta de mezclilla azul desgastada sobre camiseta blanca lisa. Expresión serena y mirada directa."

**Recomendaciones para mantener la consistencia:**

- Un solo personaje por prompt. Dos personas en la misma imagen multiplican los errores.
- Mantén constantes la lente y la distancia (ej. siempre 50 mm) para que el rostro no se deforme.
- Guarda tus mejores renders en una carpeta "canon" y descarta el resto; solo el canon se usa como referencia.
- Cambia el entorno y la iluminación, nunca la descripción física.
- Revisa siempre tres puntos de fallo: ojos, orejas y manos.

---

## 2. Cómo genero las imágenes de cada escena

Primero convierto el guion en un **storyboard textual**: una lista de escenas, cada una con locación, acción, encuadre y emoción. Luego genero un fotograma clave (*keyframe*) por escena.

**Estructura de mi prompt de imagen:**

`[biblia de personaje] + [acción] + [locación] + [encuadre] + [iluminación] + [estilo] + [relación de aspecto]`

**Ejemplo:**

> "Mariana, mujer latina de 32 años, rostro ovalado, piel morena clara, ojos avellana, cabello negro ondulado al hombro, lunar bajo el ojo derecho, chaqueta de mezclilla azul sobre camiseta blanca. Está de pie junto a una ventana empañada de un café vacío, sosteniendo una taza con ambas manos. Plano medio, ligeramente a tres cuartos. Luz natural fría entrando desde la izquierda, sombras suaves. Fotografía cinematográfica, lente 50 mm, f/2.0, grano fino, paleta azul apagada. Formato 16:9."

Genero 4 variantes por escena y me quedo con una. Si ninguna respeta al personaje, no ajusto el texto: vuelvo a la referencia visual.

---

## 3. Cómo escribo prompts cinematográficos para Flow AI

Un prompt de video no es una descripción: es una **instrucción de dirección**. La diferencia entre un clip amateur y uno cinematográfico está en especificar el movimiento de cámara y la duración de la acción.

**Mi plantilla de seis capas:**

1. **Sujeto** — quién (con la biblia de personaje o la imagen de referencia).
2. **Acción** — un solo verbo claro, ejecutable en 5–8 segundos.
3. **Cámara** — tipo de plano y movimiento (*dolly in*, *pan*, *tracking*, estático).
4. **Entorno** — locación y detalles atmosféricos.
5. **Iluminación y óptica** — fuente de luz, hora del día, lente, profundidad de campo.
6. **Estilo y ritmo** — referencia visual, paleta, velocidad de la escena.

**Ejemplo de prompt cinematográfico:**

> "Plano medio de Mariana junto a la ventana empañada de un café vacío. Deja lentamente la taza sobre la mesa y gira la cabeza hacia la ventana. Cámara: *dolly in* muy lento hacia su rostro, terminando en primer plano. Luz natural fría desde la izquierda, atmósfera de mañana lluviosa, gotas resbalando en el cristal. Lente 50 mm, f/2.0, profundidad de campo reducida, fondo desenfocado. Estética cinematográfica contemporánea, paleta azul apagada, ritmo pausado. 8 segundos, 16:9, 24 fps."

**Errores que aprendí a evitar:**

- Encadenar tres acciones en un clip. El modelo las comprime y el resultado se ve acelerado.
- Movimientos de cámara contradictorios (*zoom out* + *dolly in*).
- Prompts poéticos sin datos técnicos: "hermoso y emotivo" no produce nada consistente.
- Escenas de más de 8–10 segundos. Es preferible dividirlas y unirlas en edición.

---

## 4. Cómo agrego audio y sincronización labial

1. **Guion de voz por escena**: escribo el texto exacto, con marcas de pausa. La duración del audio define la duración del clip, no al revés.
2. **Voz sintética**: genero la locución con una voz clonada o de catálogo, siempre la misma para el personaje. Ajusto velocidad y énfasis hasta que suene natural.
3. **Lip sync**: envío el clip de video y el archivo de audio a la herramienta de sincronización labial. Regla práctica: funciona mucho mejor en planos medios y primeros planos frontales que en planos generales o perfiles.
4. **Capas sonoras**: música de fondo a −18 dB respecto a la voz, ambiente (lluvia, café, calle) y efectos puntuales. El ambiente es lo que hace creíble una escena generada.

---

## 5. Cómo uno las escenas para el video final

- **Ensamblo por audio**: coloco primero la locución completa y encajo los clips encima. Así el ritmo lo marca la narración.
- **Continuidad**: verifico que la dirección de la luz y el vestuario no salten entre escenas.
- **Transiciones**: corte directo por defecto. Fundidos solo para saltos de tiempo.
- **Color grading**: aplico un LUT único a todo el proyecto. Esto unifica clips generados en sesiones distintas y disimula pequeñas variaciones del personaje.
- **Exportación**: 16:9 para YouTube; recorte a 9:16 con reencuadre del sujeto para TikTok, Reels y Shorts.

---

## 6. Cómo diseño agentes de IA para automatizar todo el proceso

Un agente no es un prompt largo: es un rol con **objetivo, herramientas, entradas, salidas y criterios de calidad**. Yo divido el pipeline en agentes especializados y los conecto en cadena. Cada uno entrega un archivo estructurado (JSON o Markdown) que el siguiente consume.

| Agente | Función | Entrada → Salida |
|---|---|---|
| **Investigador** | Busca tendencias, datos y ángulos del tema | Tema → informe con fuentes |
| **Guionista** | Escribe el guion con gancho, desarrollo y cierre | Informe → guion por escenas |
| **Director de arte** | Genera prompts de imagen usando la biblia de personaje | Guion → lista de prompts |
| **Generador de imágenes** | Produce los keyframes y descarta los fallidos | Prompts → imágenes canon |
| **Prompt engineer de video** | Convierte cada escena en prompt cinematográfico | Guion + imagen → prompt Flow AI |
| **Productor** | Genera los clips y valida duración y encuadre | Prompts → clips |
| **Editor** | Ensambla, sincroniza audio, aplica LUT y exporta formatos | Clips + audio → master |
| **Publicador** | Redacta copies, hashtags y programa las publicaciones | Master → posts programados |
| **Analista** | Lee métricas y propone ajustes para el próximo video | Métricas → recomendaciones |

**Cómo los orquesto:**

- **Estado compartido**: una carpeta o base de datos del proyecto donde vive la biblia de personaje, el guion y los assets. Todos los agentes leen de ahí.
- **Contratos estrictos**: cada agente devuelve un esquema fijo. Si el formato falla, se reintenta automáticamente.
- **Punto de control humano**: apruebo manualmente dos momentos — el guion y el corte final. El resto corre solo.
- **Disparador**: un cron semanal o un webhook lanza al Investigador y la cadena avanza sola.

**Ejemplo de instrucción para el agente Guionista:**

> "Eres guionista de video corto. Recibes un informe de investigación en JSON. Escribe un guion de 60 segundos dividido en 8 escenas. Cada escena incluye: `id`, `locacion`, `accion` (un solo verbo), `encuadre`, `emocion` y `locucion` (máximo 18 palabras). La escena 1 debe abrir con un gancho de menos de 3 segundos. Devuelve únicamente JSON válido, sin texto adicional."

---

## Conclusión

La IA no reemplaza el criterio creativo: reemplaza la **repetición**. Escribir el mismo tipo de prompt cuarenta veces, renombrar archivos, recortar a 9:16, redactar el copy, programar la publicación — todas son tareas deterministas, y todo lo determinista es automatizable.

Lo que queda del lado humano es lo que realmente decide si un video funciona: qué historia vale la pena contar, qué personaje merece existir y qué se corta. Los agentes ejecutan; tú diriges.

Mi recomendación práctica: no intentes automatizar las nueve etapas el primer día. Automatiza una, mídela durante dos semanas y solo entonces añade la siguiente. Un pipeline construido paso a paso resiste; uno construido de golpe se rompe en la primera escena inconsistente.
