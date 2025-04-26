import { useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../../baseURL/base_url';
import { Pagination, UniversityProgram } from '../../../hooks/useProgrammes';
interface CustomFilterModalProps {
    onClose: () => void;
    onSubmit: (courses: UniversityProgram[], pagination: Pagination) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  }
  

const CustomFilterModal: React.FC<CustomFilterModalProps> = ({ 
  onClose, 
  onSubmit,
  setLoading,
  setError
}) => {
  const [subjects, setSubjects] = useState([
    { subject: '', grade: 'C' },
    { subject: '', grade: 'C' },
    { subject: '', grade: 'C' }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (subjects.some(s => !s.subject.trim())) {
      setError('Please fill in all subject fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${baseURL}/api/general-requests.php?action=get_custom_courses`, {
        subjects: subjects.map(s => ({
          subject: s.subject.trim(),
          grade: s.grade
        })),
        page: 1,
        per_page: 6 
      });

      if (response.data.success) {
        onSubmit(response.data.courses, response.data.pagination);
        onClose();
      } else {
        setError(response.data.error || 'Failed to check eligibility');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check eligibility');
      console.error('Error checking eligibility:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Custom Course Filter</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter 3 subjects and their grades to check eligibility
        </p>
        
        <form onSubmit={handleSubmit}>
          {subjects.map((subj, index) => (
            <div key={index} className="flex gap-3 mb-3">
              <input
                type="text"
                placeholder={`Subject ${index + 1}`}
                className="flex-1 p-2 border rounded"
                value={subj.subject}
                onChange={(e) => {
                  const newSubjects = [...subjects];
                  newSubjects[index].subject = e.target.value;
                  setSubjects(newSubjects);
                }}
                required
              />
              <select
                className="p-2 border rounded"
                value={subj.grade}
                onChange={(e) => {
                  const newSubjects = [...subjects];
                  newSubjects[index].grade = e.target.value;
                  setSubjects(newSubjects);
                }}
              >
                {['A', 'B', 'C', 'D', 'E'].map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Check Eligibility
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomFilterModal;