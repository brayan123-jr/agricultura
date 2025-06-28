import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Snackbar,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
  tipo: Yup.string()
    .oneOf(['comprador', 'vendedor'] as const, 'Tipo de usuario inválido')
    .required('El tipo de usuario es requerido'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = React.useState('');
  const [searchParams] = useSearchParams();
  const tipoFromUrl = searchParams.get('tipo') as 'comprador' | 'vendedor' | null;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      tipo: tipoFromUrl || 'comprador',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password, values.tipo);
        navigate('/');
      } catch (error) {
        setError('Credenciales inválidas. Por favor, intenta nuevamente.');
      }
    },
  });

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            {tipoFromUrl === 'vendedor' ? 'Iniciar Sesión como Vendedor' : 'Iniciar Sesión como Comprador'}
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="tipo-label">Tipo de Usuario</InputLabel>
              <Select
                labelId="tipo-label"
                id="tipo"
                name="tipo"
                value={formik.values.tipo}
                label="Tipo de Usuario"
                onChange={formik.handleChange}
                error={formik.touched.tipo && Boolean(formik.errors.tipo)}
                disabled={!!tipoFromUrl}
              >
                <MenuItem value="comprador">Comprador</MenuItem>
                <MenuItem value="vendedor">Vendedor</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                ¿No tienes una cuenta?{' '}
                <MuiLink 
                  component={Link} 
                  to={tipoFromUrl ? `/registro?tipo=${tipoFromUrl}` : '/registro'}
                >
                  Regístrate aquí
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;