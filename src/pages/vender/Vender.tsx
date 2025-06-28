import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
  IconButton,
  Chip,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CloudUpload as CloudUploadIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { Producto } from '../../types';

const steps = ['Información Básica', 'Detalles Técnicos', 'Logística', 'Certificaciones'];

const validationSchemas = {
  0: Yup.object({
    nombre: Yup.string().required('El nombre es requerido'),
    tipo: Yup.string().required('El tipo es requerido'),
    precio: Yup.number().required('El precio es requerido').positive('El precio debe ser positivo'),
    cantidad: Yup.number().required('La cantidad es requerida').positive('La cantidad debe ser positiva'),
    descripcion: Yup.string().required('La descripción es requerida'),
    imagenes: Yup.array().min(1, 'Debe subir al menos una imagen'),
  }),
  1: Yup.object({
    detallesTecnicos: Yup.object({
      origen: Yup.string().required('El origen es requerido'),
      variedad: Yup.string().when('tipo', {
        is: 'cafe',
        then: (schema) => schema.required('La variedad es requerida para café'),
      }),
      tueste: Yup.string().when('tipo', {
        is: 'cafe',
        then: (schema) => schema.required('El tueste es requerido para café'),
      }),
      perfilSabor: Yup.string().when('tipo', {
        is: 'cafe',
        then: (schema) => schema.required('El perfil de sabor es requerido para café'),
      }),
      formato: Yup.string().when('tipo', {
        is: 'panela',
        then: (schema) => schema.required('El formato es requerido para panela'),
      }),
      dulzor: Yup.string().when('tipo', {
        is: 'panela',
        then: (schema) => schema.required('El dulzor es requerido para panela'),
      }),
      fechaProduccion: Yup.string().required('La fecha de producción es requerida'),
      condicionesTransporte: Yup.object({
        temperatura: Yup.string().required('La temperatura es requerida'),
        humedad: Yup.string().required('La humedad es requerida'),
      }),
    }),
  }),
  2: Yup.object({
    logistica: Yup.object({
      peso: Yup.number().required('El peso es requerido').positive('El peso debe ser positivo'),
      dimensiones: Yup.object({
        largo: Yup.number().required('El largo es requerido').positive('El largo debe ser positivo'),
        ancho: Yup.number().required('El ancho es requerido').positive('El ancho debe ser positivo'),
        alto: Yup.number().required('El alto es requerido').positive('El alto debe ser positivo'),
      }),
      medioTransporte: Yup.string().required('El medio de transporte es requerido'),
      paisDestino: Yup.string().required('El país de destino es requerido'),
      ubicacionOrigen: Yup.object({
        departamento: Yup.string().required('El departamento es requerido'),
        ciudad: Yup.string().required('La ciudad es requerida'),
        direccion: Yup.string().required('La dirección es requerida'),
      }),
      impuestos: Yup.object({
        iva: Yup.number().required('El IVA es requerido').min(0, 'El IVA no puede ser negativo'),
        retencionFuente: Yup.number().required('La retención en la fuente es requerida').min(0, 'La retención no puede ser negativa'),
      }),
    }),
  }),
  3: Yup.object({
    certificaciones: Yup.object({
      sanitario: Yup.boolean(),
      fiscal: Yup.boolean(),
      origen: Yup.boolean(),
    }),
    fechaLimiteComercializacion: Yup.string().required('La fecha límite de comercialización es requerida'),
  }),
};

const Vender: React.FC = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [imagenes, setImagenes] = useState<File[]>([]);

  const formik = useFormik({
    initialValues: {
      nombre: '',
      tipo: '',
      precio: '',
      cantidad: '',
      descripcion: '',
      imagenes: [],
      detallesTecnicos: {
        origen: '',
        variedad: '',
        tueste: '',
        perfilSabor: '',
        formato: '',
        dulzor: '',
        fechaProduccion: '',
        condicionesTransporte: {
          temperatura: '',
          humedad: '',
        },
      },
      logistica: {
        peso: '',
        dimensiones: {
          largo: '',
          ancho: '',
          alto: '',
        },
        medioTransporte: '',
        paisDestino: '',
        ubicacionOrigen: {
          departamento: '',
          ciudad: '',
          direccion: '',
        },
        impuestos: {
          iva: 19, // IVA por defecto en Colombia
          retencionFuente: 4, // Retención por defecto
        },
      },
      certificaciones: {
        sanitario: false,
        fiscal: false,
        origen: false,
      },
      fechaLimiteComercializacion: '',
    },
    validationSchema: validationSchemas[activeStep as keyof typeof validationSchemas],
    onSubmit: (values) => {
      if (activeStep === steps.length - 1) {
        // Aquí iría la lógica para enviar el producto
        console.log(values);
      } else {
        handleNext();
      }
    },
  });

  const isStepValid = async () => {
    try {
      await validationSchemas[activeStep as keyof typeof validationSchemas].validate(formik.values, { abortEarly: false });
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await isStepValid();
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(formik.values).forEach(key => {
        formik.setFieldTouched(key, true);
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setImagenes([...imagenes, ...newFiles]);
      formik.setFieldValue('imagenes', [...imagenes, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImagenes = imagenes.filter((_, i) => i !== index);
    setImagenes(newImagenes);
    formik.setFieldValue('imagenes', newImagenes);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del producto"
                name="nombre"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                helperText={formik.touched.nombre && formik.errors.nombre}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                error={formik.touched.tipo && Boolean(formik.errors.tipo)}
              >
                <InputLabel>Tipo de producto</InputLabel>
                <Select
                  name="tipo"
                  value={formik.values.tipo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Tipo de producto"
                >
                  <MenuItem value="cafe">Café</MenuItem>
                  <MenuItem value="panela">Panela</MenuItem>
                  <MenuItem value="otros">Otros</MenuItem>
                </Select>
                {formik.touched.tipo && formik.errors.tipo && (
                  <FormHelperText>{formik.errors.tipo}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Precio"
                name="precio"
                type="number"
                value={formik.values.precio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.precio && Boolean(formik.errors.precio)}
                helperText={formik.touched.precio && formik.errors.precio}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cantidad"
                name="cantidad"
                type="number"
                value={formik.values.cantidad}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cantidad && Boolean(formik.errors.cantidad)}
                helperText={formik.touched.cantidad && formik.errors.cantidad}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción"
                name="descripcion"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
                helperText={formik.touched.descripcion && formik.errors.descripcion}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                multiple
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Subir Imágenes
                </Button>
              </label>
              {formik.touched.imagenes && formik.errors.imagenes && (
                <FormHelperText error>{formik.errors.imagenes as string}</FormHelperText>
              )}
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {imagenes.map((imagen, index) => (
                  <Chip
                    key={index}
                    label={imagen.name}
                    onDelete={() => handleRemoveImage(index)}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Origen"
                name="detallesTecnicos.origen"
                value={formik.values.detallesTecnicos.origen}
                onChange={formik.handleChange}
                error={
                  formik.touched.detallesTecnicos?.origen &&
                  Boolean(formik.errors.detallesTecnicos?.origen)
                }
                helperText={
                  formik.touched.detallesTecnicos?.origen &&
                  formik.errors.detallesTecnicos?.origen
                }
              />
            </Grid>
            {formik.values.tipo === 'cafe' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Variedad"
                    name="detallesTecnicos.variedad"
                    value={formik.values.detallesTecnicos.variedad}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.detallesTecnicos?.variedad &&
                      Boolean(formik.errors.detallesTecnicos?.variedad)
                    }
                    helperText={
                      formik.touched.detallesTecnicos?.variedad &&
                      formik.errors.detallesTecnicos?.variedad
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tueste"
                    name="detallesTecnicos.tueste"
                    value={formik.values.detallesTecnicos.tueste}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.detallesTecnicos?.tueste &&
                      Boolean(formik.errors.detallesTecnicos?.tueste)
                    }
                    helperText={
                      formik.touched.detallesTecnicos?.tueste &&
                      formik.errors.detallesTecnicos?.tueste
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Perfil de Sabor"
                    name="detallesTecnicos.perfilSabor"
                    value={formik.values.detallesTecnicos.perfilSabor}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.detallesTecnicos?.perfilSabor &&
                      Boolean(formik.errors.detallesTecnicos?.perfilSabor)
                    }
                    helperText={
                      formik.touched.detallesTecnicos?.perfilSabor &&
                      formik.errors.detallesTecnicos?.perfilSabor
                    }
                  />
                </Grid>
              </>
            )}
            {formik.values.tipo === 'panela' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Formato"
                    name="detallesTecnicos.formato"
                    value={formik.values.detallesTecnicos.formato}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.detallesTecnicos?.formato &&
                      Boolean(formik.errors.detallesTecnicos?.formato)
                    }
                    helperText={
                      formik.touched.detallesTecnicos?.formato &&
                      formik.errors.detallesTecnicos?.formato
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dulzor"
                    name="detallesTecnicos.dulzor"
                    value={formik.values.detallesTecnicos.dulzor}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.detallesTecnicos?.dulzor &&
                      Boolean(formik.errors.detallesTecnicos?.dulzor)
                    }
                    helperText={
                      formik.touched.detallesTecnicos?.dulzor &&
                      formik.errors.detallesTecnicos?.dulzor
                    }
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Producción"
                name="detallesTecnicos.fechaProduccion"
                value={formik.values.detallesTecnicos.fechaProduccion}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                error={
                  formik.touched.detallesTecnicos?.fechaProduccion &&
                  Boolean(formik.errors.detallesTecnicos?.fechaProduccion)
                }
                helperText={
                  formik.touched.detallesTecnicos?.fechaProduccion &&
                  formik.errors.detallesTecnicos?.fechaProduccion
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Temperatura de Transporte"
                name="detallesTecnicos.condicionesTransporte.temperatura"
                value={formik.values.detallesTecnicos.condicionesTransporte.temperatura}
                onChange={formik.handleChange}
                error={
                  formik.touched.detallesTecnicos?.condicionesTransporte?.temperatura &&
                  Boolean(formik.errors.detallesTecnicos?.condicionesTransporte?.temperatura)
                }
                helperText={
                  formik.touched.detallesTecnicos?.condicionesTransporte?.temperatura &&
                  formik.errors.detallesTecnicos?.condicionesTransporte?.temperatura
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Humedad de Transporte"
                name="detallesTecnicos.condicionesTransporte.humedad"
                value={formik.values.detallesTecnicos.condicionesTransporte.humedad}
                onChange={formik.handleChange}
                error={
                  formik.touched.detallesTecnicos?.condicionesTransporte?.humedad &&
                  Boolean(formik.errors.detallesTecnicos?.condicionesTransporte?.humedad)
                }
                helperText={
                  formik.touched.detallesTecnicos?.condicionesTransporte?.humedad &&
                  formik.errors.detallesTecnicos?.condicionesTransporte?.humedad
                }
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ubicación de Origen
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Departamento"
                name="logistica.ubicacionOrigen.departamento"
                value={formik.values.logistica.ubicacionOrigen.departamento}
                onChange={formik.handleChange}
                error={
                  formik.touched.logistica?.ubicacionOrigen?.departamento &&
                  Boolean(formik.errors.logistica?.ubicacionOrigen?.departamento)
                }
                helperText={
                  formik.touched.logistica?.ubicacionOrigen?.departamento &&
                  formik.errors.logistica?.ubicacionOrigen?.departamento
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ciudad"
                name="logistica.ubicacionOrigen.ciudad"
                value={formik.values.logistica.ubicacionOrigen.ciudad}
                onChange={formik.handleChange}
                error={
                  formik.touched.logistica?.ubicacionOrigen?.ciudad &&
                  Boolean(formik.errors.logistica?.ubicacionOrigen?.ciudad)
                }
                helperText={
                  formik.touched.logistica?.ubicacionOrigen?.ciudad &&
                  formik.errors.logistica?.ubicacionOrigen?.ciudad
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="logistica.ubicacionOrigen.direccion"
                value={formik.values.logistica.ubicacionOrigen.direccion}
                onChange={formik.handleChange}
                error={
                  formik.touched.logistica?.ubicacionOrigen?.direccion &&
                  Boolean(formik.errors.logistica?.ubicacionOrigen?.direccion)
                }
                helperText={
                  formik.touched.logistica?.ubicacionOrigen?.direccion &&
                  formik.errors.logistica?.ubicacionOrigen?.direccion
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Impuestos Aplicables
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="IVA (%)"
                name="logistica.impuestos.iva"
                type="number"
                value={formik.values.logistica.impuestos.iva}
                onChange={formik.handleChange}
                error={
                  formik.touched.logistica?.impuestos?.iva &&
                  Boolean(formik.errors.logistica?.impuestos?.iva)
                }
                helperText={
                  formik.touched.logistica?.impuestos?.iva &&
                  formik.errors.logistica?.impuestos?.iva
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Retención en la Fuente (%)"
                name="logistica.impuestos.retencionFuente"
                type="number"
                value={formik.values.logistica.impuestos.retencionFuente}
                onChange={formik.handleChange}
                error={
                  formik.touched.logistica?.impuestos?.retencionFuente &&
                  Boolean(formik.errors.logistica?.impuestos?.retencionFuente)
                }
                helperText={
                  formik.touched.logistica?.impuestos?.retencionFuente &&
                  formik.errors.logistica?.impuestos?.retencionFuente
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Información de Envío
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Peso (kg)"
                name="logistica.peso"
                type="number"
                value={formik.values.logistica.peso}
                onChange={formik.handleChange}
                error={
                  formik.touched.logistica?.peso &&
                  Boolean(formik.errors.logistica?.peso)
                }
                helperText={
                  formik.touched.logistica?.peso &&
                  formik.errors.logistica?.peso
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.logistica?.medioTransporte && Boolean(formik.errors.logistica?.medioTransporte)}>
                <InputLabel>Medio de Transporte</InputLabel>
                <Select
                  name="logistica.medioTransporte"
                  value={formik.values.logistica.medioTransporte}
                  onChange={formik.handleChange}
                  label="Medio de Transporte"
                >
                  <MenuItem value="aereo">Aéreo</MenuItem>
                  <MenuItem value="maritimo">Marítimo</MenuItem>
                  <MenuItem value="terrestre">Terrestre</MenuItem>
                </Select>
                {formik.touched.logistica?.medioTransporte && formik.errors.logistica?.medioTransporte && (
                  <FormHelperText>{formik.errors.logistica.medioTransporte}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Largo (cm)"
                name="logistica.dimensiones.largo"
                type="number"
                value={formik.values.logistica.dimensiones.largo}
                onChange={formik.handleChange}
                error={
                  formik.touched.logistica?.dimensiones?.largo &&
                  Boolean(formik.errors.logistica?.dimensiones?.largo)
                }
                helperText={
                  formik.touched.logistica?.dimensiones?.largo &&
                  formik.errors.logistica?.dimensiones?.largo
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Ancho (cm)"
                name="logistica.dimensiones.ancho"
                type="number"
                value={formik.values.logistica.dimensiones.ancho}
                onChange={formik.handleChange}
                error={
                  formik.touched.logistica?.dimensiones?.ancho &&
                  Boolean(formik.errors.logistica?.dimensiones?.ancho)
                }
                helperText={
                  formik.touched.logistica?.dimensiones?.ancho &&
                  formik.errors.logistica?.dimensiones?.ancho
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Alto (cm)"
                name="logistica.dimensiones.alto"
                type="number"
                value={formik.values.logistica.dimensiones.alto}
                onChange={formik.handleChange}
                error={
                  formik.touched.logistica?.dimensiones?.alto &&
                  Boolean(formik.errors.logistica?.dimensiones?.alto)
                }
                helperText={
                  formik.touched.logistica?.dimensiones?.alto &&
                  formik.errors.logistica?.dimensiones?.alto
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="País de Destino"
                name="logistica.paisDestino"
                value={formik.values.logistica.paisDestino}
                onChange={formik.handleChange}
                error={
                  formik.touched.logistica?.paisDestino &&
                  Boolean(formik.errors.logistica?.paisDestino)
                }
                helperText={
                  formik.touched.logistica?.paisDestino &&
                  formik.errors.logistica?.paisDestino
                }
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Certificaciones disponibles
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl>
                  <Button
                    variant={formik.values.certificaciones.sanitario ? "contained" : "outlined"}
                    onClick={() => formik.setFieldValue('certificaciones.sanitario', !formik.values.certificaciones.sanitario)}
                    startIcon={<AddIcon />}
                  >
                    Certificado Sanitario
                  </Button>
                </FormControl>
                <FormControl>
                  <Button
                    variant={formik.values.certificaciones.fiscal ? "contained" : "outlined"}
                    onClick={() => formik.setFieldValue('certificaciones.fiscal', !formik.values.certificaciones.fiscal)}
                    startIcon={<AddIcon />}
                  >
                    Certificado Fiscal
                  </Button>
                </FormControl>
                <FormControl>
                  <Button
                    variant={formik.values.certificaciones.origen ? "contained" : "outlined"}
                    onClick={() => formik.setFieldValue('certificaciones.origen', !formik.values.certificaciones.origen)}
                    startIcon={<AddIcon />}
                  >
                    Certificado de Origen
                  </Button>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Límite de Comercialización"
                name="fechaLimiteComercializacion"
                value={formik.values.fechaLimiteComercializacion}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                error={
                  formik.touched.fechaLimiteComercializacion &&
                  Boolean(formik.errors.fechaLimiteComercializacion)
                }
                helperText={
                  formik.touched.fechaLimiteComercializacion &&
                  formik.errors.fechaLimiteComercializacion
                }
              />
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Publicar Producto
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={formik.handleSubmit}>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Atrás
              </Button>
            )}
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? formik.submitForm : handleNext}
              disabled={formik.isSubmitting}
            >
              {activeStep === steps.length - 1 ? 'Publicar' : 'Siguiente'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Vender;