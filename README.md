
# Sistema de Gestión de Clientes - Seguros

Sistema profesional para la gestión de clientes de empresas de seguros construido con Next.js 14, React 18, Firebase y Tailwind CSS.

## 🚀 Características

### Autenticación
- Sistema completo de login y registro con Firebase Authentication
- Validación de contraseñas para acciones críticas (eliminación de clientes)
- Manejo seguro de sesiones

### Gestión de Clientes
- **CRUD completo**: Crear, leer, actualizar y eliminar clientes
- **Búsqueda avanzada**: Por nombre, email, SS#, teléfono, ciudad, estado, compañía de seguros
- **Formulario completo** con más de 40 campos específicos de seguros
- **Sección de dependientes expandible**: De 3 a 7 dependientes por cliente
- **Validaciones automáticas**: Formateo de SS#, Alien#, teléfonos, fechas
- **Cálculos automáticos**: Edad desde fecha de nacimiento, total de ingresos

### Campos del Cliente
- Información personal (nombre, edad, status migratorio, SS#, Alien#, etc.)
- Dirección completa con desplegables de búsqueda para ciudades/estados USA
- Información laboral e ingresos
- Información bancaria y de pago
- Detalles completos de seguro (compañía, plan, prima, deducibles, etc.)
- Servicios médicos y coberturas
- Notas adicionales
- Hasta 7 dependientes con información completa

### Interfaz de Usuario
- Diseño moderno y responsive
- Dashboard con estadísticas
- Interfaz profesional adaptada a empresas de seguros
- Componentes reutilizables con Tailwind CSS

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Google/Gmail para Firebase
- Editor de código (VS Code recomendado)

## 🔧 Configuración e Instalación

### Paso 1: Clonar e Instalar Dependencias

```bash
# Navegar al directorio del proyecto
cd sistema_gestion_clientes_seguros/nextjs_space

# Instalar dependencias
yarn install
```

### Paso 2: Crear Proyecto en Firebase

1. **Ir a Firebase Console**
   - Visita: https://console.firebase.google.com/
   - Inicia sesión con tu cuenta de Google

2. **Crear nuevo proyecto**
   - Haz clic en "Crear proyecto"
   - Nombre del proyecto: `sistema-clientes-seguros` (o el nombre que prefieras)
   - Ubicación: Selecciona tu región
   - **NO habilites Google Analytics por ahora** (puedes hacerlo después)
   - Haz clic en "Crear proyecto"

3. **Configurar aplicación web**
   - En el dashboard del proyecto, haz clic en el ícono web `</>`
   - Nombre de la app: `Sistema Clientes Seguros`
   - **NO marques** "Configurar Firebase Hosting"
   - Haz clic en "Registrar app"

4. **Copiar configuración**
   - Firebase te mostrará un objeto de configuración similar a esto:
   ```javascript
   const firebaseConfig = {
     apiKey: "tu-api-key-aqui",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto-id",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "123456789",
     appId: "tu-app-id"
   };
   ```
   - **¡GUARDA esta información!** La necesitarás en el siguiente paso

### Paso 3: Configurar Firebase Authentication

1. **Habilitar Authentication**
   - En el menú lateral izquierdo, ve a "Authentication"
   - Haz clic en "Comenzar"

2. **Configurar método de inicio de sesión**
   - Ve a la pestaña "Sign-in method"
   - Haz clic en "Correo electrónico/contraseña"
   - **Habilita** la primera opción (Correo electrónico/contraseña)
   - **NO habilites** la segunda opción (Vínculo de correo electrónico)
   - Haz clic en "Guardar"

### Paso 4: Configurar Firestore Database

1. **Crear base de datos**
   - En el menú lateral, ve a "Firestore Database"
   - Haz clic en "Crear base de datos"

2. **Configurar seguridad**
   - Selecciona "Comenzar en modo de prueba" (por ahora)
   - Haz clic en "Siguiente"

3. **Seleccionar ubicación**
   - Elige la ubicación más cercana a ti
   - Haz clic en "Listo"

4. **Configurar reglas de seguridad** (IMPORTANTE)
   - Ve a la pestaña "Reglas"
   - Reemplaza el contenido con estas reglas:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Los usuarios autenticados pueden leer y escribir sus datos
       match /clientes/{document} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
   - Haz clic en "Publicar"

### Paso 5: Configurar Variables de Entorno

1. **Crear archivo de variables de entorno**
   - En la raíz del proyecto (`sistema_gestion_clientes_seguros/nextjs_space/`), ya existe un archivo `.env`
   - Abre el archivo `.env` y reemplaza los valores con los de tu configuración de Firebase:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key-aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
```

2. **⚠️ IMPORTANTE**: 
   - Reemplaza TODOS los valores `tu-*` con los valores reales de tu configuración de Firebase
   - NO compartas estos valores públicamente
   - Asegúrate de que el archivo `.env` esté en tu `.gitignore`

### Paso 6: Ejecutar la Aplicación Localmente

1. **Iniciar el servidor de desarrollo**
   ```bash
   yarn dev
   ```

2. **Abrir en el navegador**
   - Ve a: http://localhost:3000
   - Deberías ver la pantalla de login/registro

3. **Probar la aplicación**
   - Registra una cuenta nueva
   - Prueba creando un cliente
   - Verifica que los datos se guarden en Firebase (ve a Firestore Database en la consola)

## 🚀 Despliegue en Producción

### Opción 1: Vercel (Recomendado)

1. **Preparar el repositorio**
   ```bash
   # Inicializar git (si no está inicializado)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Subir a GitHub (crear repo en github.com primero)
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```

2. **Desplegar en Vercel**
   - Ve a https://vercel.com
   - Conecta tu cuenta de GitHub
   - Selecciona tu repositorio
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configurar variables de entorno en Vercel**
   - En el dashboard de Vercel, ve a tu proyecto
   - Ve a Settings > Environment Variables
   - Agrega TODAS las variables del archivo `.env`:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
     - `NEXTAUTH_URL` (cambia a tu dominio de Vercel, ej: `https://tu-app.vercel.app`)

4. **Actualizar configuración de Firebase**
   - Ve a Firebase Console > Authentication > Settings
   - En "Dominios autorizados", agrega tu dominio de Vercel
   - Ejemplo: `tu-app.vercel.app`

### Opción 2: Netlify

1. **Preparar build para Netlify**
   - Crea un archivo `netlify.toml` en la raíz:
   ```toml
   [build]
     publish = ".next"
     command = "yarn build && yarn export"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Desplegar**
   - Ve a https://netlify.com
   - Conecta tu repositorio de GitHub
   - Configura las variables de entorno igual que en Vercel
   - Actualiza `NEXTAUTH_URL` con tu dominio de Netlify

## 📁 Estructura del Proyecto

```
sistema_gestion_clientes_seguros/nextjs_space/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal (dashboard o login)
│   └── globals.css         # Estilos globales
├── components/
│   ├── auth-provider.tsx   # Proveedor de autenticación
│   ├── login-form.tsx      # Formulario de login/registro
│   ├── dashboard.tsx       # Dashboard principal
│   ├── cliente-form.tsx    # Formulario completo de cliente
│   ├── dependiente-section.tsx  # Sección de dependientes
│   ├── delete-confirm-dialog.tsx # Diálogo de confirmación
│   └── ui/                 # Componentes de interfaz
├── lib/
│   ├── firebase.ts         # Configuración de Firebase
│   ├── types.ts            # Tipos TypeScript
│   └── utils.ts            # Utilidades
├── .env                    # Variables de entorno
├── package.json           # Dependencias
└── README.md              # Este archivo
```

## 🔒 Seguridad

### Configuración de Firestore (Producción)
Para producción, considera reglas más restrictivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden acceder a clientes
    match /clientes/{clienteId} {
      allow read, write: if request.auth != null 
        && request.auth.uid != null;
    }
    
    // Prevenir acceso a otros documentos
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Variables de Entorno
- **NUNCA** commits archivos `.env` a repositorios públicos
- Usa diferentes proyectos Firebase para desarrollo y producción
- Regenera claves si se comprometen

## 🛠️ Desarrollo y Mantenimiento

### Comandos Útiles
```bash
# Desarrollo
yarn dev                    # Servidor de desarrollo

# Build
yarn build                  # Construir para producción
yarn start                  # Ejecutar build de producción

# Linting
yarn lint                   # Verificar código

# Tipos
yarn type-check            # Verificar tipos TypeScript
```

### Backup de Datos
Para respaldar datos de Firestore:
1. Ve a Firebase Console > Firestore Database
2. Ve a la pestaña "Import/Export"
3. Selecciona "Export" y sigue las instrucciones

## 📞 Soporte

Si encuentras problemas:

1. **Errores de Firebase**:
   - Verifica que las variables de entorno estén correctas
   - Revisa las reglas de Firestore
   - Confirma que Authentication esté habilitado

2. **Errores de Build**:
   - Ejecuta `yarn build` localmente para verificar
   - Revisa los logs de Vercel/Netlify

3. **Errores de Permisos**:
   - Verifica las reglas de seguridad de Firestore
   - Confirma que el usuario esté autenticado

## 📝 Características Adicionales Disponibles

El sistema incluye funcionalidades avanzadas como:
- ✅ Formateo automático de campos (SS#, teléfonos, etc.)
- ✅ Validaciones en tiempo real
- ✅ Búsqueda instantánea y filtros
- ✅ Cálculos automáticos (edad, ingresos totales)
- ✅ Interfaz responsive y profesional
- ✅ Manejo de errores y notificaciones
- ✅ Confirmación con contraseña para eliminaciones
- ✅ Sección de dependientes expandible (3-7 dependientes)

## 🎯 Próximos Pasos Recomendados

1. **Personalización**:
   - Ajustar colores y branding según tu empresa
   - Agregar logo personalizado

2. **Funcionalidades adicionales**:
   - Exportar datos a PDF/Excel
   - Reportes y analytics
   - Notificaciones por email

3. **Seguridad avanzada**:
   - Roles de usuario (admin, agente, etc.)
   - Auditoría de cambios
   - Backup automático

---

**¡Tu sistema de gestión de clientes de seguros está listo para usar!** 🎉

Para cualquier duda o personalización, revisa la documentación o contacta al desarrollador.
