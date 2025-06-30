import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  Paper,
  IconButton,
  Badge,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckIcon,
  Search as SearchIcon,
  Gavel as GavelIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data for dashboard
  const stats = [
    { title: 'Active Transactions', value: '3', icon: MoneyIcon, color: 'primary' },
    { title: 'Pending Reviews', value: '2', icon: ClockIcon, color: 'warning' },
    { title: 'Completed Deals', value: '12', icon: CheckIcon, color: 'success' },
    { title: 'Saved Properties', value: '8', icon: SearchIcon, color: 'info' },
  ];

  const transactions = [
    {
      id: 1,
      property: '123 Main St, San Francisco, CA',
      type: 'Purchase',
      status: 'contract_review',
      progress: 25,
      attorney: 'Sarah Johnson',
      nextStep: 'Contract review scheduled for tomorrow'
    },
    {
      id: 2,
      property: '456 Oak Ave, Oakland, CA',
      type: 'Sale',
      status: 'inspection',
      progress: 60,
      attorney: 'Michael Chen',
      nextStep: 'Inspection completed, awaiting report'
    },
    {
      id: 3,
      property: '789 Pine St, Berkeley, CA',
      type: 'Purchase',
      status: 'financing',
      progress: 80,
      attorney: 'Emily Rodriguez',
      nextStep: 'Final loan approval pending'
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Shared Sidebar */}
      <Sidebar user={user} onSignOut={logout} />
      
      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: '280px' }}>
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                Dashboard
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Welcome back, {user?.firstName || 'User'}!
              </Typography>
            </Box>
            <IconButton color="primary" sx={{ mr: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography color="text.secondary" gutterBottom variant="overline">
                            {stat.title}
                          </Typography>
                          <Typography variant="h4" component="div" fontWeight="bold">
                            {stat.value}
                          </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: `${stat.color}.main`, width: 56, height: 56 }}>
                          <IconComponent />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Active Transactions */}
          <Card elevation={2} sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Active Transactions
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/properties')}
                >
                  New Transaction
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                {transactions.map((transaction) => (
                  <Grid item xs={12} md={6} lg={4} key={transaction.id}>
                    <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {transaction.property}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip 
                            label={transaction.type} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Chip 
                            label={getStatusText(transaction.status)} 
                            size="small" 
                            color={getStatusColor(transaction.status)}
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={transaction.progress} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Attorney
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                            {transaction.attorney.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Typography variant="body2">
                            {transaction.attorney}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Next Step
                        </Typography>
                        <Typography variant="body2">
                          {transaction.nextStep}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<SearchIcon />}
                    onClick={() => navigate('/properties')}
                    sx={{ py: 2 }}
                  >
                    Search Properties
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<GavelIcon />}
                    onClick={() => navigate('/contracts')}
                    sx={{ py: 2 }}
                  >
                    Generate Contract
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<WarningIcon />}
                    onClick={() => navigate('/attorneys')}
                    sx={{ py: 2 }}
                  >
                    Find Attorney
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<MoneyIcon />}
                    onClick={() => navigate('/calculator')}
                    sx={{ py: 2 }}
                  >
                    Cost Calculator
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}

export default DashboardPage;

