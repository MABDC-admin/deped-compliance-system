import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

interface SchoolYear {
  id: string;
  year_name: string;
  is_active: boolean;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  schoolYears: SchoolYear[];
  currentSchoolYearId: string | null;
  setSchoolYear: (id: string) => void;
  isLoadingSY: boolean;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => { },
  schoolYears: [],
  currentSchoolYearId: null,
  setSchoolYear: () => { },
  isLoadingSY: false,
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [currentSchoolYearId, setCurrentSchoolYearId] = useState<string | null>(null);
  const [isLoadingSY, setIsLoadingSY] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const fetchSchoolYears = useCallback(async () => {
    setIsLoadingSY(true);
    try {
      const response = await api.get('/enrollment/school-years');
      if (response.data.success) {
        const years = response.data.schoolYears;
        setSchoolYears(years);

        // Default to active year if no year is selected
        if (!currentSchoolYearId) {
          const active = years.find((y: SchoolYear) => y.is_active);
          if (active) {
            setCurrentSchoolYearId(active.id);
          } else if (years.length > 0) {
            setCurrentSchoolYearId(years[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch school years:', err);
    } finally {
      setIsLoadingSY(false);
    }
  }, [currentSchoolYearId]);

  useEffect(() => {
    fetchSchoolYears();
  }, [fetchSchoolYears]);

  const setSchoolYear = (id: string) => {
    setCurrentSchoolYearId(id);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        schoolYears,
        currentSchoolYearId,
        setSchoolYear,
        isLoadingSY,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
