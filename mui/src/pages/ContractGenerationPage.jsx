import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  InputAdornment,
  CircularProgress,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  Description as FileTextIcon,
  AutoFixHigh as WandIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertCircleIcon,
  Person as UserIcon,
  Home as HomeIcon,
  AttachMoney as DollarSignIcon,
  Event as CalendarIcon,
  Chat as MessageSquareIcon,
  ArrowBack as ArrowBackIcon,
  Scale as ScaleIcon,
  Business as BuildingIcon,
  Message as MessageIcon,
  Dashboard as DashboardIcon,
  Contacts as ContactsIcon,
  Folder as DocumentsIcon,
  Group as ConsultationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { ContractService } from '../lib/api';

export function ContractGenerationPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const contractService = new ContractService();
        const response = await contractService.getContractTemplates();
        setTemplates(response.templates || []);
      } catch (error) {
        console.error('Error loading templates:', error);
        // Set fallback templates if API fails
        setTemplates([
          {
            id: '1',
            name: 'Purchase Agreement',
            description: 'Standard real estate purchase agreement',
            category: 'purchase',
            fields: [
              { name: 'buyerName', label: 'Buyer Name', type: 'text', required: true },
              { name: 'sellerName', label: 'Seller Name', type: 'text', required: true },
              { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
              { name: 'purchasePrice', label: 'Purchase Price', type: 'currency', required: true },
              { name: 'closingDate', label: 'Closing Date', type: 'date', required: true }
            ]
          },
          {
            id: '2',
            name: 'Lease Agreement',
            description: 'Residential lease agreement',
            category: 'lease',
            fields: [
              { name: 'tenantName', label: 'Tenant Name', type: 'text', required: true },
              { name: 'landlordName', label: 'Landlord Name', type: 'text', required: true },
              { name: 'propertyAddress', label: 'Property Address', type: 'text', required: true },
              { name: 'monthlyRent', label: 'Monthly Rent', type: 'currency', required: true },
              { name: 'leaseStartDate', label: 'Lease Start Date', type: 'date', required: true },
              { name: 'leaseEndDate', label: 'Lease End Date', type: 'date', required: true }
            ]
          },
          {
            id: '3',
            name: 'Amendment',
            description: 'Contract amendment form',
            category: 'amendment',
            fields: [
              { name: 'originalContractDate', label: 'Original Contract Date', type: 'date', required: true },
              { name: 'amendmentDescription', label: 'Amendment Description', type: 'text', required: true },
              { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData({});
    setErrors({});
    setGeneratedContract(null);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    selectedTemplate?.fields?.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    return newErrors;
  };

  const handleGenerateContract = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setGenerating(true);
      const contractService = new ContractService();
      const response = await contractService.generateContract(selectedTemplate.id, formData);
      setGeneratedContract(response);
    } catch (error) {
      console.error('Error generating contract:', error);
      // Set a mock generated contract for demo purposes
      setGeneratedContract({
        id: 'mock-contract-1',
        content: `${selectedTemplate.name}\n\nThis is a mock generated contract based on your inputs:\n\n${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\nThis contract has been generated using AI and will be reviewed by a licensed attorney before finalization.`
      });
    } finally {
      setGenerating(false);
    }
  };

  const renderFormField = (field) => {
    const value = formData[field.name] || '';
    const hasError = errors[field.name];

    switch (field.type) {
      case 'text':
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            error={!!hasError}
            helperText={hasError}
            required={field.required}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        );

      case 'currency':
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            error={!!hasError}
            helperText={hasError}
            required={field.required}
            placeholder="0"
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        );

      case 'date':
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            error={!!hasError}
            helperText={hasError}
            required={field.required}
            variant="outlined"
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );

      case 'select':
        return (
          <FormControl key={field.name} fullWidth sx={{ mb: 2 }} error={!!hasError}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {hasError}
              </Typography>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  const steps = [
    'Select Template',
    'Fill Details', 
    'AI Generation',
    'Attorney Review',
    'Signature'
  ];

  const getActiveStep = () => {
    if (!selectedTemplate) return 0;
    if (!generatedContract) return 1;
    return 2;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
        {/* Sidebar Skeleton */}
        <Box sx={{ width: 280, bgcolor: 'primary.dark' }}>
          <Skeleton variant="rectangular" height="100%" />
        </Box>
        
        {/* Main Content Skeleton */}
        <Box sx={{ flex: 1, p: 4 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" height={24} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} lg={8}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

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
            <ListItem 
              button 
              component={Link} 
              to="/dashboard" 
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/properties" 
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <BuildingIcon />
              </ListItemIcon>
              <ListItemText primary="My Transactions" />
            </ListItem>
            <ListItem 
              button 
              sx={{ 
                borderRadius: 2, 
                mb: 1, 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <FileTextIcon />
              </ListItemIcon>
              <ListItemText primary="Contracts" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/documents" 
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <DocumentsIcon />
              </ListItemIcon>
              <ListItemText primary="Documents" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/messages" 
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/attorney-dashboard" 
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Attorney Dashboard" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/attorney-clients" 
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <ContactsIcon />
              </ListItemIcon>
              <ListItemText primary="Client Management" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/attorney-calendar" 
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <CalendarIcon />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/attorney-workflow" 
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <ConsultationsIcon />
              </ListItemIcon>
              <ListItemText primary="Agent Workflow" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/settings" 
              sx={{ 
                borderRadius: 2, 
                mb: 1,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
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
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight="medium" noWrap>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="primary.light" noWrap>
                {user?.email || 'user@agentfree.com'}
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
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Contract Generation
            </Typography>
            <Typography variant="h6" color="text.secondary">
              AI-powered contract creation with legal review
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Main Content */}
            <Grid item xs={12} lg={8}>
              {/* Template Selection */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FileTextIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                      Select Contract Template
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {templates.map((template) => (
                      <Grid item xs={12} md={6} key={template.id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer',
                            border: selectedTemplate?.id === template.id ? 2 : 1,
                            borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'divider',
                            bgcolor: selectedTemplate?.id === template.id ? 'primary.50' : 'background.paper',
                            '&:hover': {
                              bgcolor: selectedTemplate?.id === template.id ? 'primary.50' : 'grey.50'
                            }
                          }}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box>
                                <Typography variant="h6" component="h3" gutterBottom>
                                  {template.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {template.description}
                                </Typography>
                                <Chip 
                                  label={template.category} 
                                  color="success" 
                                  size="small"
                                />
                              </Box>
                              {selectedTemplate?.id === template.id && (
                                <CheckCircleIcon color="primary" />
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              {/* Form Fields */}
              {selectedTemplate && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                      Contract Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Fill in the required information for your {selectedTemplate.name.toLowerCase()}.
                    </Typography>
                    
                    <Box component="form">
                      {selectedTemplate.fields?.map(renderFormField)}
                      
                      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <WandIcon />}
                          onClick={handleGenerateContract}
                          disabled={generating}
                          sx={{ minWidth: 200 }}
                        >
                          {generating ? 'Generating...' : 'Generate Contract'}
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => {
                            setSelectedTemplate(null);
                            setFormData({});
                            setErrors({});
                          }}
                        >
                          Reset
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Generated Contract Preview */}
              {generatedContract && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                      Generated Contract Preview
                    </Typography>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        mb: 3, 
                        bgcolor: 'grey.50',
                        maxHeight: 400,
                        overflow: 'auto'
                      }}
                    >
                      <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                        {generatedContract.content}
                      </Typography>
                    </Paper>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => {
                          // Download logic here
                          console.log('Downloading contract...');
                        }}
                      >
                        Download PDF
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<SendIcon />}
                        onClick={() => {
                          // Send for review logic here
                          console.log('Sending for attorney review...');
                        }}
                      >
                        Send for Review
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              {/* Progress Stepper */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Contract Process
                  </Typography>
                  <Stepper activeStep={getActiveStep()} orientation="vertical">
                    {steps.map((label, index) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </CardContent>
              </Card>

              {/* AI Assistant */}
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WandIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                      AI Assistant
                    </Typography>
                  </Box>
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <AlertTitle>Tip:</AlertTitle>
                    Make sure all property details are accurate. Our AI will generate a comprehensive contract based on your inputs.
                  </Alert>
                  
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <AlertTitle>Legal Review:</AlertTitle>
                    All generated contracts are reviewed by licensed attorneys before finalization.
                  </Alert>
                  
                  <Alert severity="warning">
                    <AlertTitle>Next Steps:</AlertTitle>
                    After generation, your attorney will review and contact you within 24 hours.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

