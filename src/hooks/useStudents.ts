import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { useAppContext } from '@/contexts/AppContext';

export interface Student {
  id: string;
  lrn: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  suffix?: string;
  gender: 'Male' | 'Female';
  birth_date: string;
  birth_place?: string;
  nationality?: string;
  religion?: string;
  mother_tongue?: string;
  email?: string;
  phone?: string;
  address_street?: string;
  address_barangay?: string;
  address_city?: string;
  address_province?: string;
  address_zip?: string;
  guardian_name?: string;
  guardian_relationship?: string;
  guardian_phone?: string;
  guardian_email?: string;
  guardian_occupation?: string;
  mother_name?: string;
  mother_phone?: string;
  mother_occupation?: string;
  father_name?: string;
  father_phone?: string;
  father_occupation?: string;
  current_grade_level?: string;
  current_section?: string;
  current_school_year?: string;
  admission_date?: string;
  status: 'Enrolled' | 'Transferred' | 'Dropped' | 'Graduated' | 'Inactive';
  profile_photo_url?: string;
  special_needs?: string;
  medical_conditions?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AcademicRecord {
  id: string;
  student_id: string;
  school_year: string;
  grade_level: string;
  term: string;
  subject: string;
  grade: number;
  remarks?: string;
  teacher_id?: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  attendance_date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  time_in?: string;
  time_out?: string;
  remarks?: string;
}

export interface EnrollmentHistory {
  id: string;
  student_id: string;
  school_year: string;
  grade_level: string;
  section?: string;
  enrollment_date: string;
  enrollment_status: string;
  previous_school?: string;
  remarks?: string;
}

export interface StudentStats {
  total: number;
  enrolled: number;
  male: number;
  female: number;
  byGrade: Record<string, number>;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export const useStudents = () => {
  const { currentSchoolYearId } = useAppContext();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchStudents = useCallback(async (params?: {
    search?: string;
    gradeLevel?: string;
    status?: string;
    schoolYearId?: string;
    page?: number;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const finalParams = {
        ...params,
        schoolYearId: params?.schoolYearId || currentSchoolYearId
      };
      const response = await api.get('/students', { params: finalParams });

      if (response.data.success) {
        setStudents(response.data.students || []);
        setTotalCount(response.data.total || 0);
        return response.data.students;
      }
      throw new Error(response.data.error || 'Failed to fetch students');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      setError(msg);
      toast({
        title: 'Error',
        description: msg,
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentSchoolYearId]);

  const getStudent = useCallback(async (studentId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/students/${studentId}`, {
        params: { schoolYearId: currentSchoolYearId }
      });

      if (response.data.success) {
        return {
          student: response.data.student as Student,
          academicRecords: response.data.academicRecords as AcademicRecord[],
          attendanceRecords: response.data.attendanceRecords as AttendanceRecord[],
          enrollmentHistory: response.data.enrollmentHistory as EnrollmentHistory[]
        };
      }
      throw new Error(response.data.error || 'Failed to fetch student');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || err.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentSchoolYearId]);

  const createStudent = useCallback(async (studentData: Partial<Student>) => {
    setLoading(true);
    try {
      const response = await api.post('/students', { studentData });

      if (response.data.success) {
        toast({ title: 'Success', description: 'Student created successfully' });
        return response.data.student as Student;
      }
      throw new Error(response.data.error || 'Failed to create student');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || err.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStudent = useCallback(async (studentId: string, studentData: Partial<Student>) => {
    setLoading(true);
    try {
      const response = await api.put(`/students/${studentId}`, { studentData });

      if (response.data.success) {
        toast({ title: 'Success', description: 'Student updated successfully' });
        return response.data.student as Student;
      }
      throw new Error(response.data.error || 'Failed to update student');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || err.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStudent = useCallback(async (studentId: string) => {
    setLoading(true);
    try {
      const response = await api.delete(`/students/${studentId}`);

      if (response.data.success) {
        toast({ title: 'Success', description: 'Student deleted successfully' });
        return true;
      }
      throw new Error(response.data.error || 'Failed to delete student');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || err.message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStudentStats = useCallback(async (): Promise<StudentStats | null> => {
    try {
      const response = await api.get('/dashboard/teacher'); // Reusing existing stats logic
      if (response.data.success) {
        return response.data.stats as StudentStats;
      }
      return null;
    } catch (err: any) {
      console.error('Failed to fetch student stats:', err);
      return null;
    }
  }, []);

  const getAttendanceSummary = useCallback(async (
    studentId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceSummary | null> => {
    try {
      const response = await api.get(`/dashboard/student?studentId=${studentId}`);
      if (response.data.success) {
        return response.data.attendance_stats as AttendanceSummary;
      }
      return null;
    } catch (err: any) {
      console.error('Failed to fetch attendance summary:', err);
      return null;
    }
  }, []);

  const addAcademicRecord = useCallback(async (recordData: Partial<AcademicRecord>) => {
    try {
      const response = await api.post('/grades', recordData);
      if (response.data.success) {
        toast({ title: 'Success', description: 'Academic record added successfully' });
        return response.data.record as AcademicRecord;
      }
      return null;
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.error || err.message,
        variant: 'destructive'
      });
      return null;
    }
  }, []);

  const exportStudents = useCallback((studentsToExport: Student[], format: 'csv' | 'json' = 'csv') => {
    if (format === 'csv') {
      const headers = ['LRN', 'Last Name', 'First Name', 'Middle Name', 'Gender', 'Birth Date', 'Grade Level', 'Section', 'Status', 'Email', 'Phone'];
      const rows = studentsToExport.map(s => [
        s.lrn,
        s.last_name,
        s.first_name,
        s.middle_name || '',
        s.gender,
        s.birth_date,
        s.current_grade_level || '',
        s.current_section || '',
        s.status,
        s.email || '',
        s.phone || ''
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } else {
      const jsonContent = JSON.stringify(studentsToExport, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `students_export_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    }

    toast({
      title: 'Export Complete',
      description: `Exported ${studentsToExport.length} students to ${format.toUpperCase()}`
    });
  }, []);

  return {
    students,
    loading,
    error,
    totalCount,
    fetchStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentStats,
    getAttendanceSummary,
    addAcademicRecord,
    exportStudents
  };
};

export default useStudents;
