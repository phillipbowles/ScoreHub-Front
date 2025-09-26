# Score Hub Frontend - React Native

Aplicación móvil de Score Hub desarrollada en React Native con Expo, conectada a un backend Laravel.

## 📋 Características

- ✅ Sistema de autenticación completo (Login/Register)
- ✅ Conexión con backend Laravel via API REST
- ✅ Gestión de usuarios y autenticación JWT
- ✅ Creación y gestión de juegos personalizados
- ✅ Interfaz moderna con Tailwind CSS
- ✅ Navegación nativa optimizada
- ✅ Soporte para múltiples plataformas (iOS/Android/Web)

## 🛠 Tecnologías

- **React Native** con **Expo 54**
- **TypeScript** para tipado estático
- **NativeWind** (Tailwind CSS para React Native)
- **React Navigation 7** para navegación
- **AsyncStorage** para persistencia local
- **API REST** conectada a Laravel backend

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos

- **Node.js 18+**
- **npm o yarn**
- **Expo CLI**
- **Expo Go** app en tu celular (iOS/Android)
- **Backend Laravel** configurado y corriendo

### 🔧 Paso a paso

#### 1. Clonar/Descargar el proyecto
```bash
# Si tienes Git
git clone [URL_DEL_REPOSITORIO]
cd ScoreHub-Front

# O descomprimir el archivo ZIP en una carpeta llamada ScoreHub-Front
```

#### 2. Instalar dependencias
```bash
npm install
# o
yarn install
```

#### 3. Instalar Expo CLI (si no lo tienes)
```bash
npm install -g @expo/cli
```

#### 4. Instalar Expo Go en tu celular
- **iOS:** https://apps.apple.com/app/expo-go/id982107779
- **Android:** https://play.google.com/store/apps/details?id=host.exp.exponent

#### 5. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```bash
# Para simulador/desarrollo local
API_BASE_URL=http://localhost:8000/api
API_TIMEOUT=10000

# Para dispositivo físico (reemplaza con tu IP local)
# API_BASE_URL=http://192.168.1.XXX:8000/api

# Para usar con ngrok
# API_BASE_URL=https://tu-url-ngrok.ngrok.io/api
```

#### 6. Iniciar la aplicación
```bash
npx expo start
```

#### 7. Abrir en tu dispositivo
1. Se abrirá automáticamente una página en tu navegador con un QR code
2. **Android**: Abrir Expo Go → Tocar "Scan QR Code" → Escanear
3. **iOS**: Abrir app Cámara → Enfocar al QR → Tocar "Abrir con Expo Go"

¡La app se cargará automáticamente y cualquier cambio se reflejará instantáneamente!

## 📱 Configuración según tu entorno

### Opción 1: Simulador (recomendado para empezar)
1. **En la terminal de Expo presiona:**
   - `i` para iOS Simulator
   - `a` para Android Emulator
   - `w` para navegador web

2. **URL del backend:** `http://localhost:8000/api`

### Opción 2: Dispositivo físico - misma WiFi
1. **Obtén tu IP local:**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Windows
   ipconfig
   ```

2. **Inicia el backend con acceso de red:**
   ```bash
   cd Score-Hub-Back
   php artisan serve --host=0.0.0.0 --port=8000
   ```

3. **Actualiza el archivo `.env` del frontend:**
   ```bash
   API_BASE_URL=http://TU_IP_LOCAL:8000/api
   ```

4. **Inicia Expo:**
   ```bash
   npx expo start
   ```

5. **Escanea el QR con Expo Go**

### Opción 3: Dispositivo físico - redes diferentes (ngrok)
1. **Instala ngrok:**
   ```bash
   # Mac
   brew install ngrok

   # Otras plataformas: https://ngrok.com/download
   ```

2. **Regístrate en ngrok:**
   - Ve a https://dashboard.ngrok.com/signup
   - Obtén tu authtoken

3. **Configura ngrok:**
   ```bash
   ngrok config add-authtoken TU_TOKEN_AQUI
   ```

4. **Inicia el backend normalmente:**
   ```bash
   cd Score-Hub-Back
   php artisan serve
   ```

5. **En otra terminal, crea el túnel:**
   ```bash
   ngrok http 8000
   ```

6. **Copia la URL https que te da ngrok y actualiza `.env`:**
   ```bash
   API_BASE_URL=https://abc123def.ngrok.io/api
   ```

7. **Inicia Expo con túnel:**
   ```bash
   npx expo start --tunnel
   ```

## 📦 Scripts Disponibles

```bash
# Iniciar en desarrollo
npm start

# Limpiar cache y reiniciar
npx expo start --clear

# Abrir en iOS simulator
npx expo start --ios

# Abrir en Android emulator
npx expo start --android

# Abrir en navegador web
npx expo start --web

# Usar túnel para dispositivos remotos
npx expo start --tunnel
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Input, Card)
│   └── game/            # Componentes específicos del juego
├── screens/
│   ├── auth/            # Login y Register
│   ├── game/            # Pantallas de juego
│   └── HomeScreen.tsx   # Pantalla principal
├── navigation/
│   └── AppNavigator.tsx # Configuración de navegación
├── types/
│   └── index.ts         # Tipos TypeScript
├── utils/
│   ├── api.ts           # Servicio para llamadas al backend
│   └── storage.ts       # Utilidades de almacenamiento
└── styles/
    └── global.ts        # Estilos globales
```

## 🐛 Solución de Problemas

### Error "Network request failed"
**Causa:** El frontend no puede conectarse al backend
**Soluciones:**
1. **Verifica que el backend esté corriendo:**
   ```bash
   curl http://localhost:8000
   ```

2. **Si usas dispositivo físico, verifica la IP:**
   ```bash
   # Obtén tu IP y actualiza .env
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

3. **Reinicia Expo:**
   ```bash
   npx expo start --clear
   ```

### Error "Could not connect to development server"
**Soluciones:**
1. **Usa túnel de Expo:**
   ```bash
   npx expo start --tunnel
   ```

2. **O usa ngrok como se describe arriba**

### La app se cierra al hacer login/registro
**Causa:** Problemas con el backend o JWT
**Soluciones:**
1. **Revisa los logs en la consola de Expo**
2. **Verifica que el backend esté retornando el formato correcto**
3. **Asegúrate de que JWT_SECRET esté configurado en el backend:**
   ```bash
   # En el .env del backend
   JWT_SECRET=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
   ```

### Error: "expo: command not found"
**Solución**: Usar `npx expo start` en lugar de `expo start`

### Error: Metro bundler issues
**Solución**: Limpiar caché
```bash
npx expo start --clear
```

### Variables de entorno no se cargan
**Soluciones:**
1. **Reinicia completamente Expo:**
   ```bash
   # Ctrl+C para parar
   npx expo start --clear
   ```

2. **Verifica que el archivo `.env` esté en la raíz del proyecto**

### Problemas con dependencias
**Solución**: Reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

### Error en iPhone: "Unable to verify app"
**Solución**: En iPhone ir a Configuración → General → Gestión de dispositivos → Confiar en la aplicación

### Backend devuelve error 500
**Causa:** Configuración incorrecta del backend
**Soluciones:**
1. **Verifica el archivo .env del backend**
2. **Ejecuta las migraciones:**
   ```bash
   cd Score-Hub-Back
   php artisan migrate
   ```
3. **Verifica que SQLite esté configurado correctamente**

## Desarrollo

### Agregar nuevas dependencias
```bash
# Para dependencias normales
npm install nombre-paquete

# Para dependencias específicas de Expo
npx expo install nombre-paquete
```

### Estructura de branches recomendada
- `main`: Código estable
- `develop`: Desarrollo activo
- `feature/nombre-feature`: Nuevas características

### Comandos útiles para desarrollo
```bash
# Ver logs en tiempo real
npx expo start --dev-client

# Generar build para testing
npx expo build:android
npx expo build:ios

# Publicar update (sin rebuild)
npx expo publish
```

## Variables de Entorno

El archivo `.env` puede contener:

```env
# API Configuration
API_BASE_URL=http://localhost:3000/api
API_TIMEOUT=10000
NODE_ENV=development

# Para testing en dispositivo físico, reemplazar localhost con tu IP
# Encontrar IP: ifconfig (Mac/Linux) o ipconfig (Windows)
# API_BASE_URL=http://192.168.1.100:3000/api
```

## Testing en Dispositivo Físico vs Web

### Dispositivo físico (recomendado)
- Experiencia completa de app móvil
- Testing de gestos y navegación nativa
- Performance real

### Web (para desarrollo rápido)
```bash
npx expo start --web
```
- Más rápido para probar UI
- DevTools del navegador
- No todas las funciones nativas disponibles

## Contribución

1. Fork del repositorio
2. Crear branch: `git checkout -b feature/nueva-caracteristica`
3. Commit: `git commit -m 'Add nueva característica'`
4. Push: `git push origin feature/nueva-caracteristica`
5. Crear Pull Request

## Equipo de Desarrollo

Proyecto desarrollado para la materia Ingeniería de Software 2 - Universidad de Montevideo.

## Licencia

Este proyecto es parte de un trabajo académico.