# NoStateNode

This is a web application that allows users to manage tasks and share them with other users. The application leverages Firebase for authentication and realtime database capabilities.



# NoStateNode

NoStateNode es una aplicación web para gestionar notas y recursos personales, con la posibilidad de compartir listas de tareas con otros usuarios de manera privada o grupal. Está desarrollada en React 18 y utiliza Firebase v9 (Auth y Firestore) como backend.

## Características principales

- **Notas personales:** Cada usuario puede crear, editar y eliminar sus propias notas.
- **Compartir listas:** Las notas pueden compartirse con uno o varios usuarios, generando listas privadas, individuales o grupales.
- **Alias y contactos:** Los contactos pueden tener alias personalizados, y los grupos compartidos pueden tener un nombre propio.
- **Vista de dashboard:** El dashboard agrupa las listas por destinatario (individual o grupo), mostrando el número de recursos compartidos.
- **Vista de detalles:** Al ingresar a una card, se muestran solo las notas correspondientes a ese destinatario o grupo.
- **Autenticación:** Login, registro y recuperación de contraseña usando Firebase Auth.
- **UI moderna:** Estilos con Tailwind CSS y componentes personalizados.

## Estructura del proyecto

```
src/
	components/
		SharedRecipientsGrid.js      // Agrupa y muestra las cards de destinatarios y grupos
		SharedRecipientCard.js       // Card individual o grupal, permite editar alias
		OwnerRecipientsDashboard.js  // Dashboard principal del usuario
		...otros componentes
	formPages/
		TaskList.js                  // Lista de tareas/notas filtradas por destinatario/grupo
		TaskForm.js                  // Formulario para crear nuevas notas
		...otros formularios
	context/
		AuthContext.js               // Contexto de autenticación
	firebase.js                    // Configuración e inicialización de Firebase
	...otros archivos
```

## Cómo funciona la app

1. **Inicio de sesión:** El usuario accede con email/contraseña o Google.
2. **Dashboard:** El usuario ve sus listas agrupadas por destinatario (cards individuales y grupales).
3. **Crear nota:** Desde el formulario, puede crear una nota y elegir compartirla con uno o varios contactos.
4. **Compartir con grupo:** Si selecciona varios usuarios, se crea una card de grupo. El nombre del grupo puede editarse y se guarda en Firestore.
5. **Alias:** Los alias de contactos y grupos pueden editarse y se persisten en Firestore.
6. **Vista de detalles:** Al hacer click en una card, se muestran solo las notas correspondientes a ese destinatario o grupo.
7. **Notas privadas:** Las notas sin destinatario aparecen en la card "Solo tú".
8. **Seguridad:** Solo el dueño puede editar/eliminar sus notas; los invitados solo pueden ver las listas compartidas con ellos.

## Cómo instalar y correr el proyecto

1. Clona el repositorio:
	 ```
	 git clone https://github.com/CharlyBGood/NoStateNode_Site.git
	 cd NoStateNode_Site
	 ```
2. Instala dependencias:
	 ```
	 npm install
	 ```
3. Configura las variables de entorno en `.env` (ver `src/firebase.js` para los keys necesarios).
4. Inicia la app:
	 ```
	 npm start
	 ```
5. Accede a `http://localhost:3000` en tu navegador.

## Notas técnicas

- **Firestore:** Las notas se guardan en la colección `notes`, los contactos en `usersToShare`, y los alias de grupos en `sharedGroups`.
- **Consultas:** El dashboard y las vistas de detalle usan queries eficientes para filtrar por usuario, grupo o privado.
- **Limpieza de listeners:** Todos los listeners de Firestore se limpian correctamente para evitar fugas de memoria.
- **Estilos:** Tailwind CSS y algunos archivos CSS personalizados.

## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix.
3. Haz tus cambios y abre un pull request.
