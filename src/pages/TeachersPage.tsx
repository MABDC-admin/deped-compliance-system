import React, { useState } from 'react';

interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  subjects: string[];
  status: 'Active' | 'On Leave' | 'Inactive';
}

const TeachersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const teachers: Teacher[] = [
    { id: '1', employeeId: 'T-001', firstName: 'Karen', lastName: 'Lee', email: 'karen.lee@school.edu', department: 'Mathematics', subjects: ['Math 7', 'Math 8'], status: 'Active' },
    { id: '2', employeeId: 'T-002', firstName: 'John', lastName: 'Santos', email: 'john.santos@school.edu', department: 'Science', subjects: ['Science 7', 'Science 8'], status: 'Active' },
    { id: '3', employeeId: 'T-003', firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@school.edu', department: 'English', subjects: ['English 9', 'English 10'], status: 'Active' },
    { id: '4', employeeId: 'T-004', firstName: 'Pedro', lastName: 'Cruz', email: 'pedro.cruz@school.edu', department: 'Filipino', subjects: ['Filipino 7', 'Filipino 8'], status: 'Active' },
    { id: '5', employeeId: 'T-005', firstName: 'Ana', lastName: 'Reyes', email: 'ana.reyes@school.edu', department: 'Social Studies', subjects: ['AP 9', 'AP 10'], status: 'On Leave' },
    { id: '6', employeeId: 'T-006', firstName: 'Carlos', lastName: 'Lopez', email: 'carlos.lopez@school.edu', department: 'MAPEH', subjects: ['PE 7', 'Music 8'], status: 'Active' },
  ];

  const filteredTeachers = teachers.filter(teacher =>
    teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Teacher Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Teacher
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or employee ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-blue-600">
                  {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                </div>
                <div className="text-white">
                  <h3 className="font-semibold text-lg">{teacher.firstName} {teacher.lastName}</h3>
                  <p className="text-blue-100 text-sm">{teacher.employeeId}</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                </svg>
                <span className="text-sm">{teacher.department}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {teacher.subjects.map((subject, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {subject}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  teacher.status === 'Active' ? 'bg-green-100 text-green-700' :
                  teacher.status === 'On Leave' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {teacher.status}
                </span>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 p-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="text-green-600 hover:text-green-800 p-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add New Teacher</h2>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-white/20 rounded p-1">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full border rounded-lg px-3 py-2">
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>English</option>
                  <option>Filipino</option>
                  <option>Social Studies</option>
                  <option>MAPEH</option>
                  <option>TLE</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
