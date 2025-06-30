import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Link } from 'react-router-dom';
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
  Scale
} from 'lucide-react';
import '../App.css';

export function DashboardPage() {
  const { user, logout } = useAuth();

  const transactions = [
    {
      id: 1,
      property: '123 Oak Street, San Francisco, CA',
      status: 'contract_review',
      progress: 25,
      nextStep: 'Attorney review pending',
      price: '$750,000',
      type: 'purchase'
    },
    {
      id: 2,
      property: '456 Pine Avenue, Oakland, CA',
      status: 'inspection',
      progress: 60,
      nextStep: 'Inspection scheduled for tomorrow',
      price: '$520,000',
      type: 'sale'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'document',
      message: 'Contract uploaded for 123 Oak Street',
      time: '2 hours ago',
      icon: FileText
    },
    {
      id: 2,
      type: 'attorney',
      message: 'Attorney Sarah Johnson assigned to your case',
      time: '1 day ago',
      icon: User
    },
    {
      id: 3,
      type: 'message',
      message: 'New message from your attorney',
      time: '2 days ago',
      icon: MessageSquare
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'contract_review': return 'bg-yellow-100 text-yellow-800';
      case 'inspection': return 'bg-blue-100 text-blue-800';
      case 'financing': return 'bg-purple-100 text-purple-800';
      case 'closing': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'contract_review': return 'Contract Review';
      case 'inspection': return 'Inspection Period';
      case 'financing': return 'Financing';
      case 'closing': return 'Closing Preparation';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 p-6 border-b">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Agent Free</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/properties" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted">
                  <Search className="w-5 h-5" />
                  <span>Property Search</span>
                </Link>
              </li>
              <li>
                <Link to="/contracts" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted">
                  <FileText className="w-5 h-5" />
                  <span>Contracts</span>
                </Link>
              </li>
              <li>
                <Link to="/documents" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted">
                  <FileText className="w-5 h-5" />
                  <span>Documents</span>
                </Link>
              </li>
              <li>
                <Link to="/messages" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted">
                  <MessageSquare className="w-5 h-5" />
                  <span>Messages</span>
                </Link>
              </li>
              <li>
                <Link to="/attorneys" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted">
                  <Scale className="w-5 h-5" />
                  <span>Attorneys</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-xs"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Transaction
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  +1 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$31,000</div>
                <p className="text-xs text-muted-foreground">
                  vs traditional agents
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Process Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28 days</div>
                <p className="text-xs text-muted-foreground">
                  15% faster than average
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">
                  Successful closings
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Transactions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Active Transactions</CardTitle>
                  <CardDescription>
                    Your current real estate transactions and their progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{transaction.property}</h3>
                          <p className="text-sm text-muted-foreground">
                            {transaction.type === 'purchase' ? 'Purchasing' : 'Selling'} • {transaction.price}
                          </p>
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusText(transaction.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{transaction.progress}%</span>
                        </div>
                        <Progress value={transaction.progress} className="h-2" />
                        <p className="text-sm text-muted-foreground flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {transaction.nextStep}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates on your transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{activity.message}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

