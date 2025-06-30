import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Folder
} from 'lucide-react';
import { documentService } from '@/lib/api';
import '../App.css';

export function DocumentManagementPage() {
  const navigate = useNavigate();
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
        loadDocuments();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in-review':
        return <Eye className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const documentsByType = {
    contracts: filteredDocuments.filter(doc => doc.type === 'contract'),
    inspection: filteredDocuments.filter(doc => doc.type === 'inspection'),
    financing: filteredDocuments.filter(doc => doc.type === 'financing'),
    other: filteredDocuments.filter(doc => !['contract', 'inspection', 'financing'].includes(doc.type))
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600 mt-2">Secure document storage and e-signature workflow</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Supports PDF, DOC, DOCX, JPG, PNG files up to 10MB
                  </p>
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
                      <Plus className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </Label>
                </div>

                {/* Upload Progress */}
                {uploadingFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadingFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                          <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-blue-600">{file.progress}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="signed">Signed</option>
                    <option value="pending">Pending</option>
                    <option value="in-review">In Review</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Documents by Category */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All ({filteredDocuments.length})</TabsTrigger>
                <TabsTrigger value="contracts">Contracts ({documentsByType.contracts.length})</TabsTrigger>
                <TabsTrigger value="inspection">Inspection ({documentsByType.inspection.length})</TabsTrigger>
                <TabsTrigger value="financing">Financing ({documentsByType.financing.length})</TabsTrigger>
                <TabsTrigger value="other">Other ({documentsByType.other.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredDocuments.map((document) => (
                  <Card key={document.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{document.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(document.status)}>
                                {getStatusIcon(document.status)}
                                <span className="ml-1 capitalize">{document.status}</span>
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {document.uploadDate ? new Date(document.uploadDate).toLocaleDateString() : 'Not uploaded'}
                              </span>
                              {document.size && (
                                <span className="text-sm text-gray-500">• {document.size}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(document.id, document.name)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(document.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {document.signatures && document.signatures.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm font-medium text-gray-700 mb-2">Signatures:</p>
                          <div className="flex gap-2">
                            {document.signatures.map((sig, index) => (
                              <Badge 
                                key={index}
                                variant={sig.signed ? "default" : "secondary"}
                                className={sig.signed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                              >
                                {sig.party} {sig.signed ? '✓' : '○'}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {['contracts', 'inspection', 'financing', 'other'].map((type) => (
                <TabsContent key={type} value={type} className="space-y-4">
                  {documentsByType[type].map((document) => (
                    <Card key={document.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{document.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getStatusColor(document.status)}>
                                  {getStatusIcon(document.status)}
                                  <span className="ml-1 capitalize">{document.status}</span>
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {document.uploadDate ? new Date(document.uploadDate).toLocaleDateString() : 'Not uploaded'}
                                </span>
                                {document.size && (
                                  <span className="text-sm text-gray-500">• {document.size}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleDownload(document.id, document.name)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(document.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Document Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Signed</span>
                    </div>
                    <span className="font-semibold">{documents.filter(d => d.status === 'signed').length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <span className="font-semibold">{documents.filter(d => d.status === 'pending').length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">In Review</span>
                    </div>
                    <span className="font-semibold">{documents.filter(d => d.status === 'in-review').length}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Documents</span>
                    <span className="font-bold">{documents.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>SOC 2 Type II compliant</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Attorney-client privilege protected</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Automatic backup & versioning</span>
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
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Request Document
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Folder className="h-4 w-4 mr-2" />
                    Organize Folders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentManagementPage;

