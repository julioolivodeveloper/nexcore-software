# 🚀 Instrucciones de Setup - Sistema de Contabilidad

Tu sistema estará en: **https://julioolivodeveloper.com/accounting**

## ✅ PASO 1: Crear Tablas en Supabase (2 minutos)

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto **"financialinnovationaccounting"**
3. Click en **"SQL Editor"** (lado izquierdo)
4. Click en **"New Query"**
5. **Copia TODO el contenido** de este archivo: `db/create-tables.sql`
6. **Pega en Supabase** y click en **"Run"**
7. ✅ Las tablas están creadas

---

## ✅ PASO 2: Crear Usuario Admin en Supabase (1 minuto)

1. En Supabase, click en **"Table Editor"**
2. Click en tabla **"users"**
3. Click en **"Insert row"**
4. Rellena:
   - **email:** `jojulioneto1@gmail.com`
   - **password:** `$2a$10$YOu7.MZZdVJQaZHrxgY8L.cVp8cNRqbzPvKzqM8rX9e5BvZqN9VCe` (copiar exacto)
   - **name:** `Admin Julio`
5. Click en **"Save"**
6. ✅ Usuario admin creado

---

## ✅ PASO 3: Push a GitHub (1 minuto)

```bash
cd /Users/jeoh123/nexcore-software

git add -A
git commit -m "feat: add Supabase credentials and setup instructions"
git push origin main
```

---

## ✅ PASO 4: Configurar Variables en Vercel (2 minutos)

1. Ve a https://vercel.com
2. Click en tu proyecto **"nexcore-software"** (o el que está conectado a tu dominio)
3. Click en **"Settings"** → **"Environment Variables"**
4. Agrega estas 3 variables:

```
SUPABASE_URL = https://otdwdjxcknpzkilfjktt.supabase.co

SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZHdkanhja25wemtsbGZqa3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMDg5NDAsImV4cCI6MjA5ODc4NDk0MH0.KIR3P8sWrt3CSRgsdBQZP6j-TfcFzzP4ipQ4DOGgLqg

SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZHdkanhja25wemtsbGZqa3R0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzIwODk0MCwiZXhwIjoyMDk4Nzg0OTQwfQ.1PKbmVFdATkNgU1ddoh2GsYk8HzYlmBc7zcJ6NmDTSw

SESSION_SECRET = nexcore-accounting-secure-secret-key-2024
```

5. Click en **"Save"**
6. ✅ Variables configuradas

---

## ✅ PASO 5: Hacer Deploy (1 minuto)

En Vercel:
1. Click en **"Deployments"**
2. Click en los 3 puntos del último deploy
3. Click en **"Redeploy"**
4. Espera 2-3 minutos
5. ✅ Deploy completado

---

## ✅ LISTO! 🎉

Accede a tu sistema en:

```
https://julioolivodeveloper.com/accounting/login
```

**Credenciales:**
- 📧 Email: `jojulioneto1@gmail.com`
- 🔒 Contraseña: `Julioolivo94@`

---

## 📱 URLs del Sistema

- **Login:** https://julioolivodeveloper.com/accounting/login
- **Dashboard:** https://julioolivodeveloper.com/accounting/dashboard
- **Clientes:** https://julioolivodeveloper.com/accounting/clients
- **Facturas:** https://julioolivodeveloper.com/accounting/invoices
- **Reportes:** https://julioolivodeveloper.com/accounting/reports

---

## ⏱️ Tiempo Total: 7 minutos

1. Crear tablas: 2 min
2. Crear usuario: 1 min
3. Push a GitHub: 1 min
4. Configurar Vercel: 2 min
5. Deploy: 1 min

---

## 🔐 Notas de Seguridad

⚠️ **Antes de desplegar en producción:**
- [ ] Cambiar SESSION_SECRET a un valor aleatorio
- [ ] Cambiar contraseña admin en Supabase
- [ ] Verificar que no hay logs o datos sensibles en GitHub

---

¿Necesitas ayuda con algún paso? 🚀
