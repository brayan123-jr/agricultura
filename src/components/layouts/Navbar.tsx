import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#FCD116' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 0,
            display: 'flex',
            alignItems: 'center',
            color: 'black',
            cursor: 'pointer',
            mr: 4
          }}
          onClick={() => navigate('/')}
        >
          AGRO-MARKET
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/productos')}
            sx={{ color: 'black' }}
          >
            Productos
          </Button>
          {isAuthenticated && (
            <>
              {user?.tipo === 'comprador' && (
                <Button
                  color="inherit"
                  onClick={() => navigate('/mis-compras')}
                  sx={{ color: 'black' }}
                >
                  Mis Compras
                </Button>
              )}
              {user?.tipo === 'vendedor' && (
                <Button
                  color="inherit"
                  onClick={() => navigate('/vender')}
                  sx={{ color: 'black' }}
                >
                  Vender
                </Button>
              )}
            </>
          )}
        </Box>

        {isAuthenticated ? (
          <>
            <IconButton
              onClick={handleMenu}
              sx={{ 
                bgcolor: '#ccc',
                '&:hover': { bgcolor: '#bbb' }
              }}
            >
              <Typography sx={{ color: 'black', fontSize: '1.2rem' }}>
                {user?.nombre.charAt(0).toUpperCase()}
              </Typography>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleNavigate('/perfil')}>Perfil</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </Menu>
          </>
        ) : (
          <Box>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{ color: 'black', mr: 1 }}
            >
              Iniciar Sesión
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/registro')}
              sx={{
                bgcolor: 'white',
                color: 'black',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Registrarse
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;