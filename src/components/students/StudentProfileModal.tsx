import React, { useState, useEffect } from 'react';
import { Student, AcademicRecord, AttendanceRecord, EnrollmentHistory, AttendanceSummary, useStudents } from '@/hooks/useStudents';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  studentId
}) => {
  const { getStudent, getAttendanceSummary } = useStudents();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [student, setStudent] = useState<Student | null>(null);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [enrollmentHistory, setEnrollmentHistory] = useState<EnrollmentHistory[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);

  useEffect(() => {
    if (isOpen && studentId) {
      loadStudentData();
    }
  }, [isOpen, studentId]);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      const data = await getStudent(studentId);
      if (data) {
        setStudent(data.student);
        setAcademicRecords(data.academicRecords);
        setAttendanceRecords(data.attendanceRecords);
        setEnrollmentHistory(data.enrollmentHistory);
      }

      const summary = await getAttendanceSummary(studentId);
      if (summary) {
        setAttendanceSummary(summary);
      }
    } catch (err) {
      console.error('Failed to load student data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'academics', label: 'Academics' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'history', label: 'History' }
  ];

  // Calculate GPA from academic records
  const calculateGPA = () => {
    if (academicRecords.length === 0) return 0;
    const total = academicRecords.reduce((sum, r) => sum + (r.grade || 0), 0);
    return (total / academicRecords.length).toFixed(2);
  };

  // Group academic records by term
  const recordsByTerm = academicRecords.reduce((acc, record) => {
    const key = `${record.school_year} - ${record.term}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(record);
    return acc;
  }, {} as Record<string, AcademicRecord[]>);

  // Calculate attendance percentage
  const attendancePercentage = attendanceSummary
    ? ((attendanceSummary.present / attendanceSummary.total) * 100).toFixed(1)
    : '0';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {student ? `${student.first_name[0]}${student.last_name[0]}` : '??'}
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {student ? `${student.last_name}, ${student.first_name} ${student.middle_name || ''}` : 'Loading...'}
                </h2>
                <p className="text-blue-100">
                  {student?.lrn} | {student?.current_grade_level} - {student?.current_section}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 rounded p-2 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && student && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                      <p className="text-blue-100 text-sm">Average Grade</p>
                      <p className="text-3xl font-bold">{calculateGPA()}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                      <p className="text-green-100 text-sm">Attendance Rate</p>
                      <p className="text-3xl font-bold">{attendancePercentage}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                      <p className="text-purple-100 text-sm">Status</p>
                      <p className="text-xl font-bold">{student.status}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                      <p className="text-orange-100 text-sm">School Year</p>
                      <p className="text-xl font-bold">{student.current_school_year}</p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-white border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{student.last_name}, {student.first_name} {student.middle_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{student.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Birth Date</p>
                        <p className="font-medium">{new Date(student.birth_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Birth Place</p>
                        <p className="font-medium">{student.birth_place || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Nationality</p>
                        <p className="font-medium">{student.nationality || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Religion</p>
                        <p className="font-medium">{student.religion || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{student.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{student.phone || 'N/A'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">
                          {[student.address_street, student.address_barangay, student.address_city, student.address_province].filter(Boolean).join(', ') || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="bg-white border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Guardian Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Guardian Name</p>
                        <p className="font-medium">{student.guardian_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Relationship</p>
                        <p className="font-medium">{student.guardian_relationship || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Guardian Phone</p>
                        <p className="font-medium">{student.guardian_phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Mother's Name</p>
                        <p className="font-medium">{student.mother_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Father's Name</p>
                        <p className="font-medium">{student.father_name || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Academics Tab */}
              {activeTab === 'academics' && (
                <div className="space-y-6">
                  {/* Grade Chart */}
                  <div className="bg-white border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Performance</h3>
                    {academicRecords.length > 0 ? (
                      <div className="space-y-4">
                        {/* Simple bar chart for grades */}
                        <div className="grid grid-cols-1 gap-3">
                          {Object.entries(
                            academicRecords.reduce((acc, r) => {
                              if (!acc[r.subject]) acc[r.subject] = [];
                              acc[r.subject].push(r.grade);
                              return acc;
                            }, {} as Record<string, number[]>)
                          ).map(([subject, grades]) => {
                            const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
                            return (
                              <div key={subject} className="flex items-center gap-4">
                                <div className="w-32 text-sm text-gray-600 truncate">{subject}</div>
                                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                  <div
                                    className={`h-6 rounded-full ${
                                      avg >= 90 ? 'bg-green-500' :
                                      avg >= 80 ? 'bg-blue-500' :
                                      avg >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${avg}%` }}
                                  />
                                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                    {avg.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No academic records available</p>
                    )}
                  </div>

                  {/* Grades by Term */}
                  {Object.entries(recordsByTerm).map(([term, records]) => (
                    <div key={term} className="bg-white border rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-6 py-3 border-b">
                        <h4 className="font-semibold text-gray-800">{term}</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Subject</th>
                              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Grade</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {records.map(record => (
                              <tr key={record.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm">{record.subject}</td>
                                <td className="px-4 py-2 text-center">
                                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                                    record.grade >= 90 ? 'bg-green-100 text-green-700' :
                                    record.grade >= 80 ? 'bg-blue-100 text-blue-700' :
                                    record.grade >= 75 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {record.grade}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600">{record.remarks || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Attendance Tab */}
              {activeTab === 'attendance' && (
                <div className="space-y-6">
                  {/* Attendance Summary */}
                  {attendanceSummary && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-gray-100 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-gray-800">{attendanceSummary.total}</p>
                        <p className="text-sm text-gray-600">Total Days</p>
                      </div>
                      <div className="bg-green-100 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-700">{attendanceSummary.present}</p>
                        <p className="text-sm text-green-600">Present</p>
                      </div>
                      <div className="bg-red-100 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-red-700">{attendanceSummary.absent}</p>
                        <p className="text-sm text-red-600">Absent</p>
                      </div>
                      <div className="bg-yellow-100 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-700">{attendanceSummary.late}</p>
                        <p className="text-sm text-yellow-600">Late</p>
                      </div>
                      <div className="bg-blue-100 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-700">{attendanceSummary.excused}</p>
                        <p className="text-sm text-blue-600">Excused</p>
                      </div>
                    </div>
                  )}

                  {/* Attendance Records */}
                  <div className="bg-white border rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b">
                      <h4 className="font-semibold text-gray-800">Recent Attendance Records</h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Status</th>
                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Time In</th>
                            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Time Out</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {attendanceRecords.length > 0 ? (
                            attendanceRecords.map(record => (
                              <tr key={record.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm">
                                  {new Date(record.attendance_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </td>
                                <td className="px-4 py-2 text-center">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    record.status === 'Present' ? 'bg-green-100 text-green-700' :
                                    record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                                    record.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {record.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2 text-sm text-center text-gray-600">{record.time_in || '-'}</td>
                                <td className="px-4 py-2 text-sm text-center text-gray-600">{record.time_out || '-'}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{record.remarks || '-'}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                No attendance records available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <div className="bg-white border rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b">
                      <h4 className="font-semibold text-gray-800">Enrollment History</h4>
                    </div>
                    <div className="p-6">
                      {enrollmentHistory.length > 0 ? (
                        <div className="relative">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          <div className="space-y-6">
                            {enrollmentHistory.map((entry, index) => (
                              <div key={entry.id} className="relative pl-10">
                                <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                                  index === 0 ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
                                }`}></div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-semibold text-gray-800">{entry.school_year}</h5>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      entry.enrollment_status === 'Enrolled' ? 'bg-green-100 text-green-700' :
                                      entry.enrollment_status === 'Promoted' ? 'bg-blue-100 text-blue-700' :
                                      entry.enrollment_status === 'Graduated' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {entry.enrollment_status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {entry.grade_level} {entry.section && `- ${entry.section}`}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Enrolled: {new Date(entry.enrollment_date).toLocaleDateString()}
                                  </p>
                                  {entry.remarks && (
                                    <p className="text-sm text-gray-600 mt-2 italic">{entry.remarks}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No enrollment history available</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
