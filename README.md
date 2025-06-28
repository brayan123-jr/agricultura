# Plataforma de Comercio Agrícola

Esta es una plataforma web que permite a los usuarios registrar y comprar productos agrícolas como papa, yuca y plátano.

## Características

- Registro de usuarios (compradores y vendedores)
- Inicio de sesión
- Listado de productos
- Filtrado y búsqueda de productos
- Sistema de carrito de compras
- Gestión de pedidos

## Tecnologías Utilizadas

- React
- TypeScript
- Material-UI
- React Router
- Formik
- Yup
- React Query

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias
```bash
npm install
```

3. Crear archivo .env con las variables de entorno necesarias
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME="PlataformaAgricola"
```

4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

## Estructura del Proyecto

```
src/
  ├── components/     # Componentes reutilizables
  ├── pages/         # Páginas de la aplicación
  ├── services/      # Servicios y llamadas a API
  ├── hooks/         # Hooks personalizados
  ├── types/         # Definiciones de tipos TypeScript
  ├── utils/         # Utilidades y funciones auxiliares
  ├── theme/         # Configuración del tema
  ├── App.tsx        # Componente principal
  └── main.tsx       # Punto de entrada
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Vista previa de la versión de producción
- `npm run lint`: Ejecuta el linter
- `npm run test`: Ejecuta las pruebas

## Contribución

1. Fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.