import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import { Grass as GrassIcon } from '@mui/icons-material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <GrassIcon sx={{ fontSize: 40 }} />,
      title: 'Productos Agrícolas',
      description: 'Encuentra una amplia variedad de productos agrícolas de calidad.',
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Logística Integrada',
      description: 'Gestión completa de la cadena de suministro y transporte.',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Conexión Directa',
      description: 'Conecta directamente con productores y compradores.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}DD 30%, ${theme.palette.secondary.main}DD 90%)`,
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            AGRO-MARKET
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            Conectando productores artesanales con el mercado internacional
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/productos')}
            sx={{
              bgcolor: 'white',
              color: theme.palette.secondary.main,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Ver Productos
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                  backgroundImage: index === 0 
                    ? 'url(https://images.unsplash.com/photo-1523741543316-beb7fc7023d8)'
                    : index === 1
                    ? 'url(https://images.unsplash.com/photo-1595246140625-573b715d11dc)'
                    : 'url(https://images.unsplash.com/photo-1595475038784-bbe439ff41e6)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    zIndex: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette.secondary.main,
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: theme.palette.grey[100],
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom color="secondary">
                ¿Eres Agricultor?
              </Typography>
              <Typography variant="h6" paragraph color="text.secondary">
                Únete a nuestra plataforma y vende tus productos directamente a los consumidores.
                Obtén mejores precios y alcanza más clientes.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/registro?tipo=vendedor')}
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  color: theme.palette.primary.contrastText,
                }}
              >
                Registrarse como Vendedor
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7"
                alt="Agricultor colombiano"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;