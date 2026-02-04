import React, { useState, useEffect } from 'react';
import { useStudents, Student } from '@/hooks/useStudents';
import StudentFormModal from '@/components/students/StudentFormModal';
import StudentProfileModal from '@/components/students/StudentProfileModal';
import { toast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';

const StudentsPage: React.FC = () => {
  const { currentSchoolYearId } = useAppContext();
  const {
    students,
    loading,
    totalCount,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    exportStudents
  } = useStudents();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    loadStudents();
  }, [searchTerm, filterGrade, filterStatus, currentPage, currentSchoolYearId]);

  const loadStudents = async () => {
    await fetchStudents({
      search: searchTerm || undefined,
      gradeLevel: filterGrade !== 'all' ? filterGrade : undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      page: currentPage,
      limit: itemsPerPage
    });
  };

  const handleAddStudent = async (data: Partial<Student>) => {
    const result = await createStudent(data);
    if (result) {
      setShowAddModal(false);
      loadStudents();
    }
  };

  const handleEditStudent = async (data: Partial<Student>) => {
    if (selectedStudent) {
      const result = await updateStudent(selectedStudent.id, data);
      if (result) {
        setShowAddModal(false);
        setSelectedStudent(null);
        loadStudents();
      }
    }
  };

  const handleDeleteStudent = async () => {
    if (studentToDelete) {
      const success = await deleteStudent(studentToDelete.id);
      if (success) {
        setShowDeleteConfirm(false);
        setStudentToDelete(null);
        loadStudents();
      }
    }
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudentId(student.id);
    setShowProfileModal(true);
  };

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setShowAddModal(true);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setShowDeleteConfirm(true);
  };

  const handleExport = (format: 'csv' | 'json') => {
    exportStudents(students, format);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Enrolled': return 'bg-green-100 text-green-700';
      case 'Transferred': return 'bg-yellow-100 text-yellow-700';
      case 'Dropped': return 'bg-red-100 text-red-700';
      case 'Graduated': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
          <p className="text-gray-600">Manage student records, profiles, and academic information</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => document.getElementById('export-dropdown')?.classList.toggle('hidden')}
              className="bg-white border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            <div id="export-dropdown" className="hidden absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
              <button
                onClick={() => { handleExport('csv'); document.getElementById('export-dropdown')?.classList.add('hidden'); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
              >
                Export as CSV
              </button>
              <button
                onClick={() => { handleExport('json'); document.getElementById('export-dropdown')?.classList.add('hidden'); }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
              >
                Export as JSON
              </button>
            </div>
          </div>
          <button
            onClick={() => { setSelectedStudent(null); setShowAddModal(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{students.filter(s => s.status === 'Enrolled').length}</p>
              <p className="text-sm text-gray-600">Enrolled</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{students.filter(s => s.status === 'Graduated').length}</p>
              <p className="text-sm text-gray-600">Graduated</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{new Set(students.map(s => s.current_grade_level)).size}</p>
              <p className="text-sm text-gray-600">Grade Levels</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or LRN..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filterGrade}
            onChange={(e) => { setFilterGrade(e.target.value); setCurrentPage(1); }}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Grade Levels</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Transferred">Transferred</option>
            <option value="Dropped">Dropped</option>
            <option value="Graduated">Graduated</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">LRN</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Gender</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Grade Level</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Section</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                            {student.first_name[0]}{student.last_name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.last_name}, {student.first_name} {student.middle_name ? `${student.middle_name[0]}.` : ''}
                            </p>
                            <p className="text-xs text-gray-500">{student.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">{student.lrn}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{student.gender}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{student.current_grade_level}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{student.current_section || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleViewProfile(student)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditClick(student)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(student)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} students
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-lg ${currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border hover:bg-gray-100'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      <StudentFormModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setSelectedStudent(null); }}
        onSubmit={selectedStudent ? handleEditStudent : handleAddStudent}
        student={selectedStudent}
        loading={loading}
      />

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        studentId={selectedStudentId}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && studentToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Delete Student</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{studentToDelete.first_name} {studentToDelete.last_name}</strong>?
              All associated records including academic records, attendance, and enrollment history will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setStudentToDelete(null); }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
