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
  ChevronLeft,
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
  X,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  Timer,
  MapPin as LocationIcon,
  Repeat,
  UserPlus,
  Send
} from 'lucide-react';
import { AttorneyService } from '../lib/api';

const AttorneyCalendarPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'consultation',
    client: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    description: '',
    priority: 'medium',
    recurring: false
  });

  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        const attorneyService = new AttorneyService();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Mock calendar events data
        const mockEvents = [
          {
            id: '1',
            title: 'Client Consultation - Michelle Lee',
            type: 'consultation',
            client: 'Michelle Lee',
            date: '2024-05-02',
            time: '10:00',
            duration: 60,
            location: 'Office Conference Room A',
            description: 'Initial consultation for purchase agreement review',
            priority: 'high',
            status: 'confirmed',
            attendees: ['Michelle Lee', 'Sarah Johnson'],
            recurring: false
          },
          {
            id: '2',
            title: 'Contract Review - Robert Chen',
            type: 'review',
            client: 'Robert Chen',
            date: '2024-05-03',
            time: '14:00',
            duration: 45,
            location: 'Virtual Meeting',
            description: 'Review contract amendments and negotiate terms',
            priority: 'medium',
            status: 'confirmed',
            attendees: ['Robert Chen', 'Sarah Johnson'],
            recurring: false
          },
          {
            id: '3',
            title: 'Closing Preparation - Jennifer Walsh',
            type: 'closing',
            client: 'Jennifer Walsh',
            date: '2024-05-06',
            time: '09:00',
            duration: 90,
            location: 'Title Company Office',
            description: 'Final closing preparation and document review',
            priority: 'urgent',
            status: 'confirmed',
            attendees: ['Jennifer Walsh', 'Title Officer', 'Sarah Johnson'],
            recurring: false
          },
          {
            id: '4',
            title: 'Team Meeting',
            type: 'meeting',
            client: null,
            date: '2024-05-07',
            time: '11:00',
            duration: 30,
            location: 'Main Conference Room',
            description: 'Weekly team sync and case updates',
            priority: 'low',
            status: 'confirmed',
            attendees: ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez'],
            recurring: true
          },
          {
            id: '5',
            title: 'Property Inspection - Daniel Martinez',
            type: 'inspection',
            client: 'Daniel Martinez',
            date: '2024-05-08',
            time: '15:30',
            duration: 120,
            location: '321 Maple Street, San Jose',
            description: 'Attend property inspection with client',
            priority: 'medium',
            status: 'pending',
            attendees: ['Daniel Martinez', 'Inspector', 'Sarah Johnson'],
            recurring: false
          }
        ];
        
        setEvents(mockEvents);
        setUpcomingEvents(mockEvents.filter(event => new Date(event.date) >= new Date()).slice(0, 5));
      } catch (error) {
        console.error('Error loading calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCalendarData();
  }, [currentDate]);

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
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review': return 'bg-green-100 text-green-800 border-green-200';
      case 'closing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'meeting': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'inspection': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled': return <CalendarX className="w-4 h-4 text-red-600" />;
      default: return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleCreateEvent = async () => {
    try {
      const attorneyService = new AttorneyService();
      const eventData = {
        ...eventForm,
        datetime: `${eventForm.date}T${eventForm.time}:00`,
        duration: parseInt(eventForm.duration)
      };
      
      await attorneyService.createCalendarEvent(eventData);
      
      // Add to local state
      const newEvent = {
        id: Date.now().toString(),
        ...eventData,
        status: 'confirmed',
        attendees: [user?.name || 'Attorney']
      };
      
      setEvents([...events, newEvent]);
      setShowCreateEvent(false);
      setEventForm({
        title: '',
        type: 'consultation',
        client: '',
        date: '',
        time: '',
        duration: '60',
        location: '',
        description: '',
        priority: 'medium',
        recurring: false
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const EventDetailsModal = () => {
    if (!selectedEvent) return null;

    return (
      <Dialog.Root open={showEventDetails} onOpenChange={setShowEventDetails}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getEventTypeColor(selectedEvent.type)}`}>
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(selectedEvent.type)}`}>
                        {selectedEvent.type}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedEvent.priority)}`}>
                        {selectedEvent.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <Button.Root className="p-2 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </Button.Root>
                </Dialog.Close>
              </div>

              <div className="space-y-6">
                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Date & Time</p>
                        <p className="font-medium">{selectedEvent.date} at {selectedEvent.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Timer className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium">{selectedEvent.duration} minutes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <LocationIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{selectedEvent.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(selectedEvent.status)}
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium capitalize">{selectedEvent.status}</p>
                      </div>
                    </div>
                    
                    {selectedEvent.client && (
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Client</p>
                          <p className="font-medium">{selectedEvent.client}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedEvent.recurring && (
                      <div className="flex items-center space-x-3">
                        <Repeat className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Recurring</p>
                          <p className="font-medium">Weekly</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Attendees */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendees</h3>
                  <div className="space-y-2">
                    {selectedEvent.attendees.map((attendee, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Avatar.Root className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Avatar.Fallback className="text-blue-600 font-medium text-sm">
                            {attendee.split(' ').map(n => n[0]).join('')}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <span className="text-sm text-gray-700">{attendee}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button.Root className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Edit className="w-4 h-4" />
                      <span>Edit Event</span>
                    </Button.Root>
                    <Button.Root className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Send className="w-4 h-4" />
                      <span>Send Reminder</span>
                    </Button.Root>
                  </div>
                  <Button.Root className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                    <CalendarX className="w-4 h-4" />
                    <span>Cancel Event</span>
                  </Button.Root>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  };

  const CreateEventModal = () => (
    <Dialog.Root open={showCreateEvent} onOpenChange={setShowCreateEvent}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
              <Dialog.Close asChild>
                <Button.Root className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </Button.Root>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <Select.Root value={eventForm.type} onValueChange={(value) => setEventForm({...eventForm, type: value})}>
                    <Select.Trigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <span className="capitalize">{eventForm.type}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Select.Trigger>
                    <Select.Content className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <Select.Item value="consultation" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Consultation</Select.Item>
                      <Select.Item value="review" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Contract Review</Select.Item>
                      <Select.Item value="closing" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Closing</Select.Item>
                      <Select.Item value="meeting" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Meeting</Select.Item>
                      <Select.Item value="inspection" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Inspection</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <Select.Root value={eventForm.priority} onValueChange={(value) => setEventForm({...eventForm, priority: value})}>
                    <Select.Trigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <span className="capitalize">{eventForm.priority}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Select.Trigger>
                    <Select.Content className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <Select.Item value="low" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Low</Select.Item>
                      <Select.Item value="medium" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Medium</Select.Item>
                      <Select.Item value="high" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">High</Select.Item>
                      <Select.Item value="urgent" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Urgent</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client (Optional)</label>
                <input
                  type="text"
                  value={eventForm.client}
                  onChange={(e) => setEventForm({...eventForm, client: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={eventForm.duration}
                    onChange={(e) => setEventForm({...eventForm, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter location or 'Virtual Meeting'"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter event description"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={eventForm.recurring}
                  onChange={(e) => setEventForm({...eventForm, recurring: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700">Recurring event (weekly)</label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <Button.Root 
                onClick={() => setShowCreateEvent(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Button.Root>
              <Button.Root 
                onClick={handleCreateEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Event
              </Button.Root>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );

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
            <Link to="/attorney-clients" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors">
              <Users className="w-5 h-5" />
              <span>Client Management</span>
            </Link>
            <Link to="/attorney-calendar" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-800 text-white">
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
              <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
              <p className="text-gray-600">Manage your schedule and appointments</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button.Root 
                onClick={() => setShowCreateEvent(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>New Event</span>
              </Button.Root>
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Calendar Main Area */}
          <div className="flex-1 p-6">
            {/* Calendar Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button.Root 
                    onClick={handlePrevMonth}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button.Root>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <Button.Root 
                    onClick={handleNextMonth}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button.Root>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select.Root value={viewMode} onValueChange={setViewMode}>
                    <Select.Trigger className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <span className="capitalize">{viewMode}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Select.Trigger>
                    <Select.Content className="bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <Select.Item value="month" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Month</Select.Item>
                      <Select.Item value="week" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Week</Select.Item>
                      <Select.Item value="day" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Day</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <div key={day} className="p-4 text-center text-sm font-medium text-gray-700 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {getDaysInMonth(currentDate).map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[120px] p-2 border-r border-b border-gray-200 ${
                      day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                    }`}
                  >
                    {day && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${
                            day === new Date().getDate() && 
                            currentDate.getMonth() === new Date().getMonth() && 
                            currentDate.getFullYear() === new Date().getFullYear()
                              ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                              : 'text-gray-700'
                          }`}>
                            {day}
                          </span>
                        </div>
                        
                        {/* Events for this day */}
                        <div className="space-y-1">
                          {getEventsForDate(day).map((event) => (
                            <div
                              key={event.id}
                              onClick={() => handleEventClick(event)}
                              className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getEventTypeColor(event.type)}`}
                            >
                              <div className="font-medium truncate">{event.time}</div>
                              <div className="truncate">{event.title}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Upcoming Events */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{event.date} at {event.time}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                            {event.type}
                          </span>
                          {event.priority === 'urgent' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                              {event.priority}
                            </span>
                          )}
                        </div>
                      </div>
                      {getStatusIcon(event.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Events</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Consultations</span>
                  <span className="font-medium">{events.filter(e => e.type === 'consultation').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reviews</span>
                  <span className="font-medium">{events.filter(e => e.type === 'review').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Closings</span>
                  <span className="font-medium">{events.filter(e => e.type === 'closing').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EventDetailsModal />
      <CreateEventModal />
    </div>
  );
};

export default AttorneyCalendarPage;

