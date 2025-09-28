// Mock Document Service for Demo Functionality
// This service simulates backend operations using local storage

class MockDocumentService {
  constructor() {
    this.initializeStorage();
  }

  initializeStorage() {
    // Initialize with demo data if not exists
    if (!localStorage.getItem('demo_documents')) {
      const demoDocuments = [
        {
          id: 'DOC001',
          title: 'Semester Registration Form',
          description: 'Registration form for 6th semester',
          fileName: 'semester_registration.pdf',
          fileSize: 245760, // 240KB
          uploadedBy: {
            id: 'JECRC-CSE-21-001',
            name: 'Suresh Shah',
            email: 'suresh.shah.cse25001@jecrc.edu'
          },
          assignedTo: {
            id: 'FAC001',
            name: 'Dr. Kavya Sharma',
            email: 'kavya@jecrc.edu'
          },
          status: 'pending',
          priority: 'medium',
          uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          comments: '',
          approvedAt: null,
          approvedBy: null
        },
        {
          id: 'DOC002',
          title: 'Fee Receipt Verification',
          description: 'Semester fee payment receipt for verification',
          fileName: 'fee_receipt_sem6.jpg',
          fileSize: 156800, // 153KB
          uploadedBy: {
            id: 'JECRC-CSE-21-002',
            name: 'Priya Sharma',
            email: 'priya.sharma.cse25002@jecrc.edu'
          },
          assignedTo: {
            id: 'FAC002',
            name: 'Dr. Rajesh Kumar',
            email: 'rajesh.kumar@jecrc.edu'
          },
          status: 'approved',
          priority: 'high',
          uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          comments: 'Fee receipt verified and approved.',
          approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          approvedBy: {
            id: 'FAC002',
            name: 'Dr. Rajesh Kumar'
          }
        },
        {
          id: 'DOC003',
          title: 'Leave Application',
          description: 'Medical leave application with doctor certificate',
          fileName: 'medical_leave_application.pdf',
          fileSize: 512000, // 500KB
          uploadedBy: {
            id: 'JECRC-CSE-21-003',
            name: 'Amit Patel',
            email: 'amit.patel.cse25003@jecrc.edu'
          },
          assignedTo: {
            id: 'FAC001',
            name: 'Dr. Kavya Sharma',
            email: 'kavya@jecrc.edu'
          },
          status: 'rejected',
          priority: 'medium',
          uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          comments: 'Incomplete documentation. Please submit updated medical certificate.',
          approvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
          approvedBy: {
            id: 'FAC001',
            name: 'Dr. Kavya Sharma'
          }
        }
      ];
      
      localStorage.setItem('demo_documents', JSON.stringify(demoDocuments));
    }

    // Initialize notifications
    if (!localStorage.getItem('demo_notifications')) {
      localStorage.setItem('demo_notifications', JSON.stringify([]));
    }
  }

  // Get all documents
  async getAllDocuments() {
    await this.simulateDelay();
    const documents = JSON.parse(localStorage.getItem('demo_documents') || '[]');
    return { success: true, data: documents };
  }

  // Get documents for a specific user
  async getUserDocuments(userId) {
    await this.simulateDelay();
    const documents = JSON.parse(localStorage.getItem('demo_documents') || '[]');
    const userDocuments = documents.filter(doc => doc.uploadedBy.id === userId);
    return { success: true, data: userDocuments };
  }

  // Get pending documents for approval (faculty)
  async getPendingApprovals(facultyId) {
    await this.simulateDelay();
    const documents = JSON.parse(localStorage.getItem('demo_documents') || '[]');
    const pendingDocs = documents.filter(doc => 
      doc.assignedTo.id === facultyId && doc.status === 'pending'
    );
    return { success: true, data: pendingDocs };
  }

  // Upload a new document
  async uploadDocument(documentData) {
    await this.simulateDelay();
    const documents = JSON.parse(localStorage.getItem('demo_documents') || '[]');
    
    const newDocument = {
      id: `DOC${String(documents.length + 1).padStart(3, '0')}`,
      ...documentData,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      comments: '',
      approvedAt: null,
      approvedBy: null
    };

    documents.push(newDocument);
    localStorage.setItem('demo_documents', JSON.stringify(documents));

    // Add notification for faculty
    this.addNotification({
      type: 'document_upload',
      title: 'New Document for Approval',
      message: `${newDocument.uploadedBy.name} uploaded "${newDocument.title}" for approval`,
      recipientId: newDocument.assignedTo.id,
      documentId: newDocument.id
    });

    return { success: true, data: newDocument };
  }

  // Approve or reject a document
  async updateDocumentStatus(documentId, status, comments = '', facultyInfo) {
    await this.simulateDelay();
    const documents = JSON.parse(localStorage.getItem('demo_documents') || '[]');
    const docIndex = documents.findIndex(doc => doc.id === documentId);
    
    if (docIndex === -1) {
      return { success: false, error: 'Document not found' };
    }

    documents[docIndex] = {
      ...documents[docIndex],
      status,
      comments,
      approvedAt: new Date().toISOString(),
      approvedBy: facultyInfo
    };

    localStorage.setItem('demo_documents', JSON.stringify(documents));

    // Add notification for student
    const document = documents[docIndex];
    this.addNotification({
      type: 'document_status',
      title: `Document ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your document "${document.title}" has been ${status}`,
      recipientId: document.uploadedBy.id,
      documentId: documentId
    });

    return { success: true, data: documents[docIndex] };
  }

  // Add notification
  addNotification(notification) {
    const notifications = JSON.parse(localStorage.getItem('demo_notifications') || '[]');
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    notifications.unshift(newNotification);
    localStorage.setItem('demo_notifications', JSON.stringify(notifications));
  }

  // Get notifications for user
  async getNotifications(userId) {
    await this.simulateDelay();
    const notifications = JSON.parse(localStorage.getItem('demo_notifications') || '[]');
    const userNotifications = notifications.filter(notif => notif.recipientId === userId);
    return { success: true, data: userNotifications };
  }

  // Simulate network delay
  simulateDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get demo faculty mapping for document assignment
  getFacultyMapping(studentEmail) {
    // Demo mapping - in real app this would be based on department/course
    const mappings = {
      'suresh.shah.cse25001@jecrc.edu': {
        id: 'FAC001',
        name: 'Dr. Kavya Sharma',
        email: 'kavya@jecrc.edu'
      },
      'priya.sharma.cse25002@jecrc.edu': {
        id: 'FAC002',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@jecrc.edu'
      }
    };
    
    return mappings[studentEmail] || {
      id: 'FAC001',
      name: 'Dr. Kavya Sharma',
      email: 'kavya@jecrc.edu'
    };
  }

  // Clear all demo data (for testing)
  clearDemoData() {
    localStorage.removeItem('demo_documents');
    localStorage.removeItem('demo_notifications');
    this.initializeStorage();
  }

  // Get document statistics
  async getDocumentStats() {
    await this.simulateDelay();
    const documents = JSON.parse(localStorage.getItem('demo_documents') || '[]');
    
    const stats = {
      total: documents.length,
      pending: documents.filter(doc => doc.status === 'pending').length,
      approved: documents.filter(doc => doc.status === 'approved').length,
      rejected: documents.filter(doc => doc.status === 'rejected').length
    };
    
    return { success: true, data: stats };
  }
}

// Export singleton instance
export const mockDocumentService = new MockDocumentService();
export default mockDocumentService;