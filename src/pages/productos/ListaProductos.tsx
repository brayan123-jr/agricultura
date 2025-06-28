import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ProductService } from '../../services/productos';
import { Product } from '../../types';

const ListaProductos = () => {
  const [productos, setProductos] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busqueda, setBusqueda] = React.useState('');
  const [tipoFiltro, setTipoFiltro] = React.useState('Todos');

  React.useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await ProductService.obtenerProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = React.useMemo(() => {
    return productos.filter(producto => {
      const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = tipoFiltro === 'Todos' || producto.tipo === tipoFiltro;
      return coincideBusqueda && coincideTipo;
    });
  }, [productos, busqueda, tipoFiltro]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      {/* Sección de filtros */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="tipo-filtro-label">Filtrar por tipo</InputLabel>
              <Select
                labelId="tipo-filtro-label"
                id="tipo-filtro"
                value={tipoFiltro}
                label="Filtrar por tipo"
                onChange={(e) => setTipoFiltro(e.target.value)}
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="papa">Papa</MenuItem>
                <MenuItem value="yuca">Yuca</MenuItem>
                <MenuItem value="platano">Plátano</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Lista de productos */}
      {productosFiltrados.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="h6" color="text.secondary">
            No se encontraron productos
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {productosFiltrados.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {producto.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {producto.descripcion}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${producto.precio}/kg
                  </Typography>
                  <Typography variant="body2">
                    Disponible: {producto.cantidad} kg
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" fullWidth>
                    Comprar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ListaProductos;