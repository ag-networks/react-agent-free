import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  Container,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as SquareFootIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

export function PropertySearchPage() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([300000, 800000]);
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const properties = [
    {
      id: 1,
      title: '123 Main Street',
      address: 'San Francisco, CA 94102',
      price: 750000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1200,
      type: 'Condo',
      image: '/api/placeholder/300/200',
      description: 'Beautiful modern condo in the heart of downtown'
    },
    {
      id: 2,
      title: '456 Oak Avenue',
      address: 'Oakland, CA 94610',
      price: 650000,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1000,
      type: 'Townhouse',
      image: '/api/placeholder/300/200',
      description: 'Charming townhouse with private garden'
    },
    {
      id: 3,
      title: '789 Pine Street',
      address: 'Berkeley, CA 94704',
      price: 850000,
      bedrooms: 4,
      bathrooms: 3,
      sqft: 1800,
      type: 'House',
      image: '/api/placeholder/300/200',
      description: 'Spacious family home near UC Berkeley'
    },
    {
      id: 4,
      title: '321 Elm Drive',
      address: 'Palo Alto, CA 94301',
      price: 1200000,
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1500,
      type: 'House',
      image: '/api/placeholder/300/200',
      description: 'Modern home in prestigious neighborhood'
    },
    {
      id: 5,
      title: '654 Maple Court',
      address: 'San Jose, CA 95110',
      price: 550000,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 900,
      type: 'Condo',
      image: '/api/placeholder/300/200',
      description: 'Cozy condo with city views'
    },
    {
      id: 6,
      title: '987 Cedar Lane',
      address: 'Mountain View, CA 94041',
      price: 900000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1300,
      type: 'Townhouse',
      image: '/api/placeholder/300/200',
      description: 'Contemporary townhouse near tech companies'
    }
  ];

  const toggleFavorite = (propertyId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesType = !propertyType || property.type === propertyType;
    const matchesBedrooms = !bedrooms || property.bedrooms >= parseInt(bedrooms);
    const matchesBathrooms = !bathrooms || property.bathrooms >= parseInt(bathrooms);
    
    return matchesSearch && matchesPrice && matchesType && matchesBedrooms && matchesBathrooms;
  });

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
              Property Search
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Find your perfect home with our advanced search tools
            </Typography>
          </Box>

          {/* Search and Filters */}
          <Card elevation={2} sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search by address, neighborhood, or property name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Property Type</InputLabel>
                    <Select
                      value={propertyType}
                      label="Property Type"
                      onChange={(e) => setPropertyType(e.target.value)}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="House">House</MenuItem>
                      <MenuItem value="Condo">Condo</MenuItem>
                      <MenuItem value="Townhouse">Townhouse</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Min Bedrooms</InputLabel>
                    <Select
                      value={bedrooms}
                      label="Min Bedrooms"
                      onChange={(e) => setBedrooms(e.target.value)}
                    >
                      <MenuItem value="">Any</MenuItem>
                      <MenuItem value="1">1+</MenuItem>
                      <MenuItem value="2">2+</MenuItem>
                      <MenuItem value="3">3+</MenuItem>
                      <MenuItem value="4">4+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Min Bathrooms</InputLabel>
                    <Select
                      value={bathrooms}
                      label="Min Bathrooms"
                      onChange={(e) => setBathrooms(e.target.value)}
                    >
                      <MenuItem value="">Any</MenuItem>
                      <MenuItem value="1">1+</MenuItem>
                      <MenuItem value="2">2+</MenuItem>
                      <MenuItem value="3">3+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={200000}
                    max={2000000}
                    step={50000}
                    valueLabelFormat={formatPrice}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {filteredProperties.length} Properties Found
            </Typography>
            <Button variant="outlined" startIcon={<FilterIcon />}>
              More Filters
            </Button>
          </Box>

          {/* Property Grid */}
          <Grid container spacing={3}>
            {filteredProperties.map((property) => (
              <Grid item xs={12} md={6} lg={4} key={property.id}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        bgcolor: 'grey.300',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Property Image
                      </Typography>
                    </CardMedia>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 1)',
                        },
                      }}
                      onClick={() => toggleFavorite(property.id)}
                    >
                      {favorites.has(property.id) ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                    <Chip
                      label={property.type}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {property.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {property.address}
                      </Typography>
                    </Box>
                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                      {formatPrice(property.price)}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BedIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">{property.bedrooms} bed</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BathIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">{property.bathrooms} bath</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SquareFootIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">{property.sqft} sqft</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                      {property.description}
                    </Typography>
                    <Button variant="contained" fullWidth>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredProperties.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No properties found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search criteria to see more results.
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default PropertySearchPage;

