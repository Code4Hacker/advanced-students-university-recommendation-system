import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { baseURL } from '../baseURL/base_url';

export const useProgrammes = (initialPerPage: number = 10) => {
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [filteredProgrammes, setFilteredProgrammes] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: initialPerPage,
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<'default' | 'grades' | 'custom'>('default');
  const [studentSubjects, setStudentSubjects] = useState<any[] | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const fetchProgrammes = useCallback(
  async (page = 1, filter: 'default' | 'grades' | 'custom' = 'default', initialPerPage = 6) => {
    try {
      setLoading(true);
      const student = JSON.parse(localStorage.getItem('student') || '{}');

      const response = await axios.get(`${baseURL}/api/general-requests.php`, {
        params: {
          action: 'get_courses',
          student_id: student.student_id,
          filter,
          page,
          per_page: initialPerPage
        }
      });
      if (response.data.success) {
        console.log(response.data.courses)
        setProgrammes(response.data.courses);
        setPagination(response.data.pagination);
        setCurrentFilter(filter);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch programmes');
    } finally {
      setLoading(false);
    }
  },
  [initialPerPage]
);


  // const applyFilter = useCallback((filterType: 'default' | 'grades' | 'custom') => {
  //   setCurrentFilter(filterType);
  //   setFilteredProgrammes(filterType === 'grades' 
  //     ? programmes.filter(c => c.eligible)
  //     : programmes
  //   );
  // }, [programmes]);

  const handleCustomSubmit = useCallback((customCourses: any[], customPagination: any) => {
    setProgrammes(customCourses);
    setFilteredProgrammes(customCourses);
    setPagination(customPagination);
    setCurrentFilter('custom');
  }, []);

  useEffect(() => {
    fetchProgrammes();
  }, [fetchProgrammes]);

  return {
    programmes,
    filteredProgrammes,
    pagination,
    loading,
    error,
    currentFilter,
    studentSubjects,
    showCustomModal,
    setShowCustomModal,
    fetchProgrammes,
    // applyFilter,
    handleCustomSubmit
  };
};