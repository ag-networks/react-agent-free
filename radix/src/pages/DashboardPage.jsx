import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Bell,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  User,
  Search,
  Scale,
  Upload,
  Phone,
  Video
} from 'lucide-react';
import '../App.css';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Transaction Overview Data matching the design
  const transactionOverview = [
    {
      title: 'Contract Review',
      amount: '$550,000',
      status: 'active'
    },
    {
      title: 'Inspection Period',
      amount: '$325,000',
      status: 'active'
    },
    {
      title: 'Financing',
      amount: '$45,000',
      progress: 75,
      status: 'in-progress'
    },
    {
      title: 'Closing Preparation',
      amount: '$550,000',
      status: 'pending'
    }
  ];

  // Transaction Timeline matching the design
  const transactionTimeline = [
    {
      event: 'Contract Accepted',
      date: 'May 2, 2024',
      status: 'completed'
    },
    {
      event: 'Inspection Ends',
      date: 'May 9, 2024',
      status: 'completed'
    },
    {
      event: 'Financing',
      date: '40% complete',
      status: 'in-progress'
    },
    {
      event: 'Apprebal',
      date: 'May 15, 2024',
      status: 'pending'
    },
    {
      event: 'Closing Date',
      date: 'May 30, 2024',
      status: 'pending'
    }
  ];

  // Recent Activity matching the design
  const recentActivity = [
    {
      id: 1,
      name: 'Alice Jennings',
      action: 'Anrriee keurrecompleted',
      avatar: 'A+'
    },
    {
      id: 2,
      name: 'Purchase agreement',
      action: 'Tegract',
      avatar: 'A+'
    }
  ];

  const sidebarItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard', active: true },
    { name: 'My Transactions', icon: FileText, path: '/properties' },
    { name: 'Documents', icon: FileText, path: '/documents' },
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
            <h1 className="text-3xl font-bold text-gray-900">Transaction Overview</h1>
          </div>

          {/* Transaction Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {transactionOverview.map((transaction, index) => (
              <Card key={index} className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {transaction.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {transaction.amount}
                    </p>
                    {transaction.progress && (
                      <div className="space-y-1">
                        <Progress value={transaction.progress} className="h-2" />
                        <p className="text-sm text-gray-600">{transaction.progress}%</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Transaction Timeline */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Transaction Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {transactionTimeline.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'completed' ? 'bg-blue-600' :
                        item.status === 'in-progress' ? 'bg-blue-400' :
                        'bg-gray-300'
                      }`} />
                      <div className="flex-1 flex justify-between items-center">
                        <span className="font-medium text-gray-900">{item.event}</span>
                        <span className="text-sm text-gray-600">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {activity.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.name}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Deviow
                      </Button>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <Phone className="w-4 h-4 mr-2" />
                        Schedule Call
                      </Button>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Direct Campage
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

