import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Button
} from '@mui/material';
import {
  Home as HomeIcon,
  Assignment as TransactionsIcon,
  Description as ContractsIcon,
  Folder as DocumentsIcon,
  Message as MessagesIcon,
  Dashboard as DashboardIcon,
  People as ClientManagementIcon,
  CalendarToday as CalendarIcon,
  AccountTree as WorkflowIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const Sidebar = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { 
      label: 'Dashboard', 
      icon: HomeIcon, 
      path: '/dashboard',
      color: '#4285f4'
    },
    { 
      label: 'My Transactions', 
      icon: TransactionsIcon, 
      path: '/transactions',
      color: '#4285f4'
    },
    { 
      label: 'Contracts', 
      icon: ContractsIcon, 
      path: '/contracts',
      color: '#4285f4'
    },
    { 
      label: 'Documents', 
      icon: DocumentsIcon, 
      path: '/documents',
      color: '#4285f4'
    },
    { 
      label: 'Messages', 
      icon: MessagesIcon, 
      path: '/messages',
      color: '#4285f4'
    },
    { 
      label: 'Attorney Dashboard', 
      icon: DashboardIcon, 
      path: '/attorney-dashboard',
      color: '#4285f4'
    },
    { 
      label: 'Client Management', 
      icon: ClientManagementIcon, 
      path: '/attorney-clients',
      color: '#4285f4'
    },
    { 
      label: 'Calendar', 
      icon: CalendarIcon, 
      path: '/calendar',
      color: '#4285f4'
    },
    { 
      label: 'Agent Workflow', 
      icon: WorkflowIcon, 
      path: '/attorney-workflow',
      color: '#4285f4'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <Box
      sx={{
        width: 280,
        height: '100vh',
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'primary.light' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'white',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              AF
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight="bold">
            Agent Free
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2 }}>
        <List sx={{ px: 2 }}>
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <ListItem
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: 'white',
                  '&:hover': { 
                    bgcolor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)' 
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  <IconComponent />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400
                  }}
                />
              </ListItem>
            );
          })}
          
          {/* Settings */}
          <ListItem
            onClick={() => handleNavigation('/settings')}
            sx={{
              cursor: 'pointer',
              borderRadius: 2,
              mb: 1,
              bgcolor: isActivePath('/settings') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: 'white',
              '&:hover': { 
                bgcolor: isActivePath('/settings') ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)' 
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Settings"
              primaryTypographyProps={{
                fontWeight: isActivePath('/settings') ? 600 : 400
              }}
            />
          </ListItem>
        </List>
      </Box>

      {/* User Profile */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'primary.light' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight="medium" noWrap>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="primary.light" noWrap>
              {user?.email || 'user@agentfree.com'}
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<LogoutIcon />}
          onClick={onSignOut}
          sx={{ 
            bgcolor: 'primary.main', 
            '&:hover': { bgcolor: 'primary.light' },
            color: 'white'
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;

