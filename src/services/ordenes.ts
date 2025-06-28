import { Orden, Producto, Product } from '../types';
import { ProductService } from './productos';
import { DocumentoService } from './documentos';

// Simulación de base de datos
let ordenes: Orden[] = [];
let lastId = 0;

export interface OrdenCompra {
  id: number;
  productos: {
    producto: Product;
    cantidad: number;
  }[];
  total: number;
  compradorId: number;
  estado: 'pendiente' | 'pagada' | 'enviada' | 'entregada';
  fechaCreacion: string;
  numeroFactura?: string;
}

export const OrdenService = {
  // Crear una nueva orden
  crearOrden: async (productos: Product[], compradorId: number): Promise<OrdenCompra> => {
    const total = productos.reduce((sum, producto) => sum + producto.precio, 0);
    
    const nuevaOrden: OrdenCompra = {
      id: Date.now(),
      productos: productos.map(producto => ({
        producto,
        cantidad: 1
      })),
      total,
      compradorId,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString()
    };

    // Simular guardado en base de datos
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(nuevaOrden);
      }, 1000);
    });
  },

  // Procesar pago y generar factura
  procesarPago: async (orden: OrdenCompra): Promise<OrdenCompra> => {
    // Simular procesamiento de pago
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          // Generar factura electrónica
          const numeroFactura = await DocumentoService.generarFacturaElectronica(orden.id);
          
          const ordenActualizada: OrdenCompra = {
            ...orden,
            estado: 'pagada',
            numeroFactura
          };

          resolve(ordenActualizada);
        } catch (error) {
          console.error('Error al procesar el pago:', error);
          throw new Error('Error al procesar el pago');
        }
      }, 1500);
    });
  },

  // Obtener órdenes de un usuario
  obtenerOrdenesPorUsuario: async (usuarioId: number): Promise<OrdenCompra[]> => {
    // Simular consulta a base de datos
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 1000);
    });
  },

  // Actualizar estado de la orden
  actualizarEstadoOrden: async (ordenId: number, nuevoEstado: OrdenCompra['estado']): Promise<boolean> => {
    // Simular actualización en base de datos
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  },

  // Crear una nueva orden
  crear: async (
    compradorId: number,
    productos: { productoId: number; cantidad: number }[],
    direccionEntrega: string,
    metodoPago: string
  ): Promise<Orden> => {
    // Verificar disponibilidad y calcular total
    let total = 0;
    const productosOrden = [];

    for (const item of productos) {
      const producto = await ProductService.obtenerPorId(item.productoId);
      if (!producto) throw new Error(`Producto ${item.productoId} no encontrado`);
      if (producto.cantidad < item.cantidad) throw new Error(`Stock insuficiente para ${producto.nombre}`);

      productosOrden.push({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precio: producto.precio,
      });

      total += producto.precio * item.cantidad;

      // Actualizar stock
      await ProductService.actualizar(item.productoId, {
        cantidad: producto.cantidad - item.cantidad,
      });
    }

    const nuevaOrden: Orden = {
      id: ++lastId,
      compradorId,
      productos: productosOrden,
      total,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString(),
      direccionEntrega,
      metodoPago,
    };

    // Generar documentos comerciales
    const facturaElectronica = await DocumentoService.generarFacturaElectronica(nuevaOrden.id);
    const certificadoOrigen = await DocumentoService.generarCertificadoOrigen(productosOrden[0].productoId);

    nuevaOrden.documentosComerciales = {
      facturaElectronica,
      certificadoOrigen,
    };

    ordenes.push(nuevaOrden);
    return nuevaOrden;
  },

  // Obtener una orden por ID
  obtenerPorId: async (id: number): Promise<Orden | undefined> => {
    return ordenes.find(o => o.id === id);
  },

  // Obtener órdenes por comprador
  obtenerPorComprador: async (compradorId: number): Promise<Orden[]> => {
    return ordenes.filter(o => o.compradorId === compradorId);
  },

  // Actualizar estado de una orden
  actualizarEstado: async (id: number, estado: Orden['estado']): Promise<boolean> => {
    const orden = ordenes.find(o => o.id === id);
    if (!orden) return false;

    orden.estado = estado;
    return true;
  },

  // Cancelar una orden
  cancelar: async (id: number): Promise<boolean> => {
    const orden = ordenes.find(o => o.id === id);
    if (!orden || orden.estado !== 'pendiente') return false;

    // Restaurar stock
    for (const item of orden.productos) {
      const producto = await ProductService.obtenerPorId(item.productoId);
      if (producto) {
        await ProductService.actualizar(item.productoId, {
          cantidad: producto.cantidad + item.cantidad,
        });
      }
    }

    orden.estado = 'cancelado';
    return true;
  },

  // Obtener órdenes por estado
  obtenerPorEstado: async (estado: Orden['estado']): Promise<Orden[]> => {
    return ordenes.filter(o => o.estado === estado);
  },

  // Calcular estadísticas de ventas
  calcularEstadisticas: async (compradorId?: number): Promise<{
    totalOrdenes: number;
    totalVentas: number;
    promedioOrden: number;
    ordenesEstado: Record<Orden['estado'], number>;
  }> => {
    const ordenesRelevantes = compradorId
      ? ordenes.filter(o => o.compradorId === compradorId)
      : ordenes;

    const totalOrdenes = ordenesRelevantes.length;
    const totalVentas = ordenesRelevantes.reduce((sum, o) => sum + o.total, 0);
    const promedioOrden = totalOrdenes > 0 ? totalVentas / totalOrdenes : 0;

    const ordenesEstado = ordenesRelevantes.reduce((acc, o) => {
      acc[o.estado] = (acc[o.estado] || 0) + 1;
      return acc;
    }, {} as Record<Orden['estado'], number>);

    return {
      totalOrdenes,
      totalVentas,
      promedioOrden,
      ordenesEstado,
    };
  },
}; 