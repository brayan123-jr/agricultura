import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  Chip
} from '@mui/material';

// Tipo para la estructura de una compra
interface Compra {
  id: number;
  fecha: string;
  producto: string;
  cantidad: number;
  precio: number;
  total: number;
  estado: string;
}

const compras = [
  {
    id: 1,
    fecha: '2024-03-15',
    producto: 'Papa Pastusa',
    cantidad: 10,
    precio: 2000,
    total: 20000,
    estado: 'Entregado'
  },
  {
    id: 2,
    fecha: '2024-03-14',
    producto: 'Yuca Fresca',
    cantidad: 5,
    precio: 1800,
    total: 9000,
    estado: 'En camino'
  },
];

const MisCompras = () => {
  const [compraSeleccionada, setCompraSeleccionada] = useState<Compra | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (compra: Compra) => {
    setCompraSeleccionada(compra);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCompraSeleccionada(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis Compras
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell align="right">Cantidad (kg)</TableCell>
              <TableCell align="right">Precio/kg</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {compras.map((compra) => (
              <TableRow key={compra.id}>
                <TableCell>{compra.fecha}</TableCell>
                <TableCell>{compra.producto}</TableCell>
                <TableCell align="right">{compra.cantidad}</TableCell>
                <TableCell align="right">${compra.precio}</TableCell>
                <TableCell align="right">${compra.total}</TableCell>
                <TableCell>
                  <Chip 
                    label={compra.estado}
                    color={compra.estado === 'Entregado' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => handleOpenDialog(compra)}
                  >
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {compraSeleccionada && (
          <>
            <DialogTitle>
              Detalles de la Compra
            </DialogTitle>
            <DialogContent>
              <Box sx={{ py: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Producto
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {compraSeleccionada.producto}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Fecha de Compra
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {compraSeleccionada.fecha}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estado
                    </Typography>
                    <Chip 
                      label={compraSeleccionada.estado}
                      color={compraSeleccionada.estado === 'Entregado' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Cantidad
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {compraSeleccionada.cantidad} kg
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Precio por kg
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      ${compraSeleccionada.precio}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${compraSeleccionada.total}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default MisCompras;