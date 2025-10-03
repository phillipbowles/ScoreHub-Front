#!/bin/bash

# Script para detectar automáticamente la IP local y generar configuración

echo "🔍 Detectando IP local..."

# Detectar IP local WiFi (generalmente empieza con 192.168 o 172)
# Priorizar WiFi sobre otras interfaces
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | grep -E "^(192\.168|172\.(1[6-9]|2[0-9]|3[01]))" | head -1)

# Si no encuentra, usar cualquier IP que no sea localhost
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
fi

if [ -z "$LOCAL_IP" ]; then
    echo "❌ No se pudo detectar la IP local"
    echo "💡 Usando localhost por defecto"
    LOCAL_IP="localhost"
fi

echo "✅ IP detectada: $LOCAL_IP"

# Crear archivo de configuración TypeScript
cat > src/config/api-config.ts << EOF
// 🤖 Archivo generado automáticamente por detect-ip.sh
// NO EDITES ESTE ARCHIVO MANUALMENTE

export const API_CONFIG = {
  LOCAL_IP: '${LOCAL_IP}',
  PORT: '80',
  BASE_PATH: '/api',
};

export const getApiUrl = () => {
  return \`http://\${API_CONFIG.LOCAL_IP}\${API_CONFIG.PORT === '80' ? '' : ':' + API_CONFIG.PORT}\${API_CONFIG.BASE_PATH}\`;
};
EOF

echo "📝 Configuración generada en src/config/api-config.ts"
echo "🌐 API URL: http://${LOCAL_IP}/api"
echo ""
echo "✅ ¡Listo! Ahora puedes iniciar Expo"
