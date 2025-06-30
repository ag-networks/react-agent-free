# Agent Free Platform - Setup Guide

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Modern web browser

### Choose Your Implementation

#### Option 1: Radix Implementation
```bash
cd radix
pnpm install
pnpm run dev
```
**Access**: http://localhost:5173

#### Option 2: Material-UI Implementation
```bash
cd mui
pnpm install
pnpm run dev
```
**Access**: http://localhost:5174

### Test Credentials
Both implementations use the same authentication:
- **Username**: manusrocks
- **Password**: thankyoumanus

## 📁 Package Contents

### `/radix` - Radix UI Implementation
Complete implementation using Radix UI + shadcn/ui + Tailwind CSS
- Headless components with custom styling
- Maximum design flexibility
- Accessibility-first approach

### `/mui` - Material-UI Implementation
Foundation using Material-UI + Emotion
- Pre-styled Material Design components
- Rapid development approach
- Familiar user interface patterns

### `/design-assets` - UI Design System
- Complete UI mockups (11 screens)
- Brand standards and guidelines
- Design system documentation
- Reference images

### `/documentation` - Project Documentation
- Business analysis and strategy
- Technical architecture
- Implementation roadmap
- Testing guides

### `/testing` - Automation & Testing
- Playwright automation scripts
- Manual testing procedures
- Screenshot capture tools

## 🎯 Implementation Features

### Shared Functionality
Both implementations provide:
- Homepage with value proposition
- User authentication flows
- Protected dashboard interface
- Responsive design
- Mock API services

### Technical Differences

#### Radix Implementation
- **Styling**: Tailwind CSS utility classes
- **Components**: Custom-built with Radix primitives
- **Bundle**: Smaller, tree-shakeable
- **Customization**: Complete control

#### Material-UI Implementation
- **Styling**: Emotion CSS-in-JS
- **Components**: Pre-built Material Design
- **Bundle**: Larger, comprehensive
- **Customization**: Theme-based

## 🔧 Development Commands

### Available Scripts (Both Implementations)
```bash
pnpm run dev          # Development server
pnpm run build        # Production build
pnpm run preview      # Preview build
pnpm run lint         # Code linting
```

### Testing Scripts
```bash
cd testing/
python3 simple_automation_test.py    # Basic testing
python3 agent_free_automation_test.py # Comprehensive testing
```

## 📊 Evaluation Criteria

### Consider When Choosing:

#### Team Factors
- CSS/styling expertise level
- Development timeline constraints
- Long-term maintenance preferences
- Design system requirements

#### Project Factors
- Target audience preferences
- Brand customization needs
- Performance requirements
- Accessibility standards

#### Technical Factors
- Bundle size constraints
- Development velocity needs
- Component library preferences
- Styling approach comfort

## 🎨 Design System Consistency

Both implementations follow the same design principles:
- Consistent color palette and typography
- Identical user flows and interactions
- Same responsive breakpoints
- Unified brand messaging

The visual output should be nearly identical regardless of implementation choice.

## 🚀 Next Steps

1. **Run both implementations** locally
2. **Test user flows** with provided credentials
3. **Evaluate development experience** for your team
4. **Gather stakeholder feedback** on interface preferences
5. **Make implementation decision** based on project needs
6. **Continue development** with chosen approach

## 🆘 Troubleshooting

### Common Issues
- **Port conflicts**: Modify port in vite.config.js
- **Node version**: Ensure Node.js 18+ is installed
- **Package installation**: Try `rm -rf node_modules && pnpm install`
- **Build errors**: Check browser console for details

### Getting Help
- Review component documentation in source code
- Check browser developer tools for errors
- Test with provided credentials
- Refer to comprehensive documentation

---

Both implementations provide the same Agent Free platform functionality with different technical approaches. Choose the one that best aligns with your team's expertise and project requirements.

