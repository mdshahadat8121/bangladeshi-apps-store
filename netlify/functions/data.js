const fs = require('fs');
const path = require('path');

// Data file path
const dataFile = path.join('/tmp', 'apps-data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  const initialData = {
    apps: [
      {
        id: 1,
        name: "বাংলা টাইপিং মাস্টার",
        developer: "টেকনোলজি বাংলাদেশ",
        description: "দ্রুত ও সহজে বাংলা টাইপিং শিখুন",
        category: "education",
        icon: "⌨️",
        rating: 4.5,
        size: "15 MB",
        downloads: "500K+",
        featured: true,
        status: "active",
        downloadLink: "#",
        version: "1.0.0",
        androidVersion: "5.0+",
        packageName: "com.techbangla.typingmaster"
      },
      {
        id: 2,
        name: "বাংলাদেশ রেসিপি",
        developer: "ফুড লাভার্স",
        description: "বাংলাদেশের ঐতিহ্যবাহী রেসিপি সংগ্রহ",
        category: "entertainment",
        icon: "🍛",
        rating: 4.2,
        size: "22 MB",
        downloads: "300K+",
        featured: false,
        status: "active",
        downloadLink: "#",
        version: "2.1.0",
        androidVersion: "6.0+",
        packageName: "com.foodlovers.recipes"
      }
    ],
    users: [
      {
        id: 1,
        name: "শাহাদাত হোসেন",
        email: "mdshahadat81313@gmail.com",
        password: "123456",
        role: "admin",
        isVerified: true,
        joinDate: new Date().toLocaleDateString('bn-BD')
      }
    ],
    settings: {
      siteName: "বাংলাদেশি অ্যাপস",
      siteDescription: "বাংলাদেশের জন্য নিরাপদ অ্যাপ্লিকেশন সংগ্রহ",
      bannerImage: ""
    },
    reviews: []
  };
  fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
}

function readData() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { apps: [], users: [], settings: {}, reviews: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const data = readData();
  const { action, type } = event.queryStringParameters;

  try {
    switch (type) {
      case 'apps':
        if (action === 'get') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data.apps)
          };
        } else if (action === 'add') {
          const newApp = JSON.parse(event.body);
          data.apps.push(newApp);
          writeData(data);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
          };
        } else if (action === 'update') {
          const updatedApp = JSON.parse(event.body);
          const index = data.apps.findIndex(app => app.id === updatedApp.id);
          if (index !== -1) {
            data.apps[index] = { ...data.apps[index], ...updatedApp };
            writeData(data);
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
          };
        } else if (action === 'delete') {
          const { id } = JSON.parse(event.body);
          data.apps = data.apps.filter(app => app.id !== id);
          writeData(data);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
          };
        }
        break;

      case 'settings':
        if (action === 'get') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data.settings)
          };
        } else if (action === 'update') {
          const newSettings = JSON.parse(event.body);
          data.settings = { ...data.settings, ...newSettings };
          writeData(data);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
          };
        }
        break;

      case 'users':
        if (action === 'get') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data.users)
          };
        } else if (action === 'add') {
          const newUser = JSON.parse(event.body);
          data.users.push(newUser);
          writeData(data);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
          };
        } else if (action === 'verify') {
          const { email } = JSON.parse(event.body);
          const userIndex = data.users.findIndex(user => user.email === email);
          if (userIndex !== -1) {
            data.users[userIndex].isVerified = true;
            writeData(data);
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
          };
        }
        break;

      case 'reviews':
        if (action === 'get') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data.reviews)
          };
        } else if (action === 'add') {
          const newReview = JSON.parse(event.body);
          data.reviews.push(newReview);
          writeData(data);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
          };
        }
        break;
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid action or type' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
