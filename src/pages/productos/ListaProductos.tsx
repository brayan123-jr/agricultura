import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  VerifiedUser as VerifiedUserIcon,
  Chat as ChatIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { ProductService } from '../../services/productos';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import CarritoCompras from '../../components/CarritoCompras';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ListaProductos = () => {
  const { user } = useAuth();
  const [productos, setProductos] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busqueda, setBusqueda] = React.useState('');
  const [tipoFiltro, setTipoFiltro] = React.useState('Todos');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [openChat, setOpenChat] = useState(false);
  const [message, setMessage] = useState('');
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  React.useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await ProductService.obtenerTodos();
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

  const handleOpenDialog = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenChat = () => {
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
    setMessage('');
  };

  const handleSendMessage = () => {
    // Aquí iría la lógica para enviar el mensaje
    console.log('Mensaje enviado:', message);
    handleCloseChat();
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleOpenCart = () => {
    setCartOpen(true);
  };

  const handleCloseCart = () => {
    setCartOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      {/* Botón del carrito */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShoppingCartIcon />}
          onClick={handleOpenCart}
          disabled={cartItems.length === 0}
        >
          Carrito ({cartItems.length})
        </Button>
      </Box>

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
                <MenuItem value="cafe">Café</MenuItem>
                <MenuItem value="panela">Panela</MenuItem>
                <MenuItem value="frutas">Frutas</MenuItem>
                <MenuItem value="cacao">Cacao</MenuItem>
                <MenuItem value="miel">Miel</MenuItem>
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
                <CardMedia
                  component="img"
                  height="200"
                  image={producto.imagen?.[0] || '/placeholder-image.jpg'}
                  alt={producto.nombre}
                  sx={{
                    objectFit: 'cover',
                    '&:hover': {
                      cursor: 'pointer',
                      transform: 'scale(1.02)',
                      transition: 'transform 0.3s ease-in-out'
                    }
                  }}
                  onClick={() => handleOpenDialog(producto)}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div" noWrap>
                      {producto.nombre}
                    </Typography>
                    {producto.certificaciones.sanitario && (
                      <Tooltip title="Producto Verificado">
                        <IconButton size="small" color="primary">
                          <VerifiedUserIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      height: '40px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 1
                    }}
                  >
                    {producto.descripcion}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${producto.precio.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`Origen: ${producto.detalles.origen || 'No especificado'}`} 
                      size="small"
                      sx={{ maxWidth: '150px' }}
                    />
                    <Chip 
                      label={producto.tipo} 
                      size="small" 
                      color="primary"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      size="small"
                      onClick={() => handleAddToCart(producto)}
                    >
                      Agregar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenDialog(producto)}
                      size="small"
                    >
                      Ver detalles
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo de detalles del producto */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {selectedProduct.nombre}
                <IconButton onClick={handleOpenChat} color="primary">
                  <ChatIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Información General" />
                  <Tab label="Detalles Técnicos" />
                  <Tab label="Logística" />
                  <Tab label="Certificaciones" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" paragraph>
                  {selectedProduct.descripcion}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  Precio: ${selectedProduct.precio.toLocaleString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Disponible: {selectedProduct.cantidad} unidades
                </Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Typography variant="subtitle1" gutterBottom>
                  Origen: {selectedProduct.detalles?.origen || 'No especificado'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Variedad: {selectedProduct.detalles?.variedad || 'No especificado'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Tueste: {selectedProduct.detalles?.tueste || 'No especificado'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Perfil de Sabor: {selectedProduct.detalles?.perfilSabor || 'No especificado'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Fecha de Producción: {selectedProduct.detalles?.fechaProduccion || 'No especificado'}
                </Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Peso: {selectedProduct.logistica?.peso || 'No especificado'}kg
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Dimensiones: {selectedProduct.logistica?.dimensiones?.largo || 'No especificado'}x
                  {selectedProduct.logistica?.dimensiones?.ancho || 'No especificado'}x
                  {selectedProduct.logistica?.dimensiones?.alto || 'No especificado'}cm
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Medio de Transporte: {selectedProduct.logistica?.medioTransporte || 'No especificado'}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Costo de Envío: ${selectedProduct.logistica?.costoEnvio?.toLocaleString() || 'No especificado'}
                </Typography>
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Chip
                    icon={<VerifiedUserIcon />}
                    label="Certificado Sanitario"
                    color={selectedProduct.certificaciones.sanitario ? "success" : "default"}
                  />
                  <Chip
                    icon={<DescriptionIcon />}
                    label="Certificado Fiscal"
                    color={selectedProduct.certificaciones.fiscal ? "success" : "default"}
                  />
                  <Chip
                    icon={<LocalShippingIcon />}
                    label="Certificado de Origen"
                    color={selectedProduct.certificaciones.origen ? "success" : "default"}
                  />
                </Box>
              </TabPanel>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cerrar</Button>
              <Button variant="contained" startIcon={<ShoppingCartIcon />}>
                Agregar al Carrito
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Diálogo de chat */}
      <Dialog open={openChat} onClose={handleCloseChat}>
        <DialogTitle>Chat con el Vendedor</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mensaje"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChat}>Cancelar</Button>
          <Button onClick={handleSendMessage} variant="contained">
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Agregar el componente CarritoCompras */}
      <CarritoCompras
        productos={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onClose={handleCloseCart}
        open={cartOpen}
      />
    </Container>
  );
};

export default ListaProductos;