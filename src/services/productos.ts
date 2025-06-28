import { Product } from '../types';

const productosBase: Product[] = [
  {
    id: 1,
    nombre: 'Café Orgánico Premium',
    tipo: 'cafe',
    precio: 25000,
    cantidad: 100,
    descripcion: 'Café orgánico de alta calidad cultivado en las montañas de Colombia',
    imagen: [
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9',
      'https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a'
    ],
    vendedorId: 1,
    disponible: true,
    fechaCreacion: '2024-03-15',
    certificaciones: {
      sanitario: true,
      fiscal: true,
      origen: true
    },
    detalles: {
      origen: 'Colombia',
      variedad: 'Arábica',
      tueste: 'Medio',
      perfilSabor: 'Notas de chocolate y frutos rojos'
    },
    logistica: {
      peso: 1,
      dimensiones: {
        largo: 20,
        ancho: 10,
        alto: 5
      },
      medioTransporte: 'terrestre',
      costoEnvio: 8000
    }
  },
  {
    id: 2,
    nombre: 'Panela Orgánica',
    tipo: 'panela',
    precio: 15000,
    cantidad: 200,
    descripcion: 'Panela orgánica 100% natural',
    imagen: [
      'https://images.unsplash.com/photo-1610725663727-08695a1ac3ff',
      'https://images.unsplash.com/photo-1610725663493-c487895d6f3b'
    ],
    vendedorId: 2,
    disponible: true,
    fechaCreacion: '2024-03-14',
    certificaciones: {
      sanitario: true,
      fiscal: true,
      origen: true
    },
    detalles: {
      origen: 'Valle del Cauca',
      variedad: 'Tradicional',
      formato: 'Pulverizada'
    },
    logistica: {
      peso: 0.5,
      dimensiones: {
        largo: 15,
        ancho: 10,
        alto: 5
      },
      medioTransporte: 'terrestre',
      costoEnvio: 5000
    }
  },
  {
    id: 3,
    nombre: 'Aguacate Hass',
    tipo: 'frutas',
    precio: 35000,
    cantidad: 150,
    descripcion: 'Aguacates Hass premium cultivados en el eje cafetero',
    imagen: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578',
      'https://images.unsplash.com/photo-1587132137056-bfbf0166836e'
    ],
    vendedorId: 3,
    disponible: true,
    fechaCreacion: '2024-03-13',
    certificaciones: {
      sanitario: true,
      fiscal: true,
      origen: true
    },
    detalles: {
      origen: 'Quindío',
      variedad: 'Hass',
      fechaProduccion: '2024-03-10'
    },
    logistica: {
      peso: 5,
      dimensiones: {
        largo: 30,
        ancho: 20,
        alto: 15
      },
      medioTransporte: 'terrestre',
      costoEnvio: 12000
    }
  },
  {
    id: 4,
    nombre: 'Cacao Fino de Aroma',
    tipo: 'cacao',
    precio: 45000,
    cantidad: 80,
    descripcion: 'Cacao fino de aroma de origen único colombiano',
    imagen: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b',
      'https://images.unsplash.com/photo-1589923187400-425e8208c2e6'
    ],
    vendedorId: 4,
    disponible: true,
    fechaCreacion: '2024-03-12',
    certificaciones: {
      sanitario: true,
      fiscal: true,
      origen: true
    },
    detalles: {
      origen: 'Santander',
      variedad: 'Criollo',
      perfilSabor: 'Notas florales y frutales'
    },
    logistica: {
      peso: 1,
      dimensiones: {
        largo: 25,
        ancho: 15,
        alto: 10
      },
      medioTransporte: 'terrestre',
      costoEnvio: 8000
    }
  },
  {
    id: 5,
    nombre: 'Miel de Abejas Pura',
    tipo: 'miel',
    precio: 28000,
    cantidad: 120,
    descripcion: 'Miel de abejas 100% pura de flores silvestres',
    imagen: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38',
      'https://images.unsplash.com/photo-1587049352847-de8f3b2b6d6c'
    ],
    vendedorId: 5,
    disponible: true,
    fechaCreacion: '2024-03-11',
    certificaciones: {
      sanitario: true,
      fiscal: true,
      origen: true
    },
    detalles: {
      origen: 'Boyacá',
      variedad: 'Multifloral',
      formato: 'Líquida'
    },
    logistica: {
      peso: 0.5,
      dimensiones: {
        largo: 10,
        ancho: 10,
        alto: 15
      },
      medioTransporte: 'terrestre',
      costoEnvio: 6000
    }
  }
];

export const ProductService = {
  obtenerTodos: async (): Promise<Product[]> => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(productosBase);
      }, 1000);
    });
  },

  obtenerPorId: async (id: number): Promise<Product | null> => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const producto = productosBase.find(p => p.id === id);
        resolve(producto || null);
      }, 500);
    });
  },

  crear: async (producto: Omit<Product, 'id'>): Promise<Product> => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const nuevoProducto = {
          ...producto,
          id: Math.max(...productosBase.map(p => p.id)) + 1,
          fechaCreacion: new Date().toISOString()
        };
        productosBase.push(nuevoProducto);
        resolve(nuevoProducto);
      }, 1000);
    });
  },

  actualizar: async (id: number, producto: Partial<Product>): Promise<Product | null> => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = productosBase.findIndex(p => p.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        const productoActualizado = {
          ...productosBase[index],
          ...producto
        };
        productosBase[index] = productoActualizado;
        resolve(productoActualizado);
      }, 1000);
    });
  },

  eliminar: async (id: number): Promise<boolean> => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = productosBase.findIndex(p => p.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        productosBase.splice(index, 1);
        resolve(true);
      }, 1000);
    });
  },

  buscar: async (query: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return productosBase.filter(p => 
      p.nombre.toLowerCase().includes(query.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(query.toLowerCase())
    );
  },

  filtrarPorTipo: async (tipo: string): Promise<Product[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return productosBase.filter(p => p.tipo === tipo);
  },

  verificarDisponibilidad: async (id: number, cantidad: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const producto = productosBase.find(p => p.id === id);
    return producto ? producto.cantidad >= cantidad : false;
  }
}; 