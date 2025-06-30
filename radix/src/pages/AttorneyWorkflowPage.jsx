import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Scale, 
  User, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  Phone,
  Video,
  Star,
  Award,
  Briefcase,
  Users,
  TrendingUp,
  DollarSign,
  Home
} from 'lucide-react';
import { attorneyService, transactionService } from '@/lib/api';
import '../App.css';

export function AttorneyWorkflowPage() {
  const navigate = useNavigate();
  const [attorneys, setAttorneys] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAttorney, setSelectedAttorney] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [attorneyResponse, transactionResponse] = await Promise.all([
        attorneyService.getAttorneys(),
        transactionService.getTransactions()
      ]);
      
      setAttorneys(attorneyResponse.attorneys);
      setTransactions(transactionResponse.transactions);
      
      if (attorneyResponse.attorneys.length > 0) {
        setSelectedAttorney(attorneyResponse.attorneys[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleConsultation = async (attorneyId) => {
    try {
      const datetime = new Date();
      datetime.setDate(datetime.getDate() + 7); // Schedule for next week
      await attorneyService.scheduleConsultation(attorneyId, datetime.toISOString());
      alert('Consultation scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling consultation:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Contract':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const calculateTransactionProgress = (transaction) => {
    const steps = ['contract', 'inspection', 'financing', 'closing'];
    const completedSteps = steps.filter(step => transaction.progress[step] === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-96 bg-gray-200 rounded"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Attorney Workflow</h1>
            <p className="text-gray-600 mt-2">Professional legal support and consultation</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attorney List */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Available Attorneys
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {attorneys.map((attorney) => (
                  <Card 
                    key={attorney.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedAttorney?.id === attorney.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAttorney(attorney)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={attorney.avatar} />
                          <AvatarFallback>
                            {attorney.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{attorney.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{attorney.rating}</span>
                            <span className="text-sm text-gray-500">• {attorney.experience}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {attorney.specialties.slice(0, 2).map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{attorney.activeTransactions}</span> active
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{attorney.completedTransactions}</span> completed
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Attorney Details & Workflow */}
          <div className="lg:col-span-2 space-y-6">
            {selectedAttorney ? (
              <>
                {/* Attorney Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Attorney Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedAttorney.avatar} />
                        <AvatarFallback className="text-lg">
                          {selectedAttorney.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedAttorney.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{selectedAttorney.rating}</span>
                          </div>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">{selectedAttorney.experience} experience</span>
                        </div>
                        
                        <p className="text-gray-600 mt-2">{selectedAttorney.bio}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedAttorney.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                          <Button 
                            onClick={() => handleScheduleConsultation(selectedAttorney.id)}
                            className="flex items-center gap-2"
                          >
                            <Calendar className="h-4 w-4" />
                            Schedule Consultation
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Send Message
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Attorney Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">{selectedAttorney.activeTransactions}</div>
                        <div className="text-sm text-gray-600">Active Cases</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">{selectedAttorney.completedTransactions}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-600">{selectedAttorney.rating}</div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-600">{selectedAttorney.experience}</div>
                        <div className="text-sm text-gray-600">Experience</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5" />
                      Active Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.filter(t => t.attorney.id === selectedAttorney.id).map((transaction) => {
                        const progress = calculateTransactionProgress(transaction);
                        
                        return (
                          <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900">{transaction.propertyAddress}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge className={getStatusColor(transaction.status)}>
                                      {transaction.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                      {transaction.clientRole === 'buyer' ? 'Buyer' : 'Seller'}
                                    </span>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-medium text-gray-700">Progress</span>
                                      <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                    <div>
                                      <span className="text-gray-600">Purchase Price:</span>
                                      <span className="font-medium ml-1">
                                        ${transaction.purchasePrice.toLocaleString()}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Closing Date:</span>
                                      <span className="font-medium ml-1">
                                        {new Date(transaction.timeline.closingDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 ml-4">
                                  <Button size="sm" variant="outline">
                                    <FileText className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                    Message
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Timeline Steps */}
                              <div className="mt-4 pt-4 border-t">
                                <div className="grid grid-cols-4 gap-2">
                                  {Object.entries(transaction.progress).map(([step, status]) => (
                                    <div key={step} className="text-center">
                                      <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                                        status === 'completed' ? 'bg-green-500 text-white' :
                                        status === 'in-progress' ? 'bg-blue-500 text-white' :
                                        'bg-gray-200 text-gray-600'
                                      }`}>
                                        {status === 'completed' ? (
                                          <CheckCircle className="h-4 w-4" />
                                        ) : status === 'in-progress' ? (
                                          <Clock className="h-4 w-4" />
                                        ) : (
                                          <div className="w-2 h-2 bg-current rounded-full" />
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-600 capitalize">{step}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Scale className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select an Attorney
                  </h3>
                  <p className="text-gray-600">
                    Choose an attorney from the list to view their profile and workflow
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttorneyWorkflowPage;

