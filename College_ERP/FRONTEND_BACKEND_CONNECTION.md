# Frontend-Backend Connection Guide

## Current Status
Your **frontend** is running on http://localhost:5173 but it's working with **mock data** instead of connecting to your **backend API** on http://localhost:5000.

## What You Have Now

### Frontend (localhost:5173)
- ✅ Working login with hardcoded credentials
- ✅ Mock data for all features  
- ❌ No API connectivity
- ❌ No real profile photo uploads

### Current Login Credentials
- **Admin**: `admin` / `admin123`
- **Student**: `student` / `student123`
- **Faculty**: `faculty` / `faculty123`

### Backend (localhost:5000) 
- ✅ Full API with authentication
- ✅ Profile photo upload functionality
- ✅ Database integration
- ✅ Real user management

## How to Connect Frontend to Backend

I've created the necessary files to connect your frontend to the backend. Here's what to do:

### Step 1: Use the API Service
I created `src/services/api.js` which provides:
- Authentication API calls
- Profile photo upload functionality
- Students and Faculty API endpoints

### Step 2: Add Profile Photo Component
I created `src/components/ProfilePhotoUpload.jsx` which provides:
- Profile photo upload interface
- Real-time upload status
- Photo deletion functionality
- File validation

### Step 3: Integration Options

#### Option A: Quick Test (Recommended)
Add the profile photo component to any existing page to test backend connectivity:

```jsx
// Add to any component file (e.g., Student profile, Faculty profile, Admin dashboard)
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';

// In your component's render method:
<ProfilePhotoUpload 
  currentUser={currentUser} 
  onPhotoUpdate={(newPhotoUrl) => console.log('Photo updated:', newPhotoUrl)} 
/>
```

#### Option B: Full API Integration
Replace mock data with real API calls by updating your existing components to use the API service:

```jsx
// Example: Replace mock data with real API calls
import { studentsAPI, facultyAPI, authAPI } from '../services/api';

// Instead of hardcoded data:
const [students, setStudents] = useState(mockData);

// Use real API:
useEffect(() => {
  const loadStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      setStudents(response);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };
  loadStudents();
}, []);
```

### Step 4: Authentication Update
To use real authentication, update your Login.jsx:

```jsx
// Replace hardcoded login with real API call
import { authAPI } from '../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await authAPI.login({
      email: username, // or map to correct field
      password: password,
      role: selectedRole // add role selection to your form
    });
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userRole', response.role);
      navigate(`/${response.role}`);
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
};
```

## Quick Test - Profile Photo Upload

### 1. Add Profile Component to Any Page
Find any profile page in your frontend (Student, Faculty, or Admin) and add:

```jsx
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';

// Add this to your profile section:
<div className="profile-section">
  <h3>Profile Photo</h3>
  <ProfilePhotoUpload />
</div>
```

### 2. Test Upload Functionality
1. Login to your frontend with existing credentials
2. Navigate to the page where you added the component
3. Try uploading a profile photo
4. Check if it connects to your backend API

### 3. Backend Credentials for Testing
If you want to test with real backend authentication, use these credentials:

**Admin**:
- Email: `admin@jecrc.ac.in`
- Password: `admin123`
- Role: `admin`

**Students** (Password: `demo123`):
- `john.doe.cse25002@jecrc.edu`
- `alice.johnson.cse25004@jecrc.edu`

**Faculty** (Password: `demo123`):
- `jane.smith@jecrc.edu`
- `michael.wilson@jecrc.edu`

## Expected Results

Once connected, you should see:

### ✅ Profile Photo Upload Working
- Upload photos through the UI
- Photos saved to `uploads/profiles/` directory
- Database updated with photo URLs
- Real-time upload progress and status

### ✅ Real Data Integration
- Students and faculty loaded from database
- Authentication through backend API
- Real-time updates and notifications

## Current System Status

- **Frontend**: http://localhost:5173 (Mock data mode)
- **Backend**: http://localhost:5000 (Full API ready)
- **Profile Photos**: Backend ready, frontend needs integration
- **Database**: Fully configured and tested

## Next Steps

1. **Quick Test**: Add ProfilePhotoUpload component to any page
2. **Test Upload**: Try uploading a photo to test connectivity
3. **Full Integration**: Replace mock data with API calls gradually
4. **Authentication**: Update login to use real backend authentication

Your backend is fully functional and ready - you just need to connect the frontend to start using real data and profile photos!