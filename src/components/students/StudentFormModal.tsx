import React, { useState, useEffect } from 'react';
import { Student } from '@/hooks/useStudents';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Student>) => Promise<void>;
  student?: Student | null;
  loading?: boolean;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  student,
  loading
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState<Partial<Student>>({
    lrn: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    suffix: '',
    gender: 'Male',
    birth_date: '',
    birth_place: '',
    nationality: 'Filipino',
    religion: '',
    mother_tongue: '',
    email: '',
    phone: '',
    address_street: '',
    address_barangay: '',
    address_city: '',
    address_province: '',
    address_zip: '',
    guardian_name: '',
    guardian_relationship: '',
    guardian_phone: '',
    guardian_email: '',
    mother_name: '',
    mother_phone: '',
    father_name: '',
    father_phone: '',
    current_grade_level: 'Grade 7',
    current_section: '',
    current_school_year: '2025-2026',
    status: 'Enrolled',
    special_needs: '',
    medical_conditions: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    } else {
      setFormData({
        lrn: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: 'Male',
        birth_date: '',
        nationality: 'Filipino',
        current_grade_level: 'Grade 7',
        current_school_year: '2025-2026',
        status: 'Enrolled'
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'contact', label: 'Contact' },
    { id: 'guardian', label: 'Guardian/Parents' },
    { id: 'academic', label: 'Academic' },
    { id: 'additional', label: 'Additional' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded p-1 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LRN *</label>
                  <input
                    type="text"
                    name="lrn"
                    value={formData.lrn || ''}
                    onChange={handleChange}
                    required
                    maxLength={12}
                    placeholder="12-digit LRN"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender || 'Male'}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                  <input
                    type="text"
                    name="suffix"
                    value={formData.suffix || ''}
                    onChange={handleChange}
                    placeholder="Jr., Sr., III"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date *</label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date || ''}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                  <input
                    type="text"
                    name="birth_place"
                    value={formData.birth_place || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality || 'Filipino'}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother Tongue</label>
                  <input
                    type="text"
                    name="mother_tongue"
                    value={formData.mother_tongue || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Information Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address_street"
                  value={formData.address_street || ''}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                  <input
                    type="text"
                    name="address_barangay"
                    value={formData.address_barangay || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City/Municipality</label>
                  <input
                    type="text"
                    name="address_city"
                    value={formData.address_city || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <input
                    type="text"
                    name="address_province"
                    value={formData.address_province || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="address_zip"
                    value={formData.address_zip || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Guardian/Parents Tab */}
          {activeTab === 'guardian' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Guardian Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                    <input
                      type="text"
                      name="guardian_name"
                      value={formData.guardian_name || ''}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <select
                      name="guardian_relationship"
                      value={formData.guardian_relationship || ''}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Grandparent">Grandparent</option>
                      <option value="Aunt/Uncle">Aunt/Uncle</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
                    <input
                      type="tel"
                      name="guardian_phone"
                      value={formData.guardian_phone || ''}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Email</label>
                    <input
                      type="email"
                      name="guardian_email"
                      value={formData.guardian_email || ''}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Mother's Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                    <input
                      type="text"
                      name="mother_name"
                      value={formData.mother_name || ''}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Phone</label>
                    <input
                      type="tel"
                      name="mother_phone"
                      value={formData.mother_phone || ''}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Father's Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                    <input
                      type="text"
                      name="father_name"
                      value={formData.father_name || ''}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Father's Phone</label>
                    <input
                      type="tel"
                      name="father_phone"
                      value={formData.father_phone || ''}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Academic Tab */}
          {activeTab === 'academic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level *</label>
                  <select
                    name="current_grade_level"
                    value={formData.current_grade_level || 'Grade 7'}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <input
                    type="text"
                    name="current_section"
                    value={formData.current_section || ''}
                    onChange={handleChange}
                    placeholder="e.g., Section A"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Year</label>
                  <select
                    name="current_school_year"
                    value={formData.current_school_year || '2025-2026'}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2025-2026">2025-2026</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2026-2027">2026-2027</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status || 'Enrolled'}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Enrolled">Enrolled</option>
                    <option value="Transferred">Transferred</option>
                    <option value="Dropped">Dropped</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                  <input
                    type="date"
                    name="admission_date"
                    value={formData.admission_date || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Tab */}
          {activeTab === 'additional' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone || ''}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Needs</label>
                <textarea
                  name="special_needs"
                  value={formData.special_needs || ''}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any special educational needs or accommodations required"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                <textarea
                  name="medical_conditions"
                  value={formData.medical_conditions || ''}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any medical conditions, allergies, or medications"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {student ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFormModal;
