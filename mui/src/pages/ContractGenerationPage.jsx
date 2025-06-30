import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid2 as Grid,
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
  Home as HomeIcon,
  AttachMoney as DollarSignIcon,
  Event as CalendarIcon,
  Chat as MessageSquareIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { contractService } from '../lib/api';

export function ContractGenerationPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await contractService.getContractTemplates();
      setTemplates(response.templates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

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
      newErrors.template = 'Please select a contract template';
      return newErrors;
    }

    selectedTemplate.fields.forEach(field => {
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
      const response = await contractService.generateContract(selectedTemplate.id, formData);
      setGeneratedContract(response);
    } catch (error) {
      console.error('Error generating contract:', error);
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
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            error={!!hasError}
            helperText={hasError}
            required={field.required}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DollarSignIcon />
                </InputAdornment>
              ),
            }}
            placeholder="0.00"
            variant="outlined"
            sx={{ mb: 2 }}
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
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        );

      case 'number':
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            error={!!hasError}
            helperText={hasError}
            required={field.required}
            placeholder="0"
            variant="outlined"
            sx={{ mb: 2 }}
          />
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
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
            Contract Generation
          </Typography>
          <Typography variant="h6" color="text.secondary">
            AI-powered contract creation with legal review
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
        <Grid size={{ xs: 12, lg: 8 }}>
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
                  <Grid size={{ xs: 12, md: 6 }} key={template.id}>
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
                            <Typography variant="h6" gutterBottom>
                              {template.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {template.description}
                            </Typography>
                            <Chip 
                              label={template.type} 
                              size="small" 
                              color="secondary"
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

          {/* Contract Form */}
          {selectedTemplate && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <UserIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Contract Details
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {selectedTemplate.fields.map((field, index) => (
                    <Grid size={{ xs: 12, md: 6 }} key={field.name}>
                      {renderFormField(field)}
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    variant="contained"
                    onClick={handleGenerateContract}
                    disabled={generating}
                    startIcon={generating ? <CircularProgress size={16} /> : <WandIcon />}
                    size="large"
                  >
                    {generating ? 'Generating...' : 'Generate Contract'}
                  </Button>
                  
                  {generatedContract && (
                    <>
                      <Button 
                        variant="outlined" 
                        startIcon={<DownloadIcon />}
                        size="large"
                      >
                        Download PDF
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<SendIcon />}
                        size="large"
                      >
                        Send for Review
                      </Button>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Generated Contract Preview */}
          {generatedContract && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" component="h2">
                    Generated Contract
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mb: 3 }}>
                  <AlertTitle>AI Generated Contract</AlertTitle>
                  This contract has been generated using AI and will be reviewed by a licensed attorney before finalization.
                </Alert>
                
                <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedTemplate.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Generated on {new Date().toLocaleDateString()} • Ready for attorney review
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {Object.entries(formData).map(([key, value]) => {
                      const field = selectedTemplate.fields.find(f => f.name === key);
                      return (
                        <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight="medium">
                            {field?.label}:
                          </Typography>
                          <Typography variant="body2">
                            {value}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* AI Assistant */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MessageSquareIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="h2">
                  AI Assistant
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Tip:</strong> Make sure all property details are accurate. Our AI will generate a comprehensive contract based on your inputs.
                  </Typography>
                </Alert>
                
                <Alert severity="success">
                  <Typography variant="body2">
                    <strong>Legal Review:</strong> All generated contracts are reviewed by licensed attorneys before finalization.
                  </Typography>
                </Alert>
                
                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>Next Steps:</strong> After generation, your attorney will review and contact you within 24 hours.
                  </Typography>
                </Alert>
              </Box>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contract Process
              </Typography>
              
              <Stepper activeStep={getActiveStep()} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>
                      <Typography variant="body2" fontWeight="medium">
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ContractGenerationPage;

