# Profile Photos Directory

This directory stores user profile photos for the College ERP system.

## Directory Structure

```
uploads/profiles/
├── students/          # Student profile photos
├── faculty/           # Faculty profile photos
├── default-avatar.png # Default avatar (placeholder)
└── README.md         # This file
```

## Default Avatar

To add a default avatar image:

1. Add a file named `default-avatar.png` to this directory
2. Recommended size: 300x300 pixels
3. Supported formats: PNG, JPEG, GIF, WebP
4. This image will be used when users haven't uploaded their own profile photo

## File Naming Convention

- **Students**: `student_{userId}_{timestamp}.{ext}`
- **Faculty**: `faculty_{facultyId}_{timestamp}.{ext}`

## File Size Limits

- Maximum file size: 5MB per image
- Supported formats: JPEG, PNG, GIF, WebP
- Images are automatically organized by user type

## Security

- All uploads require authentication
- Users can only upload/modify their own profile photos
- Admins can view all profile photos
- Faculty can view photos of assigned students only

## API Endpoints

- `POST /api/profile-photos/upload` - Upload profile photo
- `GET /api/profile-photos/current/me` - Get own profile photo
- `GET /api/profile-photos/:userId` - Get specific user's photo (with access control)
- `DELETE /api/profile-photos/current/me` - Remove own profile photo
- `GET /api/profile-photos/cleanup/orphaned` - Admin cleanup (removes orphaned files)