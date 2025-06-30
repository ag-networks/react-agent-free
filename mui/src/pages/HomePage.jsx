import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  Bolt as FlashIcon,
  LocationOn as LocationIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

export function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
              <HomeIcon />
            </Avatar>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Agent Free
            </Typography>
          </Box>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3, mr: 3 }}>
              <Button color="inherit">How It Works</Button>
              <Button color="inherit">Pricing</Button>
              <Button color="inherit">About</Button>
              <Button color="inherit">Contact</Button>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/signup')}
              sx={{ ml: 1 }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #EBF4FF 0%, #F0F9FF 100%)',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 3,
              color: 'text.primary',
            }}
          >
            Save{' '}
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              $15,000+
            </Typography>{' '}
            on Real Estate Commissions
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              mb: 6,
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Get licensed attorney support for your real estate transactions at a fraction of traditional agent costs. 
            AI-powered contracts with legal expertise you can trust.
          </Typography>

          {/* Property Search Bar */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 6,
              maxWidth: '600px',
              mx: 'auto',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              borderRadius: 3,
            }}
          >
            <TextField
              fullWidth
              placeholder="Enter city, state, or ZIP code"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              sx={{ minWidth: { xs: '100%', md: 'auto' } }}
            >
              Search Properties
            </Button>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/signup')}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
            >
              Start Saving Today
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
            >
              See How It Works
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 600 }}>
            Why Choose Agent Free?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Revolutionary approach to real estate transactions combining technology with legal expertise
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'success.light',
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <MoneyIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Save Money
              </Typography>
              <Typography color="text.secondary">
                Pay just $2,500 flat fee instead of 6% commission. Save $15,000+ on a $300k home purchase.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.light',
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <SecurityIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Legal Protection
              </Typography>
              <Typography color="text.secondary">
                Licensed attorneys review every contract and guide you through the entire transaction process.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'secondary.light',
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <FlashIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                AI-Powered
              </Typography>
              <Typography color="text.secondary">
                Streamlined process with AI-generated contracts and automated document management.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Pricing Comparison */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" sx={{ mb: 2, fontWeight: 600 }}>
              Compare the Savings
            </Typography>
            <Typography variant="h6" color="text.secondary">
              See how much you can save with Agent Free
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={5}>
              <Card elevation={2}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                    Traditional Agent
                  </Typography>
                  <Typography
                    variant="h2"
                    color="error.main"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    $18,000
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    6% commission on $300k home
                  </Typography>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>• High commission fees</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Limited attorney oversight</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Lengthy process</Typography>
                    <Typography variant="body2">• Hidden costs</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card
                elevation={4}
                sx={{
                  border: 2,
                  borderColor: 'primary.main',
                  position: 'relative',
                }}
              >
                <Chip
                  label="RECOMMENDED"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontWeight: 600,
                  }}
                />
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography
                    variant="h4"
                    color="primary.main"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    Agent Free
                  </Typography>
                  <Typography
                    variant="h2"
                    color="primary.main"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    $2,500
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Flat fee + $500 refundable retainer
                  </Typography>
                  <Box sx={{ textAlign: 'left', mb: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Transparent flat fee pricing</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• Licensed attorney support</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>• AI-powered efficiency</Typography>
                    <Typography variant="body2">• No hidden costs</Typography>
                  </Box>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: 'success.light',
                      color: 'success.contrastText',
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Save $15,500!
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 600 }}>
            Ready to Save Thousands?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join the revolution in real estate transactions. Get started today.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/signup')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.100', py: 4 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: 32, height: 32 }}>
                <HomeIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Agent Free
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              © 2025 Agent Free. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

