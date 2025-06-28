import { Mensaje } from '../types';

// Simulación de base de datos
let mensajes: Mensaje[] = [];
let lastId = 0;

export const MensajeService = {
  // Enviar un mensaje
  enviar: async (
    emisorId: number,
    receptorId: number,
    contenido: string,
    productoId?: number
  ): Promise<Mensaje> => {
    const nuevoMensaje: Mensaje = {
      id: ++lastId,
      emisorId,
      receptorId,
      productoId,
      contenido,
      fechaEnvio: new Date().toISOString(),
      leido: false,
    };
    mensajes.push(nuevoMensaje);

    // Simulación de envío de correo electrónico
    console.log(`Correo enviado a usuario ${receptorId}: Nuevo mensaje recibido`);

    return nuevoMensaje;
  },

  // Obtener conversación entre dos usuarios
  obtenerConversacion: async (
    usuario1Id: number,
    usuario2Id: number,
    productoId?: number
  ): Promise<Mensaje[]> => {
    return mensajes.filter(m => 
      ((m.emisorId === usuario1Id && m.receptorId === usuario2Id) ||
      (m.emisorId === usuario2Id && m.receptorId === usuario1Id)) &&
      (!productoId || m.productoId === productoId)
    ).sort((a, b) => new Date(a.fechaEnvio).getTime() - new Date(b.fechaEnvio).getTime());
  },

  // Marcar mensaje como leído
  marcarComoLeido: async (mensajeId: number): Promise<boolean> => {
    const mensaje = mensajes.find(m => m.id === mensajeId);
    if (!mensaje) return false;

    mensaje.leido = true;
    return true;
  },

  // Obtener mensajes no leídos
  obtenerNoLeidos: async (usuarioId: number): Promise<Mensaje[]> => {
    return mensajes.filter(m => 
      m.receptorId === usuarioId && !m.leido
    );
  },

  // Eliminar mensaje
  eliminar: async (mensajeId: number): Promise<boolean> => {
    const index = mensajes.findIndex(m => m.id === mensajeId);
    if (index === -1) return false;

    mensajes.splice(index, 1);
    return true;
  },

  // Obtener últimos mensajes por usuario
  obtenerUltimosMensajes: async (usuarioId: number): Promise<Mensaje[]> => {
    const conversaciones = new Map<number, Mensaje>();
    
    mensajes
      .filter(m => m.emisorId === usuarioId || m.receptorId === usuarioId)
      .forEach(m => {
        const otroUsuarioId = m.emisorId === usuarioId ? m.receptorId : m.emisorId;
        const mensajeExistente = conversaciones.get(otroUsuarioId);
        
        if (!mensajeExistente || new Date(m.fechaEnvio) > new Date(mensajeExistente.fechaEnvio)) {
          conversaciones.set(otroUsuarioId, m);
        }
      });

    return Array.from(conversaciones.values())
      .sort((a, b) => new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime());
  },
}; 