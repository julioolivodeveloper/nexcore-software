# 📊 Sistema de Contabilidad Privado - Nexcore Software

## 🚀 Inicio Rápido

El servidor está corriendo en: **http://localhost:3003**

### Credenciales de Acceso
- **Email:** jojulioneto1@gmail.com
- **Contraseña:** Julioolivo94@

### URLs de Acceso
- **Login:** http://localhost:3003/accounting/login
- **Dashboard:** http://localhost:3003/accounting/dashboard
- **Facturas:** http://localhost:3003/accounting/invoices
- **Clientes:** http://localhost:3003/accounting/clients
- **Reportes:** http://localhost:3003/accounting/reports

---

## 📋 Funcionalidades

### 1. **Dashboard** 📈
- Vista general de ingresos totales
- Total de facturas emitidas
- Cantidad de clientes registrados
- Facturas pendientes de pago
- Gráfico de ingresos últimos 12 meses

### 2. **Gestión de Clientes** 👥
- Registrar nuevos clientes
- Editar información de cliente
- Eliminar clientes
- Información completa: nombre, email, teléfono, dirección, RUC/Cédula, empresa

### 3. **Gestión de Facturas** 📄
- Crear facturas dinámicas
- Agregar múltiples ítems por factura
- Cálculo automático de subtotal, IVA (13%) y total
- Descargar facturas en PDF
- Estados: draft (borrador) y paid (pagada)
- Gestión completa de facturas: crear, editar, eliminar

### 4. **Generación de PDF** 📥
- Descarga automática de facturas en PDF
- Incluye:
  - Información del negocio (Nexcore Software)
  - Datos del cliente (nombre, empresa, RUC, dirección, email, teléfono)
  - Detalles de la factura (número, fecha, vencimiento)
  - Ítems con descripción, cantidad, precio unitario
  - Cálculo de subtotal, IVA y total
  - Notas adicionales

### 5. **Reportes** 📋
- Ingresos totales generados
- Facturas pagadas
- Clientes activos
- Clientes principales (top 10 por monto gastado)
- Ingresos por período (mensual, diario, anual)

---

## 🔧 Estructura del Proyecto

```
/nexcore-software/
├── server.js                 # Servidor principal
├── package.json              # Dependencias
├── .env                       # Variables de entorno
├── accounting.db              # Base de datos SQLite
│
├── db/
│   ├── database.js           # Conexión a BD
│   └── schema.sql            # Esquema de tablas
│
├── routes/
│   ├── auth.js              # Rutas de autenticación (login, logout, registro)
│   ├── clients.js           # CRUD de clientes
│   ├── invoices.js          # CRUD de facturas + generación PDF
│   └── reports.js           # Endpoints de reportes
│
├── middleware/
│   └── auth.js              # Middleware de autenticación
│
├── views/
│   ├── login.html           # Página de login
│   ├── dashboard.html       # Dashboard principal
│   ├── clients.html         # Gestión de clientes
│   ├── invoices.html        # Gestión de facturas
│   └── reports.html         # Reportes
│
└── public/                    # Sitio web estático original
    ├── index.html
    ├── contratistas.html
    ├── etc...
```

---

## 🗄️ Base de Datos

### Tablas Principales

**users**
- Credenciales de administrador
- Almacenadas con hash bcrypt

**clients**
- Información de clientes
- Email, teléfono, dirección, RUC/Cédula

**invoices**
- Facturas emitidas
- Estados: draft, paid
- Subtotal, IVA (13%), total

**invoice_items**
- Ítems individuales de cada factura
- Descripción, cantidad, precio unitario, monto

**transactions**
- Registro de transacciones por factura
- Para futuros reportes de movimientos

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcryptjs
- ✅ Sesiones HTTP-only secure
- ✅ Middleware de autenticación en rutas privadas
- ✅ Base de datos SQLite local (sin datos en nube)
- ✅ CORS configurado

---

## 📦 Dependencias

- **express** - Framework web
- **sqlite3** - Base de datos
- **bcryptjs** - Hashing de contraseñas
- **express-session** - Gestión de sesiones
- **pdfkit** - Generación de PDFs
- **cors** - Control de CORS
- **uuid** - Generación de IDs únicos
- **dotenv** - Variables de entorno

---

## 🚀 Comandos

```bash
# Iniciar servidor
npm start

# O en desarrollo
npm run dev
```

---

## 📱 Flujo de Uso

### Crear una Factura
1. Ir a **Facturas**
2. Click en **➕ Nueva Factura**
3. Seleccionar cliente (crear si no existe en **Clientes**)
4. Agregar ítems:
   - Descripción del servicio
   - Cantidad
   - Precio unitario
5. Los totales se calculan automáticamente
6. Guardar factura
7. Descargar como PDF cuando esté lista

### Registrar Cliente
1. Ir a **Clientes**
2. Click en **➕ Nuevo Cliente**
3. Llenar información:
   - Nombre (requerido)
   - Email, teléfono, dirección (opcionales)
   - RUC/Cédula, empresa (opcionales)
4. Guardar

### Ver Reportes
1. Ir a **Reportes**
2. Ver:
   - Ingresos totales
   - Facturas pagadas
   - Clientes activos
   - Top 10 clientes por gasto
   - Ingresos por período

---

## 💡 Notas

- Las facturas se generan en **draft** por defecto
- El IVA es del **13%** (configurado en las rutas)
- Los PDFs incluyen el número de factura, fecha y datos del cliente
- Los datos se guardan en `accounting.db` (SQLite local)
- El servidor corre en puerto **3003**

---

## 🔄 Flujo Técnico de una Factura

1. Usuario crea factura en `/accounting/invoices`
2. Frontend calcula subtotal automáticamente
3. POST a `/api/invoices` con cliente e ítems
4. Backend calcula IVA (13%) y total
5. Guarda factura en `invoices` table
6. Guarda cada ítem en `invoice_items` table
7. Usuario puede descargar PDF desde `/api/invoices/{id}/pdf`
8. PDFKit genera PDF con datos de factura y cliente

---

## 🎯 Próximas Mejoras (Opcionales)

- Cambiar estado de factura (draft → paid)
- Exportar reportes a Excel
- Envío de facturas por email
- Múltiples usuarios con permisos
- Categorías de gasto
- Dashboard más detallado con gráficos

---

**Sistema creado para Nexcore Software - Contabilidad Privada** ✨
