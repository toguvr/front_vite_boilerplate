import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Content,
  HeaderLinks,
  HeaderLink,
  LogoIcon,
  PerfilDiv,
} from './styles';
import { useAuth } from '../../hooks/auth';
import { key } from '../../config/key';
import { theme } from '../../theme';

interface PrivateLayoutProps {
  children: React.ReactNode;
  logout: boolean;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children, logout }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { signOut, user } = useAuth();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(key.token);
    signOut();
    navigate('/');
  };

  return (
    <Container>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              cursor: 'pointer',
              color: theme.palette.primary.main,
            }}
            onClick={() =>
              navigate(logout ? '/criar-nova-dieta' : '/criar-dieta')
            }
          >
            NossoNutri
          </Typography>

          {!logout && (
            <HeaderLinks>
              <HeaderLink
                onClick={() => navigate('/criar-dieta')}
                className={location.pathname === '/criar-dieta' ? 'active' : ''}
              >
                Fazer dieta
              </HeaderLink>
              <HeaderLink
                onClick={() => navigate('/minhas-dietas')}
                className={
                  location.pathname === '/minhas-dietas' ? 'active' : ''
                }
              >
                Minhas dietas
              </HeaderLink>
            </HeaderLinks>
          )}

          {!logout && (
            <PerfilDiv>
              <Typography variant="body1" sx={{ mx: 2 }}>
                {user?.email}
              </Typography>
              <IconButton onClick={handleLogout} color="error">
                <LogoutIcon />
              </IconButton>
            </PerfilDiv>
          )}

          {!logout && (
            <IconButton
              edge="end"
              color="primary"
              onClick={handleMenuOpen}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                navigate('/criar-dieta');
                handleMenuClose();
              }}
            >
              Fazer dieta
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate('/minhas-dietas');
                handleMenuClose();
              }}
            >
              Minhas dietas
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Content>{children}</Content>
    </Container>
  );
};

export default PrivateLayout;
