# ScoreHub - Mobile Scoring App

Aplicación móvil para llevar el marcador de juegos de mesa, desarrollada con React Native, TypeScript y Tailwind CSS.

## Características

- Sistema de autenticación (Login/Register)
- Contador de puntos para múltiples jugadores
- Interfaz moderna y minimalista
- Soporte para diferentes tipos de juegos
- Historial de partidas

## Tecnologías

- **React Native** con **Expo**
- **TypeScript** para tipado estático
- **NativeWind** (Tailwind CSS para React Native)
- **React Navigation** para navegación
- **AsyncStorage** para persistencia local

## Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Smartphone** (Android o iOS)

### Paso a paso

#### 1. Clonar el repositorio
```bash
git clone https://github.com/phillipbowles/ScoreHub-Front.git
cd ScoreHub-Front
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Instalar Expo Go en tu celular
- **Android**: Google Play Store → Buscar "Expo Go" → Instalar
- **iOS**: App Store → Buscar "Expo Go" → Instalar

#### 4. Configurar variables de entorno (opcional)
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env si necesitas conectar con backend
# Por defecto funciona sin backend
```

#### 5. Iniciar la aplicación
```bash
npx expo start
```

#### 6. Abrir en tu celular
1. Se abrirá automáticamente una página en tu navegador con un QR code
2. **Android**: Abrir Expo Go → Tocar "Scan QR Code" → Escanear
3. **iOS**: Abrir app Cámara → Enfocar al QR → Tocar "Abrir con Expo Go"

La app se cargará automáticamente en tu celular y cualquier cambio en el código se reflejará instantáneamente (hot reload).

## Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start
# o
npx expo start

# Iniciar con caché limpio (si hay problemas)
npx expo start --clear

# Abrir directamente en Android (si tienes emulador)
npx expo start --android

# Abrir directamente en iOS (solo macOS con simulador)
npx expo start --ios

# Ejecutar en navegador web
npx expo start --web
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

## Solución de Problemas

### Error: "expo: command not found"
**Solución**: Usar `npx expo start` en lugar de `expo start`

### Error: Metro bundler issues
**Solución**: Limpiar caché
```bash
npx expo start --clear
```

### Error: "Network response timed out"
**Solución**: Asegúrate de estar en la misma red WiFi que tu computadora

### No aparece el QR code
**Solución**: 
1. Abrir manualmente http://localhost:19002 en tu navegador
2. O usar modo túnel: `npx expo start --tunnel`

### Problemas con dependencias
**Solución**: Reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
npx expo start
```

### Error en iPhone: "Unable to verify app"
**Solución**: En iPhone ir a Configuración → General → Gestión de dispositivos → Confiar en la aplicación

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