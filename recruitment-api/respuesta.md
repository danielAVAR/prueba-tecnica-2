# RESPUESTAS



regunta 1. La empresa desea utilizar un modelo de inteligencia artificial para identificar
automáticamente las habilidades técnicas del candidato a partir de su carta de presentación y
compararlas con las requeridas por la vacante. Explique cómo integraría esta capacidad a la
solución desarrollada.


RESPUESTA: Implementaria unb agente con parametros para reducir alucinaciones y que solo se enfoque en identificar las habilidades y validarlas 



Pregunta 2. Suponga que el modelo de IA devuelve ocasionalmente una respuesta con formato
inválido o habilidades que no existen en el catálogo de la empresa. Explique cómo debería
manejar esta situación el backend.

RESPUESTAS:  crearia un validator que impida que se cree un catalogo que no exita. si la IA crea un catalogo no existente el validator hara que vuelva a devolver una respuesta valida 


Pregunta 3. ¿Considera apropiado reemplazar completamente las reglas determinísticas
utilizadas para calcular la prioridad por una decisión realizada por un modelo de IA, teniendo en
cuenta que la decisión afecta directamente a personas? Justifique técnicamente su respuesta.

RESPUESTA: Es escencial implementar eso al usar una inteligencia artifical. no solo para la seguridad del usuario sino que tambien que no afecte el rendimiento de la logica del proyecto