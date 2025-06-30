import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Typography,
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
  Skeleton,
  Container,
  Button
} from '@mui/material';
import {
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
  Assignment as AssignmentIcon,
  Folder as FolderIcon,
  Security as SecurityIcon,
  CloudDone as CloudDoneIcon
} from '@mui/icons-material';

export function DocumentManagementPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock documents data
  const mockDocuments = [
    {
      id: 1,
      name: 'Purchase Agreement - 123 Main St.pdf',
      type: 'Contract',
      status: 'signed',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      signatures: [
        { party: 'buyer', signed: true, date: '2024-01-15' },
        { party: 'seller', signed: true, date: '2024-01-16' }
      ],
      description: 'Primary purchase agreement for property acquisition'
    },
    {
      id: 2,
      name: 'Property Inspection Report.pdf',
      type: 'Report',
      status: 'pending',
      size: '5.1 MB',
      uploadDate: '2024-01-18',
      signatures: [
        { party: 'inspector', signed: true, date: '2024-01-18' },
        { party: 'buyer', signed: false, date: null }
      ],
      description: 'Comprehensive property inspection findings'
    },
    {
      id: 3,
      name: 'Title Insurance Policy.pdf',
      type: 'Insurance',
      status: 'review',
      size: '1.8 MB',
      uploadDate: '2024-01-20',
      signatures: [
        { party: 'title_company', signed: true, date: '2024-01-20' }
      ],
      description: 'Title insurance coverage documentation'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed': return 'success';
      case 'pending': return 'warning';
      case 'review': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'signed': return <CheckCircleIcon />;
      case 'pending': return <ClockIcon />;
      case 'review': return <AlertCircleIcon />;
      default: return <FileCheckIcon />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getDocumentSummary = () => {
    const signed = documents.filter(doc => doc.status === 'signed').length;
    const pending = documents.filter(doc => doc.status === 'pending').length;
    const review = documents.filter(doc => doc.status === 'review').length;
    return { signed, pending, review };
  };

  const summary = getDocumentSummary();

  const renderSignatureStatus = (signatures) => {
    return signatures.map((sig, index) => (
      <Chip
        key={index}
        label={`${sig.party}${sig.signed ? ' ✓' : ''}`}
        size="small"
        color={sig.signed ? 'success' : 'default'}
        variant={sig.signed ? 'filled' : 'outlined'}
        sx={{ mr: 0.5, mb: 0.5 }}
      />
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
              Document Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Secure document storage and e-signature management
            </Typography>
          </Box>

          {/* Document Summary */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="overline">
                        Signed Documents
                      </Typography>
                      <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                        {summary.signed}
                      </Typography>
                    </Box>
                    <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="overline">
                        Pending Signatures
                      </Typography>
                      <Typography variant="h4" component="div" fontWeight="bold" color="warning.main">
                        {summary.pending}
                      </Typography>
                    </Box>
                    <ClockIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="overline">
                        In Review
                      </Typography>
                      <Typography variant="h4" component="div" fontWeight="bold" color="info.main">
                        {summary.review}
                      </Typography>
                    </Box>
                    <AlertCircleIcon sx={{ fontSize: 40, color: 'info.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Content Card */}
          <Card elevation={2}>
            <CardContent>
              {/* Tabs */}
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="All Documents" />
                <Tab label="Upload" />
                <Tab label="Security & Privacy" />
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                {/* Search and Filter */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <TextField
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
                    sx={{ flexGrow: 1, minWidth: 300 }}
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
                      <MenuItem value="review">In Review</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Documents List */}
                {loading ? (
                  <Box>
                    {[1, 2, 3].map((item) => (
                      <Paper key={item} sx={{ p: 3, mb: 2 }}>
                        <Skeleton variant="text" width="60%" height={32} />
                        <Skeleton variant="text" width="40%" height={24} />
                        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Box>
                    {filteredDocuments.map((doc) => (
                      <Paper key={doc.id} elevation={1} sx={{ p: 3, mb: 2 }}>
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AssignmentIcon sx={{ mr: 2, color: 'primary.main' }} />
                              <Typography variant="h6" component="h3">
                                {doc.name}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {doc.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                              <Chip label={doc.type} size="small" variant="outlined" />
                              <Chip 
                                label={doc.status} 
                                size="small" 
                                color={getStatusColor(doc.status)}
                                icon={getStatusIcon(doc.status)}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {doc.size} • Uploaded {doc.uploadDate}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="subtitle2" gutterBottom>
                              Signatures:
                            </Typography>
                            <Box>
                              {renderSignatureStatus(doc.signatures)}
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <IconButton size="small" color="primary">
                                <EyeIcon />
                              </IconButton>
                              <IconButton size="small" color="primary">
                                <DownloadIcon />
                              </IconButton>
                              <IconButton size="small" color="primary">
                                <Share2Icon />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <UploadIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Upload Documents
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Drag and drop files here or click to browse
                  </Typography>
                  <Button variant="contained" size="large" startIcon={<PlusIcon />}>
                    Choose Files
                  </Button>
                </Box>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Alert severity="success" sx={{ mb: 3 }}>
                      <AlertTitle>Bank-Level Security</AlertTitle>
                      All documents are encrypted with 256-bit SSL encryption and stored in secure data centers.
                    </Alert>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <AlertTitle>Privacy Protection</AlertTitle>
                      Your documents are private and only accessible to authorized parties in your transaction.
                    </Alert>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Security Features
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SecurityIcon sx={{ mr: 2, color: 'success.main' }} />
                          <Typography>End-to-end encryption</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CloudDoneIcon sx={{ mr: 2, color: 'success.main' }} />
                          <Typography>Secure cloud storage</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircleIcon sx={{ mr: 2, color: 'success.main' }} />
                          <Typography>Digital signatures</Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </TabPanel>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}

export default DocumentManagementPage;

