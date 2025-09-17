const crypto = require('crypto');
const { Student, Faculty } = require('../models');

class CredentialGenerator {
  
  /**
   * Generate unique Student ID
   * Format: DEPT-YEAR-SEQUENCE (e.g., CSE-24-001)
   */
  static async generateStudentId(department, admissionYear) {
    const deptCode = this.getDepartmentCode(department);
    const yearCode = admissionYear.toString().slice(-2); // Last 2 digits of year
    
    let sequence = 1;
    let studentId;
    let isUnique = false;
    
    while (!isUnique) {
      const sequenceStr = sequence.toString().padStart(3, '0');
      studentId = `${deptCode}-${yearCode}-${sequenceStr}`;
      
      // Check if this ID already exists
      const existingStudent = await Student.findOne({ 
        where: { Student_ID: studentId } 
      });
      
      if (!existingStudent) {
        isUnique = true;
      } else {
        sequence++;
      }
    }
    
    return studentId;
  }
  
  /**
   * Generate unique Enrollment Number
   * Format: COLLEGE-YEAR-DEPT-SEQUENCE (e.g., JECRC-2024-CSE-001)
   */
  static async generateEnrollmentNumber(department, admissionYear, collegeCode = 'JECRC') {
    const deptCode = this.getDepartmentCode(department);
    
    let sequence = 1;
    let enrollmentNo;
    let isUnique = false;
    
    while (!isUnique) {
      const sequenceStr = sequence.toString().padStart(3, '0');
      enrollmentNo = `${collegeCode}-${admissionYear}-${deptCode}-${sequenceStr}`;
      
      // Check if this enrollment number already exists
      const existingStudent = await Student.findOne({ 
        where: { Enrollment_No: enrollmentNo } 
      });
      
      if (!existingStudent) {
        isUnique = true;
      } else {
        sequence++;
      }
    }
    
    return enrollmentNo;
  }
  
  /**
   * Generate unique Roll Number
   * Format: DEPT-SECTION-SEQUENCE (e.g., CSE-A-01)
   */
  static async generateRollNumber(department, section) {
    const deptCode = this.getDepartmentCode(department);
    
    let sequence = 1;
    let rollNo;
    let isUnique = false;
    
    while (!isUnique) {
      const sequenceStr = sequence.toString().padStart(2, '0');
      rollNo = `${deptCode}-${section}-${sequenceStr}`;
      
      // Check if this roll number already exists
      const existingStudent = await Student.findOne({ 
        where: { Roll_No: rollNo } 
      });
      
      if (!existingStudent) {
        isUnique = true;
      } else {
        sequence++;
      }
    }
    
    return rollNo;
  }
  
  /**
   * Generate unique Faculty ID
   * Format: FAC-DEPT-SEQUENCE (e.g., FAC-CSE-001)
   */
  static async generateFacultyId(department) {
    const deptCode = this.getDepartmentCode(department);
    
    let sequence = 1;
    let facultyId;
    let isUnique = false;
    
    while (!isUnique) {
      const sequenceStr = sequence.toString().padStart(3, '0');
      facultyId = `FAC-${deptCode}-${sequenceStr}`;
      
      // Check if this faculty ID already exists
      const existingFaculty = await Faculty.findOne({ 
        where: { Faculty_ID: facultyId } 
      });
      
      if (!existingFaculty) {
        isUnique = true;
      } else {
        sequence++;
      }
    }
    
    return facultyId;
  }
  
  /**
   * Generate unique Employee ID for faculty
   * Format: EMP-YEAR-SEQUENCE (e.g., EMP-2024-001)
   */
  static async generateEmployeeId(joiningYear) {
    let sequence = 1;
    let employeeId;
    let isUnique = false;
    
    while (!isUnique) {
      const sequenceStr = sequence.toString().padStart(3, '0');
      employeeId = `EMP-${joiningYear}-${sequenceStr}`;
      
      // Check if this employee ID already exists
      const existingFaculty = await Faculty.findOne({ 
        where: { employeeId: employeeId } 
      });
      
      if (!existingFaculty) {
        isUnique = true;
      } else {
        sequence++;
      }
    }
    
    return employeeId;
  }
  
  /**
   * Generate secure random password
   */
  static generatePassword(length = 8) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      let password = '';
      
      for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset[randomIndex];
      }
      
      // Check if password meets criteria
      if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return password;
      }
      
      attempts++;
    }
    
    // Fallback: construct a password that meets criteria
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = '@#$%&*';
    
    let password = '';
    password += lower[crypto.randomInt(0, lower.length)];
    password += upper[crypto.randomInt(0, upper.length)];
    password += digits[crypto.randomInt(0, digits.length)];
    
    for (let i = 3; i < length; i++) {
      password += charset[crypto.randomInt(0, charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
  
  /**
   * Generate institutional email for students
   * Format: firstname.lastname.studentid@college.edu
   */
  static generateStudentEmail(fullName, studentId, domain = 'jecrc.edu') {
    const nameParts = fullName.toLowerCase().trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    const idSuffix = studentId.toLowerCase().replace(/-/g, '');
    
    return `${firstName}.${lastName}.${idSuffix}@${domain}`;
  }
  
  /**
   * Generate institutional email for faculty
   * Format: firstname.lastname@college.edu
   */
  static generateFacultyEmail(fullName, domain = 'jecrc.edu') {
    const nameParts = fullName.toLowerCase().trim().split(' ');
    
    // Filter out titles and empty strings
    const titles = ['dr', 'prof', 'mr', 'ms', 'mrs', 'miss'];
    const filteredParts = nameParts.filter(part => 
      part.length > 0 && !titles.includes(part.replace('.', ''))
    );
    
    // Get first and last meaningful names
    const firstName = filteredParts[0] || 'faculty';
    const lastName = filteredParts[filteredParts.length - 1] || 'user';
    
    // Ensure no double dots
    const cleanFirstName = firstName.replace(/[^a-z0-9]/g, '');
    const cleanLastName = lastName.replace(/[^a-z0-9]/g, '');
    
    return `${cleanFirstName}.${cleanLastName}@${domain}`;
  }
  
  /**
   * Get department code from full department name
   */
  static getDepartmentCode(department) {
    const deptCodes = {
      'Computer Science Engineering': 'CSE',
      'Computer Science and Engineering': 'CSE',
      'Information Technology': 'IT',
      'Electronics and Communication Engineering': 'ECE',
      'Electrical Engineering': 'EE',
      'Mechanical Engineering': 'ME',
      'Civil Engineering': 'CE',
      'Biotechnology': 'BT',
      'Chemical Engineering': 'CHE',
      'Aerospace Engineering': 'AE',
      'Automobile Engineering': 'AUTO',
      'Business Administration': 'MBA',
      'Master of Computer Applications': 'MCA',
      'Bachelor of Computer Applications': 'BCA',
      'Commerce': 'COM',
      'Arts': 'ARTS',
      'Science': 'SCI'
    };
    
    // Try exact match first
    if (deptCodes[department]) {
      return deptCodes[department];
    }
    
    // Try partial matches
    for (const [key, value] of Object.entries(deptCodes)) {
      if (department.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(department.toLowerCase())) {
        return value;
      }
    }
    
    // Fallback: use first 3 letters of department name
    return department.substring(0, 3).toUpperCase();
  }
  
  /**
   * Validate if credentials are unique before saving
   */
  static async validateUniqueCredentials(type, credentials) {
    const errors = [];
    
    if (type === 'student') {
      // Check Student ID
      if (credentials.Student_ID) {
        const existingById = await Student.findOne({ 
          where: { Student_ID: credentials.Student_ID } 
        });
        if (existingById) {
          errors.push(`Student ID ${credentials.Student_ID} already exists`);
        }
      }
      
      // Check Email
      if (credentials.Email_ID) {
        const existingByEmail = await Student.findOne({ 
          where: { Email_ID: credentials.Email_ID } 
        });
        if (existingByEmail) {
          errors.push(`Email ${credentials.Email_ID} already exists`);
        }
      }
      
      // Check Enrollment Number
      if (credentials.Enrollment_No) {
        const existingByEnrollment = await Student.findOne({ 
          where: { Enrollment_No: credentials.Enrollment_No } 
        });
        if (existingByEnrollment) {
          errors.push(`Enrollment Number ${credentials.Enrollment_No} already exists`);
        }
      }
      
      // Check Roll Number
      if (credentials.Roll_No) {
        const existingByRoll = await Student.findOne({ 
          where: { Roll_No: credentials.Roll_No } 
        });
        if (existingByRoll) {
          errors.push(`Roll Number ${credentials.Roll_No} already exists`);
        }
      }
    }
    
    if (type === 'faculty') {
      // Check Faculty ID
      if (credentials.Faculty_ID) {
        const existingById = await Faculty.findOne({ 
          where: { Faculty_ID: credentials.Faculty_ID } 
        });
        if (existingById) {
          errors.push(`Faculty ID ${credentials.Faculty_ID} already exists`);
        }
      }
      
      // Check Email
      if (credentials.Email_ID) {
        const existingByEmail = await Faculty.findOne({ 
          where: { Email_ID: credentials.Email_ID } 
        });
        if (existingByEmail) {
          errors.push(`Email ${credentials.Email_ID} already exists`);
        }
      }
      
      // Check Employee ID
      if (credentials.employeeId) {
        const existingByEmpId = await Faculty.findOne({ 
          where: { employeeId: credentials.employeeId } 
        });
        if (existingByEmpId) {
          errors.push(`Employee ID ${credentials.employeeId} already exists`);
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
  /**
   * Generate complete credential set for new student
   */
  static async generateCompleteStudentCredentials(studentData) {
    const {
      Full_Name,
      Department,
      Section,
      'Batch/Year': batchYear
    } = studentData;
    
    const admissionYear = new Date().getFullYear();
    
    const credentials = {
      Student_ID: await this.generateStudentId(Department, admissionYear),
      Enrollment_No: await this.generateEnrollmentNumber(Department, admissionYear),
      Roll_No: await this.generateRollNumber(Department, Section),
      Email_ID: this.generateStudentEmail(Full_Name, await this.generateStudentId(Department, admissionYear)),
      password: this.generatePassword(),
      admissionDate: new Date(),
      expectedGraduationDate: new Date(admissionYear + 4, 5, 30) // 4 years from admission
    };
    
    return credentials;
  }
  
  /**
   * Generate complete credential set for new faculty
   */
  static async generateCompleteFacultyCredentials(facultyData) {
    const {
      Full_Name,
      Department
    } = facultyData;
    
    const joiningYear = new Date().getFullYear();
    
    const credentials = {
      Faculty_ID: await this.generateFacultyId(Department),
      employeeId: await this.generateEmployeeId(joiningYear),
      Email_ID: this.generateFacultyEmail(Full_Name),
      password: this.generatePassword(),
      joiningDate: new Date(),
      assignedDepartments: [Department],
      assignedSections: [] // Will be assigned later by admin
    };
    
    return credentials;
  }
}

module.exports = CredentialGenerator;
