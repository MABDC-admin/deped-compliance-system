import React, { useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface BulkEnrollmentProps {
  onRefresh: () => void;
}

interface ImportedStudent {
  id: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

const BulkEnrollment: React.FC<BulkEnrollmentProps> = ({ onRefresh }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedStudents, setImportedStudents] = useState<ImportedStudent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'pre-registered' | 'enrolled'>('enrolled');

  const sections: Record<string, string[]> = {
    'Grade 7': ['Einstein', 'Newton', 'Galileo'],
    'Grade 8': ['Rizal', 'Bonifacio', 'Mabini'],
    'Grade 9': ['Aquino', 'Marcos', 'Quezon'],
    'Grade 10': ['Diamond', 'Ruby', 'Emerald'],
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate parsing CSV file
    const mockStudents: ImportedStudent[] = [
      { id: '1', firstName: 'Juan', lastName: 'Dela Cruz', gradeLevel: 'Grade 7', status: 'pending' },
      { id: '2', firstName: 'Maria', lastName: 'Santos', gradeLevel: 'Grade 7', status: 'pending' },
      { id: '3', firstName: 'Pedro', lastName: 'Reyes', gradeLevel: 'Grade 7', status: 'pending' },
      { id: '4', firstName: 'Ana', lastName: 'Garcia', gradeLevel: 'Grade 8', status: 'pending' },
      { id: '5', firstName: 'Jose', lastName: 'Lopez', gradeLevel: 'Grade 8', status: 'pending' },
      { id: '6', firstName: 'Carmen', lastName: 'Cruz', gradeLevel: 'Grade 8', status: 'pending' },
      { id: '7', firstName: 'Miguel', lastName: 'Fernandez', gradeLevel: 'Grade 9', status: 'pending' },
      { id: '8', firstName: 'Rosa', lastName: 'Martinez', gradeLevel: 'Grade 9', status: 'pending' },
    ];

    setImportedStudents(mockStudents);
    toast({
      title: 'File Uploaded',
      description: `${mockStudents.length} students found in the file.`,
    });
  };

  const handleProcessBulk = async () => {
    setIsProcessing(true);

    // Simulate processing each student
    for (let i = 0; i < importedStudents.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setImportedStudents(prev => prev.map((student, index) => {
        if (index === i) {
          // Simulate random success/error
          const isSuccess = Math.random() > 0.1;
          return {
            ...student,
            status: isSuccess ? 'success' : 'error',
            errorMessage: isSuccess ? undefined : 'Duplicate LRN found',
          };
        }
        return student;
      }));
    }

    setIsProcessing(false);
    toast({
      title: 'Bulk Enrollment Complete',
      description: 'All students have been processed.',
    });
    onRefresh();
  };

  const handleClearList = () => {
    setImportedStudents([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'First Name,Middle Name,Last Name,Suffix,Date of Birth,Gender,Grade Level,LRN,Address,Contact Number,Father Name,Mother Name\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enrollment_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const successCount = importedStudents.filter(s => s.status === 'success').length;
  const errorCount = importedStudents.filter(s => s.status === 'error').length;
  const pendingCount = importedStudents.filter(s => s.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Instructions Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bulk Enrollment Tool</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-gray-800">Download Template</p>
              <p className="text-sm text-gray-500">Get the CSV template with required fields</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-gray-800">Fill Student Data</p>
              <p className="text-sm text-gray-500">Enter student information in the template</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-gray-800">Upload & Process</p>
              <p className="text-sm text-gray-500">Upload the file and enroll students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Upload Student List</h3>
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download Template
          </button>
        </div>

        {/* File Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500 mt-1">CSV, XLS, or XLSX (max 10MB)</p>
        </div>

        {/* Bulk Options */}
        {importedStudents.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Grade Level</label>
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setSelectedSection('');
                }}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Use from file</option>
                {Object.keys(sections).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Section</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                disabled={!selectedGrade}
              >
                <option value="">Select Section</option>
                {selectedGrade && sections[selectedGrade]?.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'pre-registered' | 'enrolled')}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="enrolled">Enrolled</option>
                <option value="pre-registered">Pre-Registered</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Imported Students List */}
      {importedStudents.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Summary */}
          <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-sm text-gray-600">Pending: {pendingCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Success: {successCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Errors: {errorCount}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClearList}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                Clear List
              </button>
              <button
                onClick={handleProcessBulk}
                disabled={isProcessing || pendingCount === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Process All
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Student Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Grade Level</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {importedStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">
                        {student.lastName}, {student.firstName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{student.gradeLevel}</td>
                    <td className="px-4 py-3">
                      {student.status === 'pending' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Pending
                        </span>
                      )}
                      {student.status === 'success' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Success
                        </span>
                      )}
                      {student.status === 'error' && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1 w-fit">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Error
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {student.status === 'success' && (
                        <span className="text-green-600 text-sm">Enrolled successfully</span>
                      )}
                      {student.status === 'error' && (
                        <span className="text-red-600 text-sm">{student.errorMessage}</span>
                      )}
                      {student.status === 'pending' && (
                        <span className="text-gray-400 text-sm">Waiting to process</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
            <svg className="w-8 h-8 text-blue-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
            </svg>
            <p className="font-medium text-gray-800">Export Enrollment List</p>
            <p className="text-sm text-gray-500">Download current enrollment data</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
            <svg className="w-8 h-8 text-green-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <p className="font-medium text-gray-800">Promote Students</p>
            <p className="text-sm text-gray-500">Bulk promote to next grade level</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left">
            <svg className="w-8 h-8 text-purple-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
            </svg>
            <p className="font-medium text-gray-800">Generate ID Cards</p>
            <p className="text-sm text-gray-500">Batch print student IDs</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkEnrollment;
