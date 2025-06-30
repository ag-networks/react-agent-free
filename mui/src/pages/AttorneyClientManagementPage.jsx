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
  Drawer,
  AppBar,
  Toolbar,
  Badge,
  Menu,
  MenuList,
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
  Close as XIcon
} from '@mui/icons-material';
import { AttorneyService } from '../lib/api';

const AttorneyClientManagementPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [clients, setClients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadClientData = async () => {
      try {
        const attorneyService = new AttorneyService();
        const [clientsData, consultationsData] = await Promise.all([
          attorneyService.getClients(),
          attorneyService.getPendingConsultations()
        ]);
        
        setClients(clientsData.clients || []);
        setConsultations(consultationsData.consultations || []);
      } catch (error) {
        console.error('Error loading client data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesType = filterType === 'all' || client.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.lastContact) - new Date(a.lastContact);
      case 'rating':
        return b.rating - a.rating;
      case 'transactions':
        return b.totalTransactions - a.totalTransactions;
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'default';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'buyer': return <HomeIcon />;
      case 'seller': return <BuildingIcon />;
      case 'tenant': return <UserIcon />;
      default: return <UserIcon />;
    }
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };

  const handleScheduleMeeting = async (clientId, type) => {
    try {
      const attorneyService = new AttorneyService();
      const datetime = new Date();
      datetime.setDate(datetime.getDate() + 1); // Tomorrow
      await attorneyService.scheduleClientMeeting(clientId, datetime.toISOString(), type);
      // Show success message or update UI
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const ClientDetailsModal = () => {
    if (!selectedClient) return null;

    return (
      <Dialog 
        open={showClientDetails} 
        onClose={() => setShowClientDetails(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.light', fontSize: '1.5rem' }}>
                {selectedClient.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {selectedClient.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={selectedClient.status}
                    color={getStatusColor(selectedClient.status)}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    • {selectedClient.type}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton onClick={() => setShowClientDetails(false)}>
              <XIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Overview" />
            <Tab label="Transactions" />
            <Tab label="Documents" />
            <Tab label="Communication" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Contact Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <MailIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary={selectedClient.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary={selectedClient.phone} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <MapPinIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary={selectedClient.address} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <MessageIcon color="action" />
                      </ListItemIcon>
                      <ListItemText primary={`Prefers ${selectedClient.preferredContact}`} />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* Client Statistics */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Client Statistics
                  </Typography>
                  <List dense>
                    <ListItem sx={{ justifyContent: 'space-between', px: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Transactions
                      </Typography>
                      <Typography fontWeight="medium">
                        {selectedClient.totalTransactions}
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ justifyContent: 'space-between', px: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        Current Transactions
                      </Typography>
                      <Typography fontWeight="medium">
                        {selectedClient.currentTransactions}
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ justifyContent: 'space-between', px: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        Client Rating
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                        <Typography fontWeight="medium">{selectedClient.rating}</Typography>
                      </Box>
                    </ListItem>
                    <ListItem sx={{ justifyContent: 'space-between', px: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        Join Date
                      </Typography>
                      <Typography fontWeight="medium">
                        {new Date(selectedClient.joinDate).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ justifyContent: 'space-between', px: 0 }}>
                      <Typography variant="body2" color="text.secondary">
                        Last Contact
                      </Typography>
                      <Typography fontWeight="medium">
                        {new Date(selectedClient.lastContact).toLocaleDateString()}
                      </Typography>
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {selectedClient.notes}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" startIcon={<EditIcon />}>
                      Edit Notes
                    </Button>
                    <Button variant="outlined" startIcon={<PlusIcon />}>
                      Add Note
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Transaction History</Typography>
              <Button variant="contained" startIcon={<PlusIcon />}>
                New Transaction
              </Button>
            </Box>
            
            {/* Mock transaction data */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">Purchase Agreement - 123 Oak Street</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Started: April 15, 2024
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip label="Active" color="success" size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      $850,000
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Client Documents</Typography>
              <Button variant="contained" startIcon={<UploadIcon />}>
                Upload Document
              </Button>
            </Box>
            
            {/* Mock document data */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FileTextIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="h6">Purchase Agreement.pdf</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Uploaded: April 15, 2024 • 2.4 MB
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton>
                      <EyeIcon />
                    </IconButton>
                    <IconButton>
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Communication History</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  startIcon={<CalendarIcon />}
                  onClick={() => handleScheduleMeeting(selectedClient.id, 'consultation')}
                >
                  Schedule Meeting
                </Button>
                <Button variant="outlined" startIcon={<MessageIcon />}>
                  Send Message
                </Button>
              </Box>
            </Box>
            
            {/* Mock communication history */}
            <Box sx={{ space: 2 }}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light' }}>
                      <MessageIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Email sent</Typography>
                        <Typography variant="body2" color="text.secondary">
                          April 29, 2024
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Contract review completed. Please review the attached documents and let me know if you have any questions.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.light' }}>
                      <PhoneIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Phone call</Typography>
                        <Typography variant="body2" color="text.secondary">
                          April 28, 2024
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Discussed contract terms and timeline. Client has questions about inspection contingency.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowClientDetails(false)}>
            Close
          </Button>
          <Button variant="contained" startIcon={<EditIcon />}>
            Edit Client
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

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
            <ListItemButton component={Link} to="/attorney-clients" sx={{ borderRadius: 2, mb: 0.5, bgcolor: 'primary.main', color: 'white' }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <UsersIcon />
              </ListItemIcon>
              <ListItemText primary="Client Management" />
            </ListItemButton>
            <ListItemButton component={Link} to="/calendar" sx={{ borderRadius: 2, mb: 0.5, color: 'primary.light' }}>
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
                Client Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your clients and consultations
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => setShowAddClient(true)}
            >
              Add Client
            </Button>
          </Box>
        </Paper>

        <Box sx={{ flex: 1, p: 3 }}>
          {/* Search and Filters */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <TextField
                  placeholder="Search clients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 400, flex: 1 }}
                />
                
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filterType}
                    label="Type"
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="buyer">Buyer</MenuItem>
                    <MenuItem value="seller">Seller</MenuItem>
                    <MenuItem value="tenant">Tenant</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Sort</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="date">Last Contact</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="transactions">Transactions</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {sortedClients.length} of {clients.length} clients
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {clients.filter(c => c.status === 'active').length} active • {clients.filter(c => c.status === 'urgent').length} urgent
              </Typography>
            </Box>
          </Paper>

          {/* Clients Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {sortedClients.map((client) => (
              <Grid item xs={12} md={6} lg={4} key={client.id}>
                <Card 
                  sx={{ 
                    '&:hover': { boxShadow: 3 }, 
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onClick={() => handleClientClick(client)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {client.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {getTypeIcon(client.type)}
                            <Typography variant="body2" color="text.secondary">
                              {client.type}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <IconButton size="small">
                        <MoreVerticalIcon />
                      </IconButton>
                    </Box>

                    <List dense sx={{ mb: 2 }}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <MailIcon sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={client.email}
                          primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <PhoneIcon sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={client.phone}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <ActivityIcon sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`Last contact: ${new Date(client.lastContact).toLocaleDateString()}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    </List>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={client.status}
                        color={getStatusColor(client.status)}
                        size="small"
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                        <Typography variant="body2">{client.rating}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {client.totalTransactions} total transactions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {client.currentTransactions} active
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<MessageIcon />}
                        sx={{ flex: 1 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Message
                      </Button>
                      <IconButton 
                        size="small" 
                        sx={{ border: 1, borderColor: 'divider' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PhoneIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        sx={{ border: 1, borderColor: 'divider' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScheduleMeeting(client.id, 'consultation');
                        }}
                      >
                        <CalendarIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Consultations */}
          <Paper>
            <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="600">
                  Recent Consultations
                </Typography>
                <Button color="primary">
                  View All
                </Button>
              </Box>
            </Box>
            <List>
              {consultations.slice(0, 5).map((consultation, index) => (
                <React.Fragment key={consultation.id}>
                  <ListItem sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'grey.100', color: 'text.secondary' }}>
                        {consultation.clientName.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={consultation.clientName}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {consultation.type}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {consultation.address}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={consultation.status}
                          color={getStatusColor(consultation.status)}
                          size="small"
                        />
                        <Chip
                          label={consultation.priority}
                          color={getPriorityColor(consultation.priority)}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">{consultation.scheduledDate}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {consultation.scheduledTime}
                        </Typography>
                      </Box>
                      <Button size="small" color="primary">
                        {consultation.action}
                      </Button>
                      <ChevronRightIcon color="action" />
                    </Box>
                  </ListItem>
                  {index < consultations.slice(0, 5).length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>

      {/* Client Details Modal */}
      <ClientDetailsModal />
    </Box>
  );
};

export default AttorneyClientManagementPage;

