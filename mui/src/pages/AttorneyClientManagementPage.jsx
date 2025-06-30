import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
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
  Container
} from '@mui/material';
import {
  Message as MessageIcon,
  VideoCall as VideoIcon,
  Event as CalendarIcon,
  Description as FileTextIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertCircleIcon,
  Add as PlusIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

export function AttorneyClientManagementPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Mock client data
  const clients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      status: 'active',
      type: 'buyer',
      rating: 5,
      lastContact: '2024-01-15',
      totalTransactions: 3,
      currentTransaction: 'Purchase - 123 Main St',
      notes: 'Excellent client, very responsive and prepared.',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '(555) 234-5678',
      status: 'active',
      type: 'seller',
      rating: 4,
      lastContact: '2024-01-18',
      totalTransactions: 1,
      currentTransaction: 'Sale - 456 Oak Ave',
      notes: 'First-time seller, needs guidance through process.',
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '(555) 345-6789',
      status: 'pending',
      type: 'buyer',
      rating: 5,
      lastContact: '2024-01-20',
      totalTransactions: 2,
      currentTransaction: 'Purchase - 789 Pine St',
      notes: 'Repeat client, very satisfied with previous transactions.',
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '(555) 456-7890',
      status: 'completed',
      type: 'seller',
      rating: 4,
      lastContact: '2024-01-10',
      totalTransactions: 1,
      currentTransaction: 'Sale - 321 Elm Dr (Completed)',
      notes: 'Transaction completed successfully.',
      avatar: 'DW'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'buyer': return 'primary';
      case 'seller': return 'secondary';
      default: return 'default';
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'lastContact':
        return new Date(b.lastContact) - new Date(a.lastContact);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      index < rating ? (
        <StarIcon key={index} sx={{ fontSize: 16, color: 'warning.main' }} />
      ) : (
        <StarBorderIcon key={index} sx={{ fontSize: 16, color: 'grey.300' }} />
      )
    ));
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Shared Sidebar */}
      <Sidebar user={user} onSignOut={logout} />
      
      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: '280px' }}>
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Client Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage your client relationships and track transaction progress
            </Typography>
          </Box>

          {/* Client Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    Total Clients
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {clients.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    Active Transactions
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                    {clients.filter(c => c.status === 'active').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    Pending Reviews
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color="warning.main">
                    {clients.filter(c => c.status === 'pending').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    Completed
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color="info.main">
                    {clients.filter(c => c.status === 'completed').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Search and Filter Controls */}
          <Card elevation={2} sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filterStatus}
                      label="Status"
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="lastContact">Last Contact</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    startIcon={<PlusIcon />}
                    fullWidth
                    onClick={() => setDialogOpen(true)}
                  >
                    Add Client
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Client List */}
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Client List ({sortedClients.length})
              </Typography>
              <List>
                {sortedClients.map((client, index) => (
                  <React.Fragment key={client.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'grey.50',
                        },
                      }}
                      onClick={() => setSelectedClient(client)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {client.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {client.name}
                            </Typography>
                            <Chip
                              label={client.status}
                              size="small"
                              color={getStatusColor(client.status)}
                            />
                            <Chip
                              label={client.type}
                              size="small"
                              color={getTypeColor(client.type)}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {client.email} • {client.phone}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {client.currentTransaction}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              {renderStars(client.rating)}
                              <Typography variant="caption" sx={{ ml: 1 }}>
                                Last contact: {client.lastContact}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <MessageIcon />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <PhoneIcon />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <VideoIcon />
                        </IconButton>
                        <IconButton size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < sortedClients.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Client Details Dialog */}
          <Dialog
            open={selectedClient !== null}
            onClose={() => setSelectedClient(null)}
            maxWidth="md"
            fullWidth
          >
            {selectedClient && (
              <>
                <DialogTitle>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {selectedClient.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedClient.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={selectedClient.status}
                          size="small"
                          color={getStatusColor(selectedClient.status)}
                        />
                        <Chip
                          label={selectedClient.type}
                          size="small"
                          color={getTypeColor(selectedClient.type)}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
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
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Contact Information
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                          {selectedClient.email}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                          {selectedClient.phone}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ mr: 1 }}>Rating:</Typography>
                          {renderStars(selectedClient.rating)}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Transaction Summary
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Total Transactions: {selectedClient.totalTransactions}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Current: {selectedClient.currentTransaction}
                        </Typography>
                        <Typography variant="body2">
                          Last Contact: {selectedClient.lastContact}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          Notes
                        </Typography>
                        <Typography variant="body2">
                          {selectedClient.notes}
                        </Typography>
                      </Grid>
                    </Grid>
                  </TabPanel>

                  <TabPanel value={activeTab} index={1}>
                    <Typography variant="body1">Transaction history will be displayed here.</Typography>
                  </TabPanel>

                  <TabPanel value={activeTab} index={2}>
                    <Typography variant="body1">Client documents will be displayed here.</Typography>
                  </TabPanel>

                  <TabPanel value={activeTab} index={3}>
                    <Typography variant="body1">Communication history will be displayed here.</Typography>
                  </TabPanel>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSelectedClient(null)}>Close</Button>
                  <Button variant="contained">Edit Client</Button>
                </DialogActions>
              </>
            )}
          </Dialog>

          {/* Add Client Dialog */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Full Name" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" type="email" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Phone" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Client Type</InputLabel>
                    <Select label="Client Type">
                      <MenuItem value="buyer">Buyer</MenuItem>
                      <MenuItem value="seller">Seller</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select label="Status">
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button variant="contained">Add Client</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
}

export default AttorneyClientManagementPage;

