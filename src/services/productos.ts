import { Product } from '../types';

// Simulación de una base de datos local
let productos: Product[] = [];

export const ProductService = {
  // Crear un nuevo producto
  crearProducto: async (producto: Product): Promise<Product> => {
    const nuevoProducto = {
      ...producto,
      id: Date.now(), // Generamos un ID único
      fechaCreacion: new Date().toISOString()
    };
    productos.push(nuevoProducto);
    return nuevoProducto;
  },

  // Obtener todos los productos
  obtenerProductos: async (): Promise<Product[]> => {
    return productos;
  },

  // Obtener un producto por ID
  obtenerProductoPorId: async (id: number): Promise<Product | undefined> => {
    return productos.find(p => p.id === id);
  },

  // Actualizar un producto
  actualizarProducto: async (id: number, producto: Partial<Product>): Promise<Product | undefined> => {
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1) {
      productos[index] = { ...productos[index], ...producto };
      return productos[index];
    }
    return undefined;
  },

  // Eliminar un producto
  eliminarProducto: async (id: number): Promise<boolean> => {
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1) {
      productos = productos.filter(p => p.id !== id);
      return true;
    }
    return false;
  }
}; 