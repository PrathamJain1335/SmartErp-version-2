#!/usr/bin/env node

import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🏗️  Building College ERP for Production...\n');

const isWindows = os.platform() === 'win32';
const projectRoot = __dirname;

function runCommand(command, args, cwd, title) {
  console.log(`🔨 ${title}...`);
  
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: cwd,
      stdio: 'inherit',
      shell: isWindows
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${title} completed successfully\n`);
        resolve();
      } else {
        console.error(`❌ ${title} failed with code ${code}\n`);
        reject(new Error(`${title} failed`));
      }
    });

    child.on('error', (err) => {
      console.error(`❌ Failed to run ${title}:`, err);
      reject(err);
    });
  });
}

async function buildProduction() {
  try {
    console.log('📦 Production Build Process Starting...\n');

    // 1. Install frontend dependencies
    await runCommand(
      isWindows ? 'npm.cmd' : 'npm',
      ['install'],
      projectRoot,
      'Installing Frontend Dependencies'
    );

    // 2. Build React frontend for production
    await runCommand(
      isWindows ? 'npm.cmd' : 'npm',
      ['run', 'build'],
      projectRoot,
      'Building React Frontend'
    );

    // 3. Install backend dependencies
    const backendPath = path.join(projectRoot, 'college-erp-backend');
    if (fs.existsSync(backendPath)) {
      await runCommand(
        isWindows ? 'npm.cmd' : 'npm',
        ['install', '--production'],
        backendPath,
        'Installing Backend Dependencies'
      );
    }

    // 4. Install AI service dependencies
    const aiServicePath = path.join(projectRoot, 'college-erp-backend', 'ai-service');
    if (fs.existsSync(aiServicePath)) {
      await runCommand(
        'pip',
        ['install', '-r', 'requirements.txt'],
        aiServicePath,
        'Installing AI Service Dependencies'
      );
    }

    // 5. Create production configuration
    const prodConfigPath = path.join(projectRoot, 'prod-config.json');
    const prodConfig = {
      "name": "College ERP System",
      "version": "1.0.0",
      "environment": "production",
      "services": {
        "frontend": {
          "build_dir": "./dist",
          "port": 3000,
          "served_by": "nginx_or_static_server"
        },
        "backend": {
          "port": 5000,
          "node_env": "production",
          "database": "production_db_config_needed"
        },
        "ai_service": {
          "port": 8001,
          "model_cache": true,
          "optimization": "enabled"
        }
      },
      "deployment": {
        "docker_ready": true,
        "pm2_ready": true,
        "nginx_config_available": true
      }
    };

    fs.writeFileSync(prodConfigPath, JSON.stringify(prodConfig, null, 2));

    // 6. Create production start script
    const prodStartScript = `#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting College ERP Production Environment...');

const isWindows = os.platform() === 'win32';
const projectRoot = __dirname;

// Production startup
async function startProduction() {
  console.log('Starting backend services...');
  
  // Start Node.js backend
  const backend = spawn('node', ['start.js'], {
    cwd: path.join(projectRoot, 'college-erp-backend'),
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Start AI service
  const aiService = spawn('python', ['start.py'], {
    cwd: path.join(projectRoot, 'college-erp-backend', 'ai-service'),
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env, ENVIRONMENT: 'production' }
  });

  console.log(\`
✅ College ERP Production Environment Started!

📊 Services Running:
   ├── ⚙️  Backend API: http://localhost:5000
   └── 🤖 AI Service:  http://localhost:8001

📁 Frontend Build:
   └── 📦 Static files in: ./dist/
   
🌐 Deploy Frontend:
   - Serve ./dist/ with nginx, Apache, or static hosting
   - Configure reverse proxy to backend services
   
🔧 Production Notes:
   - Set up proper environment variables
   - Configure production database
   - Set up SSL certificates
   - Configure logging and monitoring
\`);

  process.on('SIGINT', () => {
    console.log('\\n🛑 Shutting down production services...');
    backend.kill();
    aiService.kill();
    process.exit(0);
  });
}

startProduction().catch(console.error);
`;

    fs.writeFileSync(path.join(projectRoot, 'start-prod.js'), prodStartScript);

    // 7. Create Docker configuration (optional)
    const dockerCompose = `version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
      - ai-service
    
  backend:
    build:
      context: ./college-erp-backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    
  ai-service:
    build:
      context: ./college-erp-backend/ai-service
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      - ENVIRONMENT=production

networks:
  default:
    driver: bridge
`;

    fs.writeFileSync(path.join(projectRoot, 'docker-compose.prod.yml'), dockerCompose);

    // 8. Create nginx configuration template
    const nginxConfig = `# College ERP Nginx Configuration
server {
    listen 80;
    server_name your-domain.com;
    
    # Serve React build files
    location / {
        root ${path.join(projectRoot, 'dist').replace(/\\/g, '/')};
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Proxy AI service requests
    location /ai/ {
        proxy_pass http://localhost:8001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;
}
`;

    fs.writeFileSync(path.join(projectRoot, 'nginx.conf.template'), nginxConfig);

    console.log(`
🎉 Production Build Complete!

📦 Build Output:
   ├── 📁 Frontend build: ./dist/
   ├── ⚙️  Backend ready: ./college-erp-backend/
   ├── 🤖 AI service ready: ./college-erp-backend/ai-service/
   └── 🔧 Config files: prod-config.json, start-prod.js

🚀 Deployment Options:

   1️⃣  Simple Production Start:
       node start-prod.js
   
   2️⃣  Docker Deployment:
       docker-compose -f docker-compose.prod.yml up
   
   3️⃣  Traditional Web Server:
       - Serve ./dist/ with nginx/Apache
       - Run backend services separately
       - Use nginx.conf.template for configuration

📋 Production Checklist:
   ├── ✅ Frontend built and optimized
   ├── ✅ Backend dependencies installed
   ├── ✅ AI service dependencies ready
   ├── ⚠️  Configure production database
   ├── ⚠️  Set environment variables
   ├── ⚠️  Configure SSL certificates
   ├── ⚠️  Set up monitoring/logging
   └── ⚠️  Configure backup strategy

🔗 Next Steps:
   1. Test production build locally: node start-prod.js
   2. Configure production environment variables
   3. Set up production database
   4. Deploy to your hosting platform
   5. Configure domain and SSL

===============================================
    `);

  } catch (error) {
    console.error('❌ Production build failed:', error);
    process.exit(1);
  }
}

buildProduction();