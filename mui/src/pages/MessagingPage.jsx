import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  IconButton,
  Badge,
  Chip,
  Container
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  MoreVert as MoreVertIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

export function MessagingPage() {
  const { user, logout } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Attorney',
      lastMessage: 'The contract review is complete. I have a few minor suggestions.',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Attorney',
      lastMessage: 'Perfect! The inspection report looks good. Ready to proceed.',
      timestamp: '1 hour ago',
      unread: 0,
      online: true,
      avatar: 'MC'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Attorney',
      lastMessage: 'I\'ll review the financing documents and get back to you by tomorrow.',
      timestamp: '3 hours ago',
      unread: 1,
      online: false,
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'Agent Free Support',
      role: 'Support Team',
      lastMessage: 'Welcome to Agent Free! How can we help you today?',
      timestamp: '1 day ago',
      unread: 0,
      online: true,
      avatar: 'AF'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      content: 'Hi! I\'ve completed the initial review of your purchase agreement.',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      content: 'Great! What are your thoughts?',
      timestamp: '10:32 AM',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      content: 'Overall it looks very good. I have a few minor suggestions that could strengthen your position.',
      timestamp: '10:35 AM',
      isOwn: false
    },
    {
      id: 4,
      sender: 'Sarah Johnson',
      content: 'Would you like to schedule a call to discuss the details?',
      timestamp: '10:36 AM',
      isOwn: false
    },
    {
      id: 5,
      sender: 'You',
      content: 'Yes, that would be perfect. When are you available?',
      timestamp: '10:38 AM',
      isOwn: true
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Shared Sidebar */}
      <Sidebar user={user} onSignOut={logout} />
      
      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: '280px' }}>
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Messages
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Communicate with attorneys and transaction participants
            </Typography>
          </Box>

          {/* Messaging Interface */}
          <Card elevation={2} sx={{ height: 'calc(100vh - 200px)' }}>
            <Box sx={{ display: 'flex', height: '100%' }}>
              {/* Conversations List */}
              <Box sx={{ width: 350, borderRight: 1, borderColor: 'divider' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Conversations
                  </Typography>
                </Box>
                <List sx={{ p: 0, height: 'calc(100% - 80px)', overflow: 'auto' }}>
                  {conversations.map((conversation, index) => (
                    <React.Fragment key={conversation.id}>
                      <ListItem
                        button
                        selected={selectedConversation === index}
                        onClick={() => setSelectedConversation(index)}
                        sx={{
                          py: 2,
                          '&.Mui-selected': {
                            bgcolor: 'primary.light',
                            '&:hover': {
                              bgcolor: 'primary.light',
                            },
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              conversation.online ? (
                                <CircleIcon sx={{ fontSize: 12, color: 'success.main' }} />
                              ) : null
                            }
                          >
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {conversation.avatar}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {conversation.name}
                              </Typography>
                              {conversation.unread > 0 && (
                                <Badge badgeContent={conversation.unread} color="primary" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Chip label={conversation.role} size="small" variant="outlined" sx={{ mb: 0.5 }} />
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {conversation.lastMessage}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {conversation.timestamp}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < conversations.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>

              {/* Chat Area */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {conversations[selectedConversation]?.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {conversations[selectedConversation]?.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircleIcon 
                          sx={{ 
                            fontSize: 8, 
                            color: conversations[selectedConversation]?.online ? 'success.main' : 'grey.400',
                            mr: 0.5 
                          }} 
                        />
                        <Typography variant="caption" color="text.secondary">
                          {conversations[selectedConversation]?.online ? 'Online' : 'Offline'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton color="primary">
                      <PhoneIcon />
                    </IconButton>
                    <IconButton color="primary">
                      <VideoCallIcon />
                    </IconButton>
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, p: 2, overflow: 'auto', bgcolor: 'grey.50' }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          bgcolor: message.isOwn ? 'primary.main' : 'white',
                          color: message.isOwn ? 'white' : 'text.primary',
                        }}
                      >
                        <Typography variant="body1">
                          {message.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 1,
                            opacity: 0.7,
                          }}
                        >
                          {message.timestamp}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      multiline
                      maxRows={3}
                    />
                    <IconButton color="primary">
                      <AttachFileIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}

export default MessagingPage;

