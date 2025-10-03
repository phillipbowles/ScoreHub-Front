# 🚀 Guía de Inicio Rápido - Score Hub

## Cada Día (Pasos Simples)

### 1️⃣ Iniciar Backend
```bash
cd Score-Hub-Back
./vendor/bin/sail up -d
```
✅ Esto inicia Laravel con PostgreSQL en Docker (puerto 80)

### 2️⃣ Detectar IP y Iniciar Frontend
```bash
cd ScoreHub-Front

# Detecta tu IP automáticamente
./detect-ip.sh

# Inicia Expo
npx expo start
```

### 3️⃣ Escanear QR desde tu celular
- Abre **Expo Go** en tu celular
- Escanea el QR que aparece en la terminal
- ¡Listo! 🎉

---

## 🛑 Para Detener Todo

```bash
# Detener backend
cd Score-Hub-Back
./vendor/bin/sail down

# Detener Expo (Ctrl+C en la terminal)
```

---

## ❓ ¿Cuándo ejecutar `detect-ip.sh`?

Ejecuta `./detect-ip.sh` cuando:
- ✅ **Cada vez que inicies la app** (por las dudas)
- ✅ Te conectes a otra red WiFi
- ✅ Reinicies tu router
- ✅ La app no se conecte al backend

El script detecta automáticamente tu IP y actualiza la configuración. **Toma 1 segundo**.

---

## 🔍 Verificación Rápida

Si algo no funciona:

```bash
# ¿Backend corriendo?
curl http://localhost/api/users

# Deberías ver: {"data":[...]}
```

---

## 📌 Resumen Ultra Corto

**Cada día:**
```bash
# Terminal 1
cd Score-Hub-Back && ./vendor/bin/sail up -d

# Terminal 2
cd ScoreHub-Front && ./detect-ip.sh && npx expo start
```

Escanea QR → ¡A usar la app! 🚀

---

## 🤔 ¿Qué hace `detect-ip.sh`?

1. Detecta automáticamente tu IP local (ej: `192.168.1.100`)
2. Genera el archivo `src/config/api-config.ts` con tu IP
3. La app usa esta IP para conectarse al backend

**No necesitas editar código nunca más** ✨
