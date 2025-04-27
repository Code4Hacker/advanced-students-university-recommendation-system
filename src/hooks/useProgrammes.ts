import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { baseURL } from '../baseURL/base_url';

export interface UniversityProgram {
  universityAbbr: string;
  university: string;
  collegeAbbr: string;
  college: string;
  courseAbbr: string;
  course: string;
  required_combinations: {
    short: string;
    long: string;
  }[];
  minimum_points: number;
  specific_requirements: {
    subject: string;
    grade: string;
  }[];
  grade_scale: string;
  match_score?: number;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface ApiResponse {
  success: boolean;
  courses: UniversityProgram[];
  total: number;
  pagination?: Pagination;
  error?: string;
}

interface StudentSubjects {
  subject: string;
  grade: string;
}

interface UseProgrammesReturn {
  programmes: UniversityProgram[];
  filteredProgrammes: UniversityProgram[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  currentFilter: 'default' | 'grades' | 'custom';
  studentSubjects: StudentSubjects[] | null;
  showCustomModal: boolean; 
  setShowCustomModal: (show: boolean) => void; 
  fetchProgrammes: (page?: number, filter?: 'default' | 'grades' | 'custom') => Promise<void>;
  applyFilter: (filterType: 'default' | 'grades' | 'custom') => void;
  resetFilters: () => void;
  handleCustomSubmit: (customCourses: UniversityProgram[], customPagination: Pagination) => void;
  applyLocalFilter: (programmes: UniversityProgram[], filterType: string, subjects: StudentSubjects[]) => void;
}

const useProgrammes = (initialPerPage: number = 10): UseProgrammesReturn => {
  const [programmes, setProgrammes] = useState<UniversityProgram[]>([]);
  const [filteredProgrammes, setFilteredProgrammes] = useState<UniversityProgram[]>([]);
  const [availableUn, setAvailableUn] = useState(0);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: initialPerPage,
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<'default' | 'grades' | 'custom'>('default');
  const [studentSubjects, setStudentSubjects] = useState<StudentSubjects[] | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleCustomSubmit = useCallback((customCourses: UniversityProgram[], customPagination: Pagination) => {
    setProgrammes(customCourses);
    setFilteredProgrammes(customCourses);
    setPagination(customPagination);
    setCurrentFilter('custom');
  }, []);
  const getStudentSubjects = useCallback(() => {
    try {
      const studentData = localStorage.getItem('subjects');
      if (studentData) {
        const parsedData = JSON.parse(studentData);
        console.log(parsedData)
        return parsedData;
      }
      return null;
    } catch (err) {
      console.error('Error parsing student data:', err);
      return null;
    }
  }, []);

  const calculateMatchScore = useCallback((programme: UniversityProgram, subjects: StudentSubjects[]) => {
    const gradePoints: Record<string, number> = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1 };
    let matchScore = 0;

    const subjectMap = subjects.reduce((acc, curr) => {
      acc[curr.subject] = curr.grade;
      return acc;
    }, {} as Record<string, string>);

    programme.specific_requirements.forEach(req => {
      const studentGrade = subjectMap[req.subject];
      if (studentGrade) {
        const studentPoints = gradePoints[studentGrade] || 0;
        const requiredPoints = gradePoints[req.grade] || 0;

        if (studentPoints >= requiredPoints) {
          matchScore += (studentPoints - requiredPoints + 1);
        }
      }
    });

    return matchScore;
  }, []);
  const applyLocalFilter = useCallback((programmes: UniversityProgram[], filterType: string, subjects: StudentSubjects[]) => {
    
    if (filterType === 'default') {
        return programmes.map(programme => ({
            ...programme,
            match_score: 0
        }));
    }

    if (!subjects || subjects.length === 0) return programmes;

    const gradePoints: Record<string, number> = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1 };
    const subjectMap = subjects.reduce((acc, curr) => {
        acc[curr.subject] = curr.grade;
        return acc;
    }, {} as Record<string, string>);
    
    let v =  programmes.filter(programme => {
      
        return programme.specific_requirements.every(req => {
            const studentGrade = subjectMap[req.subject];
            if (!studentGrade) return false;
            return gradePoints[studentGrade] >= gradePoints[req.grade];
        });
    }).map(programme => ({
        ...programme,
        match_score: calculateMatchScore(programme, subjects)
    })).sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    
    localStorage.setItem("eligible_courses", JSON.stringify(filteredProgrammes));
    localStorage.setItem("summary", JSON.stringify({
        eligible: filteredProgrammes.length,
        available_university: new Set(filteredProgrammes.map(p => p.universityAbbr)).size,
        available_courses: availableUn || filteredProgrammes.length
    }));
    console.log("inside Filter")
    return v;
}, [calculateMatchScore]);

const fetchProgrammes = useCallback(async (page: number = 1, filter: 'default' | 'grades' | 'custom' = 'default') => {
  try {
      setLoading(true);
      const studentI = localStorage.getItem('student');
      let studentId = -1;
      if (studentI !== null) {
          studentId = (JSON.parse(localStorage.getItem('student')!)).student_id;
      }

      if (!studentId) throw new Error('Student ID not found');

      const subjects = getStudentSubjects();
      setStudentSubjects(subjects);

      const response = await axios.get<ApiResponse>(
          `${baseURL}/api/general-requests.php?action=get_courses&student_id=${studentId}&filter=${filter}&page=${page}&per_page=${initialPerPage}`
      );

      if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to fetch programmes');
      }

      let processedProgrammes = response.data.courses;

      if (subjects && filter !== 'default') {
          processedProgrammes = applyLocalFilter(processedProgrammes, filter, subjects);
      }

      setProgrammes(processedProgrammes);
      setFilteredProgrammes(processedProgrammes);

      if (response.data.pagination) {
        setAvailableUn(response.data.pagination.total);
          setPagination({
              total: response.data.pagination.total,
              per_page: response.data.pagination.per_page,
              current_page: response.data.pagination.current_page,
              last_page: response.data.pagination.last_page
          });
      }
      localStorage.setItem("eligible_courses", JSON.stringify(processedProgrammes));
      localStorage.setItem("summary", JSON.stringify({
          eligible: processedProgrammes.length,
          available_university: new Set(processedProgrammes.map(p => p.universityAbbr)).size,
          available_courses: response.data.pagination?.total || processedProgrammes.length
      }));

      setError(null);
      setCurrentFilter(filter);
  } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch programmes');
      console.error('Fetch error:', err);
  } finally {
      setLoading(false);
  }
}, [initialPerPage, getStudentSubjects, applyLocalFilter]);

  // Apply filter to already loaded data
  const applyFilter = useCallback((filterType: 'default' | 'grades' | 'custom') => {
    if (!studentSubjects || studentSubjects.length === 0) {
      setError('Student subjects data not available '+ JSON.stringify(studentSubjects));
      return;
    }

    const filtered = applyLocalFilter(programmes, filterType, studentSubjects);
    setFilteredProgrammes(filtered);
    setCurrentFilter(filterType);
    
  }, [programmes, studentSubjects, applyLocalFilter]);

  const resetFilters = useCallback(() => {
    setFilteredProgrammes(programmes);
    setCurrentFilter('default');
  }, [programmes]);

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
    applyFilter,
    resetFilters,
    handleCustomSubmit,
    applyLocalFilter
  };
};

export default useProgrammes;