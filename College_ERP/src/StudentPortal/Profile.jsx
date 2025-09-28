import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  AccountCircle as AccountCircleIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Verified as VerifiedIcon,
  Work as WorkIcon,
  LocalLibrary as LocalLibraryIcon,
  Download as DownloadIcon,
  FamilyRestroom as FamilyRestroomIcon,
  Cake as CakeIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Public as PublicIcon,
  LocationCity as LocationCityIcon,
  LocationOn as LocationOnIcon,
  Badge as BadgeIcon,
  Bloodtype as BloodtypeIcon,
  Emergency as EmergencyIcon,
} from "@mui/icons-material";

export default function StudentDetails({ profile }) {
  const idCardRef = useRef(null);
  const [showModal, setShowModal] = useState({ open: false, content: "" });


  // Sample student data (non-editable)
  const studentData = {
    fullName: profile?.name || "Suresh Shah",
    studentId: "JECRC-CSE-21-001",
    fathersName: "Mr. Pratham Shah",
    mothersName: "Mrs. Savita Shah",
    dob: "2003-05-15",
    age: 22,
    gender: "Male",
    mobileNumber: "+91-9876543210",
    email: "suresh.shah@jecrcu.edu.in",
    address: {
      country: "India",
      state: "Rajasthan",
      district: "Jaipur",
      city: "Jaipur",
      pinCode: "303905",
      fullAddress: "123 Vidhani, Sitapura Industrial Area, Jaipur, Rajasthan 303905",
    },
    educationalHistory: {
      tenth: {
        schoolName: "XYZ High School, Jaipur",
        board: "CBSE",
        marks: "92%",
        yearOfPassing: "2019",
      },
      twelfth: {
        schoolName: "ABC Senior Secondary School, Jaipur",
        board: "CBSE",
        marks: "88%",
        yearOfPassing: "2021",
      },
    },
    bloodGroup: "O+",
    emergencyContact: {
      name: "Mr. Pratham Shah",
      relation: "Father",
      phone: "+91-8765432109",
    },
    nationality: "Indian",
    category: "General",
    aadhaarNumber: "1234 5678 9012",
    passportNumber: "N/A",
    department: "Computer Science & Engineering",
    course: "B.Tech (CSE)",
    enrollmentYear: "2023",
    scholarshipStatus: "Active (Merit-Based)",
    academicStatus: "Good Standing",
    cgpa: "8.5",
    placementStatus: "Eligible",
    libraryFines: "₹0",
  };

  // Handle PDF download
  const handleDownloadID = () => {
    if (idCardRef.current) {
      html2canvas(idCardRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("./pratham.jpg");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [87, 124],
        });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("student_id_card.pdf");
      });
    }
  };

  // Handle clickable feature actions
  const handleFeatureClick = (feature) => {
    let content = "";
    switch (feature) {
      case "profile":
        content = `Name: ${studentData.fullName}\nID: ${studentData.studentId}\nFather's Name: ${studentData.fathersName}\nMother's Name: ${studentData.mothersName}\nDOB: ${studentData.dob}\nAge: ${studentData.age}\nGender: ${studentData.gender}\nMobile: ${studentData.mobileNumber}\nEmail: ${studentData.email}\nAddress: ${studentData.address.fullAddress}\nNationality: ${studentData.nationality}\nCategory: ${studentData.category}\nAadhaar: ${studentData.aadhaarNumber}\nPassport: ${studentData.passportNumber}\nBlood Group: ${studentData.bloodGroup}\nEmergency Contact: ${studentData.emergencyContact.name} (${studentData.emergencyContact.relation}) - ${studentData.emergencyContact.phone}`;
        break;
      case "academic":
        content = `Department: ${studentData.department}\nCourse: ${studentData.course}\nEnrollment Year: ${studentData.enrollmentYear}\nCGPA: ${studentData.cgpa}\nStatus: ${studentData.academicStatus}`;
        break;
      case "education":
        content = `10th: ${studentData.educationalHistory.tenth.schoolName}, ${studentData.educationalHistory.tenth.board}, ${studentData.educationalHistory.tenth.marks}, ${studentData.educationalHistory.tenth.yearOfPassing}\n12th: ${studentData.educationalHistory.twelfth.schoolName}, ${studentData.educationalHistory.twelfth.board}, ${studentData.educationalHistory.twelfth.marks}, ${studentData.educationalHistory.twelfth.yearOfPassing}`;
        break;
      case "scholarship":
        content = `Status: ${studentData.scholarshipStatus}\nCheck eligibility and apply via portal.`;
        break;
      case "certification":
        content = `Status: Verified\nDownload certificates from the academic office.`;
        break;
      case "placement":
        content = `Status: ${studentData.placementStatus}\nView opportunities on placement portal.`;
        break;
      case "library":
        content = `Fines: ${studentData.libraryFines}\nManage books on library portal.`;
        break;
      default:
        content = "Feature details loading...";
    }
    setShowModal({ open: true, content });
  };

  // Close modal
  const closeModal = () => setShowModal({ open: false, content: "" });

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <img src="/image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>Student Profile</h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Personal and academic information</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
          <div className="flex items-center gap-2 mb-2">
            <AccountCircleIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Student ID</span>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{studentData.studentId}</p>
        </div>
        
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
          <div className="flex items-center gap-2 mb-2">
            <SchoolIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>CGPA</span>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{studentData.cgpa}</p>
        </div>
        
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
          <div className="flex items-center gap-2 mb-2">
            <CakeIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Age</span>
          </div>
          <p className="text-xl font-bold" style={{ color: 'var(--text)' }}>{studentData.age}</p>
        </div>
        
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
          <div className="flex items-center gap-2 mb-2">
            <VerifiedIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Status</span>
          </div>
          <p className="text-lg font-bold text-green-600">Active</p>
        </div>
      </div>

      {/* Student Details Section */}
      <div className="space-y-6 mb-8">
        {/* Profile Overview */}
        <div
          className="p-6 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: 'var(--card)' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--soft)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
          onClick={() => handleFeatureClick("profile")}
        >
          <div className="flex items-center gap-2 mb-4">
            <AccountCircleIcon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Profile Overview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Name:</span> <span style={{ color: 'var(--muted)' }}>{studentData.fullName}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Father's Name:</span> <span style={{ color: 'var(--muted)' }}>{studentData.fathersName}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Mother's Name:</span> <span style={{ color: 'var(--muted)' }}>{studentData.mothersName}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Department:</span> <span style={{ color: 'var(--muted)' }}>{studentData.department}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Course:</span> <span style={{ color: 'var(--muted)' }}>{studentData.course}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Enrollment Year:</span> <span style={{ color: 'var(--muted)' }}>{studentData.enrollmentYear}</span></div>
          </div>
        </div>

        {/* Personal Information */}
        <div
          className="p-6 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: 'var(--card)' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--soft)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
          onClick={() => handleFeatureClick("profile")}
        >
          <div className="flex items-center gap-2 mb-4">
            <CakeIcon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>DOB:</span> <span style={{ color: 'var(--muted)' }}>{studentData.dob}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Age:</span> <span style={{ color: 'var(--muted)' }}>{studentData.age}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Gender:</span> <span style={{ color: 'var(--muted)' }}>{studentData.gender}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Mobile:</span> <span style={{ color: 'var(--muted)' }}>{studentData.mobileNumber}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Email:</span> <span style={{ color: 'var(--muted)' }}>{studentData.email}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Nationality:</span> <span style={{ color: 'var(--muted)' }}>{studentData.nationality}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Category:</span> <span style={{ color: 'var(--muted)' }}>{studentData.category}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Aadhaar:</span> <span style={{ color: 'var(--muted)' }}>{studentData.aadhaarNumber}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Passport:</span> <span style={{ color: 'var(--muted)' }}>{studentData.passportNumber}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Blood Group:</span> <span style={{ color: 'var(--muted)' }}>{studentData.bloodGroup}</span></div>
          </div>
        </div>

        {/* Address Information */}
        <div
          className="p-6 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: 'var(--card)' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--soft)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
          onClick={() => handleFeatureClick("profile")}
        >
          <div className="flex items-center gap-2 mb-4">
            <HomeIcon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Address Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Country:</span> <span style={{ color: 'var(--muted)' }}>{studentData.address.country}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>State:</span> <span style={{ color: 'var(--muted)' }}>{studentData.address.state}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>District:</span> <span style={{ color: 'var(--muted)' }}>{studentData.address.district}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>City:</span> <span style={{ color: 'var(--muted)' }}>{studentData.address.city}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>PIN Code:</span> <span style={{ color: 'var(--muted)' }}>{studentData.address.pinCode}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Full Address:</span> <span style={{ color: 'var(--muted)' }}>{studentData.address.fullAddress}</span></div>
          </div>
        </div>

        {/* Educational History */}
        <div
          className="p-6 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: 'var(--card)' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--soft)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
          onClick={() => handleFeatureClick("education")}
        >
          <div className="flex items-center gap-2 mb-4">
            <FamilyRestroomIcon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Educational History</h3>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2" style={{ color: 'var(--text)' }}>10th Grade</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium" style={{ color: 'var(--text)' }}>School:</span> <span style={{ color: 'var(--muted)' }}>{studentData.educationalHistory.tenth.schoolName}</span></div>
                <div><span className="font-medium" style={{ color: 'var(--text)' }}>Board:</span> <span style={{ color: 'var(--muted)' }}>{studentData.educationalHistory.tenth.board}</span></div>
                <div><span className="font-medium" style={{ color: 'var(--text)' }}>Marks:</span> <span style={{ color: 'var(--muted)' }}>{studentData.educationalHistory.tenth.marks}</span></div>
                <div><span className="font-medium" style={{ color: 'var(--text)' }}>Year:</span> <span style={{ color: 'var(--muted)' }}>{studentData.educationalHistory.tenth.yearOfPassing}</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2" style={{ color: 'var(--text)' }}>12th Grade</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium" style={{ color: 'var(--text)' }}>School:</span> <span style={{ color: 'var(--muted)' }}>{studentData.educationalHistory.twelfth.schoolName}</span></div>
                <div><span className="font-medium" style={{ color: 'var(--text)' }}>Board:</span> <span style={{ color: 'var(--muted)' }}>{studentData.educationalHistory.twelfth.board}</span></div>
                <div><span className="font-medium" style={{ color: 'var(--text)' }}>Marks:</span> <span style={{ color: 'var(--muted)' }}>{studentData.educationalHistory.twelfth.marks}</span></div>
                <div><span className="font-medium" style={{ color: 'var(--text)' }}>Year:</span> <span style={{ color: 'var(--muted)' }}>{studentData.educationalHistory.twelfth.yearOfPassing}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div
          className="p-6 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: 'var(--card)' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--soft)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
          onClick={() => handleFeatureClick("profile")}
        >
          <div className="flex items-center gap-2 mb-4">
            <PhoneIcon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Emergency Contact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Name:</span> <span style={{ color: 'var(--muted)' }}>{studentData.emergencyContact.name}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Relation:</span> <span style={{ color: 'var(--muted)' }}>{studentData.emergencyContact.relation}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Phone:</span> <span style={{ color: 'var(--muted)' }}>{studentData.emergencyContact.phone}</span></div>
          </div>
        </div>

        {/* Academic Progress */}
        <div
          className="p-6 rounded-lg cursor-pointer transition-colors"
          style={{ backgroundColor: 'var(--card)' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--soft)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
          onClick={() => handleFeatureClick("academic")}
        >
          <div className="flex items-center gap-2 mb-4">
            <SchoolIcon className="h-6 w-6" style={{ color: 'var(--accent)' }} />
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Academic Progress</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>CGPA:</span> <span style={{ color: 'var(--muted)' }}>{studentData.cgpa}</span></div>
            <div><span className="font-medium" style={{ color: 'var(--text)' }}>Status:</span> <span style={{ color: 'var(--muted)' }}>{studentData.academicStatus}</span></div>
          </div>
        </div>

        {/* Additional Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Scholarship Tracking */}
          <div
            className="p-4 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: 'var(--card)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--soft)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
            onClick={() => handleFeatureClick("scholarship")}
          >
            <div className="flex items-center gap-2 mb-3">
              <AssessmentIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <h4 className="font-semibold" style={{ color: 'var(--text)' }}>Scholarship</h4>
            </div>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{studentData.scholarshipStatus}</p>
          </div>

          {/* Certification Verification */}
          <div
            className="p-4 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: 'var(--card)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--soft)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
            onClick={() => handleFeatureClick("certification")}
          >
            <div className="flex items-center gap-2 mb-3">
              <VerifiedIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <h4 className="font-semibold" style={{ color: 'var(--text)' }}>Certification</h4>
            </div>
            <p className="text-sm" style={{ color: 'var(--success)' }}>Verified</p>
          </div>

          {/* Placement Statistics */}
          <div
            className="p-4 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: 'var(--card)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--soft)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
            onClick={() => handleFeatureClick("placement")}
          >
            <div className="flex items-center gap-2 mb-3">
              <WorkIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <h4 className="font-semibold" style={{ color: 'var(--text)' }}>Placement</h4>
            </div>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{studentData.placementStatus}</p>
          </div>

          {/* Library Status */}
          <div
            className="p-4 rounded-lg cursor-pointer transition-colors"
            style={{ backgroundColor: 'var(--card)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--soft)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
            onClick={() => handleFeatureClick("library")}
          >
            <div className="flex items-center gap-2 mb-3">
              <LocalLibraryIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <h4 className="font-semibold" style={{ color: 'var(--text)' }}>Library Status</h4>
            </div>
            <p className="text-sm" style={{ color: 'var(--success)' }}>{studentData.libraryFines}</p>
          </div>
        </div>

        {/* ID Card Section */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Student ID Card</h3>
          <div className="mt-6 flex justify-center">
            <div
              ref={idCardRef}
              className="overflow-hidden shadow-lg rounded-xl bg-white"
              style={{ width: 330, minHeight: 470 }}
            >
              <div style={{ background: "linear-gradient(120deg, #a60514 70%, #fff 30%)", height: 110, position: "relative" }}>
                <img
                  src="./pratham.jpg" // Replace with student photo URL
                  alt="ID"
                  style={{
                    position: "absolute",
                    left: 20,
                    bottom: -45,
                    borderRadius: "50%",
                    width: 90,
                    height: 90,
                    objectFit: "cover",
                    boxShadow: "0 4px 16px #bbb",
                  }}
                />
                <div style={{ position: "absolute", right: 15, top: 15, color: "#fff", fontWeight: 700 }}>
                  JECRC UNIVERSITY
                </div>
              </div>
              <div className="px-5 pt-12 pb-3">
                <div className="text-lg font-bold">{studentData.fullName}</div>
                <div className="text-sm text-red-700 mb-1">Student</div>
                <div className="text-xs mb-1"><b>ID No:</b> {studentData.studentId}</div>
                <div className="text-xs mb-1"><b>Department:</b> {studentData.department}</div>
                <div className="text-xs mb-1"><b>DOB:</b> {studentData.dob}</div>
                <div className="text-xs mb-1"><b>Email:</b> {studentData.email}</div>
                <div className="text-xs mb-1"><b>Phone:</b> {studentData.mobileNumber}</div>
                <div className="text-xs mb-1"><b>Address:</b> {studentData.address.fullAddress}</div>
                <div className="text-xs mb-1"><b>Joined Date:</b> {studentData.enrollmentYear}-07-01</div>
                <div className="text-xs mb-1"><b>Expire Date:</b> {new Date().getFullYear() + 4}-06-30</div>
                <div className="mt-2 mb-1 flex justify-center">
                  <div
                    style={{
                      width: "130px",
                      height: "32px",
                      background: "repeating-linear-gradient(90deg,#333 0 2px,#fff 2px 6px)",
                    }}
                  />
                </div>
                <div className="mt-3 mb-1 text-xs text-right">Your Signature</div>
                <div className="text-xs text-right font-semibold">Registrar</div>
              </div>
              <div style={{ background: "#a60514", height: 25 }} />
            </div>
          </div>
          <button
            onClick={handleDownloadID}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--secondary)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent)'}
          >
            <DownloadIcon /> Download ID Card (PDF)
          </button>
        </div>

        {/* Modal for Feature Details */}
        {showModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="rounded-lg shadow-xl w-11/12 md:w-3/4 max-w-2xl p-6 relative" style={{ backgroundColor: 'var(--card)' }}>
              <button 
                onClick={closeModal} 
                className="absolute top-4 right-4 text-2xl transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}
              >&times;</button>
              <pre className="whitespace-pre-wrap" style={{ color: 'var(--text)' }}>{showModal.content}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
    );
}