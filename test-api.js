#!/usr/bin/env node

// Simple API Test Script for Agent Free Backend
const http = require('http');

const API_BASE = 'http://localhost:3001';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${API_BASE}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runTests() {
  console.log('🧪 Testing Agent Free Backend API...\n');
  
  const tests = [
    { name: 'Health Check', path: '/health' },
    { name: 'Properties Endpoint', path: '/api/properties' },
    { name: 'Dashboard Stats', path: '/api/dashboard/stats' },
    { name: 'Contract Templates', path: '/api/contract-templates' },
  ];
  
  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const result = await makeRequest(test.path);
      
      if (result.status === 200) {
        console.log(`✅ ${test.name}: SUCCESS (${result.status})`);
        if (test.path === '/health') {
          console.log(`   Service: ${result.data.service}`);
          console.log(`   Version: ${result.data.version}`);
        }
      } else {
        console.log(`❌ ${test.name}: FAILED (${result.status})`);
        console.log(`   Error: ${JSON.stringify(result.data)}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
    console.log('');
  }
  
  console.log('🎯 API Testing Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Start the frontend: cd mui && npm start');
  console.log('2. Open browser: http://localhost:3000');
  console.log('3. Test the complete application');
  console.log('\n🔗 Backend API: http://localhost:3001');
  console.log('📊 Health Check: http://localhost:3001/health');
}

runTests().catch(console.error);

