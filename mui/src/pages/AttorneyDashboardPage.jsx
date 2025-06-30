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
  IconButton,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Scale as ScaleIcon,
  Message as MessageIcon,
  VideoCall as VideoIcon,
  Calendar as CalendarIcon,
  Description as FileTextIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertCircleIcon,
  Add as PlusIcon,
  ChevronRight as ChevronRightIcon,
  Person as UserIcon,
  Business as BuildingIcon,
  Phone as PhoneIcon,
  Email as MailIcon,
  LocationOn as MapPinIcon,
  AttachMoney as DollarSignIcon,
  TrendingUp as TrendingUpIcon,
  People as UsersIcon,
  TaskAlt as FileCheckIcon,
  Timer as TimerIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { AttorneyService } from '../lib/api';

const AttorneyDashboardPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [consultations, setConsultations] = useState([]);
  const [contractReviews, setContractReviews] = useState([]);
  const [legalTasks, setLegalTasks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttorneyData = async () => {
      try {
        const attorneyService = new AttorneyService();
        const [consultationsData, reviewsData, tasksData, templatesData] = await Promise.all([
          attorneyService.getPendingConsultations(),
          attorneyService.getContractReviews(),
          attorneyService.getLegalTasks(),
          attorneyService.getDocumentTemplates()
        ]);
        
        setConsultations(consultationsData.consultations || []);
        setContractReviews(reviewsData.reviews || []);
        setLegalTasks(tasksData.tasks || []);
        setTemplates(templatesData.templates || []);
      } catch (error) {
        console.error('Error loading attorney data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttorneyData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'review': return 'info';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'pending': return <ClockIcon sx={{ fontSize: 16 }} />;
      case 'review': return <AlertCircleIcon sx={{ fontSize: 16 }} />;
      default: return <FileTextIcon sx={{ fontSize: 16 }} />;
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`attorney-tabpanel-${index}`}
      aria-labelledby={`attorney-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ px: 3, py: 2, mb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ScaleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold" color="text.primary">
              Agent Workflow
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<MessageIcon />}
              sx={{ textTransform: 'none' }}
            >
              Message
            </Button>
            <Button
              variant="contained"
              startIcon={<VideoIcon />}
              sx={{ textTransform: 'none' }}
            >
              Start Video Call
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Navigation Tabs */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ px: 3 }}
        >
          <Tab label="Dashboards" sx={{ textTransform: 'none' }} />
          <Tab label="Consultations" sx={{ textTransform: 'none' }} />
          <Tab label="Contacts" sx={{ textTransform: 'none' }} />
          <Tab label="Documents" sx={{ textTransform: 'none' }} />
          <Tab label="Tasks" sx={{ textTransform: 'none' }} />
        </Tabs>
      </Paper>

      <Box sx={{ display: 'flex' }}>
        {/* Main Content */}
        <Box sx={{ flex: 1, p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            {/* Pending Client Consultations */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight="600">
                  Pending Client Consultations
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" size="small">
                    Deuteunge
                  </Button>
                  <IconButton size="small" sx={{ bgcolor: 'grey.100' }}>
                    <PlusIcon />
                  </IconButton>
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 4 }}>
                {consultations.map((consultation) => (
                  <Grid item xs={12} md={6} key={consultation.id}>
                    <Card sx={{ '&:hover': { boxShadow: 3 }, cursor: 'pointer' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                              {consultation.clientName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {consultation.address}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
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
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                {consultation.type}
                              </Typography>
                              <Button size="small" color="primary">
                                {consultation.action}
                              </Button>
                            </Box>
                          </Box>
                          <ChevronRightIcon color="action" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Contract Reviews */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                Contract Reviews
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {contractReviews.map((review) => (
                  <Grid item xs={12} md={6} key={review.id}>
                    <Card sx={{ '&:hover': { boxShadow: 3 }, cursor: 'pointer' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                              {review.clientName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {review.address}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
                              <Chip
                                label={review.stage}
                                color={getStatusColor(review.stage)}
                                size="small"
                              />
                              <Chip
                                label={review.priority}
                                color={getStatusColor(review.priority)}
                                size="small"
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                {review.type}
                              </Typography>
                              <Button size="small" color="primary">
                                {review.action}
                              </Button>
                            </Box>
                          </Box>
                          <ChevronRightIcon color="action" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Legal Tasks */}
            <Box>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                Legal Tasks
              </Typography>
              <Box sx={{ space: 2 }}>
                {legalTasks.map((task) => (
                  <Card key={task.id} sx={{ mb: 2, '&:hover': { boxShadow: 2 } }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: task.completed ? 'success.light' : 'primary.light',
                            width: 32, 
                            height: 32 
                          }}>
                            {task.completed ? (
                              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                            ) : (
                              <ClockIcon sx={{ color: 'primary.main', fontSize: 16 }} />
                            )}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="500">
                              {task.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {task.description}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {task.dueDate}
                          </Typography>
                          <IconButton size="small" sx={{ bgcolor: 'grey.100' }}>
                            <PlusIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </TabPanel>
        </Box>

        {/* Right Sidebar */}
        <Paper sx={{ width: 320, borderLeft: 1, borderColor: 'divider', p: 3 }}>
          {/* Calendar */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="600">
                April 2024
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <IconButton size="small">
                  <ChevronRightIcon sx={{ transform: 'rotate(180deg)' }} />
                </IconButton>
                <IconButton size="small">
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Grid container spacing={0.5} sx={{ mb: 2 }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                <Grid item xs key={day}>
                  <Typography variant="caption" color="text.secondary" align="center" display="block">
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            
            <Grid container spacing={0.5}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <Grid item xs key={day}>
                  <Box
                    sx={{
                      p: 1,
                      textAlign: 'center',
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: day === 11 || day === 15 ? 'primary.light' : 'transparent',
                      color: day === 11 || day === 15 ? 'primary.main' : 'text.primary',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <Typography variant="body2">{day}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 2, space: 1 }}>
              <Typography variant="caption" color="primary.main" fontWeight="500" display="block">
                11 Cillets Complrtion
              </Typography>
              <Typography variant="caption" color="primary.main" fontWeight="500" display="block">
                15 Difering Quemion
              </Typography>
            </Box>
          </Box>

          {/* Legal Document Templates */}
          <Box>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Legal Document Templates
            </Typography>
            <List dense>
              {templates.map((template) => (
                <ListItem 
                  key={template.id}
                  sx={{ 
                    bgcolor: 'grey.50', 
                    borderRadius: 1, 
                    mb: 1,
                    '&:hover': { bgcolor: 'grey.100' },
                    cursor: 'pointer'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FileTextIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={template.name}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    --
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AttorneyDashboardPage;

