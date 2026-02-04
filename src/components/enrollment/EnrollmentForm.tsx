import React, { useState, useRef } from 'react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface EnrollmentFormProps {
  onSuccess: () => void;
}

interface FormData {
  // Student Info
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  dateOfBirth: string;
  gender: string;
  placeOfBirth: string;
  nationality: string;
  religion: string;

  // Contact Info
  address: string;
  barangay: string;
  cityMunicipality: string;
  province: string;
  zipCode: string;
  contactNumber: string;
  email: string;

  // Parent/Guardian Info
  fatherName: string;
  fatherOccupation: string;
  fatherContact: string;
  motherName: string;
  motherOccupation: string;
  motherContact: string;
  guardianName: string;
  guardianRelationship: string;
  guardianContact: string;

  // Academic Info
  gradeLevelApplying: string;
  previousSchool: string;
  previousSchoolAddress: string;
  lrn: string;
}

interface DocumentFile {
  type: string;
  file: File | null;
  name: string;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dateOfBirth: '',
    gender: '',
    placeOfBirth: '',
    nationality: 'Filipino',
    religion: '',
    address: '',
    barangay: '',
    cityMunicipality: '',
    province: '',
    zipCode: '',
    contactNumber: '',
    email: '',
    fatherName: '',
    fatherOccupation: '',
    fatherContact: '',
    motherName: '',
    motherOccupation: '',
    motherContact: '',
    guardianName: '',
    guardianRelationship: '',
    guardianContact: '',
    gradeLevelApplying: '',
    previousSchool: '',
    previousSchoolAddress: '',
    lrn: '',
  });

  const [documents, setDocuments] = useState<DocumentFile[]>([
    { type: 'birth_certificate', file: null, name: 'Birth Certificate (PSA/NSO)' },
    { type: 'form_137', file: null, name: 'Form 137 / School Records' },
    { type: 'photo_2x2', file: null, name: '2x2 ID Photo' },
    { type: 'good_moral', file: null, name: 'Certificate of Good Moral Character' },
    { type: 'report_card', file: null, name: 'Report Card (Latest)' },
  ]);

  const steps = [
    { number: 1, title: 'Student Information' },
    { number: 2, title: 'Contact Details' },
    { number: 3, title: 'Parent/Guardian' },
    { number: 4, title: 'Academic Info' },
    { number: 5, title: 'Documents' },
    { number: 6, title: 'Review & Submit' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (type: string, file: File | null) => {
    setDocuments(prev => prev.map(doc =>
      doc.type === type ? { ...doc, file } : doc
    ));
  };

  const generateApplicationNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `ENR-${year}-${random}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await api.post('/enrollment/submit', formData);

      if (response.data.success) {
        toast({
          title: 'Application Submitted!',
          description: `Your application number is ${response.data.applicationNumber}. Please save this for tracking.`,
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Student Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                <select
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">None</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                <input
                  type="text"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="House/Lot No., Street, Subdivision/Village"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                <input
                  type="text"
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City/Municipality</label>
                <input
                  type="text"
                  name="cityMunicipality"
                  value={formData.cityMunicipality}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="09XX-XXX-XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Father's Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="fatherContact"
                  value={formData.fatherContact}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Mother's Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Maiden)</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="motherContact"
                  value={formData.motherContact}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Guardian Information (if different from parents)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <input
                  type="text"
                  name="guardianRelationship"
                  value={formData.guardianRelationship}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Grandmother, Uncle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="guardianContact"
                  value={formData.guardianContact}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level Applying For *</label>
                <select
                  name="gradeLevelApplying"
                  value={formData.gradeLevelApplying}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Grade Level</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Learner Reference Number (LRN)</label>
                <input
                  type="text"
                  name="lrn"
                  value={formData.lrn}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="12-digit LRN"
                  maxLength={12}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous School Name</label>
              <input
                type="text"
                name="previousSchool"
                value={formData.previousSchool}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous School Address</label>
              <textarea
                name="previousSchoolAddress"
                value={formData.previousSchoolAddress}
                onChange={handleInputChange}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Required Documents</h3>
            <p className="text-sm text-gray-600">
              Please upload clear scanned copies or photos of the following documents. Accepted formats: PDF, JPG, PNG (max 5MB each)
            </p>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.type} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.file ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                        {doc.file ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{doc.name}</p>
                        {doc.file && (
                          <p className="text-sm text-green-600">{doc.file.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={(el) => fileInputRefs.current[doc.type] = el}
                        onChange={(e) => handleFileChange(doc.type, e.target.files?.[0] || null)}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[doc.type]?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        {doc.file ? 'Change' : 'Upload'}
                      </button>
                      {doc.file && (
                        <button
                          type="button"
                          onClick={() => handleFileChange(doc.type, null)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800">Important Note</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Original documents must be presented during enrollment verification. Incomplete documents may delay your application processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Review Your Application</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Info Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Student Information
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Name:</span> <span className="font-medium">{formData.firstName} {formData.middleName} {formData.lastName} {formData.suffix}</span></p>
                  <p><span className="text-gray-500">Date of Birth:</span> <span className="font-medium">{formData.dateOfBirth || 'Not provided'}</span></p>
                  <p><span className="text-gray-500">Gender:</span> <span className="font-medium">{formData.gender || 'Not provided'}</span></p>
                  <p><span className="text-gray-500">Nationality:</span> <span className="font-medium">{formData.nationality}</span></p>
                </div>
              </div>

              {/* Contact Info Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Contact Details
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Address:</span> <span className="font-medium">{formData.address || 'Not provided'}</span></p>
                  <p><span className="text-gray-500">City:</span> <span className="font-medium">{formData.cityMunicipality || 'Not provided'}</span></p>
                  <p><span className="text-gray-500">Contact:</span> <span className="font-medium">{formData.contactNumber || 'Not provided'}</span></p>
                  <p><span className="text-gray-500">Email:</span> <span className="font-medium">{formData.email || 'Not provided'}</span></p>
                </div>
              </div>

              {/* Parent Info Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Parent/Guardian
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Father:</span> <span className="font-medium">{formData.fatherName || 'Not provided'}</span></p>
                  <p><span className="text-gray-500">Mother:</span> <span className="font-medium">{formData.motherName || 'Not provided'}</span></p>
                  {formData.guardianName && (
                    <p><span className="text-gray-500">Guardian:</span> <span className="font-medium">{formData.guardianName} ({formData.guardianRelationship})</span></p>
                  )}
                </div>
              </div>

              {/* Academic Info Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
                  </svg>
                  Academic Info
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Grade Level:</span> <span className="font-medium">{formData.gradeLevelApplying || 'Not selected'}</span></p>
                  <p><span className="text-gray-500">LRN:</span> <span className="font-medium">{formData.lrn || 'Not provided'}</span></p>
                  <p><span className="text-gray-500">Previous School:</span> <span className="font-medium">{formData.previousSchool || 'Not provided'}</span></p>
                </div>
              </div>
            </div>

            {/* Documents Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                Uploaded Documents
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {documents.map((doc) => (
                  <div key={doc.type} className={`p-3 rounded-lg text-center ${doc.file ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    <svg className="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                      {doc.file ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      )}
                    </svg>
                    <p className="text-xs font-medium">{doc.name.split(' ')[0]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-5 h-5 text-blue-600 rounded" required />
                <span className="text-sm text-gray-700">
                  I hereby certify that all information provided in this application is true and correct. I understand that any false information may result in the denial or cancellation of my enrollment.
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Progress Steps */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${currentStep >= step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }`}>
                  {currentStep > step.number ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`text-xs mt-1 hidden md:block ${currentStep >= step.number ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Previous
        </button>

        {currentStep < 6 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next Step
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Submit Application
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default EnrollmentForm;
