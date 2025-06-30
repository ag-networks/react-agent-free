import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { attorneyService } from '../lib/api';
import { 
  ArrowLeft, 
  MessageSquare, 
  Video, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  Calendar,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

export function AttorneyWorkflowPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Dashboards');

  // Mock data matching the design
  const pendingConsultations = [
    {
      id: 1,
      name: 'Michelle Lee',
      address: '3111.7 Frencq, TA Argelle, CA',
      status: 'Under Contract',
      stage: 'Pretice',
      action: 'Approve'
    },
    {
      id: 2,
      name: 'Robert Chen',
      address: '201.500 Durf Lateain, TX',
      status: 'Per approval',
      stage: 'fintaice',
      action: 'Review'
    }
  ];

  const contractReviews = [
    {
      id: 1,
      name: 'Daniel Martinez',
      address: '2018.1Htrm JU. Ireican, TI',
      status: 'Caving',
      stage: 'Pitgei',
      action: 'Checkilld'
    },
    {
      id: 2,
      name: 'Sarah Green',
      address: '13.8991 5irb Evervea, CO',
      status: 'Featuig',
      stage: 'Rotaioia',
      action: 'Approv'
    }
  ];

  const legalTasks = [
    {
      id: 1,
      task: 'Conduct legal review',
      date: 'Apr 24',
      status: 'pending'
    },
    {
      id: 2,
      task: 'Obtain client approval',
      date: 'Apr 25',
      status: 'completed'
    }
  ];

  const documentTemplates = [
    { name: 'Contact', status: '--' },
    { name: 'Amendment', status: '--' },
    { name: 'Agreement', status: '--' },
    { name: 'Addendum', status: '--' },
    { name: 'Bill of Sails', status: '--' }
  ];

  const calendarEvents = [
    { date: 11, event: 'Cillets Complrtion' },
    { date: 15, event: 'Difering Quemion' }
  ];

  const tabs = ['Dashboards', 'Contitutions', 'Contacts', 'Documents', 'Documents', 'Tasks'];

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <div className="text-white text-sm font-bold">⚖</div>
              </div>
              <h1 className="text-2xl font-bold">
                <span className="text-blue-600">Agent</span>
                <span className="text-black">Workflow</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Video className="w-4 h-4" />
              <span>Start Video Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pending Client Consultations */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Pending Client Consultations</h2>
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                        Deteutinge
                      </button>
                      <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingConsultations.map((consultation) => (
                      <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{consultation.name}</h3>
                          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{consultation.address}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{consultation.status}</p>
                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                              {consultation.stage}
                            </span>
                          </div>
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {consultation.action}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contract Reviews */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Contract Reviews</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contractReviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{review.name}</h3>
                          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{review.address}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{review.status}</p>
                            <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              {review.stage}
                            </span>
                          </div>
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {review.action}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legal Tasks */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Legal Tasks</h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {legalTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {task.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="font-medium">{task.task}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{task.date}</span>
                          <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Calendar */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{formatMonth(currentDate)}</h3>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => navigateMonth(-1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigateMonth(1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentDate).map((day, index) => (
                      <div key={index} className="aspect-square flex items-center justify-center text-sm">
                        {day && (
                          <div className="w-full h-full flex flex-col items-center justify-center relative">
                            <span className={`${day === 11 || day === 15 ? 'font-semibold' : ''}`}>
                              {day}
                            </span>
                            {calendarEvents.find(event => event.date === day) && (
                              <div className="absolute bottom-0 left-0 right-0">
                                <div className="text-xs text-blue-600 truncate px-1">
                                  {calendarEvents.find(event => event.date === day)?.event}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legal Document Templates */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Legal Document Templates</h3>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    {documentTemplates.map((template, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{template.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{template.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

