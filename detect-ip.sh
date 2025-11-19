#!/bin/bash

# Script para detectar automáticamente la IP local y verificar conectividad con el backend
# Si no se encuentra backend local, usa la URL de Railway configurada

# ========================================
# CONFIGURACIÓN - Cambia esto según tu entorno
# ========================================
# URL del backend desplegado en Railway (sin /api al final)
RAILWAY_URL="https://laravel-app-production-b5cb.up.railway.app"

echo "🔍 Detectando configuración del backend..."
echo ""

# Crear directorio config si no existe
mkdir -p src/config

# Obtener TODAS las IPs locales (excluyendo localhost)
ALL_IPS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}')

# Función para verificar si el backend responde
test_backend() {
    local url=$1
    # Timeout de 3 segundos
    if curl -s --max-time 3 "$url/api/users" > /dev/null 2>&1; then
        return 0  # Éxito
    else
        return 1  # Fallo
    fi
}

WORKING_URL=""
USE_RAILWAY=false

# Si hay IPs locales, probarlas primero
if [ -n "$ALL_IPS" ]; then
    echo "📍 IPs locales encontradas:"
    echo "$ALL_IPS" | while read ip; do echo "   - $ip"; done
    echo ""

    echo "🔎 Probando conectividad con backend local..."
    while IFS= read -r ip; do
        echo -n "   Probando http://$ip... "
        if test_backend "http://$ip"; then
            echo "✅ ¡Funciona!"
            WORKING_URL="http://$ip"
            break
        else
            echo "❌ No responde"
        fi
    done <<< "$ALL_IPS"
fi

# Si no encontró backend local, probar Railway
if [ -z "$WORKING_URL" ]; then
    echo ""
    echo "ℹ️  No se encontró backend local activo"
    echo "🌐 Probando conexión con Railway..."
    echo -n "   Probando $RAILWAY_URL... "

    if test_backend "$RAILWAY_URL"; then
        echo "✅ ¡Funciona!"
        WORKING_URL="$RAILWAY_URL"
        USE_RAILWAY=true
    else
        echo "❌ No responde"
        echo ""
        echo "⚠️  No se pudo conectar a ningún backend"
        echo ""
        echo "📝 Se creará el archivo de configuración con Railway como fallback"
        echo "   Actualiza la URL en detect-ip.sh (línea 8) o edita manualmente:"
        echo "   src/config/api-config.ts"
        WORKING_URL="$RAILWAY_URL"
        USE_RAILWAY=true
    fi
fi

echo ""
if [ "$USE_RAILWAY" = true ]; then
    echo "✅ Usando backend en Railway: $WORKING_URL"
else
    echo "✅ Usando backend local: $WORKING_URL"
fi
echo ""

# Crear archivo de configuración TypeScript
cat > src/config/api-config.ts << EOF
// 🤖 Archivo generado automáticamente por detect-ip.sh
// Última actualización: $(date)
// Modo: $(if [ "$USE_RAILWAY" = true ]; then echo "Railway (remoto)"; else echo "Local"; fi)

export const API_CONFIG = {
  BASE_URL: '${WORKING_URL}',
  BASE_PATH: '/api',
};

export const getApiUrl = () => {
  return \`\${API_CONFIG.BASE_URL}\${API_CONFIG.BASE_PATH}\`;
};

// Para desarrollo: descomenta y usa tu IP local si el backend corre localmente
// export const API_CONFIG = {
//   BASE_URL: 'http://192.168.1.XXX',
//   BASE_PATH: '/api',
// };
EOF

echo "📝 Configuración guardada en src/config/api-config.ts"
echo "🌐 API URL: ${WORKING_URL}/api"
echo ""

if [ "$USE_RAILWAY" = true ]; then
    echo "💡 IMPORTANTE: Si esta URL no es correcta, actualiza la variable RAILWAY_URL"
    echo "   en detect-ip.sh (línea 9) con la URL real de tu backend en Railway"
    echo ""
fi

echo "✅ ¡Listo! Ahora puedes iniciar Expo con: npx expo start"
echo ""
