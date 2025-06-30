import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Skeleton
} from '@mui/material';
import {
  Chat as MessageSquareIcon,
  Send as SendIcon,
  AttachFile as PaperclipIcon,
  Phone as PhoneIcon,
  VideoCall as VideoIcon,
  MoreVert as MoreVerticalIcon,
  Search as SearchIcon,
  Add as PlusIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Person as UserIcon,
  Gavel as ScaleIcon,
  Home as HomeIcon,
  Description as FileTextIcon,
  Event as CalendarIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { messageService, attorneyService } from '../lib/api';

export function MessagingPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messageService.getConversations();
      setConversations(response.conversations);
      if (response.conversations.length > 0) {
        setSelectedConversation(response.conversations[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await messageService.getMessages(conversationId);
      setMessages(response.messages);
      // Mark as read
      await messageService.markAsRead(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    try {
      setSending(true);
      await messageService.sendMessage(selectedConversation.id, newMessage);
      
      // Add message to local state immediately for better UX
      const newMsg = {
        id: Date.now(),
        conversationId: selectedConversation.id,
        senderId: 1, // Current user ID
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      
      // Refresh conversations to update last message
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getParticipantInfo = (conversation, excludeCurrentUser = false) => {
    const currentUserId = 1; // Mock current user ID
    const otherParticipants = conversation.participants.filter(p => 
      excludeCurrentUser ? p.id !== currentUserId : true
    );
    return otherParticipants[0] || conversation.participants[0];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Messages
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Secure communication with your attorney
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ height: 'calc(100vh - 250px)' }}>
        {/* Conversations List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ pb: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MessageSquareIcon />
                  <Typography variant="h6">Conversations</Typography>
                </Box>
                <IconButton size="small">
                  <PlusIcon />
                </IconButton>
              </Box>
              
              <TextField
                fullWidth
                placeholder="Search conversations..."
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </CardContent>
            
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <List sx={{ p: 0 }}>
                {conversations.map((conversation) => {
                  const participant = getParticipantInfo(conversation, true);
                  const isSelected = selectedConversation?.id === conversation.id;
                  
                  return (
                    <ListItem
                      key={conversation.id}
                      button
                      selected={isSelected}
                      onClick={() => setSelectedConversation(conversation)}
                      sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        '&.Mui-selected': {
                          bgcolor: 'primary.50',
                          borderColor: 'primary.main'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={participant.avatar}>
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" noWrap>
                              {participant.name}
                            </Typography>
                            {conversation.unreadCount > 0 && (
                              <Badge badgeContent={conversation.unreadCount} color="primary" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                              <Chip label={participant.role} size="small" color="secondary" />
                              {conversation.transactionId && (
                                <Chip 
                                  icon={<HomeIcon />} 
                                  label="Transaction" 
                                  size="small" 
                                  variant="outlined" 
                                />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {conversation.lastMessage?.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(conversation.lastMessage?.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Card>
        </Grid>

        {/* Chat Area */}
        <Grid size={{ xs: 12, md: 8 }}>
          {selectedConversation ? (
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Chat Header */}
              <CardContent sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={getParticipantInfo(selectedConversation, true).avatar}>
                      {getParticipantInfo(selectedConversation, true).name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    
                    <Box>
                      <Typography variant="h6">
                        {getParticipantInfo(selectedConversation, true).name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={getParticipantInfo(selectedConversation, true).role} 
                          size="small" 
                          color="secondary" 
                        />
                        <Typography variant="caption" color="success.main">
                          Online
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton>
                      <PhoneIcon />
                    </IconButton>
                    <IconButton>
                      <VideoIcon />
                    </IconButton>
                    <IconButton>
                      <MoreVerticalIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {messages.map((message) => {
                  const isCurrentUser = message.senderId === 1; // Mock current user ID
                  const sender = selectedConversation.participants.find(p => p.id === message.senderId);
                  
                  return (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                        mb: 2
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        maxWidth: '70%',
                        flexDirection: isCurrentUser ? 'row-reverse' : 'row'
                      }}>
                        {!isCurrentUser && (
                          <Avatar sx={{ width: 32, height: 32 }} src={sender?.avatar}>
                            {sender?.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        )}
                        
                        <Paper
                          sx={{
                            p: 1.5,
                            bgcolor: isCurrentUser ? 'primary.main' : 'grey.100',
                            color: isCurrentUser ? 'primary.contrastText' : 'text.primary'
                          }}
                        >
                          <Typography variant="body2">
                            {message.content}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: isCurrentUser ? 'primary.50' : 'text.secondary',
                              display: 'block',
                              mt: 0.5
                            }}
                          >
                            {formatTime(message.timestamp)}
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Box sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                  <IconButton>
                    <PaperclipIcon />
                  </IconButton>
                  
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                    size="small"
                  />
                  
                  <IconButton 
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                  >
                    {sending ? (
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        border: 2, 
                        borderColor: 'primary.main',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }} />
                    ) : (
                      <SendIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ) : (
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <MessageSquareIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography color="text.secondary">
                  Choose a conversation from the list to start messaging
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Quick Actions */}
      {selectedConversation && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ScaleIcon />
              <Typography variant="h6">Transaction Quick Actions</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<FileTextIcon />}
                >
                  View Contract
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<CalendarIcon />}
                >
                  Schedule Meeting
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<ClockIcon />}
                >
                  Check Timeline
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<CheckCircleIcon />}
                >
                  Update Status
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default MessagingPage;

