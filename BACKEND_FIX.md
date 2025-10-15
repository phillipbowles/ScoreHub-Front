# Fix Backend Auth para JWT

## Problema
Las rutas protegidas usan `middleware(['auth'])` que por defecto usa el guard `web` (sesiones) en lugar del guard `api` (JWT).

## Solución 1: Cambiar el .env (Recomendado)

Agregar en `/Score-Hub-Back/.env`:

```env
AUTH_GUARD=api
```

Luego reiniciar el servidor:
```bash
cd Score-Hub-Back
sail artisan config:clear
sail restart
```

## Solución 2: Cambiar las rutas

En `/Score-Hub-Back/routes/api.php`, cambiar:

```php
// ANTES
Route::middleware(['auth'])->group(static function (): void {

// DESPUÉS
Route::middleware(['auth:api'])->group(static function (): void {
```

## Verificar

Después de aplicar el fix, deberías ver en los logs del frontend:
```
🔑 Token: eyJ0eXAiOiJKV1QiLCJ...
✅ GET /games - Success
```

En lugar de:
```
❌ GET /games - Status 401
```
