import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Share2,
  Edit,
  FileCheck,
  FileX,
  Folder,
  Home,
  MessageSquare,
  Calendar,
  Settings,
  Shield
} from 'lucide-react';
import { documentService } from '../lib/api';
import '../App.css';

export function DocumentManagementPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [uploadingFiles, setUploadingFiles] = useState([]);

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
      // In a real app, this would trigger a download
      console.log(`Downloading ${fileName}`);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.deleteDocument(documentId);
        loadDocuments(); // Refresh documents list
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleRequestSignature = async (documentId) => {
    try {
      await documentService.requestSignature(documentId);
      loadDocuments(); // Refresh to show updated status
    } catch (error) {
      console.error('Signature request error:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'signed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'in_review': return <Eye className="w-4 h-4 text-blue-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'My Transactions', icon: FileText, path: '/properties' },
    { name: 'Documents', icon: FileText, path: '/documents', active: true },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Blue Sidebar */}
      <div className="w-64 bg-blue-600 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">Agent Free</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-blue-500">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-blue-500 text-white">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-blue-200">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="w-full mt-3 text-blue-100 hover:bg-blue-700 hover:text-white"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600 mt-2">Secure document storage and e-signature workflow</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload Documents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to upload</p>
                    <p className="text-sm text-gray-600 mb-4">Supports PDF, DOC, DOCX, JPG, PNG files up to 10MB</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload">
                      <Button className="cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        Choose Files
                      </Button>
                    </Label>
                  </div>

                  {/* Upload Progress */}
                  {uploadingFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadingFiles.map((file) => (
                        <div key={file.id} className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{file.name}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-600">{file.progress}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Search and Filter */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search documents..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="w-48">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Status</option>
                        <option value="signed">Signed</option>
                        <option value="pending">Pending</option>
                        <option value="in_review">In Review</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Tabs */}
              <Card>
                <CardContent className="p-0">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="all">All (3)</TabsTrigger>
                      <TabsTrigger value="contracts">Contracts (1)</TabsTrigger>
                      <TabsTrigger value="inspection">Inspection (1)</TabsTrigger>
                      <TabsTrigger value="financing">Financing (1)</TabsTrigger>
                      <TabsTrigger value="other">Other (0)</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="p-6">
                      <div className="space-y-4">
                        {loading ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-600 mt-2">Loading documents...</p>
                          </div>
                        ) : filteredDocuments.length === 0 ? (
                          <div className="text-center py-8">
                            <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No documents found</p>
                          </div>
                        ) : (
                          filteredDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                              <div className="flex items-center space-x-4">
                                <FileText className="w-8 h-8 text-blue-600" />
                                <div>
                                  <h3 className="font-medium text-gray-900">{doc.name}</h3>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <Badge className={getStatusColor(doc.status)}>
                                      {getStatusIcon(doc.status)}
                                      <span className="ml-1">{doc.status}</span>
                                    </Badge>
                                    <span className="text-sm text-gray-600">{doc.date}</span>
                                    <span className="text-sm text-gray-600">{doc.size}</span>
                                  </div>
                                  {doc.signatures && (
                                    <div className="flex items-center space-x-2 mt-2">
                                      <span className="text-sm text-gray-600">Signatures:</span>
                                      {doc.signatures.map((sig, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {sig}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleDownload(doc.id, doc.name)}>
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Document Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Document Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Signed</span>
                      </div>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">In Review</span>
                      </div>
                      <span className="font-medium">1</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total Documents</span>
                      <span>3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security & Privacy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">SOC 2 Type II compliant</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Attorney-client privilege protected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Automatic backup & versioning</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Request Document
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Create Template
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Folder className="w-4 h-4 mr-2" />
                      Organize Folders
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

