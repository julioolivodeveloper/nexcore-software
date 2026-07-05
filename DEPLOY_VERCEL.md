# 🚀 Desplegar Sistema de Contabilidad en Vercel + Supabase

Tu sistema de contabilidad estará accesible públicamente en una URL tipo:
```
https://nexcore-software.vercel.app/accounting/login
```

## 📋 Pasos para Desplegar

### PASO 1: Crear Proyecto Supabase (BD)

1. Ve a https://supabase.com
2. Click en **"New Project"**
3. Completa:
   - **Project Name:** `nexcore-accounting`
   - **Database Password:** (guarda esta contraseña)
   - **Region:** Elige la más cercana a ti
4. Click en **"Create new project"** (espera 2-3 minutos)

### PASO 2: Obtener Credenciales de Supabase

1. Una vez creado el proyecto, ve a **Settings → API**
2. Copia estos valores:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

Ejemplo:
```
SUPABASE_URL=https://abcdef123456.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### PASO 3: Crear Tablas en Supabase

1. En Supabase, ve a **SQL Editor**
2. Click en **"New Query"**
3. Copia y pega esto:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  tax_id TEXT,
  business_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de facturas
CREATE TABLE invoices (
  id BIGSERIAL PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  client_id BIGINT NOT NULL REFERENCES clients(id),
  issue_date TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP,
  status TEXT DEFAULT 'draft',
  subtotal NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de ítems de factura
CREATE TABLE invoice_items (
  id BIGSERIAL PRIMARY KEY,
  invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  amount NUMERIC NOT NULL
);

-- Tabla de transacciones
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  category TEXT,
  invoice_id BIGINT REFERENCES invoices(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
```

4. Click en **"Run"**

### PASO 4: Registrar Usuario Admin en Supabase

1. Ve a **Table Editor** en Supabase
2. Click en tabla **"users"**
3. Click en **"Insert row"**
4. Rellena:
   - **email:** `jojulioneto1@gmail.com`
   - **password:** `$2a$10$...` (usa bcrypt hash de "Julioolivo94@")
   - **name:** `Admin Julio`

⚠️ La contraseña debe estar hasheada. Usa esto en terminal:
```bash
node -e "console.log(require('bcryptjs').hashSync('Julioolivo94@', 10))"
```

O usa esta contraseña hasheada lista:
```
$2a$10$YOu7.MZZdVJQaZHrxgY8L.cVp8cNRqbzPvKzqM8rX9e5BvZqN9VCe
```

### PASO 5: Push a GitHub

```bash
cd /Users/jeoh123/nexcore-software

git add -A
git commit -m "feat: add Vercel and Supabase configuration for production deployment"
git push origin main
```

### PASO 6: Desplegar en Vercel

1. Ve a https://vercel.com
2. Login con GitHub
3. Click en **"Import Project"**
4. Selecciona el repositorio **nexcore-software**
5. En **Environment Variables**, agrega:

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOi...
SESSION_SECRET = nexcore-accounting-secure-secret-key-2024
```

6. Click en **"Deploy"** (espera 2-3 minutos)

### PASO 7: Acceder al Sistema

Una vez desplegado, ve a:
```
https://tu-proyecto.vercel.app/accounting/login
```

Login:
- **Email:** jojulioneto1@gmail.com
- **Contraseña:** Julioolivo94@

---

## ✅ Checklist de Despliegue

- [ ] Proyecto Supabase creado
- [ ] Credenciales de Supabase obtenidas
- [ ] Tablas SQL creadas en Supabase
- [ ] Usuario admin registrado en Supabase
- [ ] Código pusheado a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deploy completado
- [ ] Login funciona en URL pública

---

## 🔗 URLs Útiles

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Tu Sitio Desplegado:** https://nexcore-software.vercel.app
- **GitHub Repositorio:** https://github.com/julioolivodeveloper/nexcore-software

---

## 📞 Soporte

Si tienes problemas:

1. Verifica que las variables de entorno están bien en Vercel
2. Revisa los logs en Vercel → Deployments → [Tu deploy] → Logs
3. Asegúrate que Supabase está corriendo y las tablas existen
4. Confirma que el usuario admin está registrado con contraseña hasheada

---

¡Listo! Tu sistema de contabilidad estará disponible públicamente 🎉
