# Deployment Guide

This guide covers deploying the Voice AI Assistant to various hosting platforms.

## 🚀 Quick Deploy Options

### 1. Render (Recommended)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Fork this repository to your GitHub account
2. Go to [Render](https://render.com) and sign up/login
3. Click "New +" → "Web Service"
4. Connect your GitHub account and select this repository
5. Configure:
   - **Name**: `voice-ai-assistant`
   - **Environment**: `Node`
   - **Build Command**: `npm install` (leave empty if no dependencies)
   - **Start Command**: `npm start`
6. Add Environment Variable:
   - **Key**: `OPENROUTER_API_KEY`
   - **Value**: Your OpenRouter API key
7. Click "Create Web Service"

### 2. Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

1. Fork this repository
2. Go to [Railway](https://railway.app)
3. Click "Deploy from GitHub repo"
4. Select your forked repository
5. Add environment variable:
   - `OPENROUTER_API_KEY=your-api-key-here`
6. Deploy automatically

### 3. Fly.io

1. Install [Fly CLI](https://fly.io/docs/getting-started/installing-flyctl/)
2. Login: `fly auth login`
3. In your project directory: `fly launch`
4. Set your API key: `fly secrets set OPENROUTER_API_KEY=your-api-key-here`
5. Deploy: `fly deploy`

### 4. Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variable:
   ```bash
   heroku config:set OPENROUTER_API_KEY=your-api-key-here
   ```
5. Deploy:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### 5. Vercel

1. Install [Vercel CLI](https://vercel.com/cli): `npm i -g vercel`
2. In your project directory: `vercel`
3. Follow the prompts
4. Set environment variable in Vercel dashboard:
   - Go to your project settings
   - Add `OPENROUTER_API_KEY` in Environment Variables

### 6. Netlify

1. Build the project locally or use Netlify's build process
2. Deploy to [Netlify](https://netlify.com)
3. Set environment variables in Netlify dashboard
4. Configure redirects for API routes

## 🐳 Docker Deployment

### Local Docker

```bash
# Build the image
docker build -t voice-ai-assistant .

# Run the container
docker run -p 8787:8787 -e OPENROUTER_API_KEY=your-api-key-here voice-ai-assistant
```

### Docker Compose

```bash
# Set your API key in .env file
echo "OPENROUTER_API_KEY=your-api-key-here" > .env

# Start the application
docker-compose up -d
```

### Docker Hub

```bash
# Tag and push to Docker Hub
docker tag voice-ai-assistant yourusername/voice-ai-assistant
docker push yourusername/voice-ai-assistant
```

## ☁️ Cloud Platform Deployment

### AWS (EC2)

1. Launch an EC2 instance (Ubuntu 20.04 LTS recommended)
2. SSH into your instance
3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/voice-ai-assistant.git
   cd voice-ai-assistant
   ```
5. Set environment variable:
   ```bash
   export OPENROUTER_API_KEY=your-api-key-here
   ```
6. Start the application:
   ```bash
   npm start
   ```
7. Configure security group to allow port 8787

### Google Cloud Platform (Cloud Run)

1. Build and push to Google Container Registry:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/voice-ai-assistant
   ```
2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy --image gcr.io/PROJECT-ID/voice-ai-assistant --platform managed --set-env-vars OPENROUTER_API_KEY=your-api-key-here
   ```

### Azure (Container Instances)

```bash
az container create \
  --resource-group myResourceGroup \
  --name voice-ai-assistant \
  --image yourusername/voice-ai-assistant \
  --dns-name-label voice-ai-assistant \
  --ports 8787 \
  --environment-variables OPENROUTER_API_KEY=your-api-key-here
```

## 🔧 Environment Variables

All platforms require these environment variables:

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `OPENROUTER_API_KEY` | ✅ | Your OpenRouter API key | - |
| `PORT` | ❌ | Server port | 8787 |
| `HTTP_REFERER` | ❌ | Referer header for API calls | http://localhost |
| `X_TITLE` | ❌ | Title header for API calls | Voice AI Assistant |

## 🔒 Security Considerations

1. **Never commit API keys** to version control
2. **Use HTTPS** in production (most platforms provide this automatically)
3. **Set proper CORS headers** (already configured in the server)
4. **Use environment variables** for all sensitive data
5. **Keep dependencies updated** (run `npm audit` regularly)

## 🌐 Custom Domain Setup

### Render
1. Go to your service settings
2. Add your custom domain
3. Configure DNS records as instructed

### Railway
1. Go to your project settings
2. Add custom domain
3. Update your DNS records

### Vercel
1. Go to project settings
2. Add domain
3. Configure DNS

## 📊 Monitoring and Logs

### Health Check Endpoint
All deployments include a health check at `/health`

### Logging
- Server logs are available in your platform's dashboard
- Check logs for API errors or connection issues

### Monitoring
Consider adding monitoring services like:
- [UptimeRobot](https://uptimerobot.com/) for uptime monitoring
- [LogRocket](https://logrocket.com/) for error tracking
- [New Relic](https://newrelic.com/) for performance monitoring

## 🚨 Troubleshooting

### Common Issues

**Build Failures**
- Ensure Node.js version compatibility (14.0.0+)
- Check that all files are committed to git

**Runtime Errors**
- Verify `OPENROUTER_API_KEY` is set correctly
- Check server logs for detailed error messages
- Ensure port is not blocked by firewall

**API Errors**
- Verify your OpenRouter API key is valid
- Check API rate limits
- Ensure proper network connectivity

### Getting Help

1. Check the main README.md for basic troubleshooting
2. Review server logs in your platform's dashboard
3. Test the `/health` endpoint
4. Open an issue on GitHub with:
   - Platform you're deploying to
   - Error messages from logs
   - Steps to reproduce the issue

## 📈 Scaling

For high-traffic applications:

1. **Use a CDN** for static assets
2. **Enable caching** for API responses
3. **Use load balancers** for multiple instances
4. **Monitor performance** and scale accordingly
5. **Consider serverless** options for automatic scaling

---

**Need help?** Open an issue on GitHub or check the troubleshooting section in the main README.