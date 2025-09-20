import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Trash2,
  FolderOpen,
  Plus,
  Scan,
  Image as ImageIcon,
  FilePlus
} from 'lucide-react';

const DocumentUpload = () => {
  const [documents, setDocuments] = useState([]);
  const [uploadMode, setUploadMode] = useState(null); // 'file', 'camera', null
  const [cameraActive, setCameraActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Document categories
  const documentCategories = [
    { id: 'academic', label: 'Academic Records', color: 'bg-blue-500' },
    { id: 'certificates', label: 'Certificates', color: 'bg-green-500' },
    { id: 'identity', label: 'Identity Documents', color: 'bg-purple-500' },
    { id: 'medical', label: 'Medical Records', color: 'bg-red-500' },
    { id: 'financial', label: 'Financial Documents', color: 'bg-yellow-500' },
    { id: 'other', label: 'Other Documents', color: 'bg-gray-500' }
  ];

  // Initialize camera
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
      setCameraActive(false);
      setUploadMode(null);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setUploadMode(null);
  };

  // Capture image from camera
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert to blob and upload
      canvas.toBlob((blob) => {
        const file = new File([blob], `document_${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFileUpload(file, 'camera');
      }, 'image/jpeg', 0.8);
      
      stopCamera();
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      handleFileUpload(file, 'file');
    });
    event.target.value = ''; // Reset input
  };

  // Upload file to backend
  const handleFileUpload = async (file, source = 'file') => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only PDF or image files (JPG, PNG)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('document', file);
    formData.append('category', 'other'); // Default category
    formData.append('description', file.name);
    formData.append('uploadSource', source);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add to local state
        const newDocument = {
          id: result.id || Date.now(),
          name: file.name,
          type: file.type,
          size: file.size,
          category: 'other',
          uploadDate: new Date().toISOString(),
          url: result.url || URL.createObjectURL(file),
          source: source
        };
        
        setDocuments(prev => [newDocument, ...prev]);
        console.log('✅ Document uploaded successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Add to local state even if backend fails (for demo purposes)
      const newDocument = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        category: 'other',
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(file),
        source: source,
        status: 'local' // Indicate it's only stored locally
      };
      
      setDocuments(prev => [newDocument, ...prev]);
      console.log('📁 Document stored locally (backend unavailable)');
    } finally {
      setUploading(false);
      setUploadMode(null);
    }
  };

  // Update document category
  const updateDocumentCategory = (docId, category) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, category } : doc
    ));
  };

  // Delete document
  const deleteDocument = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/documents/${docId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Delete error:', error);
      }
      
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get category info
  const getCategoryInfo = (categoryId) => {
    return documentCategories.find(cat => cat.id === categoryId) || documentCategories[documentCategories.length - 1];
  };

  // Group documents by category
  const groupedDocuments = documents.reduce((acc, doc) => {
    const category = doc.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(doc);
    return acc;
  }, {});

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FolderOpen size={32} style={{ color: 'var(--accent)' }} />
          Document Manager
        </h1>
        <p className="text-lg" style={{ color: 'var(--muted)' }}>
          Upload, organize, and manage your academic documents securely
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-8 p-6 rounded-xl border-2 border-dashed transition-all duration-300 hover:border-blue-500" 
           style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        
        {!uploadMode && (
          <div className="text-center">
            <div className="mb-4">
              <Upload size={48} className="mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
              <p style={{ color: 'var(--muted)' }}>
                Choose your upload method: scan with camera or select files
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setUploadMode('camera')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                <Camera size={20} />
                Scan with Camera
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                <FilePlus size={20} />
                Select Files
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
              Supported formats: PDF, JPG, PNG • Max size: 5MB per file
            </div>
          </div>
        )}

        {/* Camera Mode */}
        {uploadMode === 'camera' && (
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                <Scan size={24} />
                Document Scanner
              </h3>
              <p style={{ color: 'var(--muted)' }}>
                Position your document in the camera frame and capture
              </p>
            </div>
            
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 mx-auto transition-all duration-200"
              >
                <Camera size={20} />
                Start Camera
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="max-w-full h-64 object-cover rounded-lg border-2 border-blue-500"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white"></div>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={captureImage}
                    disabled={uploading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      <ImageIcon size={20} />
                    )}
                    {uploading ? 'Processing...' : 'Capture'}
                  </button>
                  
                  <button
                    onClick={stopCamera}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-all duration-200"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        )}
      </div>

      {/* Documents List */}
      {documents.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText size={24} />
              My Documents ({documents.length})
            </h2>
            
            {/* Document count by category */}
            <div className="flex gap-2 text-sm">
              {Object.entries(groupedDocuments).map(([category, docs]) => {
                const categoryInfo = getCategoryInfo(category);
                return (
                  <span
                    key={category}
                    className={`px-2 py-1 rounded-full text-white ${categoryInfo.color}`}
                  >
                    {categoryInfo.label}: {docs.length}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Documents by Category */}
          {Object.entries(groupedDocuments).map(([category, docs]) => {
            const categoryInfo = getCategoryInfo(category);
            return (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <div className={`w-3 h-3 rounded-full ${categoryInfo.color}`} />
                  {categoryInfo.label} ({docs.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl border transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                    >
                      {/* Document Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0">
                          {doc.type === 'application/pdf' ? (
                            <FileText size={32} className="text-red-500" />
                          ) : (
                            <ImageIcon size={32} className="text-blue-500" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate" title={doc.name}>
                            {doc.name}
                          </h4>
                          <p className="text-sm" style={{ color: 'var(--muted)' }}>
                            {formatFileSize(doc.size)} • {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                          {doc.source === 'camera' && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mt-1">
                              <Camera size={12} />
                              Scanned
                            </span>
                          )}
                          {doc.status === 'local' && (
                            <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full mt-1">
                              <AlertCircle size={12} />
                              Local only
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Category Selector */}
                      <div className="mb-3">
                        <select
                          value={doc.category || 'other'}
                          onChange={(e) => updateDocumentCategory(doc.id, e.target.value)}
                          className="w-full px-3 py-2 text-sm border rounded-lg"
                          style={{ 
                            backgroundColor: 'var(--card)', 
                            borderColor: 'var(--border)',
                            color: 'var(--text)'
                          }}
                        >
                          {documentCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewDocument(doc)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        
                        <a
                          href={doc.url}
                          download={doc.name}
                          className="flex-1 px-3 py-2 text-sm border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          <Download size={14} />
                          Save
                        </a>
                        
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {documents.length === 0 && (
        <div className="text-center py-12 rounded-xl" style={{ backgroundColor: 'var(--card)' }}>
          <FolderOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--muted)' }} />
          <h3 className="text-xl font-semibold mb-2">No Documents Yet</h3>
          <p style={{ color: 'var(--muted)' }}>
            Upload your first document to get started organizing your files
          </p>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{previewDocument.name}</h3>
              <button
                onClick={() => setPreviewDocument(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 max-h-[70vh] overflow-auto">
              {previewDocument.type === 'application/pdf' ? (
                <iframe
                  src={previewDocument.url}
                  className="w-full h-96 border rounded-lg"
                  title={previewDocument.name}
                />
              ) : (
                <img
                  src={previewDocument.url}
                  alt={previewDocument.name}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;