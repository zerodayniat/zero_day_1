# Voice AI Assistant

A modern, secure voice-enabled AI assistant that supports multiple languages and voices. Features speech recognition, text-to-speech, and a secure backend proxy for API calls.

## 🚀 Features

- **Voice Recognition**: Speak to the AI in multiple languages
- **Text-to-Speech**: AI responses are spoken back with customizable voice settings
- **Multi-language Support**: 20+ languages including English, Spanish, French, German, Chinese, Arabic, and more
- **Secure Architecture**: API keys are safely stored on the backend server
- **Real-time Conversation**: Instant responses with conversation history
- **Customizable Voice Settings**: Adjust speed, pitch, and voice selection
- **Responsive Design**: Works on desktop and mobile devices

## 🛡️ Security

This application uses a secure backend proxy to protect API keys:
- ✅ API keys are stored as environment variables on the server
- ✅ Frontend never exposes sensitive credentials
- ✅ CORS-enabled for cross-origin requests
- ✅ Input validation and error handling

## 🏗️ Architecture

```
Frontend (HTML/CSS/JS) → Backend Server (Node.js) → OpenRouter API
```

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks required)
- **Backend**: Node.js HTTP server with no external dependencies
- **API**: OpenRouter for AI model access

## 📋 Prerequisites

- Node.js 14.0.0 or higher
- OpenRouter API key ([Get one here](https://openrouter.ai/))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/voice-ai-assistant.git
cd voice-ai-assistant
```

### 2. Set Environment Variables

**Windows (PowerShell):**
```powershell
$env:OPENROUTER_API_KEY="your-openrouter-api-key-here"
```

**Windows (Command Prompt):**
```cmd
set OPENROUTER_API_KEY=your-openrouter-api-key-here
```

**Linux/Mac:**
```bash
export OPENROUTER_API_KEY="your-openrouter-api-key-here"
```

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:8787`

### 4. Open the Application

Open `index.html` in your web browser or serve it through a local server.

## 🌐 Deployment

### Deploy to Render

1. Fork this repository
2. Connect your GitHub account to [Render](https://render.com)
3. Create a new Web Service
4. Set the environment variable `OPENROUTER_API_KEY`
5. Deploy!

### Deploy to Railway

1. Fork this repository
2. Connect to [Railway](https://railway.app)
3. Add environment variable `OPENROUTER_API_KEY`
4. Deploy automatically

### Deploy to Fly.io

1. Install Fly CLI
2. Run `fly launch`
3. Set secrets: `fly secrets set OPENROUTER_API_KEY=your-key`
4. Deploy: `fly deploy`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |
| `PORT` | Server port (default: 8787) | No |
| `HTTP_REFERER` | Referer header for API calls | No |
| `X_TITLE` | Title header for API calls | No |

### API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/chat` - Chat completion endpoint

### Request Format

```json
{
  "message": "Hello, how are you?"
}
```

### Response Format

```json
{
  "choices": [
    {
      "message": {
        "content": "I'm doing well, thank you for asking!"
      }
    }
  ]
}
```

## 🎯 Usage

1. **Text Input**: Type your message and click Send or press Enter
2. **Voice Input**: Click the microphone button and speak
3. **Voice Settings**: Adjust language, voice, speed, and pitch
4. **Controls**: Stop speech or clear conversation history

## 🔍 Troubleshooting

### Common Issues

**"Server error! status: 500"**
- Check that your `OPENROUTER_API_KEY` is set correctly
- Verify the server is running on the correct port

**"Please make sure the server is running"**
- Start the backend server with `npm start`
- Check that port 8787 is not blocked

**Voice recognition not working**
- Ensure you're using HTTPS or localhost
- Grant microphone permissions in your browser
- Check browser compatibility (Chrome/Edge recommended)

**No voices available**
- Wait for voices to load (they load asynchronously)
- Try refreshing the page
- Check browser speech synthesis support

## 🌟 Browser Compatibility

- ✅ Chrome 25+
- ✅ Firefox 49+
- ✅ Safari 14.1+
- ✅ Edge 79+

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the browser console for errors
3. Open an issue on GitHub

## 🔮 Future Enhancements

- [ ] User authentication
- [ ] Conversation persistence
- [ ] Multiple AI model support
- [ ] Voice cloning capabilities
- [ ] Mobile app version
- [ ] Offline mode support

---

**⚠️ Important**: Never commit API keys to version control. Always use environment variables for sensitive data.