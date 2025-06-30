import React, { useState } from 'react';
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
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  ExitToApp as ExitIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const transactions = [
    {
      id: 1,
      property: '123 Oak Street, San Francisco, CA',
      status: 'contract_review',
      progress: 25,
      nextStep: 'Attorney review pending',
      price: '$750,000',
      type: 'purchase'
    },
    {
      id: 2,
      property: '456 Pine Avenue, Oakland, CA',
      status: 'inspection',
      progress: 60,
      nextStep: 'Inspection scheduled for tomorrow',
      price: '$520,000',
      type: 'sale'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'document',
      message: 'Contract uploaded for 123 Oak Street',
      time: '2 hours ago',
      icon: DescriptionIcon
    },
    {
      id: 2,
      type: 'attorney',
      message: 'Attorney Sarah Johnson assigned to your case',
      time: '1 day ago',
      icon: PersonIcon
    },
    {
      id: 3,
      type: 'message',
      message: 'New message from your attorney',
      time: '2 days ago',
      icon: MessageIcon
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'contract_review': return 'warning';
      case 'inspection': return 'info';
      case 'financing': return 'secondary';
      case 'closing': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'contract_review': return 'Contract Review';
      case 'inspection': return 'Inspection Period';
      case 'financing': return 'Financing';
      case 'closing': return 'Closing Preparation';
      default: return 'Unknown';
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: DashboardIcon, index: 0 },
    { text: 'My Transactions', icon: DescriptionIcon, index: 1 },
    { text: 'Documents', icon: DescriptionIcon, index: 2 },
    { text: 'Messages', icon: MessageIcon, index: 3 },
    { text: 'Calendar', icon: CalendarIcon, index: 4 },
    { text: 'Settings', icon: SettingsIcon, index: 5 },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <HomeIcon />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Agent Free
          </Typography>
        </Toolbar>
        
        <Divider />
        
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selectedIndex === item.index}
                  onClick={() => setSelectedIndex(item.index)}
                >
                  <ListItemIcon>
                    <Icon color={selectedIndex === item.index ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider />
        
        {/* User Profile */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email}
              </Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<ExitIcon />}
            onClick={logout}
          >
            Sign Out
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Header */}
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Dashboard
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Welcome back, {user?.firstName}!
              </Typography>
            </Box>
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ ml: 1 }}
            >
              New Transaction
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="overline">
                        Active Transactions
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        2
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +1 from last month
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <DescriptionIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="overline">
                        Total Saved
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        $31,000
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        vs traditional agents
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'success.light' }}>
                      <MoneyIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="overline">
                        Avg. Process Time
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        28 days
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        15% faster than average
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'info.light' }}>
                      <TimeIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="overline">
                        Success Rate
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        98%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Successful closings
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'success.light' }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {/* Active Transactions */}
            <Grid item xs={12} lg={8}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                    Active Transactions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Your current real estate transactions and their progress
                  </Typography>

                  <Box sx={{ space: 3 }}>
                    {transactions.map((transaction) => (
                      <Paper
                        key={transaction.id}
                        elevation={1}
                        sx={{ p: 3, mb: 2, borderRadius: 2 }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {transaction.property}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {transaction.type === 'purchase' ? 'Purchasing' : 'Selling'} • {transaction.price}
                            </Typography>
                          </Box>
                          <Chip
                            label={getStatusText(transaction.status)}
                            color={getStatusColor(transaction.status)}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Progress</Typography>
                            <Typography variant="body2">{transaction.progress}%</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={transaction.progress}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <WarningIcon color="warning" sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            {transaction.nextStep}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity & Quick Actions */}
            <Grid item xs={12} lg={4}>
              <Card elevation={2} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                    Recent Activity
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Latest updates on your transactions
                  </Typography>

                  <Box>
                    {recentActivity.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <Box key={activity.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'grey.100', mr: 2, width: 32, height: 32 }}>
                            <Icon sx={{ fontSize: 16 }} />
                          </Avatar>
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              {activity.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>

              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Upload Document
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CalendarIcon />}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Schedule Call
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<MessageIcon />}
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Send Message
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

