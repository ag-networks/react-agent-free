import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { attorneyService } from '../lib/api';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Message as MessageIcon,
  VideoCall as VideoCallIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Description as FileTextIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

export function AttorneyWorkflowPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState(0);

  // Mock data matching the design
  const pendingConsultations = [
    {
      id: 1,
      name: 'Michelle Lee',
      address: '3111.7 Frencq, TA Argelle, CA',
      status: 'Under Contract',
      stage: 'Pretice',
      action: 'Approve'
    },
    {
      id: 2,
      name: 'Robert Chen',
      address: '201.500 Durf Lateain, TX',
      status: 'Per approval',
      stage: 'fintaice',
      action: 'Review'
    }
  ];

  const contractReviews = [
    {
      id: 1,
      name: 'Daniel Martinez',
      address: '2018.1Htrm JU. Ireican, TI',
      status: 'Caving',
      stage: 'Pitgei',
      action: 'Checkilld'
    },
    {
      id: 2,
      name: 'Sarah Green',
      address: '13.8991 5irb Evervea, CO',
      status: 'Featuig',
      stage: 'Rotaioia',
      action: 'Approv'
    }
  ];

  const legalTasks = [
    {
      id: 1,
      task: 'Conduct legal review',
      date: 'Apr 24',
      status: 'pending'
    },
    {
      id: 2,
      task: 'Obtain client approval',
      date: 'Apr 25',
      status: 'completed'
    }
  ];

  const documentTemplates = [
    { name: 'Contact', status: '--' },
    { name: 'Amendment', status: '--' },
    { name: 'Agreement', status: '--' },
    { name: 'Addendum', status: '--' },
    { name: 'Bill of Sails', status: '--' }
  ];

  const calendarEvents = [
    { date: 11, event: 'Cillets Complrtion' },
    { date: 15, event: 'Difering Quemion' }
  ];

  const tabs = ['Dashboards', 'Contitutions', 'Contacts', 'Documents', 'Documents', 'Tasks'];

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ borderRadius: 0 }}>
        <Box sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main', 
                  borderRadius: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography sx={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                    ⚖
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  <Box component="span" sx={{ color: 'primary.main' }}>Agent</Box>
                  <Box component="span" sx={{ color: 'text.primary' }}>Workflow</Box>
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<MessageIcon />}
                sx={{ textTransform: 'none' }}
              >
                Message
              </Button>
              <Button
                variant="contained"
                startIcon={<VideoCallIcon />}
                sx={{ textTransform: 'none' }}
              >
                Start Video Call
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Navigation Tabs */}
      <Paper elevation={1} sx={{ borderRadius: 0 }}>
        <Box sx={{ px: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={tab} 
                label={tab} 
                sx={{ textTransform: 'none', fontWeight: 500 }}
              />
            ))}
          </Tabs>
        </Box>
      </Paper>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - 2/3 width */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Pending Client Consultations */}
              <Card elevation={1}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Pending Client Consultations
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ textTransform: 'none' }}
                      >
                        Deteutinge
                      </Button>
                      <IconButton size="small" sx={{ border: 1, borderColor: 'grey.300' }}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                
                <CardContent>
                  <Grid container spacing={2}>
                    {pendingConsultations.map((consultation) => (
                      <Grid size={{ xs: 12, md: 6 }} key={consultation.id}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {consultation.name}
                            </Typography>
                            <ChevronRightIcon sx={{ color: 'grey.400' }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {consultation.address}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                {consultation.status}
                              </Typography>
                              <Chip 
                                label={consultation.stage} 
                                size="small" 
                                sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}
                              />
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{ textTransform: 'none' }}
                            >
                              {consultation.action}
                            </Button>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Contract Reviews */}
              <Card elevation={1}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Contract Reviews
                  </Typography>
                </Box>
                
                <CardContent>
                  <Grid container spacing={2}>
                    {contractReviews.map((review) => (
                      <Grid size={{ xs: 12, md: 6 }} key={review.id}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {review.name}
                            </Typography>
                            <ChevronRightIcon sx={{ color: 'grey.400' }} />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {review.address}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                                {review.status}
                              </Typography>
                              <Chip 
                                label={review.stage} 
                                size="small" 
                                sx={{ bgcolor: 'error.light', color: 'error.dark' }}
                              />
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{ textTransform: 'none' }}
                            >
                              {review.action}
                            </Button>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Legal Tasks */}
              <Card elevation={1}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Legal Tasks
                  </Typography>
                </Box>
                
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {legalTasks.map((task) => (
                      <Paper key={task.id} variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {task.status === 'completed' ? (
                              <CheckCircleIcon sx={{ color: 'primary.main' }} />
                            ) : (
                              <ClockIcon sx={{ color: 'grey.400' }} />
                            )}
                            <Typography sx={{ fontWeight: 500 }}>{task.task}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              {task.date}
                            </Typography>
                            <IconButton size="small" sx={{ border: 1, borderColor: 'grey.300' }}>
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Right Column - 1/3 width */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Calendar */}
              <Card elevation={1}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {formatMonth(currentDate)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton 
                        size="small"
                        onClick={() => navigateMonth(-1)}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => navigateMonth(1)}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                      <Box key={day} sx={{ textAlign: 'center', py: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {day}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
                    {getDaysInMonth(currentDate).map((day, index) => (
                      <Box key={index} sx={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {day && (
                          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <Typography variant="body2" sx={{ fontWeight: day === 11 || day === 15 ? 600 : 400 }}>
                              {day}
                            </Typography>
                            {calendarEvents.find(event => event.date === day) && (
                              <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                                <Typography variant="caption" sx={{ color: 'primary.main', fontSize: '10px' }}>
                                  {calendarEvents.find(event => event.date === day)?.event}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Legal Document Templates */}
              <Card elevation={1}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Legal Document Templates
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 2 }}>
                  <List dense>
                    {documentTemplates.map((template, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <FileTextIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={template.name}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {template.status}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

