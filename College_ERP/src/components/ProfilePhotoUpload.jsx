import React, { useState, useRef, useEffect } from 'react';
import { profilePhotoAPI } from '../services/api';

const ProfilePhotoUpload = ({ currentUser, onPhotoUpdate }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Default avatar URL
  const defaultAvatar = '/uploads/profiles/default-avatar.png';

  // Load current profile photo on component mount
  useEffect(() => {
    loadCurrentPhoto();
  }, []);

  const loadCurrentPhoto = async () => {
    try {
      const response = await profilePhotoAPI.getCurrentPhoto();
      if (response.success) {
        setProfilePhoto(response.data.profilePhotoUrl);
      }
    } catch (error) {
      console.log('No profile photo found or error loading:', error);
      setProfilePhoto(defaultAvatar);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await profilePhotoAPI.upload(file);
      
      if (response.success) {
        setProfilePhoto(response.data.profilePhotoUrl);
        setSuccess('Profile photo updated successfully!');
        
        // Notify parent component
        if (onPhotoUpdate) {
          onPhotoUpdate(response.data.profilePhotoUrl);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload profile photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (window.confirm('Are you sure you want to remove your profile photo?')) {
      setUploading(true);
      setError('');
      setSuccess('');

      try {
        const response = await profilePhotoAPI.deletePhoto();
        
        if (response.success) {
          setProfilePhoto(defaultAvatar);
          setSuccess('Profile photo removed successfully!');
          
          // Notify parent component
          if (onPhotoUpdate) {
            onPhotoUpdate(defaultAvatar);
          }

          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(response.message || 'Delete failed');
        }
      } catch (error) {
        console.error('Delete error:', error);
        setError('Failed to remove profile photo. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="profile-photo-upload">
      <div className="photo-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
        {/* Profile Photo Display */}
        <div 
          className="photo-frame" 
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto',
            border: '4px solid #e0e0e0',
            cursor: 'pointer',
            position: 'relative',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url(${profilePhoto || defaultAvatar})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={triggerFileInput}
        >
          {uploading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px'
            }}>
              Uploading...
            </div>
          )}
          
          {!uploading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              opacity: 0,
              transition: 'opacity 0.3s'
            }}
            className="photo-overlay"
            onMouseEnter={(e) => e.target.style.opacity = 1}
            onMouseLeave={(e) => e.target.style.opacity = 0}
            >
              Click to change
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={triggerFileInput}
            disabled={uploading}
            style={{
              padding: '8px 16px',
              backgroundColor: uploading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              marginRight: '8px',
              fontSize: '14px'
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>

          {/* Delete Button (only show if not default avatar) */}
          {profilePhoto && profilePhoto !== defaultAvatar && (
            <button
              onClick={handleDeletePhoto}
              disabled={uploading}
              style={{
                padding: '8px 16px',
                backgroundColor: uploading ? '#ccc' : '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Remove Photo
            </button>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Status Messages */}
        {error && (
          <div style={{
            marginTop: '10px',
            padding: '8px',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            marginTop: '10px',
            padding: '8px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            color: '#155724',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        {/* Upload Guidelines */}
        <div style={{
          marginTop: '10px',
          fontSize: '12px',
          color: '#6c757d'
        }}>
          <p>Supported formats: JPG, PNG, GIF, WebP</p>
          <p>Maximum file size: 5MB</p>
          <p>Recommended: Square images (1:1 aspect ratio)</p>
        </div>
      </div>

      <style jsx>{`
        .photo-frame:hover .photo-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default ProfilePhotoUpload;