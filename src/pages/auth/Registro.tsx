import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Link as MuiLink,
  Input,
  FormHelperText,
} from '@mui/material';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre es requerido'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  telefono: Yup.string().required('El teléfono es requerido'),
  direccion: Yup.string().required('La dirección es requerida'),
  tipo: Yup.string()
    .oneOf(['comprador', 'vendedor'] as const, 'Tipo de usuario inválido')
    .required('El tipo de usuario es requerido'),
  certificadoSanitario: Yup.mixed().when('tipo', {
    is: 'vendedor',
    then: (schema) => schema.required('El certificado sanitario es requerido para vendedores'),
    otherwise: (schema) => schema,
  }),
});

const Registro: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = React.useState('');
  const [searchParams] = useSearchParams();
  const tipoFromUrl = searchParams.get('tipo') as 'comprador' | 'vendedor' | null;
  const [certificadoNombre, setCertificadoNombre] = React.useState<string>('');

  const formik = useFormik({
    initialValues: {
      nombre: '',
      email: '',
      password: '',
      telefono: '',
      direccion: '',
      tipo: tipoFromUrl || 'comprador',
      certificadoSanitario: undefined,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Aquí deberías manejar la subida del archivo antes de registrar al usuario
        // Por ahora solo simulamos que guardamos la URL del archivo
        const certificadoUrl = values.certificadoSanitario 
          ? URL.createObjectURL(values.certificadoSanitario as Blob)
          : undefined;

        await register({
          ...values,
          certificadoSanitario: certificadoUrl,
        });
        navigate('/');
      } catch (error) {
        setError('Error al registrar usuario. Por favor, intenta nuevamente.');
      }
    },
  });

  useEffect(() => {
    if (tipoFromUrl) {
      formik.setFieldValue('tipo', tipoFromUrl);
    }
  }, [tipoFromUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue('certificadoSanitario', file);
      setCertificadoNombre(file.name);
    }
  };

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
            {tipoFromUrl === 'vendedor'
              ? 'Registro de Vendedor'
              : tipoFromUrl === 'comprador'
              ? 'Registro de Comprador'
              : 'Registro'}
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="nombre"
              label="Nombre Completo"
              name="nombre"
              autoComplete="name"
              autoFocus
              value={formik.values.nombre}
              onChange={formik.handleChange}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
            />
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              margin="normal"
              fullWidth
              id="telefono"
              label="Teléfono"
              name="telefono"
              autoComplete="tel"
              value={formik.values.telefono}
              onChange={formik.handleChange}
              error={formik.touched.telefono && Boolean(formik.errors.telefono)}
              helperText={formik.touched.telefono && formik.errors.telefono}
            />
            <TextField
              margin="normal"
              fullWidth
              id="direccion"
              label="Dirección"
              name="direccion"
              autoComplete="street-address"
              value={formik.values.direccion}
              onChange={formik.handleChange}
              error={formik.touched.direccion && Boolean(formik.errors.direccion)}
              helperText={formik.touched.direccion && formik.errors.direccion}
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

            {(formik.values.tipo === 'vendedor' || tipoFromUrl === 'vendedor') && (
              <FormControl fullWidth margin="normal" error={formik.touched.certificadoSanitario && Boolean(formik.errors.certificadoSanitario)}>
                <InputLabel htmlFor="certificadoSanitario" shrink>
                  Certificado Sanitario
                </InputLabel>
                <Input
                  id="certificadoSanitario"
                  type="file"
                  onChange={handleFileChange}
                  style={{ marginTop: '16px' }}
                  inputProps={{
                    accept: '.pdf,.jpg,.jpeg,.png',
                  }}
                />
                <FormHelperText>
                  {certificadoNombre || 'Sube tu certificado sanitario (PDF, JPG, PNG)'}
                </FormHelperText>
                {formik.touched.certificadoSanitario && formik.errors.certificadoSanitario && (
                  <FormHelperText error>
                    {formik.errors.certificadoSanitario as string}
                  </FormHelperText>
                )}
              </FormControl>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Registrando...' : 'Registrarse'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                ¿Ya tienes una cuenta?{' '}
                <MuiLink 
                  component={Link} 
                  to={tipoFromUrl ? `/login?tipo=${tipoFromUrl}` : '/login'}
                >
                  Inicia sesión aquí
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

export default Registro;