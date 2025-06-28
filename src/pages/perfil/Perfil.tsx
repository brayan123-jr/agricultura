import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';
import EditIcon from '@mui/icons-material/Edit';

const Perfil = () => {
  const { user } = useAuth();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [editField, setEditField] = React.useState<{
    field: string;
    value: string;
    label: string;
  } | null>(null);

  if (!user) {
    return (
      <Container>
        <Typography>No se encontró información del usuario.</Typography>
      </Container>
    );
  }

  const handleEdit = (field: string, value: string, label: string) => {
    setEditField({ field, value, label });
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditField(null);
  };

  const handleSaveEdit = () => {
    // Aquí iría la lógica para guardar los cambios
    handleCloseEdit();
  };

  const InfoRow = ({ icon, label, value, field }: { icon: React.ReactNode, label: string, value: string, field: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box sx={{ mr: 2, color: 'primary.main' }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography>{value}</Typography>
      </Box>
      <Button
        startIcon={<EditIcon />}
        size="small"
        onClick={() => handleEdit(field, value, label)}
      >
        Editar
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <AccountCircleIcon sx={{ fontSize: 64, color: 'primary.main', mr: 2 }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              Mi Perfil
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gestiona tu información personal
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <InfoRow
              icon={<BadgeIcon />}
              label="Nombre Completo"
              value={user.nombre}
              field="nombre"
            />
            <InfoRow
              icon={<EmailIcon />}
              label="Correo Electrónico"
              value={user.email}
              field="email"
            />
            <InfoRow
              icon={<PhoneIcon />}
              label="Teléfono"
              value={user.telefono}
              field="telefono"
            />
            <InfoRow
              icon={<LocationOnIcon />}
              label="Dirección"
              value={user.direccion}
              field="direccion"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ mr: 2, color: 'primary.main' }}>
                <BadgeIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Tipo de Usuario
                </Typography>
                <Typography sx={{ textTransform: 'capitalize' }}>
                  {user.tipo}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Editar {editField?.label}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={editField?.label}
            type="text"
            fullWidth
            variant="outlined"
            value={editField?.value}
            onChange={(e) => setEditField(prev => prev ? {...prev, value: e.target.value} : null)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Perfil; 