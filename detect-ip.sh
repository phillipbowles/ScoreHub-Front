#!/bin/bash

# Script para detectar automáticamente la IP local y verificar conectividad con el backend

echo "🔍 Detectando IPs locales..."

# Obtener TODAS las IPs locales (excluyendo localhost)
ALL_IPS=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}')

if [ -z "$ALL_IPS" ]; then
    echo "❌ No se encontraron IPs locales"
    exit 1
fi

echo "📍 IPs encontradas:"
echo "$ALL_IPS" | while read ip; do echo "   - $ip"; done
echo ""

# Función para verificar si el backend responde
test_backend() {
    local ip=$1
    local url="http://${ip}/api/users"

    # Timeout de 2 segundos
    if curl -s --max-time 2 "$url" > /dev/null 2>&1; then
        return 0  # Éxito
    else
        return 1  # Fallo
    fi
}

WORKING_IP=""

# Probar cada IP hasta encontrar una que funcione
echo "🔎 Probando conectividad con el backend..."
while IFS= read -r ip; do
    echo -n "   Probando $ip... "
    if test_backend "$ip"; then
        echo "✅ ¡Funciona!"
        WORKING_IP=$ip
        break
    else
        echo "❌ No responde"
    fi
done <<< "$ALL_IPS"

# Si no encontró ninguna IP que funcione
if [ -z "$WORKING_IP" ]; then
    echo ""
    echo "❌ ERROR: No se pudo conectar al backend en ninguna IP"
    echo ""
    echo "🔧 Verifica que el backend esté corriendo:"
    echo "   cd Score-Hub-Back"
    echo "   ./vendor/bin/sail up -d"
    echo ""
    echo "💡 O verifica manualmente con:"
    while IFS= read -r ip; do
        echo "   curl http://${ip}/api/users"
    done <<< "$ALL_IPS"
    exit 1
fi

echo ""
echo "✅ Backend accesible en: $WORKING_IP"
echo ""

# Crear archivo de configuración TypeScript
cat > src/config/api-config.ts << EOF
// 🤖 Archivo generado automáticamente por detect-ip.sh
// NO EDITES ESTE ARCHIVO MANUALMENTE
// Última actualización: $(date)

export const API_CONFIG = {
  LOCAL_IP: '${WORKING_IP}',
  PORT: '80',
  BASE_PATH: '/api',
};

export const getApiUrl = () => {
  return \`http://\${API_CONFIG.LOCAL_IP}\${API_CONFIG.PORT === '80' ? '' : ':' + API_CONFIG.PORT}\${API_CONFIG.BASE_PATH}\`;
};
EOF

echo "📝 Configuración guardada en src/config/api-config.ts"
echo "🌐 API URL: http://${WORKING_IP}/api"
echo ""
echo "✅ ¡Listo! Ahora puedes iniciar Expo con: npx expo start"
