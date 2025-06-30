import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as Avatar from '@radix-ui/react-avatar';
import * as Button from '@radix-ui/react-button';
import * as Card from '@radix-ui/react-card';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Tabs from '@radix-ui/react-tabs';
import * as Progress from '@radix-ui/react-progress';
import { 
  Scale, 
  MessageSquare, 
  Video, 
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ChevronRight,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  Home,
  Briefcase,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  Activity,
  Eye,
  Download,
  Upload,
  Bell,
  Archive,
  Tag,
  History,
  ChevronDown,
  X
} from 'lucide-react';
import { AttorneyService } from '../lib/api';

const AttorneyClientManagementPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [clients, setClients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadClientData = async () => {
      try {
        const attorneyService = new AttorneyService();
        const [clientsData, consultationsData] = await Promise.all([
          attorneyService.getClients(),
          attorneyService.getPendingConsultations()
        ]);
        
        setClients(clientsData.clients || []);
        setConsultations(consultationsData.consultations || []);
      } catch (error) {
        console.error('Error loading client data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesType = filterType === 'all' || client.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.lastContact) - new Date(a.lastContact);
      case 'rating':
        return b.rating - a.rating;
      case 'transactions':
        return b.totalTransactions - a.totalTransactions;
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'buyer': return <Home className="w-4 h-4" />;
      case 'seller': return <Building className="w-4 h-4" />;
      case 'tenant': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };

  const handleScheduleMeeting = async (clientId, type) => {
    try {
      const attorneyService = new AttorneyService();
      const datetime = new Date();
      datetime.setDate(datetime.getDate() + 1); // Tomorrow
      await attorneyService.scheduleClientMeeting(clientId, datetime.toISOString(), type);
      // Show success message or update UI
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  const ClientDetailsModal = () => {
    if (!selectedClient) return null;

    return (
      <Dialog.Root open={showClientDetails} onOpenChange={setShowClientDetails}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar.Root className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <Avatar.Fallback className="text-blue-600 font-medium text-xl">
                      {selectedClient.name.split(' ').map(n => n[0]).join('')}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedClient.status)}`}>
                        {selectedClient.status}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{selectedClient.type}</span>
                    </div>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <Button.Root className="p-2 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </Button.Root>
                </Dialog.Close>
              </div>

              <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex border-b border-gray-200 mb-6">
                  <Tabs.Trigger 
                    value="overview" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                  >
                    Overview
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="transactions" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                  >
                    Transactions
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="documents" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                  >
                    Documents
                  </Tabs.Trigger>
                  <Tabs.Trigger 
                    value="communication" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                  >
                    Communication
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{selectedClient.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{selectedClient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{selectedClient.address}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Prefers {selectedClient.preferredContact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Client Statistics */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Statistics</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Transactions</span>
                          <span className="font-medium">{selectedClient.totalTransactions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Current Transactions</span>
                          <span className="font-medium">{selectedClient.currentTransactions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Client Rating</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-medium">{selectedClient.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Join Date</span>
                          <span className="font-medium">{new Date(selectedClient.joinDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Last Contact</span>
                          <span className="font-medium">{new Date(selectedClient.lastContact).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                      <p className="text-sm text-gray-600 mb-4">{selectedClient.notes}</p>
                      <div className="flex space-x-2">
                        <Button.Root className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Notes
                        </Button.Root>
                        <Button.Root className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Note
                        </Button.Root>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="transactions">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                      <Button.Root className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        New Transaction
                      </Button.Root>
                    </div>
                    
                    {/* Mock transaction data */}
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Purchase Agreement - 123 Oak Street</h4>
                            <p className="text-sm text-gray-600">Started: April 15, 2024</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                            <p className="text-sm text-gray-600 mt-1">$850,000</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="documents">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Client Documents</h3>
                      <Button.Root className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button.Root>
                    </div>
                    
                    {/* Mock document data */}
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                              <h4 className="font-medium text-gray-900">Purchase Agreement.pdf</h4>
                              <p className="text-sm text-gray-600">Uploaded: April 15, 2024 • 2.4 MB</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button.Root className="p-2 text-gray-400 hover:text-gray-600">
                              <Eye className="w-4 h-4" />
                            </Button.Root>
                            <Button.Root className="p-2 text-gray-400 hover:text-gray-600">
                              <Download className="w-4 h-4" />
                            </Button.Root>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="communication">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Communication History</h3>
                      <div className="flex space-x-2">
                        <Button.Root 
                          onClick={() => handleScheduleMeeting(selectedClient.id, 'consultation')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Meeting
                        </Button.Root>
                        <Button.Root className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Message
                        </Button.Root>
                      </div>
                    </div>
                    
                    {/* Mock communication history */}
                    <div className="space-y-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">Email sent</h4>
                              <span className="text-sm text-gray-500">April 29, 2024</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Contract review completed. Please review the attached documents and let me know if you have any questions.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Phone className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">Phone call</h4>
                              <span className="text-sm text-gray-500">April 28, 2024</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Discussed contract terms and timeline. Client has questions about inspection contingency.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>
              </Tabs.Root>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button.Root 
                  onClick={() => setShowClientDetails(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </Button.Root>
                <Button.Root className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Client
                </Button.Root>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Scale className="w-8 h-8" />
            <span className="text-xl font-bold">Agent Free</span>
          </div>
        </div>

        <nav className="flex-1 px-4">
          <div className="space-y-2">
            <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/properties" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
              <Building className="w-5 h-5" />
              <span>My Transactions</span>
            </Link>
            <Link to="/documents" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
              <FileText className="w-5 h-5" />
              <span>Documents</span>
            </Link>
            <Link to="/messages" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>
            <Link to="/attorney-dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
              <Briefcase className="w-5 h-5" />
              <span>Attorney Dashboard</span>
            </Link>
            <Link to="/attorney-clients" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-800 text-white">
              <Users className="w-5 h-5" />
              <span>Client Management</span>
            </Link>
            <Link to="/calendar" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
              <Calendar className="w-5 h-5" />
              <span>Calendar</span>
            </Link>
            <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar.Root className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Avatar.Fallback className="text-white font-medium">
                {user?.name?.charAt(0) || 'A'}
              </Avatar.Fallback>
            </Avatar.Root>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Attorney'}
              </p>
              <p className="text-xs text-blue-200 truncate">
                {user?.email || 'attorney@agentfree.com'}
              </p>
            </div>
          </div>
          <Button.Root 
            onClick={signOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button.Root>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
              <p className="text-gray-600">Manage your clients and consultations</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button.Root 
                onClick={() => setShowAddClient(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Client</span>
              </Button.Root>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-1 relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search clients by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
                  <Select.Trigger className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[120px]">
                    <Filter className="w-4 h-4" />
                    <span>Status: {filterStatus}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Select.Trigger>
                  <Select.Content className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Select.Item value="all" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">All Status</Select.Item>
                    <Select.Item value="active" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Active</Select.Item>
                    <Select.Item value="pending" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Pending</Select.Item>
                    <Select.Item value="urgent" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Urgent</Select.Item>
                    <Select.Item value="inactive" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Inactive</Select.Item>
                  </Select.Content>
                </Select.Root>

                <Select.Root value={filterType} onValueChange={setFilterType}>
                  <Select.Trigger className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[120px]">
                    <Tag className="w-4 h-4" />
                    <span>Type: {filterType}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Select.Trigger>
                  <Select.Content className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Select.Item value="all" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">All Types</Select.Item>
                    <Select.Item value="buyer" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Buyer</Select.Item>
                    <Select.Item value="seller" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Seller</Select.Item>
                    <Select.Item value="tenant" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Tenant</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>

              <div className="flex items-center space-x-2">
                <Select.Root value={sortBy} onValueChange={setSortBy}>
                  <Select.Trigger className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <span>Sort: {sortBy}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Select.Trigger>
                  <Select.Content className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Select.Item value="name" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Name</Select.Item>
                    <Select.Item value="date" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Last Contact</Select.Item>
                    <Select.Item value="rating" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Rating</Select.Item>
                    <Select.Item value="transactions" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Transactions</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {sortedClients.length} of {clients.length} clients
              </div>
              <div className="text-sm text-gray-600">
                {clients.filter(c => c.status === 'active').length} active • {clients.filter(c => c.status === 'urgent').length} urgent
              </div>
            </div>
          </div>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedClients.map((client) => (
              <div 
                key={client.id} 
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleClientClick(client)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar.Root className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Avatar.Fallback className="text-blue-600 font-medium">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <div className="flex items-center space-x-1 mt-1">
                        {getTypeIcon(client.type)}
                        <span className="text-sm text-gray-600">{client.type}</span>
                      </div>
                    </div>
                  </div>
                  <Button.Root className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </Button.Root>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Activity className="w-4 h-4" />
                    <span>Last contact: {new Date(client.lastContact).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{client.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <span>{client.totalTransactions} total transactions</span>
                  <span>{client.currentTransactions} active</span>
                </div>

                <div className="flex space-x-2">
                  <Button.Root 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle message action
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </Button.Root>
                  <Button.Root 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle phone action
                    }}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </Button.Root>
                  <Button.Root 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScheduleMeeting(client.id, 'consultation');
                    }}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                  </Button.Root>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Consultations */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Consultations</h2>
                <Button.Root className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All
                </Button.Root>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {consultations.slice(0, 5).map((consultation) => (
                <div key={consultation.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar.Root className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Avatar.Fallback className="text-gray-600 font-medium">
                          {consultation.clientName.split(' ').map(n => n[0]).join('')}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <div>
                        <h3 className="font-medium text-gray-900">{consultation.clientName}</h3>
                        <p className="text-sm text-gray-600">{consultation.type}</p>
                        <p className="text-xs text-gray-500">{consultation.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                          {consultation.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${getPriorityColor(consultation.priority)}`}>
                          {consultation.priority}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{consultation.scheduledDate}</p>
                        <p className="text-xs text-gray-500">{consultation.scheduledTime}</p>
                      </div>
                      <Button.Root className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        {consultation.action}
                      </Button.Root>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Client Details Modal */}
      <ClientDetailsModal />
    </div>
  );
};

export default AttorneyClientManagementPage;

