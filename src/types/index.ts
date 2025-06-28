export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  tipo: 'comprador' | 'vendedor';
  direccion?: string;
  certificadoSanitario?: string;
}

export interface Producto {
  id: number;
  nombre: string;
  tipo: 'papa' | 'yuca' | 'platano';
  precio: number;
  cantidad: number;
  descripcion: string;
  imagen?: string;
  vendedorId: number;
  disponible: boolean;
  fechaCreacion: string;
}

export interface Orden {
  id: number;
  compradorId: number;
  productos: {
    productoId: number;
    cantidad: number;
    precio: number;
  }[];
  total: number;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  fechaCreacion: string;
  direccionEntrega: string;
  metodoPago: string;
}

export interface Product {
  id?: number;
  nombre: string;
  tipo: string;
  precio: number;
  cantidad: number;
  descripcion: string;
  imagen?: string;
  fechaCreacion?: string;
}

export interface User {
  id?: number;
  nombre: string;
  email: string;
  tipo: 'comprador' | 'vendedor';
  telefono: string;
  direccion: string;
  certificadoSanitario?: string;
}