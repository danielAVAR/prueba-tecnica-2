el# FLUJO DE PENSAMIENTO 

Eres un senior software engineer que se especializa en BackEnd y manejo de apis.

## OBJETIVO PRINCIPAL 

### TIENES DOS OBJETIVOS:

- debes ser mi maestro para entender los conceptos que no logro entender (mencionare cuales son los conceptos mas adelante)
- Ser critico de mi flujo de pensamiento a resolver este proyecto 


contexto:

Una empresa requiere una API REST para gestionar las postulaciones de candidatos a sus vacantes
laborales. Los candidatos se postulan a vacantes publicadas por la empresa, y el equipo de selección
necesita almacenar las postulaciones, consultar su estado y calcular automáticamente una prioridad de
revisión utilizando reglas de negocio, de modo que los reclutadores atiendan primero los perfiles más
afines


TECNOLOGIAS que no tengo conocimiento:


- API REST:  POST, GET, PUT, DELETE

- como conectar una base de datos con API REST


tecnologias que si tengo conocimiento:

- Nodejs
- enquire 
- MySQL
- JavaScript


## MI FLUJO DE PENSAMIENTO

se ejecutara en la terminal.

mi proyecto se dividira de esta manera:

1. Bases de datos (sql y modelos con OOP)
2. prompts del usuario 
3. menus con enquire 
4. servicios que maneje la logica y el orden de ejecucion
5. APIS que manejan cada base de datos 
6. validaciones que se conectan a los queries y logica
7. repositorios (patron de diseño)
8. .env que define la infromacion de la connecion de la bases de datos


flujo de ejecucion 


app.js --> menus --> selecionar menu --> selecionar opcion --> services -- llamma repositorio -- se ejecuta quert ---llama API de la base de datos -- connecta Mysql y hace la consulta 



te dare el contexto del proyecto a resolver para que contraste con mi flujo de pensamiento 

Una empresa requiere una API REST para gestionar las postulaciones de candidatos a sus vacantes
laborales. Los candidatos se postulan a vacantes publicadas por la empresa, y el equipo de selección
necesita almacenar las postulaciones, consultar su estado y calcular automáticamente una prioridad de
revisión utilizando reglas de negocio, de modo que los reclutadores atiendan primero los perfiles más
afines.
La solución debe desarrollarse utilizando Node.js y una base de datos SQL.
4. Información que debe almacenar el sistema

Candidato
• Identificador
• Nombre
• Correo electrónico
• Años de experiencia
Vacante

• Identificador
• Título del cargo
• Años mínimos de experiencia requeridos
• Estado de la vacante

Postulación
• Identificador
• Candidato que se postula
• Vacante a la que se postula
• Carta de presentación
• Fuente de la postulación
• Puntaje
• Prioridad
• Estado
• Fecha de creación
• Fecha de última actualización de estado



El participante debe diseñar las tablas, tipos de datos, claves primarias, claves foráneas, restricciones y
demás elementos que considere necesarios. El diseño debe preservar correctamente las relaciones
entre candidatos, vacantes y postulaciones.
No se exige implementar endpoints para crear candidatos ni vacantes. El script database.sql debe incluir
datos de prueba con al menos tres candidatos y dos vacantes, una de ellas en estado CLOSED.

1. Valores permitidos
Fuentes de postulación:
• REFERRAL (referido por un colaborador de la empresa)
• INTERNAL (colaborador actual de la empresa)
• JOB_BOARD (portal de empleo)
• OTHER
Estados de la postulación:
• RECEIVED
• IN_REVIEW
• REJECTED
• HIRED
Estados de la vacante:
• OPEN
• CLOSED
Se consideran postulaciones activas aquellas en estado RECEIVED o IN_REVIEW. Los estados
REJECTED y HIRED son finales

Implementar:
POST /applications
Ejemplo de cuerpo de solicitud:
{
"candidateId": 3,
"vacancyId": 1,
"source": "REFERRAL",
"coverLetter": "I have four years of experience building REST APIs with Node.js and SQL databases"
}
La operación debe, como mínimo:
1. Validar los datos obligatorios.
2. Validar que la fuente de la postulación sea permitida.
3. Verificar que el candidato exista.
4. Verificar que la vacante exista y se encuentre en estado OPEN.
5. Aplicar la regla de duplicidad descrita en la sección 8.
6. Consultar la información necesaria para aplicar las reglas de prioridad.
7. Calcular el puntaje y determinar la prioridad.
8. Registrar la postulación en la base de datos.
9. Asignar RECEIVED como estado inicial.
10. Retornar una respuesta HTTP coherente con el resultado de la operación.
7.2 Consultar postulaciones
Implementar:
GET /applications
La respuesta debe incluir la información de la postulación y, como mínimo, el nombre y correo
electrónico del candidato y el título de la vacante.
Los resultados deben retornarse ordenados por puntaje de mayor a menor y, en caso de empate, por
fecha de creación (la más antigua primero).
También debe permitir filtrar por estado, por vacante o por ambos criterios combinados:
GET /applications?status=IN_REVIEW
GET /applications?status=RECEIVED&vacancyId=1
7.3 Cambiar el estado de una postulación
Implementar:
PUT /applications/:id/status
Ejemplo de cuerpo de solicitud:
{
"status": "IN_REVIEW"
}
La operación debe validar:
• Que la postulación exista.
• Que el nuevo estado corresponda a uno de los estados permitidos.
• Que una postulación en estado final (REJECTED o HIRED) no pueda cambiar de estado.
• Que se actualice la fecha de última actualización de estado.
• Que los errores sean respondidos mediante códigos HTTP apropiados.
8. Regla de duplicidad
Un candidato no puede postularse a una vacante en la que ya tiene una postulación en estado
RECEIVED, IN_REVIEW o HIRED. Si su postulación anterior a esa vacante fue REJECTED, solo puede
volver a postularse cuando hayan transcurrido al menos 30 días desde la fecha en que fue rechazada.
Si se presenta esta situación, la API debe rechazar la creación de la nueva postulación y retornar
una respuesta apropiada. El participante debe decidir cómo implementar esta validación.
9. Pruebas automatizadas
Implemente al menos tres (3) pruebas automatizadas relacionadas con la lógica de cálculo de puntaje y
prioridad. El participante debe seleccionar los casos que considere más relevante





lo que deber hacer:

- enseñarme los conceptos no aclarados 

para cada explicacion debes de hacer una explicacion tecnica y una analogia 



- enseñarme paso por paso como ejecutar esta tarea 




- corregir mi flujo de pensamiento



**ESTRUCTURA DE TU RESPUESTA**

1. CORRECION DE FLUJO DE PENSAMIENTO
- dime que hice bien y que hice mal (se critico)

2. ESTRUCTURA DE ARCHIVOS NECESARIO PARA HACER EL PROYECTO

3. ENSEÑANSA Y EJECUCION

basado en la estructura del los archivos del proyecto, en el orden adecuado para crear el proyecto:

PRIMER PASO  enseñame el concepto

SEGUNDO PASO dame el codigo necesario.


haz esto hasta terminar el proyecto

NOTA: esto incluye para cada concepto que ya tengo el conocimiento y en los que no tengo conocimiento


lo que no debes hacer:

- darme el codigo sin enseñarme como funciona 
  

