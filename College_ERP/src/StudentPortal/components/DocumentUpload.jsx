import React, { useState, useRef, useCallback } from 'react';
import mockDocumentService from '../../services/mockDocumentService';
import authManager from '../../utils/authManager';
import { 
  Upload, 
  Camera, 
  File as FileIcon, 
  Trash2, 
  Eye, 
  Download, 
  FolderOpen,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Clock,
  UserCheck,
  XCircle,
  Send,
  BookOpen,
  Award,
  Briefcase,
  User,
  Rocket,
  Image
} from 'lucide-react';

const DocumentUpload = () => {
  const [documents, setDocuments] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('academic');
  const [previewDocument, setPreviewDocument] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'certificates', label: 'Certificates' },
    { value: 'internship', label: 'Internship' },
    { value: 'personal', label: 'Personal' },
    { value: 'projects', label: 'Projects' },
    { value: 'other', label: 'Other' }
  ];

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  // Load documents and approvals on component mount
  React.useEffect(() => {
    loadApprovedDocuments();
    loadPendingApprovals();
  }, []);

  const loadApprovedDocuments = async () => {
    try {
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const userId = userProfile.id || 'JECRC-CSE-21-001';
      
      const response = await mockDocumentService.getUserDocuments(userId);
      
      if (response.success) {
        // Filter only approved documents
        const approvedDocs = response.data.filter(doc => doc.status === 'approved');
        setDocuments(approvedDocs.map(doc => ({
          id: doc.id,
          name: doc.fileName,
          category: doc.category || 'academic',
          size: doc.fileSize,
          uploadDate: new Date(doc.uploadedAt).toLocaleDateString(),
          type: doc.fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
          isVerified: true
        })));
      }
    } catch (error) {
      console.error('Error loading approved documents:', error);
      // Set empty array as fallback
      setDocuments([]);
    }
  };

  const loadPendingApprovals = async () => {
    try {
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const userId = userProfile.id || 'JECRC-CSE-21-001';
      
      const response = await mockDocumentService.getUserDocuments(userId);
      
      if (response.success) {
        // Filter only pending documents
        const pendingDocs = response.data.filter(doc => doc.status === 'pending');
        setPendingApprovals(pendingDocs.map(doc => ({
          id: doc.id,
          approvalDocument: {
            id: doc.id,
            originalName: doc.fileName,
            name: doc.fileName,
            category: doc.category || 'academic',
            fileSize: doc.fileSize,
            size: doc.fileSize,
            mimeType: doc.fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
            type: doc.fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'
          },
          status: doc.status,
          submissionDate: doc.uploadedAt,
          createdAt: doc.uploadedAt,
          assignedTo: doc.assignedTo
        })));
      }
    } catch (error) {
      console.error('Error loading pending approvals:', error);
      setPendingApprovals([]);
    }
  };

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not allowed. Please upload PDF, JPG, or PNG files.');
    }
    if (file.size > maxFileSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }
    return true;
  };

  const uploadFile = async (file, category = selectedCategory, source = 'upload') => {
    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);
    setUploadProgress(0);

    try {
      validateFile(file);

      // Create progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Get user profile for demo
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const studentInfo = {
        id: userProfile.id || 'JECRC-CSE-21-001',
        name: userProfile.name || 'Demo Student',
        email: userProfile.email || 'student@jecrc.edu'
      };
      
      // Get faculty assignment for demo
      const assignedFaculty = mockDocumentService.getFacultyMapping(studentInfo.email);
      
      // Create document data for mock service
      const documentData = {
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        description: `${category} document uploaded via ${source}`,
        fileName: file.name,
        fileSize: file.size,
        category: category,
        priority: category === 'certificates' ? 'high' : 'medium',
        uploadedBy: studentInfo,
        assignedTo: assignedFaculty
      };
      
      // Upload to mock service
      const uploadResponse = await mockDocumentService.uploadDocument(documentData);
      
      if (uploadResponse.success) {
        const uploadedDoc = uploadResponse.data;
        
        // Add to pending approvals
        const pendingDoc = {
          id: uploadedDoc.id,
          approvalDocument: {
            id: uploadedDoc.id,
            originalName: uploadedDoc.fileName,
            name: uploadedDoc.fileName,
            category: uploadedDoc.category,
            fileSize: uploadedDoc.fileSize,
            size: uploadedDoc.fileSize,
            mimeType: file.type,
            type: file.type
          },
          status: uploadedDoc.status,
          submissionDate: uploadedDoc.uploadedAt,
          createdAt: uploadedDoc.uploadedAt,
          assignedTo: uploadedDoc.assignedTo
        };
        
        setPendingApprovals(prev => [pendingDoc, ...prev]);
        setSuccessMessage(`Document uploaded and submitted for approval successfully! It has been assigned to ${assignedFaculty.name} for review.`);
      }

      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to upload document. Please try again.'
      );
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => uploadFile(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => uploadFile(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
      setError(null);
    } catch (err) {
      setError('Camera access denied. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `document_${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });
      uploadFile(file, selectedCategory, 'camera');
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return <FileIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />;
    if (type && type.startsWith('image/')) return <Image className="h-6 w-6 text-gray-600 dark:text-gray-300" />;
    return <FileIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />;
  };

  const getCategoryInfo = (category) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const CategoryIcon = ({ category }) => {
    switch (category) {
      case 'academic':
        return <BookOpen className="h-4 w-4" />;
      case 'certificates':
        return <Award className="h-4 w-4" />;
      case 'internship':
        return <Briefcase className="h-4 w-4" />;
      case 'personal':
        return <User className="h-4 w-4" />;
      case 'projects':
        return <Rocket className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-blue-600" />
            Document Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload, scan, and manage your academic documents
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Selection */}
            <div className="lg:w-1/4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Document Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Actions */}
            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload */}
                <div
                  className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Upload Files
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Drag & drop files here or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, JPG, PNG • Max 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Camera Scan */}
                <div
                  className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer"
                  onClick={startCamera}
                >
                  <Camera className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Scan with Camera
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Use your camera to scan documents
                  </p>
                  <p className="text-xs text-gray-400">
                    Position document and capture
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">Uploading...</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-300">{successMessage}</span>
              <button 
                onClick={() => setSuccessMessage(null)}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Pending Approvals Section */}
        {pendingApprovals.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Pending Approval ({pendingApprovals.length})
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Documents waiting for faculty review
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingApprovals.map((approval) => {
                  const doc = approval.approvalDocument || approval;
                  const categoryInfo = getCategoryInfo(doc.category);
                  return (
                    <div
                      key={approval.id}
                      className="border border-orange-200 dark:border-orange-800 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/10"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="mr-1">
                            {getFileIcon(doc.mimeType || doc.type)}
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/20 rounded text-xs">
                            <CategoryIcon category={categoryInfo.value} />
                            <span className="text-orange-600 dark:text-orange-300">
                              {categoryInfo.label}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-full text-xs">
                          <Clock className="h-3 w-3 text-yellow-600" />
                          <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                            {approval.status === 'pending' ? 'Pending' : 
                             approval.status === 'approved' ? 'Approved' :
                             approval.status === 'rejected' ? 'Rejected' : 'Review'}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-medium text-gray-900 dark:text-white mb-2 truncate">
                        {doc.originalName || doc.name}
                      </h3>

                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
                        <div>Size: {formatFileSize(doc.fileSize || doc.size)}</div>
                        <div>Submitted: {new Date(approval.submissionDate || approval.createdAt).toLocaleDateString()}</div>
                        <div className="text-orange-600 dark:text-orange-400 font-medium">
                          ⏳ Awaiting faculty review
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs rounded-lg transition-colors">
                          <Eye className="h-3 w-3" />
                          Preview
                        </button>
                        <button 
                          onClick={() => {
                            setError(null);
                            setSuccessMessage('Document approval status will be updated automatically when faculty reviews it.');
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 text-orange-600 dark:text-orange-300 text-xs rounded-lg transition-colors"
                        >
                          <Send className="h-3 w-3" />
                          Status
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Approved Documents List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              Approved Documents ({documents.length})
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Documents that have been reviewed and approved by faculty
            </p>
          </div>

          <div className="p-6">
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No documents yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Start by uploading your first document
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => {
                  const categoryInfo = getCategoryInfo(doc.category);
                  return (
                    <div
                      key={doc.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="mr-1">
                            {getFileIcon(doc.type)}
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                            <CategoryIcon category={categoryInfo.value} />
                            <span className="text-blue-600 dark:text-blue-300">
                              {categoryInfo.label}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <h3 className="font-medium text-gray-900 dark:text-white mb-2 truncate">
                        {doc.name}
                      </h3>

                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
                        <div>Size: {formatFileSize(doc.size)}</div>
                        <div>Uploaded: {doc.uploadDate}</div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs rounded-lg transition-colors">
                          <Eye className="h-3 w-3" />
                          Preview
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-600 dark:text-green-300 text-xs rounded-lg transition-colors">
                          <Download className="h-3 w-3" />
                          Download
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Camera Modal */}
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Document Scanner
                </h3>
                <button
                  onClick={stopCamera}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                <div className="flex justify-center mt-4">
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                    Capture Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;