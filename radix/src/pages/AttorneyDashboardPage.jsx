import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as Tabs from '@radix-ui/react-tabs';
import * as Avatar from '@radix-ui/react-avatar';
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
  TrendingUp,
  Users,
  FileCheck,
  Timer,
  Star
} from 'lucide-react';
import { AttorneyService } from '../lib/api';

const AttorneyDashboardPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboards');
  const [consultations, setConsultations] = useState([]);
  const [contractReviews, setContractReviews] = useState([]);
  const [legalTasks, setLegalTasks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttorneyData = async () => {
      try {
        const attorneyService = new AttorneyService();
        const [consultationsData, reviewsData, tasksData, templatesData] = await Promise.all([
          attorneyService.getPendingConsultations(),
          attorneyService.getContractReviews(),
          attorneyService.getLegalTasks(),
          attorneyService.getDocumentTemplates()
        ]);
        
        setConsultations(consultationsData.consultations || []);
        setContractReviews(reviewsData.reviews || []);
        setLegalTasks(tasksData.tasks || []);
        setTemplates(templatesData.templates || []);
      } catch (error) {
        console.error('Error loading attorney data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttorneyData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'review': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scale className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Agent Workflow</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button.Root className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </Button.Root>
            <Button.Root className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Video className="w-4 h-4" />
              <span>Start Video Call</span>
            </Button.Root>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Tabs.List className="flex border-b border-gray-200 bg-white px-6">
          <Tabs.Trigger 
            value="dashboards" 
            className="px-4 py-3 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
          >
            Dashboards
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="consultations" 
            className="px-4 py-3 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
          >
            Consultations
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="contacts" 
            className="px-4 py-3 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
          >
            Contacts
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="documents" 
            className="px-4 py-3 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
          >
            Documents
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="tasks" 
            className="px-4 py-3 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
          >
            Tasks
          </Tabs.Trigger>
        </Tabs.List>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            <Tabs.Content value="dashboards" className="space-y-6">
              {/* Pending Client Consultations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Pending Client Consultations</h2>
                  <div className="flex items-center space-x-2">
                    <Button.Root className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Deuteunge
                    </Button.Root>
                    <Button.Root className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Plus className="w-4 h-4" />
                    </Button.Root>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {consultations.map((consultation) => (
                    <div key={consultation.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{consultation.clientName}</h3>
                          <p className="text-sm text-gray-600">{consultation.address}</p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                              {consultation.status}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.priority)}`}>
                              {consultation.priority}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm text-gray-600">{consultation.type}</span>
                            <Button.Root className="text-blue-600 hover:text-blue-800 transition-colors">
                              {consultation.action}
                            </Button.Root>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Reviews */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contract Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {contractReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{review.clientName}</h3>
                          <p className="text-sm text-gray-600">{review.address}</p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.stage)}`}>
                              {review.stage}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.priority)}`}>
                              {review.priority}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm text-gray-600">{review.type}</span>
                            <Button.Root className="text-blue-600 hover:text-blue-800 transition-colors">
                              {review.action}
                            </Button.Root>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Tasks */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Legal Tasks</h2>
                <div className="space-y-3">
                  {legalTasks.map((task) => (
                    <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${task.completed ? 'bg-green-100' : 'bg-blue-100'}`}>
                            {task.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{task.dueDate}</span>
                          <Button.Root className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                            <Plus className="w-4 h-4" />
                          </Button.Root>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            {/* Calendar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">April 2024</h3>
                <div className="flex space-x-1">
                  <Button.Root className="p-1 text-gray-400 hover:text-gray-600">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </Button.Root>
                  <Button.Root className="p-1 text-gray-400 hover:text-gray-600">
                    <ChevronRight className="w-4 h-4" />
                  </Button.Root>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-sm">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <div key={day} className={`p-2 text-center rounded ${day === 11 || day === 15 ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="text-xs text-blue-600 font-medium">11 Cillets Complrtion</div>
                <div className="text-xs text-blue-600 font-medium">15 Difering Quemion</div>
              </div>
            </div>

            {/* Legal Document Templates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Document Templates</h3>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{template.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">--</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
};

export default AttorneyDashboardPage;

