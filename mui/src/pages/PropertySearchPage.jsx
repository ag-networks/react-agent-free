import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  Skeleton,
  Paper
} from '@mui/material';
import {
  Home as HomeIcon,
  Description as FileTextIcon,
  Message as MessageIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  LocationOn as MapPinIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as SquareIcon,
  DateRange as CalendarDateIcon,
  AttachMoney as DollarSignIcon,
  FilterList as FilterIcon,
  FavoriteBorder as HeartIcon,
  Share as Share2Icon
} from '@mui/icons-material';
import { propertyService } from '../lib/api';

const drawerWidth = 256;

export function PropertySearchPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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

  const menuItems = [
    { text: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { text: 'My Transactions', icon: FileTextIcon, path: '/properties', active: true },
    { text: 'Documents', icon: FileTextIcon, path: '/documents' },
    { text: 'Messages', icon: MessageIcon, path: '/messages' },
    { text: 'Calendar', icon: CalendarIcon, path: '/calendar' },
    { text: 'Settings', icon: SettingsIcon, path: '/settings' }
  ];

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
            Property Search
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find your perfect property with AI-powered search
          </Typography>
        </Box>

        {/* Search Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SearchIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Search Properties</Typography>
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6} lg={3}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="City, State or ZIP"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
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
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
              >
                Search
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
              >
                More Filters
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Results Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            {properties.length} Properties Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sort by: Price: Low to High
          </Typography>
        </Box>

        {/* Property Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} />
                    <Skeleton variant="text" height={20} width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {properties.map((property) => (
              <Grid item xs={12} md={6} lg={4} key={property.id}>
                <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={property.image}
                      alt={property.address}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover'
                      }}
                    />
                    <Chip
                      label="For Sale"
                      color="success"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      display: 'flex',
                      gap: 1
                    }}>
                      <IconButton size="small" sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}>
                        <HeartIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}>
                        <Share2Icon />
                      </IconButton>
                    </Box>
                  </Box>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(property.price)}
                      </Typography>
                      <Chip label={property.status} variant="outlined" size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <MapPinIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      {property.address}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BedIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {property.bedrooms} bed
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BathIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {property.bathrooms} bath
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SquareIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {property.sqft} sqft
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarDateIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        Listed {formatDate(property.listedDate)}
                      </Typography>
                      <Button size="small" variant="contained">
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

