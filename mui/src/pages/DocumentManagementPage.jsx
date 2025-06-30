import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
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
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
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
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { documentService } from '../lib/api';

export function DocumentManagementPage() {
  const navigate = useNavigate();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'signed':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'pending':
        return <ClockIcon sx={{ color: 'warning.main' }} />;
      case 'in-review':
        return <EyeIcon sx={{ color: 'info.main' }} />;
      default:
        return <FileTextIcon sx={{ color: 'text.secondary' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'in-review':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const documentsByType = {
    all: filteredDocuments,
    contracts: filteredDocuments.filter(doc => doc.type === 'contract'),
    inspection: filteredDocuments.filter(doc => doc.type === 'inspection'),
    financing: filteredDocuments.filter(doc => doc.type === 'financing'),
    other: filteredDocuments.filter(doc => !['contract', 'inspection', 'financing'].includes(doc.type))
  };

  const tabLabels = ['All', 'Contracts', 'Inspection', 'Financing', 'Other'];
  const tabKeys = ['all', 'contracts', 'inspection', 'financing', 'other'];

  const renderDocumentCard = (document) => (
    <Card key={document.id} sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <Box sx={{ 
              p: 1, 
              bgcolor: 'primary.50', 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileTextIcon color="primary" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {document.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip 
                  icon={getStatusIcon(document.status)}
                  label={document.status}
                  color={getStatusColor(document.status)}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  {document.uploadDate ? new Date(document.uploadDate).toLocaleDateString() : 'Not uploaded'}
                </Typography>
                {document.size && (
                  <Typography variant="body2" color="text.secondary">
                    • {document.size}
                  </Typography>
                )}
              </Box>
              
              {document.signatures && document.signatures.length > 0 && (
                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Signatures:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {document.signatures.map((sig, index) => (
                      <Chip 
                        key={index}
                        label={`${sig.party} ${sig.signed ? '✓' : '○'}`}
                        color={sig.signed ? 'success' : 'default'}
                        size="small"
                        variant={sig.signed ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              size="small" 
              onClick={() => handleDownload(document.id, document.name)}
              title="Download"
            >
              <DownloadIcon />
            </IconButton>
            <IconButton size="small" title="Share">
              <Share2Icon />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => handleDelete(document.id)}
              title="Delete"
            >
              <Trash2Icon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={9}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <Skeleton variant="rectangular" height={200} />
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
            Document Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Secure document storage and e-signature workflow
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
        {/* Main Content */}
        <Grid item xs={12} lg={9}>
          {/* Upload Area */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <UploadIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Upload Documents
                </Typography>
              </Box>
              
              <Paper 
                sx={{ 
                  border: 2, 
                  borderStyle: 'dashed', 
                  borderColor: 'grey.300',
                  p: 4,
                  textAlign: 'center',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'grey.50'
                  }
                }}
              >
                <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drop files here or click to upload
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
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
                    <Paper key={file.id} sx={{ p: 2, mb: 1, bgcolor: 'primary.50' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FileTextIcon color="primary" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {file.name}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={file.progress} 
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <Typography variant="body2" color="primary">
                          {file.progress}%
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="signed">Signed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-review">In Review</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Documents by Category */}
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {tabLabels.map((label, index) => {
                  const count = documentsByType[tabKeys[index]]?.length || 0;
                  return (
                    <Tab 
                      key={label}
                      label={`${label} (${count})`}
                    />
                  );
                })}
              </Tabs>
            </Box>
            
            <CardContent>
              {documentsByType[tabKeys[tabValue]]?.map(renderDocumentCard)}
              
              {documentsByType[tabKeys[tabValue]]?.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <FileTextIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No documents found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Upload your first document to get started'
                    }
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={3}>
          {/* Quick Stats */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Summary
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <FileCheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Signed" />
                  <ListItemSecondaryAction>
                    <Typography variant="h6">
                      {documents.filter(d => d.status === 'signed').length}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <ClockIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary="Pending" />
                  <ListItemSecondaryAction>
                    <Typography variant="h6">
                      {documents.filter(d => d.status === 'pending').length}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <EyeIcon color="info" />
                  </ListItemIcon>
                  <ListItemText primary="In Review" />
                  <ListItemSecondaryAction>
                    <Typography variant="h6">
                      {documents.filter(d => d.status === 'in-review').length}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                
                <Divider sx={{ my: 1 }} />
                
                <ListItem>
                  <ListItemText 
                    primary="Total Documents" 
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="h6" fontWeight="bold">
                      {documents.length}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AlertCircleIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  Security & Privacy
                </Typography>
              </Box>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="256-bit SSL encryption"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="SOC 2 Type II compliant"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Attorney-client privilege protected"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Automatic backup & versioning"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" startIcon={<PlusIcon />} fullWidth>
                  Request Document
                </Button>
                <Button variant="outlined" startIcon={<EditIcon />} fullWidth>
                  Create Template
                </Button>
                <Button variant="outlined" startIcon={<FolderIcon />} fullWidth>
                  Organize Folders
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DocumentManagementPage;

