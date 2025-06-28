import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ProductService } from '../../services/productos';
import { Product } from '../../types';

const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre es requerido'),
  tipo: Yup.string().required('El tipo de producto es requerido'),
  precio: Yup.number()
    .required('El precio es requerido')
    .positive('El precio debe ser positivo'),
  cantidad: Yup.number()
    .required('La cantidad es requerida')
    .positive('La cantidad debe ser positiva'),
  descripcion: Yup.string().required('La descripción es requerida'),
  imagen: Yup.string().url('Debe ser una URL válida'),
});

const Vender = () => {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      tipo: '',
      precio: '',
      cantidad: '',
      descripcion: '',
      imagen: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const producto: Product = {
          ...values,
          precio: Number(values.precio),
          cantidad: Number(values.cantidad),
        };
        
        await ProductService.crearProducto(producto);
        
        setSnackbar({
          open: true,
          message: '¡Producto publicado exitosamente!',
          severity: 'success',
        });
        
        formik.resetForm();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error al publicar el producto',
          severity: 'error',
        });
        console.error('Error:', error);
      }
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Publicar Producto
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="nombre"
                label="Nombre del Producto"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required error={formik.touched.tipo && Boolean(formik.errors.tipo)}>
                <InputLabel>Tipo de Producto</InputLabel>
                <Select
                  name="tipo"
                  value={formik.values.tipo}
                  label="Tipo de Producto"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="papa">Papa</MenuItem>
                  <MenuItem value="yuca">Yuca</MenuItem>
                  <MenuItem value="platano">Plátano</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="precio"
                label="Precio por kg"
                type="number"
                value={formik.values.precio}
                onChange={formik.handleChange}
                error={formik.touched.precio && Boolean(formik.errors.precio)}
                helperText={formik.touched.precio && formik.errors.precio}
                InputProps={{
                  startAdornment: <Typography>$</Typography>
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="cantidad"
                label="Cantidad disponible (kg)"
                type="number"
                value={formik.values.cantidad}
                onChange={formik.handleChange}
                error={formik.touched.cantidad && Boolean(formik.errors.cantidad)}
                helperText={formik.touched.cantidad && formik.errors.cantidad}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                name="descripcion"
                label="Descripción"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                helperText={formik.touched.descripcion && formik.errors.descripcion}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="imagen"
                label="URL de la imagen"
                value={formik.values.imagen}
                onChange={formik.handleChange}
                error={formik.touched.imagen && Boolean(formik.errors.imagen)}
                helperText={formik.touched.imagen && formik.errors.imagen}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Publicando...' : 'Publicar Producto'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Vender;