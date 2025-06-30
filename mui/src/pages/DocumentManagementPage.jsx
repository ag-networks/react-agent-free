import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Chip,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Skeleton
} from '@mui/material';
import {
  Home as HomeIcon,
  Description as FileTextIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Delete as Trash2Icon,
  Visibility as EyeIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ClockIcon,
  Warning as AlertCircleIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as PlusIcon,
  Share as Share2Icon,
  Edit as EditIcon,
  TaskAlt as FileCheckIcon,
  Close as FileXIcon,
  Folder as FolderIcon,
  Message as MessageIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { documentService } from '../lib/api';

const drawerWidth = 256;

export function DocumentManagementPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getDocuments();
      setDocuments(response.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
      const uploadId = Date.now() + Math.random();
      setUploadingFiles(prev => [...prev, { id: uploadId, name: file.name, progress: 0 }]);
      
      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setUploadingFiles(prev => 
            prev.map(f => f.id === uploadId ? { ...f, progress } : f)
          );
        }
        
        // Mock upload
        await documentService.uploadDocument(file, {
          type: 'general',
          transactionId: 1
        });
        
        setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
        loadDocuments(); // Refresh documents list
      } catch (error) {
        console.error('Upload error:', error);
        setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
      }
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      await documentService.downloadDocument(documentId);
      console.log(`Downloading ${fileName}`);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.deleteDocument(documentId);
        loadDocuments();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'signed': return <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'pending': return <ClockIcon sx={{ color: 'warning.main', fontSize: 16 }} />;
      case 'in_review': return <EyeIcon sx={{ color: 'info.main', fontSize: 16 }} />;
      default: return <FileTextIcon sx={{ color: 'text.secondary', fontSize: 16 }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed': return 'success';
      case 'pending': return 'warning';
      case 'in_review': return 'info';
      default: return 'default';
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { text: 'My Transactions', icon: FileTextIcon, path: '/properties' },
    { text: 'Documents', icon: FileTextIcon, path: '/documents', active: true },
    { text: 'Messages', icon: MessageIcon, path: '/messages' },
    { text: 'Calendar', icon: CalendarIcon, path: '/calendar' },
    { text: 'Settings', icon: SettingsIcon, path: '/settings' }
  ];

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
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
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
            Agent Free
          </Typography>
        </Box>

        {/* Navigation */}
        <List sx={{ flexGrow: 1, px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  color: item.active ? 'white' : 'primary.100',
                  bgcolor: item.active ? 'primary.dark' : 'transparent',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    color: 'white'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
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
              <Typography variant="caption" sx={{ color: 'primary.100' }}>
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
              color: 'primary.100',
              borderColor: 'primary.100',
              '&:hover': {
                bgcolor: 'primary.dark',
                borderColor: 'white',
                color: 'white'
              }
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
            Document Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Secure document storage and e-signature workflow
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Main Content - 2/3 width */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Upload Documents */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <UploadIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Upload Documents</Typography>
                </Box>
                
                <Paper
                  sx={{
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: 'grey.50'
                  }}
                >
                  <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Drop files here or click to upload
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Supports PDF, DOC, DOCX, JPG, PNG files up to 10MB
                  </Typography>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="contained" component="span" startIcon={<PlusIcon />}>
                      Choose Files
                    </Button>
                  </label>
                </Paper>

                {/* Upload Progress */}
                {uploadingFiles.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    {uploadingFiles.map((file) => (
                      <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FileTextIcon sx={{ color: 'primary.main', mr: 2 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {file.name}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={file.progress}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                          {file.progress}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                      fullWidth
                      placeholder="Search documents..."
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
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filterStatus}
                        label="Status"
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="signed">Signed</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in_review">In Review</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Document Tabs */}
            <Card>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="All (3)" />
                <Tab label="Contracts (1)" />
                <Tab label="Inspection (1)" />
                <Tab label="Financing (1)" />
                <Tab label="Other (0)" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                {loading ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} variant="rectangular" width={200} height={60} sx={{ mx: 1 }} />
                      ))}
                    </Box>
                    <Typography color="text.secondary">Loading documents...</Typography>
                  </Box>
                ) : filteredDocuments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <FileXIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                    <Typography color="text.secondary">No documents found</Typography>
                  </Box>
                ) : (
                  <Box sx={{ space: 2 }}>
                    {filteredDocuments.map((doc) => (
                      <Paper key={doc.id} sx={{ p: 2, mb: 2, '&:hover': { bgcolor: 'grey.50' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FileTextIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {doc.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                <Chip
                                  icon={getStatusIcon(doc.status)}
                                  label={doc.status}
                                  color={getStatusColor(doc.status)}
                                  size="small"
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {doc.date}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {doc.size}
                                </Typography>
                              </Box>
                              {doc.signatures && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    Signatures:
                                  </Typography>
                                  {doc.signatures.map((sig, index) => (
                                    <Chip key={index} label={sig} variant="outlined" size="small" />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleDownload(doc.id, doc.name)}>
                              <DownloadIcon />
                            </IconButton>
                            <IconButton size="small">
                              <Share2Icon />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDelete(doc.id)}>
                              <Trash2Icon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </TabPanel>
            </Card>
          </Grid>

          {/* Right Sidebar - 1/3 width */}
          <Grid size={{ xs: 12, lg: 4 }}>
            {/* Document Summary */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Document Summary</Typography>
                <Box sx={{ space: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">Signed</Typography>
                    </Box>
                    <Typography variant="subtitle2">1</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ClockIcon sx={{ color: 'warning.main', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">Pending</Typography>
                    </Box>
                    <Typography variant="subtitle2">1</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EyeIcon sx={{ color: 'info.main', mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">In Review</Typography>
                    </Box>
                    <Typography variant="subtitle2">1</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2">Total Documents</Typography>
                    <Typography variant="subtitle2">3</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Security & Privacy */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SecurityIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Security & Privacy</Typography>
                </Box>
                <Box sx={{ space: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">256-bit SSL encryption</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">SOC 2 Type II compliant</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">Attorney-client privilege protected</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">Automatic backup & versioning</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Quick Actions</Typography>
                <Box sx={{ space: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PlusIcon />}
                    sx={{ mb: 2, justifyContent: 'flex-start' }}
                  >
                    Request Document
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{ mb: 2, justifyContent: 'flex-start' }}
                  >
                    Create Template
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FolderIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Organize Folders
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

