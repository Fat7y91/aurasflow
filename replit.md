# AurasFlow - AI Design Generator

## Overview

AurasFlow is a Flask-based web application that generates marketing design concepts using AI (OpenAI/DeepSeek). The application provides a multilingual interface (English and Arabic) where users can describe their desired marketing designs and receive AI-generated design concepts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Template Engine**: Jinja2 (Flask's default templating engine)
- **Styling**: Custom CSS with responsive design and RTL (right-to-left) support
- **UI Framework**: Custom CSS with Font Awesome icons for visual elements
- **Multilingual Support**: Server-side language switching with session-based language persistence

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Session Management**: Flask sessions with secret key configuration
- **API Integration**: OpenAI Python client for AI text generation
- **Configuration**: Environment variables using python-dotenv
- **Logging**: Python's built-in logging module configured for debugging

## Key Components

### Core Application (`app.py`)
- **Route Handlers**: Manages web requests and responses
- **Session Management**: Handles user language preferences
- **AI Integration**: Interfaces with OpenAI/DeepSeek API for design generation
- **Internationalization**: Built-in translation system with English and Arabic support

### Templates (`templates/index.html`)
- **Responsive Design**: Mobile-friendly interface
- **Bilingual Support**: Dynamic content rendering based on user language preference
- **Form Handling**: User input collection for design prompts

### Styling (`static/style.css`)
- **Modern UI**: Gradient backgrounds and rounded corners
- **RTL Support**: Proper text direction and layout for Arabic language
- **Responsive Layout**: Flexible design that works across different screen sizes

### Application Entry Point (`main.py`)
- **Development Server**: Simple Flask application runner

## Data Flow

1. **User Request**: User accesses the application and selects language preference
2. **Session Storage**: Language preference stored in Flask session
3. **Form Submission**: User enters design description and submits form
4. **AI Processing**: Application sends prompt to OpenAI/DeepSeek API
5. **Response Handling**: AI-generated design concept returned to user
6. **Result Display**: Design concept rendered in user's preferred language

## External Dependencies

### AI Services
- **OpenAI API**: Primary AI service for design concept generation
- **DeepSeek API**: Alternative AI service (fallback option)
- **Authentication**: API key-based authentication stored in environment variables

### Frontend Libraries
- **Font Awesome**: Icon library for UI elements
- **CDN Delivery**: External CDN for icon resources

### Python Packages
- **Flask**: Web application framework
- **OpenAI**: Official OpenAI Python client
- **python-dotenv**: Environment variable management

## Deployment Strategy

### Environment Configuration
- **API Keys**: Supports both OPENAI_API_KEY and DEEPSEEK_API_KEY environment variables
- **Session Security**: Configurable session secret key via SESSION_SECRET environment variable
- **Development Mode**: Flask development server for local testing

### Static Assets
- **CSS Files**: Served directly through Flask's static file handling
- **External Resources**: Font Awesome loaded from CDN

### Error Handling
- **API Failures**: Graceful error handling for AI service unavailability
- **Input Validation**: Client and server-side validation for user inputs
- **Logging**: Debug-level logging for troubleshooting

### Scalability Considerations
- **Session-based State**: Minimal server-side state storage
- **Stateless Design**: Each request is independent, suitable for horizontal scaling
- **External API Dependency**: Performance dependent on AI service response times