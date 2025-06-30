import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Container,
  AppBar,
  Toolbar,
  Badge,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Scale as ScaleIcon,
  Message as MessageIcon,
  VideoCall as VideoCallIcon,
  Event as CalendarIcon,
  Description as FileTextIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertCircleIcon,
  Add as PlusIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Person as UserIcon,
  Business as BuildingIcon,
  Phone as PhoneIcon,
  Email as MailIcon,
  LocationOn as MapPinIcon,
  AttachMoney as DollarSignIcon,
  Assignment as TaskIcon,
  Contacts as ContactsIcon,
  Folder as DocumentsIcon,
  Dashboard as DashboardIcon,
  Group as ConsultationsIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { AttorneyService } from '../lib/api';

const AttorneyWorkflowPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [consultations, setConsultations] = useState([]);
  const [contractReviews, setContractReviews] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkflowData = async () => {
      try {
        const attorneyService = new AttorneyService();
        
        // Mock data matching the design
        const mockConsultations = [
          {
            id: '1',
            clientName: 'Michelle Lee',
            address: '123 Oak Street, San Francisco, CA',
            status: 'pending',
            priority: 'high',
            type: 'Purchase Agreement Review',
            action: 'Schedule Call',
            actionType: 'call',
            avatar: 'ML'
          },
          {
            id: '2',
            clientName: 'Robert Chen',
            address: '456 Pine Avenue, Oakland, CA',
            status: 'approved',
            priority: 'medium',
            type: 'Contract Negotiation',
            action: 'Review Terms',
            actionType: 'review',
            avatar: 'RC'
          },
          {
            id: '3',
            clientName: 'Jennifer Walsh',
            address: '789 Elm Drive, Berkeley, CA',
            status: 'urgent',
            priority: 'urgent',
            type: 'Title Issue Resolution',
            action: 'Emergency Review',
            actionType: 'emergency',
            avatar: 'JW'
          }
        ];

        const mockContractReviews = [
          {
            id: '1',
            title: 'Purchase Agreement - 123 Oak Street',
            client: 'Michelle Lee',
            status: 'pending',
            priority: 'high',
            dueDate: '2024-04-15',
            type: 'purchase'
          },
          {
            id: '2',
            title: 'Lease Agreement - 456 Pine Avenue',
            client: 'Robert Chen',
            status: 'in_review',
            priority: 'medium',
            dueDate: '2024-04-18',
            type: 'lease'
          }
        ];

        const mockCalendarEvents = [
          {
            id: '1',
            title: 'Clients Completion',
            date: 11,
            type: 'completion'
          },
          {
            id: '2',
            title: 'Offering Question',
            date: 15,
            type: 'question'
          }
        ];

        setConsultations(mockConsultations);
        setContractReviews(mockContractReviews);
        setCalendarEvents(mockCalendarEvents);
      } catch (error) {
        console.error('Error loading workflow data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkflowData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'urgent': return 'error';
      case 'in_review': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'pending': return <ClockIcon sx={{ fontSize: 16 }} />;
      case 'urgent': return <AlertCircleIcon sx={{ fontSize: 16 }} />;
      default: return <FileTextIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getActionButtonColor = (actionType) => {
    switch (actionType) {
      case 'call': return 'primary';
      case 'review': return 'info';
      case 'emergency': return 'error';
      default: return 'primary';
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Sidebar */}
      <Box sx={{ width: 280, bgcolor: 'primary.dark', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ScaleIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold">
              Agent Free
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, px: 2 }}>
          <List>
            <ListItem button component={Link} to="/dashboard" sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/properties" sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <BuildingIcon />
              </ListItemIcon>
              <ListItemText primary="My Transactions" />
            </ListItem>
            <ListItem button component={Link} to="/documents" sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <FileTextIcon />
              </ListItemIcon>
              <ListItemText primary="Documents" />
            </ListItem>
            <ListItem button component={Link} to="/messages" sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItem>
            <ListItem button component={Link} to="/attorney-dashboard" sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Attorney Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/attorney-clients" sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <ContactsIcon />
              </ListItemIcon>
              <ListItemText primary="Client Management" />
            </ListItem>
            <ListItem button component={Link} to="/attorney-calendar" sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <CalendarIcon />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItem>
            <ListItem 
              button 
              sx={{ 
                borderRadius: 2, 
                mb: 1, 
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.light' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <ConsultationsIcon />
              </ListItemIcon>
              <ListItemText primary="Agent Workflow" />
            </ListItem>
            <ListItem button component={Link} to="/settings" sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'primary.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0) || 'A'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight="medium" noWrap>
                {user?.name || 'Attorney'}
              </Typography>
              <Typography variant="caption" color="primary.light" noWrap>
                {user?.email || 'attorney@agentfree.com'}
              </Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={signOut}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.light' } }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'grey.200' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ScaleIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Agent Workflow
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<MessageIcon />}
                sx={{ borderRadius: 2 }}
              >
                Message
              </Button>
              <Button
                variant="contained"
                startIcon={<VideoCallIcon />}
                sx={{ borderRadius: 2 }}
              >
                Start Video Call
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
          <Grid container spacing={3}>
            {/* Main Content Area */}
            <Grid item xs={12} lg={9}>
              {/* Tab Navigation */}
              <Paper sx={{ mb: 3 }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label="Dashboards" icon={<DashboardIcon />} iconPosition="start" />
                  <Tab label="Consultations" icon={<ConsultationsIcon />} iconPosition="start" />
                  <Tab label="Contacts" icon={<ContactsIcon />} iconPosition="start" />
                  <Tab label="Documents" icon={<DocumentsIcon />} iconPosition="start" />
                  <Tab label="Tasks" icon={<TaskIcon />} iconPosition="start" />
                </Tabs>
              </Paper>

              {/* Tab Content */}
              <TabPanel value={currentTab} index={0}>
                {/* Dashboards Content */}
                <Typography variant="h6" gutterBottom>
                  Dashboard Overview
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Active Cases
                        </Typography>
                        <Typography variant="h3" color="primary">
                          12
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Pending Reviews
                        </Typography>
                        <Typography variant="h3" color="warning.main">
                          5
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={currentTab} index={1}>
                {/* Pending Client Consultations */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Pending Client Consultations
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ borderRadius: 2 }}
                    >
                      Deuteunge
                    </Button>
                    <IconButton>
                      <PlusIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  {consultations.map((consultation) => (
                    <Grid item xs={12} md={4} key={consultation.id}>
                      <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {consultation.avatar}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  {consultation.clientName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {consultation.address}
                                </Typography>
                              </Box>
                            </Box>
                            <ChevronRightIcon color="action" />
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip
                              icon={getStatusIcon(consultation.status)}
                              label={consultation.status}
                              color={getStatusColor(consultation.status)}
                              size="small"
                            />
                            <Chip
                              label={consultation.priority}
                              color={getStatusColor(consultation.priority)}
                              size="small"
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {consultation.type}
                          </Typography>

                          <Button
                            variant="contained"
                            color={getActionButtonColor(consultation.actionType)}
                            size="small"
                            sx={{ borderRadius: 2 }}
                          >
                            {consultation.action}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Contract Reviews Section */}
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 3 }}>
                  Contract Reviews
                </Typography>

                <Grid container spacing={3}>
                  {contractReviews.map((review) => (
                    <Grid item xs={12} md={6} key={review.id}>
                      <Card sx={{ '&:hover': { boxShadow: 4 } }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" fontWeight="bold">
                                {review.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Client: {review.client}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Due: {review.dueDate}
                              </Typography>
                            </Box>
                            <ChevronRightIcon color="action" />
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip
                              icon={getStatusIcon(review.status)}
                              label={review.status.replace('_', ' ')}
                              color={getStatusColor(review.status)}
                              size="small"
                            />
                            <Chip
                              label={review.priority}
                              color={getStatusColor(review.priority)}
                              size="small"
                            />
                          </Box>

                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: 2 }}
                          >
                            Review Contract
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel value={currentTab} index={2}>
                <Typography variant="h6" gutterBottom>
                  Contacts Management
                </Typography>
                <Typography color="text.secondary">
                  Contact management features will be displayed here.
                </Typography>
              </TabPanel>

              <TabPanel value={currentTab} index={3}>
                <Typography variant="h6" gutterBottom>
                  Document Management
                </Typography>
                <Typography color="text.secondary">
                  Document management features will be displayed here.
                </Typography>
              </TabPanel>

              <TabPanel value={currentTab} index={4}>
                <Typography variant="h6" gutterBottom>
                  Task Management
                </Typography>
                <Typography color="text.secondary">
                  Task management features will be displayed here.
                </Typography>
              </TabPanel>
            </Grid>

            {/* Right Sidebar - Calendar */}
            <Grid item xs={12} lg={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      April 2024
                    </Typography>
                    <Box>
                      <IconButton size="small">
                        <ChevronLeftIcon />
                      </IconButton>
                      <IconButton size="small">
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Days of Week */}
                  <Grid container spacing={0.5} sx={{ mb: 1 }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                      <Grid item xs key={`${day}-${index}`}>
                        <Typography variant="caption" color="text.secondary" align="center" display="block">
                          {day}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Calendar Days */}
                  <Grid container spacing={0.5}>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                      const hasEvent = calendarEvents.some(event => event.date === day);
                      const isHighlighted = day === 11 || day === 15;
                      
                      return (
                        <Grid item xs key={day}>
                          <Box
                            sx={{
                              p: 1,
                              textAlign: 'center',
                              borderRadius: 1,
                              cursor: 'pointer',
                              bgcolor: isHighlighted ? 'primary.main' : 'transparent',
                              color: isHighlighted ? 'white' : 'text.primary',
                              '&:hover': { bgcolor: isHighlighted ? 'primary.dark' : 'grey.100' },
                              position: 'relative'
                            }}
                          >
                            <Typography variant="body2">
                              {day}
                            </Typography>
                            {hasEvent && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 2,
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  width: 4,
                                  height: 4,
                                  borderRadius: '50%',
                                  bgcolor: isHighlighted ? 'white' : 'primary.main'
                                }}
                              />
                            )}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Calendar Events */}
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Upcoming Events
                  </Typography>
                  {calendarEvents.map((event) => (
                    <Box key={event.id} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="primary.main" fontWeight="medium">
                        {event.date} {event.title}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AttorneyWorkflowPage;

