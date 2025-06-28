export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  tipo: 'comprador' | 'vendedor';
  direccion?: string;
  certificadoSanitario?: string;
  documentos?: {
    rut?: string;
    dian?: string;
    invima?: string;
    ica?: string;
    fechaVencimiento?: {
      rut?: string;
      dian?: string;
      invima?: string;
      ica?: string;
    };
  };
}

export interface Producto {
  id: number;
  nombre: string;
  tipo: 'cafe' | 'panela' | 'otros';
  precio: number;
  cantidad: number;
  descripcion: string;
  imagen?: string[];
  vendedorId: number;
  disponible: boolean;
  fechaCreacion: string;
  certificaciones: {
    sanitario?: boolean;
    fiscal?: boolean;
    origen?: boolean;
  };
  detallesTecnicos: {
    origen?: string;
    variedad?: string;
    tueste?: string;
    perfilSabor?: string;
    formato?: string;
    dulzor?: string;
    fechaProduccion?: string;
    condicionesTransporte?: {
      temperatura?: string;
      humedad?: string;
    };
  };
  logistica: {
    peso?: number;
    dimensiones?: {
      largo: number;
      ancho: number;
      alto: number;
    };
    medioTransporte?: 'aereo' | 'maritimo' | 'terrestre';
    paisDestino?: string;
    costoEnvio?: number;
    ubicacionOrigen?: {
      departamento: string;
      ciudad: string;
      direccion: string;
    };
    impuestos?: {
      iva: number;
      retencionFuente: number;
    };
  };
  fechaLimiteComercializacion?: string;
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
  documentosComerciales?: {
    facturaElectronica?: string;
    certificadoOrigen?: string;
  };
}

export interface Mensaje {
  id: number;
  emisorId: number;
  receptorId: number;
  productoId?: number;
  contenido: string;
  fechaEnvio: string;
  leido: boolean;
}

export interface Product {
  id: number;
  nombre: string;
  tipo: string;
  precio: number;
  cantidad: number;
  descripcion: string;
  imagen?: string[];
  vendedorId: number;
  disponible: boolean;
  fechaCreacion: string;
  certificaciones: {
    sanitario: boolean;
    fiscal: boolean;
    origen: boolean;
  };
  detalles: {
    origen?: string;
    variedad?: string;
    tueste?: string;
    perfilSabor?: string;
    fechaProduccion?: string;
    formato?: string;
    condicionesTransporte?: {
      temperatura?: string;
      humedad?: string;
    };
  };
  logistica: {
    peso: number;
    dimensiones: {
      largo: number;
      ancho: number;
      alto: number;
    };
    medioTransporte: 'aereo' | 'maritimo' | 'terrestre';
    costoEnvio: number;
  };
}

export interface User {
  id?: number;
  nombre: string;
  email: string;
  tipo: 'comprador' | 'vendedor';
  telefono: string;
  direccion: string;
  certificadoSanitario?: string;
  documentos?: {
    rut?: string;
    dian?: string;
    invima?: string;
    ica?: string;
    fechaVencimiento?: {
      rut?: string;
      dian?: string;
      invima?: string;
      ica?: string;
    };
  };
}