import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  LinearProgress,
  Paper,
  Divider,
  IconButton,
  Skeleton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Gavel as ScaleIcon,
  Person as UserIcon,
  Event as CalendarIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertCircleIcon,
  Description as FileTextIcon,
  Chat as MessageSquareIcon,
  Phone as PhoneIcon,
  VideoCall as VideoIcon,
  Star as StarIcon,
  EmojiEvents as AwardIcon,
  Work as BriefcaseIcon,
  Group as UsersIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as DollarSignIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { attorneyService, transactionService } from '../lib/api';

export function AttorneyWorkflowPage() {
  const navigate = useNavigate();
  const [attorneys, setAttorneys] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [attorneyResponse, transactionResponse] = await Promise.all([
        attorneyService.getAttorneys(),
        transactionService.getTransactions()
      ]);
      
      setAttorneys(attorneyResponse.attorneys);
      setTransactions(transactionResponse.transactions);
      
      if (attorneyResponse.attorneys.length > 0) {
        setSelectedAttorney(attorneyResponse.attorneys[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleConsultation = async (attorneyId) => {
    try {
      const datetime = new Date();
      datetime.setDate(datetime.getDate() + 7); // Schedule for next week
      await attorneyService.scheduleConsultation(attorneyId, datetime.toISOString());
      alert('Consultation scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling consultation:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Contract':
        return 'info';
      case 'Closed':
        return 'success';
      case 'Pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const calculateTransactionProgress = (transaction) => {
    const steps = ['contract', 'inspection', 'financing', 'closing'];
    const completedSteps = steps.filter(step => transaction.progress[step] === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'in-progress':
        return <ClockIcon color="info" />;
      default:
        return <Box sx={{ width: 8, height: 8, bgcolor: 'grey.400', borderRadius: '50%' }} />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} lg={8}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Attorney Workflow
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Professional legal support and consultation
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Attorney List */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <ScaleIcon />
                <Typography variant="h6">Available Attorneys</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {attorneys.map((attorney) => (
                  <Card 
                    key={attorney.id}
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedAttorney?.id === attorney.id ? 2 : 1,
                      borderColor: selectedAttorney?.id === attorney.id ? 'primary.main' : 'divider',
                      bgcolor: selectedAttorney?.id === attorney.id ? 'primary.50' : 'background.paper',
                      '&:hover': {
                        bgcolor: selectedAttorney?.id === attorney.id ? 'primary.50' : 'grey.50',
                        boxShadow: 2
                      }
                    }}
                    onClick={() => setSelectedAttorney(attorney)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar sx={{ width: 48, height: 48 }} src={attorney.avatar}>
                          {attorney.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {attorney.name}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                            <Typography variant="body2" fontWeight="medium">
                              {attorney.rating}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • {attorney.experience}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {attorney.specialties.slice(0, 2).map((specialty, index) => (
                              <Chip 
                                key={index} 
                                label={specialty} 
                                size="small" 
                                color="secondary"
                              />
                            ))}
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>{attorney.activeTransactions}</strong> active
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>{attorney.completedTransactions}</strong> completed
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Attorney Details & Workflow */}
        <Grid item xs={12} lg={8}>
          {selectedAttorney ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Attorney Profile */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <UserIcon />
                    <Typography variant="h6">Attorney Profile</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Avatar sx={{ width: 80, height: 80 }} src={selectedAttorney.avatar}>
                      {selectedAttorney.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h4" gutterBottom fontWeight="bold">
                        {selectedAttorney.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                          <Typography variant="body1" fontWeight="medium">
                            {selectedAttorney.rating}
                          </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                          • {selectedAttorney.experience} experience
                        </Typography>
                      </Box>
                      
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {selectedAttorney.bio}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {selectedAttorney.specialties.map((specialty, index) => (
                          <Chip 
                            key={index} 
                            label={specialty} 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button 
                          variant="contained"
                          startIcon={<CalendarIcon />}
                          onClick={() => handleScheduleConsultation(selectedAttorney.id)}
                        >
                          Schedule Consultation
                        </Button>
                        <Button 
                          variant="outlined" 
                          startIcon={<MessageSquareIcon />}
                        >
                          Send Message
                        </Button>
                        <Button 
                          variant="outlined" 
                          startIcon={<PhoneIcon />}
                        >
                          Call
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Attorney Stats */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <TrendingUpIcon />
                    <Typography variant="h6">Performance Metrics</Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                        <BriefcaseIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                          {selectedAttorney.activeTransactions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Active Cases
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                        <CheckCircleIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {selectedAttorney.completedTransactions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Completed
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
                        <StarIcon sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="warning.main">
                          {selectedAttorney.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Rating
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.50' }}>
                        <AwardIcon sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="secondary.main">
                          {selectedAttorney.experience}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Experience
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Active Transactions */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <HomeIcon />
                    <Typography variant="h6">Active Transactions</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {transactions.filter(t => t.attorney.id === selectedAttorney.id).map((transaction) => {
                      const progress = calculateTransactionProgress(transaction);
                      
                      return (
                        <Card key={transaction.id} sx={{ '&:hover': { boxShadow: 3 } }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                  {transaction.propertyAddress}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                  <Chip 
                                    label={transaction.status} 
                                    color={getStatusColor(transaction.status)}
                                    size="small"
                                  />
                                  <Typography variant="body2" color="text.secondary">
                                    {transaction.clientRole === 'buyer' ? 'Buyer' : 'Seller'}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ mb: 2 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" fontWeight="medium">
                                      Progress
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {Math.round(progress)}%
                                    </Typography>
                                  </Box>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={progress} 
                                    sx={{ height: 8, borderRadius: 4 }}
                                  />
                                </Box>
                                
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                  <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                      Purchase Price:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                      ${transaction.purchasePrice.toLocaleString()}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">
                                      Closing Date:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                      {new Date(transaction.timeline.closingDate).toLocaleDateString()}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Box>
                              
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  startIcon={<FileTextIcon />}
                                >
                                  View
                                </Button>
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  startIcon={<MessageSquareIcon />}
                                >
                                  Message
                                </Button>
                              </Box>
                            </Box>
                            
                            {/* Timeline Steps */}
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={1}>
                              {Object.entries(transaction.progress).map(([step, status]) => (
                                <Grid item xs={3} key={step}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      justifyContent: 'center', 
                                      mb: 1 
                                    }}>
                                      {getStepIcon(status)}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                      {step.charAt(0).toUpperCase() + step.slice(1)}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Card sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ScaleIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Select an Attorney
                </Typography>
                <Typography color="text.secondary">
                  Choose an attorney from the list to view their profile and workflow
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default AttorneyWorkflowPage;

