import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { Product } from '../types';
import { OrdenService } from '../services/ordenes';
import { useAuth } from '../context/AuthContext';

interface CarritoComprasProps {
  productos: Product[];
  onRemoveFromCart: (productoId: number) => void;
  onClose: () => void;
  open: boolean;
}

const steps = ['Dirección de Envío', 'Resumen y Pago', 'Confirmación'];

export const CarritoCompras: React.FC<CarritoComprasProps> = ({
  productos,
  onRemoveFromCart,
  onClose,
  open,
}) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orden, setOrden] = useState<any>(null);
  const [direccionEnvio, setDireccionEnvio] = useState({
    departamento: '',
    ciudad: '',
    direccion: '',
  });
  const [metodoPago, setMetodoPago] = useState('');

  const calcularSubtotal = () => {
    return productos.reduce((total, producto) => total + producto.precio, 0);
  };

  const calcularIVA = () => {
    return productos.reduce((total, producto) => {
      const iva = producto.logistica?.impuestos?.iva || 19; // IVA por defecto 19%
      return total + (producto.precio * (iva / 100));
    }, 0);
  };

  const calcularRetencion = () => {
    return productos.reduce((total, producto) => {
      const retencion = producto.logistica?.impuestos?.retencionFuente || 4; // Retención por defecto 4%
      return total + (producto.precio * (retencion / 100));
    }, 0);
  };

  const calcularCostoEnvio = () => {
    return productos.reduce((total, producto) => {
      return total + (producto.logistica?.costoEnvio || 0);
    }, 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const iva = calcularIVA();
    const retencion = calcularRetencion();
    const costoEnvio = calcularCostoEnvio();
    return subtotal + iva - retencion + costoEnvio;
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      setLoading(true);
      try {
        // Crear orden
        const nuevaOrden = await OrdenService.crearOrden(productos, user?.id || 0);
        // Procesar pago y generar factura
        const ordenProcesada = await OrdenService.procesarPago(nuevaOrden);
        setOrden(ordenProcesada);
        setActiveStep((prev) => prev + 1);
      } catch (error) {
        console.error('Error al procesar la orden:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    // Limpiar carrito y cerrar diálogo
    productos.forEach((producto) => onRemoveFromCart(producto.id));
    onClose();
    setActiveStep(0);
    setOrden(null);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Departamento"
                value={direccionEnvio.departamento}
                onChange={(e) => setDireccionEnvio({ ...direccionEnvio, departamento: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ciudad"
                value={direccionEnvio.ciudad}
                onChange={(e) => setDireccionEnvio({ ...direccionEnvio, ciudad: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={direccionEnvio.direccion}
                onChange={(e) => setDireccionEnvio({ ...direccionEnvio, direccion: e.target.value })}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resumen de la Compra
            </Typography>
            <List>
              {productos.map((producto) => (
                <ListItem key={producto.id}>
                  <ListItemText
                    primary={producto.nombre}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Precio: ${producto.precio.toLocaleString()}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Origen: {producto.logistica?.ubicacionOrigen?.ciudad || 'No especificado'}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => onRemoveFromCart(producto.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Subtotal: ${calcularSubtotal().toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">
                IVA (19%): ${calcularIVA().toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">
                Retención (4%): -${calcularRetencion().toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">
                Costo de Envío: ${calcularCostoEnvio().toLocaleString()}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total: ${calcularTotal().toLocaleString()}
              </Typography>
            </Box>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Método de Pago</InputLabel>
              <Select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                label="Método de Pago"
              >
                <MenuItem value="tarjeta">Tarjeta de Crédito/Débito</MenuItem>
                <MenuItem value="pse">PSE</MenuItem>
                <MenuItem value="efectivo">Efectivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              ¡Gracias por tu compra!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Tu pedido ha sido confirmado y será procesado pronto.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recibirás un correo electrónico con los detalles de tu compra.
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <ShoppingCartIcon />
          <Typography variant="h6">Carrito de Compras</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        {activeStep === 0 ? (
          <Button onClick={onClose}>Cancelar</Button>
        ) : (
          <Button onClick={handleBack}>Atrás</Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleFinish} variant="contained" color="primary">
            Finalizar
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            disabled={loading || productos.length === 0}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 2 ? (
              'Confirmar Compra'
            ) : (
              'Siguiente'
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CarritoCompras; 