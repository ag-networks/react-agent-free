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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge,
  FormControlLabel,
  Checkbox,
  ListItemButton
} from '@mui/material';
import {
  Scale as ScaleIcon,
  Message as MessageIcon,
  VideoCall as VideoIcon,
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
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVerticalIcon,
  Edit as EditIcon,
  Delete as Trash2Icon,
  Star as StarIcon,
  Home as HomeIcon,
  Work as BriefcaseIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  ExitToApp as LogOutIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as ActivityIcon,
  Visibility as EyeIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Notifications as BellIcon,
  Archive as ArchiveIcon,
  Label as TagIcon,
  History as HistoryIcon,
  ExpandMore as ChevronDownIcon,
  Close as XIcon,
  CalendarToday as CalendarDaysIcon,
  EventAvailable as CalendarCheckIcon,
  EventBusy as CalendarXIcon,
  AddCircle as CalendarPlusIcon,
  Timer as TimerIcon,
  Repeat as RepeatIcon,
  PersonAdd as UserPlusIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { AttorneyService } from '../lib/api';

const AttorneyCalendarPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'consultation',
    client: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    description: '',
    priority: 'medium',
    recurring: false
  });

  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        const attorneyService = new AttorneyService();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Mock calendar events data
        const mockEvents = [
          {
            id: '1',
            title: 'Client Consultation - Michelle Lee',
            type: 'consultation',
            client: 'Michelle Lee',
            date: '2024-05-02',
            time: '10:00',
            duration: 60,
            location: 'Office Conference Room A',
            description: 'Initial consultation for purchase agreement review',
            priority: 'high',
            status: 'confirmed',
            attendees: ['Michelle Lee', 'Sarah Johnson'],
            recurring: false
          },
          {
            id: '2',
            title: 'Contract Review - Robert Chen',
            type: 'review',
            client: 'Robert Chen',
            date: '2024-05-03',
            time: '14:00',
            duration: 45,
            location: 'Virtual Meeting',
            description: 'Review contract amendments and negotiate terms',
            priority: 'medium',
            status: 'confirmed',
            attendees: ['Robert Chen', 'Sarah Johnson'],
            recurring: false
          },
          {
            id: '3',
            title: 'Closing Preparation - Jennifer Walsh',
            type: 'closing',
            client: 'Jennifer Walsh',
            date: '2024-05-06',
            time: '09:00',
            duration: 90,
            location: 'Title Company Office',
            description: 'Final closing preparation and document review',
            priority: 'urgent',
            status: 'confirmed',
            attendees: ['Jennifer Walsh', 'Title Officer', 'Sarah Johnson'],
            recurring: false
          },
          {
            id: '4',
            title: 'Team Meeting',
            type: 'meeting',
            client: null,
            date: '2024-05-07',
            time: '11:00',
            duration: 30,
            location: 'Main Conference Room',
            description: 'Weekly team sync and case updates',
            priority: 'low',
            status: 'confirmed',
            attendees: ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez'],
            recurring: true
          },
          {
            id: '5',
            title: 'Property Inspection - Daniel Martinez',
            type: 'inspection',
            client: 'Daniel Martinez',
            date: '2024-05-08',
            time: '15:30',
            duration: 120,
            location: '321 Maple Street, San Jose',
            description: 'Attend property inspection with client',
            priority: 'medium',
            status: 'pending',
            attendees: ['Daniel Martinez', 'Inspector', 'Sarah Johnson'],
            recurring: false
          }
        ];
        
        setEvents(mockEvents);
        setUpcomingEvents(mockEvents.filter(event => new Date(event.date) >= new Date()).slice(0, 5));
      } catch (error) {
        console.error('Error loading calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCalendarData();
  }, [currentDate]);

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
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'consultation': return 'primary';
      case 'review': return 'success';
      case 'closing': return 'secondary';
      case 'meeting': return 'default';
      case 'inspection': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircleIcon color="success" />;
      case 'pending': return <ClockIcon color="warning" />;
      case 'cancelled': return <CalendarXIcon color="error" />;
      default: return <CalendarIcon color="action" />;
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleCreateEvent = async () => {
    try {
      const attorneyService = new AttorneyService();
      const eventData = {
        ...eventForm,
        datetime: `${eventForm.date}T${eventForm.time}:00`,
        duration: parseInt(eventForm.duration)
      };
      
      await attorneyService.createCalendarEvent(eventData);
      
      // Add to local state
      const newEvent = {
        id: Date.now().toString(),
        ...eventData,
        status: 'confirmed',
        attendees: [user?.name || 'Attorney']
      };
      
      setEvents([...events, newEvent]);
      setShowCreateEvent(false);
      setEventForm({
        title: '',
        type: 'consultation',
        client: '',
        date: '',
        time: '',
        duration: '60',
        location: '',
        description: '',
        priority: 'medium',
        recurring: false
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const EventDetailsModal = () => {
    if (!selectedEvent) return null;

    return (
      <Dialog 
        open={showEventDetails} 
        onClose={() => setShowEventDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: `${getEventTypeColor(selectedEvent.type)}.light` }}>
                <CalendarIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {selectedEvent.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={selectedEvent.type}
                    color={getEventTypeColor(selectedEvent.type)}
                    size="small"
                  />
                  <Chip
                    label={selectedEvent.priority}
                    color={getPriorityColor(selectedEvent.priority)}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
            <IconButton onClick={() => setShowEventDetails(false)}>
              <XIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            {/* Event Details */}
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date & Time"
                    secondary={`${selectedEvent.date} at ${selectedEvent.time}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <TimerIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Duration"
                    secondary={`${selectedEvent.duration} minutes`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <MapPinIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Location"
                    secondary={selectedEvent.location}
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    {getStatusIcon(selectedEvent.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary="Status"
                    secondary={selectedEvent.status}
                  />
                </ListItem>
                
                {selectedEvent.client && (
                  <ListItem>
                    <ListItemIcon>
                      <UserIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Client"
                      secondary={selectedEvent.client}
                    />
                  </ListItem>
                )}
                
                {selectedEvent.recurring && (
                  <ListItem>
                    <ListItemIcon>
                      <RepeatIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Recurring"
                      secondary="Weekly"
                    />
                  </ListItem>
                )}
              </List>
            </Grid>

            {/* Description */}
            {selectedEvent.description && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedEvent.description}
                </Typography>
              </Grid>
            )}

            {/* Attendees */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Attendees
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedEvent.attendees.map((attendee, index) => (
                  <Chip
                    key={index}
                    avatar={
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        {attendee.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    }
                    label={attendee}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" startIcon={<EditIcon />}>
                Edit Event
              </Button>
              <Button variant="outlined" startIcon={<SendIcon />}>
                Send Reminder
              </Button>
            </Box>
            <Button variant="outlined" color="error" startIcon={<CalendarXIcon />}>
              Cancel Event
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    );
  };

  const CreateEventModal = () => (
    <Dialog 
      open={showCreateEvent} 
      onClose={() => setShowCreateEvent(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create New Event</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, space: 3 }}>
          <TextField
            fullWidth
            label="Event Title"
            value={eventForm.title}
            onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
            sx={{ mb: 3 }}
          />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={eventForm.type}
                  label="Event Type"
                  onChange={(e) => setEventForm({...eventForm, type: e.target.value})}
                >
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="review">Contract Review</MenuItem>
                  <MenuItem value="closing">Closing</MenuItem>
                  <MenuItem value="meeting">Meeting</MenuItem>
                  <MenuItem value="inspection">Inspection</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={eventForm.priority}
                  label="Priority"
                  onChange={(e) => setEventForm({...eventForm, priority: e.target.value})}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Client (Optional)"
            value={eventForm.client}
            onChange={(e) => setEventForm({...eventForm, client: e.target.value})}
            sx={{ mb: 3 }}
          />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={eventForm.date}
                onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="time"
                label="Time"
                value={eventForm.time}
                onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={eventForm.duration}
                onChange={(e) => setEventForm({...eventForm, duration: e.target.value})}
                inputProps={{ min: 15, step: 15 }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Location"
            value={eventForm.location}
            onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
            placeholder="Enter location or 'Virtual Meeting'"
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={eventForm.description}
            onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
            sx={{ mb: 3 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={eventForm.recurring}
                onChange={(e) => setEventForm({...eventForm, recurring: e.target.checked})}
              />
            }
            label="Recurring event (weekly)"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setShowCreateEvent(false)}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleCreateEvent}>
          Create Event
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex' }}>
      {/* Sidebar */}
      <Paper sx={{ width: 256, bgcolor: 'primary.dark', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ScaleIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold">
              Agent Free
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, px: 2 }}>
          <List>
            <ListItemButton component={Link} to="/dashboard" sx={{ borderRadius: 2, mb: 0.5, color: 'primary.light' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton component={Link} to="/properties" sx={{ borderRadius: 2, mb: 0.5, color: 'primary.light' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <BuildingIcon />
              </ListItemIcon>
              <ListItemText primary="My Transactions" />
            </ListItemButton>
            <ListItemButton component={Link} to="/documents" sx={{ borderRadius: 2, mb: 0.5, color: 'primary.light' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <FileTextIcon />
              </ListItemIcon>
              <ListItemText primary="Documents" />
            </ListItemButton>
            <ListItemButton component={Link} to="/messages" sx={{ borderRadius: 2, mb: 0.5, color: 'primary.light' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItemButton>
            <ListItemButton component={Link} to="/attorney-dashboard" sx={{ borderRadius: 2, mb: 0.5, color: 'primary.light' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <BriefcaseIcon />
              </ListItemIcon>
              <ListItemText primary="Attorney Dashboard" />
            </ListItemButton>
            <ListItemButton component={Link} to="/attorney-clients" sx={{ borderRadius: 2, mb: 0.5, color: 'primary.light' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <UsersIcon />
              </ListItemIcon>
              <ListItemText primary="Client Management" />
            </ListItemButton>
            <ListItemButton component={Link} to="/attorney-calendar" sx={{ borderRadius: 2, mb: 0.5, bgcolor: 'primary.main', color: 'white' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <CalendarIcon />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItemButton>
            <ListItemButton component={Link} to="/settings" sx={{ borderRadius: 2, mb: 0.5, color: 'primary.light' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </List>
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'primary.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
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
            startIcon={<LogOutIcon />}
            onClick={signOut}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.light' } }}
          >
            Sign Out
          </Button>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper elevation={1} sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Calendar
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your schedule and appointments
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<CalendarPlusIcon />}
              onClick={() => setShowCreateEvent(true)}
            >
              New Event
            </Button>
          </Box>
        </Paper>

        <Box sx={{ flex: 1, display: 'flex' }}>
          {/* Calendar Main Area */}
          <Box sx={{ flex: 1, p: 3 }}>
            {/* Calendar Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton onClick={handlePrevMonth}>
                    <ChevronLeftIcon />
                  </IconButton>
                  <Typography variant="h5" fontWeight="600">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Typography>
                  <IconButton onClick={handleNextMonth}>
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
                
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>View</InputLabel>
                  <Select
                    value={viewMode}
                    label="View"
                    onChange={(e) => setViewMode(e.target.value)}
                  >
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="day">Day</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>

            {/* Calendar Grid */}
            <Paper sx={{ overflow: 'hidden' }}>
              {/* Days of Week Header */}
              <Grid container>
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <Grid item xs key={day}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'grey.50', borderRight: 1, borderColor: 'divider' }}>
                      <Typography variant="body2" fontWeight="medium">
                        {day}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Calendar Days */}
              <Grid container>
                {getDaysInMonth(currentDate).map((day, index) => (
                  <Grid item xs key={index}>
                    <Box
                      sx={{
                        minHeight: 120,
                        p: 1,
                        borderRight: 1,
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: day ? 'white' : 'grey.50',
                        '&:hover': { bgcolor: day ? 'grey.50' : 'grey.50' }
                      }}
                    >
                      {day && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight="medium"
                              sx={{
                                ...(day === new Date().getDate() && 
                                    currentDate.getMonth() === new Date().getMonth() && 
                                    currentDate.getFullYear() === new Date().getFullYear() && {
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                })
                              }}
                            >
                              {day}
                            </Typography>
                          </Box>
                          
                          {/* Events for this day */}
                          <Box sx={{ space: 0.5 }}>
                            {getEventsForDate(day).map((event) => (
                              <Box
                                key={event.id}
                                onClick={() => handleEventClick(event)}
                                sx={{
                                  p: 0.5,
                                  mb: 0.5,
                                  borderRadius: 1,
                                  cursor: 'pointer',
                                  bgcolor: `${getEventTypeColor(event.type)}.light`,
                                  color: `${getEventTypeColor(event.type)}.dark`,
                                  '&:hover': { opacity: 0.8 }
                                }}
                              >
                                <Typography variant="caption" fontWeight="medium" display="block">
                                  {event.time}
                                </Typography>
                                <Typography variant="caption" noWrap>
                                  {event.title}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>

          {/* Right Sidebar - Upcoming Events */}
          <Paper sx={{ width: 320, borderLeft: 1, borderColor: 'divider', p: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Upcoming Events
            </Typography>
            <Box sx={{ space: 2, mb: 4 }}>
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  sx={{ 
                    mb: 2, 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 }
                  }}
                  onClick={() => handleEventClick(event)}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                          {event.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {event.date} at {event.time}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                          <Chip
                            label={event.type}
                            color={getEventTypeColor(event.type)}
                            size="small"
                          />
                          {event.priority === 'urgent' && (
                            <Chip
                              label={event.priority}
                              color={getPriorityColor(event.priority)}
                              size="small"
                            />
                          )}
                        </Box>
                      </Box>
                      {getStatusIcon(event.status)}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Quick Stats */}
            <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                This Month
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Events
                  </Typography>
                  <Typography fontWeight="medium">
                    {events.length}
                  </Typography>
                </ListItem>
                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Consultations
                  </Typography>
                  <Typography fontWeight="medium">
                    {events.filter(e => e.type === 'consultation').length}
                  </Typography>
                </ListItem>
                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Reviews
                  </Typography>
                  <Typography fontWeight="medium">
                    {events.filter(e => e.type === 'review').length}
                  </Typography>
                </ListItem>
                <ListItem sx={{ px: 0, justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Closings
                  </Typography>
                  <Typography fontWeight="medium">
                    {events.filter(e => e.type === 'closing').length}
                  </Typography>
                </ListItem>
              </List>
            </Paper>
          </Paper>
        </Box>
      </Box>

      {/* Modals */}
      <EventDetailsModal />
      <CreateEventModal />
    </Box>
  );
};

export default AttorneyCalendarPage;

