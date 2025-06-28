import { Usuario } from '../types';

interface DocumentoVencimiento {
  tipo: 'rut' | 'dian' | 'invima' | 'ica';
  fechaVencimiento: string;
}

export const DocumentoService = {
  // Verificar RUT con API simulada de la DIAN
  verificarRUT: async (numeroRUT: string): Promise<boolean> => {
    // Simulación de verificación
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(numeroRUT.length === 10);
      }, 1000);
    });
  },

  // Verificar registro DIAN
  verificarRegistroDIAN: async (nit: string): Promise<boolean> => {
    // Simulación de verificación
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(nit.length === 9);
      }, 1000);
    });
  },

  // Verificar certificado INVIMA
  verificarINVIMA: async (numeroRegistro: string): Promise<boolean> => {
    // Simulación de verificación
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(numeroRegistro.startsWith('RSAD'));
      }, 1000);
    });
  },

  // Verificar certificado ICA
  verificarICA: async (numeroRegistro: string): Promise<boolean> => {
    // Simulación de verificación
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(numeroRegistro.startsWith('ICA'));
      }, 1000);
    });
  },

  // Generar factura electrónica
  generarFacturaElectronica: async (ordenId: number): Promise<string> => {
    // Simulación de generación de factura
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`FE-${ordenId}-${Date.now()}`);
      }, 1000);
    });
  },

  // Generar certificado de origen
  generarCertificadoOrigen: async (productoId: number): Promise<string> => {
    // Simulación de generación de certificado
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`CO-${productoId}-${Date.now()}`);
      }, 1000);
    });
  },

  // Verificar documentos próximos a vencer
  verificarDocumentosProximosVencer: async (usuario: Usuario): Promise<DocumentoVencimiento[]> => {
    if (!usuario.documentos?.fechaVencimiento) return [];

    const documentosProximosVencer: DocumentoVencimiento[] = [];
    const hoy = new Date();

    Object.entries(usuario.documentos.fechaVencimiento).forEach(([tipo, fecha]) => {
      if (fecha) {
        const fechaVencimiento = new Date(fecha);
        const diasRestantes = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

        if (diasRestantes <= 15 && diasRestantes > 0) {
          documentosProximosVencer.push({
            tipo: tipo as 'rut' | 'dian' | 'invima' | 'ica',
            fechaVencimiento: fecha,
          });
        }
      }
    });

    return documentosProximosVencer;
  },

  // Actualizar documento
  actualizarDocumento: async (
    usuario: Usuario,
    tipo: 'rut' | 'dian' | 'invima' | 'ica',
    numeroDocumento: string,
    fechaVencimiento: string
  ): Promise<boolean> => {
    let esValido = false;

    switch (tipo) {
      case 'rut':
        esValido = await DocumentoService.verificarRUT(numeroDocumento);
        break;
      case 'dian':
        esValido = await DocumentoService.verificarRegistroDIAN(numeroDocumento);
        break;
      case 'invima':
        esValido = await DocumentoService.verificarINVIMA(numeroDocumento);
        break;
      case 'ica':
        esValido = await DocumentoService.verificarICA(numeroDocumento);
        break;
    }

    if (!esValido) return false;

    if (!usuario.documentos) {
      usuario.documentos = {
        fechaVencimiento: {},
      };
    }

    usuario.documentos[tipo] = numeroDocumento;
    if (!usuario.documentos.fechaVencimiento) {
      usuario.documentos.fechaVencimiento = {};
    }
    usuario.documentos.fechaVencimiento[tipo] = fechaVencimiento;

    return true;
  },

  // Simular integración con VUCE
  simularIntegracionVUCE: async (documentos: Usuario['documentos']): Promise<boolean> => {
    if (!documentos) return false;

    // Simulación de verificación en VUCE
    return new Promise((resolve) => {
      setTimeout(() => {
        const tieneDocumentosRequeridos = !!(
          documentos.rut &&
          documentos.dian &&
          documentos.fechaVencimiento?.rut &&
          documentos.fechaVencimiento?.dian
        );

        resolve(tieneDocumentosRequeridos);
      }, 1500);
    });
  },

  // Simular integración con MUISCA
  simularIntegracionMUISCA: async (documentos: Usuario['documentos']): Promise<boolean> => {
    if (!documentos) return false;

    // Simulación de verificación en MUISCA
    return new Promise((resolve) => {
      setTimeout(() => {
        const tieneDocumentosRequeridos = !!(
          documentos.rut &&
          documentos.dian &&
          documentos.fechaVencimiento?.rut &&
          documentos.fechaVencimiento?.dian
        );

        resolve(tieneDocumentosRequeridos);
      }, 1500);
    });
  },
}; 