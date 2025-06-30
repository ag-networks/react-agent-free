import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  IconButton,
  Skeleton,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as SquareIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  FilterList as FilterIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { propertyService } from '../lib/api';

export function PropertySearchPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: ''
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.searchProperties(filters);
      setProperties(response.properties);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    loadProperties();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          >
            Agent Free
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button component={Link} to="/dashboard" color="inherit">
              Dashboard
            </Button>
            <Button component={Link} to="/properties" color="primary" sx={{ fontWeight: 'bold' }}>
              Properties
            </Button>
            <Button component={Link} to="/transactions" color="inherit">
              Transactions
            </Button>
            <Button component={Link} to="/messages" color="inherit">
              Messages
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Search Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <SearchIcon color="primary" />
              <Typography variant="h6" component="h2">
                Search Properties
              </Typography>
            </Box>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6} lg={3}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="City, State or ZIP"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6} lg={3}>
                <TextField
                  fullWidth
                  label="Min Price"
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6} lg={3}>
                <TextField
                  fullWidth
                  label="Max Price"
                  type="number"
                  placeholder="Any"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6} lg={3}>
                <FormControl fullWidth>
                  <InputLabel>Bedrooms</InputLabel>
                  <Select
                    value={filters.bedrooms}
                    label="Bedrooms"
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="1">1+</MenuItem>
                    <MenuItem value="2">2+</MenuItem>
                    <MenuItem value="3">3+</MenuItem>
                    <MenuItem value="4">4+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                size="large"
              >
                Search
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                size="large"
              >
                More Filters
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Results Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {properties.length} Properties Found
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Sort by:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select defaultValue="price-low" variant="outlined">
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="sqft">Square Feet</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Property Grid */}
        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} width="60%" />
                    <Skeleton variant="text" height={24} width="80%" />
                    <Skeleton variant="text" height={20} width="100%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            // Property cards
            properties.map((property) => (
              <Grid item xs={12} md={6} lg={4} key={property.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="body2" color="primary">
                        Property Image
                      </Typography>
                    </CardMedia>
                    
                    {/* Action buttons */}
                    <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' } }}
                      >
                        <FavoriteIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' } }}
                      >
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    {/* Status badge */}
                    <Chip
                      label={property.status}
                      color="success"
                      size="small"
                      sx={{ position: 'absolute', top: 8, left: 8 }}
                    />
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(property.price)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {property.daysOnMarket} days
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BedIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {property.bedrooms} bed
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <BathIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {property.bathrooms} bath
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SquareIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {property.sqft.toLocaleString()} sqft
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 2 }}>
                      <LocationIcon fontSize="small" color="action" sx={{ mt: 0.1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                        {property.address}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="caption" color="text.secondary">
                        Listed {formatDate(property.listingDate)}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/properties/${property.id}`)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Load More */}
        {!loading && properties.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="outlined" size="large">
              Load More Properties
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

