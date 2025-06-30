import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
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
  InputAdornment,
  CircularProgress,
  Skeleton
} from '@mui/material';
import {
  Description as FileTextIcon,
  AutoFixHigh as WandIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Warning as AlertCircleIcon,
  Person as UserIcon,
  AttachMoney as DollarSignIcon,
  Event as CalendarIcon
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
        console.log('API Response:', response);
        setTemplates(response.templates || []);
      } catch (error) {
        console.error('Error loading templates:', error);
        // Set fallback templates if API fails
        const fallbackTemplates = [
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
        ];
        console.log('Setting fallback templates:', fallbackTemplates);
        setTemplates(fallbackTemplates);
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
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedTemplate) {
      alert('Please select a contract template first.');
      return false;
    }

    selectedTemplate.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateContract = async () => {
    if (!validateForm()) return;

    setGenerating(true);
    try {
      const contractService = new ContractService();
      const response = await contractService.generateContract({
        templateId: selectedTemplate.id,
        data: formData
      });
      
      setGeneratedContract(response.contract);
    } catch (error) {
      console.error('Error generating contract:', error);
      // Mock contract generation for demo
      setGeneratedContract({
        id: 'contract_' + Date.now(),
        content: `Generated ${selectedTemplate.name} with the provided details.`,
        status: 'draft',
        createdAt: new Date().toISOString()
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setSelectedTemplate(null);
    setFormData({});
    setErrors({});
    setGeneratedContract(null);
  };

  const getActiveStep = () => {
    if (generatedContract) return 4;
    if (selectedTemplate && Object.keys(formData).length > 0) return 2;
    if (selectedTemplate) return 1;
    return 0;
  };

  const steps = [
    'Select Template',
    'Fill Details',
    'AI Generation',
    'Attorney Review',
    'Signature'
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Box sx={{ width: 280, bgcolor: 'primary.dark' }}>
          <Skeleton variant="rectangular" height="100%" />
        </Box>
        
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
      {/* Shared Sidebar */}
      <Sidebar user={user} onSignOut={signOut} />
      
      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: '280px' }}>
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

          <Box>
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
                    <Grid item xs={12} md={4} key={template.id}>
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
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                {template.description}
                              </Typography>
                              <Chip 
                                label={template.category || 'Contract'} 
                                size="small" 
                                color="primary" 
                                variant="filled"
                                sx={{ mt: 1 }}
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

            {/* Contract Details Form */}
            {selectedTemplate && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Contract Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fill in the required information for your {selectedTemplate.name.toLowerCase()}.
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    {selectedTemplate.fields.map((field) => (
                      <Grid item xs={12} md={6} key={field.name}>
                        {field.type === 'select' ? (
                          <FormControl fullWidth error={!!errors[field.name]}>
                            <InputLabel>{field.label}</InputLabel>
                            <Select
                              value={formData[field.name] || ''}
                              label={field.label}
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                            >
                              {field.options?.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <TextField
                            fullWidth
                            label={field.label}
                            type={field.type === 'currency' ? 'number' : field.type}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            required={field.required}
                            error={!!errors[field.name]}
                            helperText={errors[field.name]}
                            InputProps={field.type === 'currency' ? {
                              startAdornment: <InputAdornment position="start">$</InputAdornment>
                            } : undefined}
                          />
                        )}
                      </Grid>
                    ))}
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={generating ? <CircularProgress size={20} /> : <WandIcon />}
                      onClick={handleGenerateContract}
                      disabled={generating}
                    >
                      {generating ? 'Generating...' : 'Generate Contract'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Generated Contract */}
            {generatedContract && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Generated Contract
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {generatedContract.content}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        console.log('Downloading contract...');
                      }}
                    >
                      Download PDF
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SendIcon />}
                      onClick={() => {
                        console.log('Sending for attorney review...');
                      }}
                    >
                      Send for Review
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

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
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default ContractGenerationPage;

