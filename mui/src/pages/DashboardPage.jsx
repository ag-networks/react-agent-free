import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Message as MessageIcon,
  Event as CalendarIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckIcon,
  Search as SearchIcon,
  Gavel as GavelIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  Upload as UploadIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const drawerWidth = 240;

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Transaction Overview Data matching the design
  const transactionOverview = [
    {
      title: 'Contract Review',
      amount: '$550,000',
      status: 'active'
    },
    {
      title: 'Inspection Period',
      amount: '$325,000',
      status: 'active'
    },
    {
      title: 'Financing',
      amount: '$45,000',
      progress: 75,
      status: 'in-progress'
    },
    {
      title: 'Closing Preparation',
      amount: '$550,000',
      status: 'pending'
    }
  ];

  // Transaction Timeline matching the design
  const transactionTimeline = [
    {
      event: 'Contract Accepted',
      date: 'May 2, 2024',
      status: 'completed'
    },
    {
      event: 'Inspection Ends',
      date: 'May 9, 2024',
      status: 'completed'
    },
    {
      event: 'Financing',
      date: '40% complete',
      status: 'in-progress'
    },
    {
      event: 'Apprebal',
      date: 'May 15, 2024',
      status: 'pending'
    },
    {
      event: 'Closing Date',
      date: 'May 30, 2024',
      status: 'pending'
    }
  ];

  // Recent Activity matching the design
  const recentActivity = [
    {
      id: 1,
      name: 'Alice Jennings',
      action: 'Anrriee keurrecompleted',
      avatar: 'A+'
    },
    {
      id: 2,
      name: 'Purchase agreement',
      action: 'Tegract',
      avatar: 'A+'
    }
  ];

  const menuItems = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/dashboard', active: true },
    { text: 'My Transactions', icon: DescriptionIcon, path: '/properties' },
    { text: 'Documents', icon: DescriptionIcon, path: '/documents' },
    { text: 'Messages', icon: MessageIcon, path: '/messages' },
    { text: 'Calendar', icon: CalendarIcon, path: '/calendar' },
    { text: 'Settings', icon: SettingsIcon, path: '/settings' }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Blue Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'primary.main',
            color: 'white'
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
            Agent Free
          </Typography>
        </Box>

        {/* Navigation */}
        <List sx={{ flexGrow: 1, px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  color: 'white',
                  bgcolor: item.active ? 'primary.dark' : 'transparent',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* User Profile */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'primary.dark' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.dark', mr: 2 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.light' }}>
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={logout}
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
                borderColor: 'white'
              }
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.50' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Transaction Overview
            </Typography>
          </Box>

          {/* Transaction Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {transactionOverview.map((transaction, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                <Card elevation={1}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {transaction.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {transaction.amount}
                    </Typography>
                    {transaction.progress && (
                      <Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={transaction.progress} 
                          sx={{ height: 8, borderRadius: 4, mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {transaction.progress}%
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4}>
            {/* Transaction Timeline */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Transaction Timeline
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {transactionTimeline.map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: item.status === 'completed' ? 'primary.main' :
                                    item.status === 'in-progress' ? 'primary.light' :
                                    'grey.300'
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {item.event}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.date}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Recent Activity */}
                <Card elevation={1}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                      Recent Activity
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {recentActivity.map((activity) => (
                        <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: 'primary.main',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '14px'
                            }}
                          >
                            {activity.avatar}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {activity.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {activity.action}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card elevation={1}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                      Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<UploadIcon />}
                          sx={{ flex: 1, textTransform: 'none' }}
                        >
                          Upload Deviow
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<PhoneIcon />}
                          sx={{ flex: 1, textTransform: 'none' }}
                        >
                          Schedule Call
                        </Button>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<MessageIcon />}
                        fullWidth
                        sx={{ textTransform: 'none' }}
                      >
                        Direct Campage
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

