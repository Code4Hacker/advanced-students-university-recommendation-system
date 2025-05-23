import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { ChevronUpIcon, PencilIcon, TrashBinIcon } from "../../../icons";
import Programmes from "../../../pages/Programmes/Programmes";
import { useProgrammes } from '../../../hooks/useProgrammes';
import { Link } from 'react-router';
import CustomFilterModal from './CustomFilterModel';
import { useModal } from '../../../hooks/useModal';
import UpdateCourse from '../../update-course/UpdateCourse';
import AddCourse from '../add-course/AddCoursee';
import { baseURL } from '../../../baseURL/base_url';

interface ShowHeader {
  header?: boolean,
  splice?: boolean,
  role?: string
}

const BasicTableOne: React.FC<ShowHeader> = ({ header, splice, role }) => {
  const {
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
  } = useProgrammes(6);

  const [filterOpen, setFilterOpen] = useState(false);
  const [iloading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const modalOne = useModal();
  const modalTwo = useModal();

  const [course, setCourse] = useState({
    universityAbbr: "UDSM",
    university: "University of Dar es Salaam",
    collegeAbbr: "CoHU",
    courseAbbr: "BA Creative Arts",
    course: "Bachelor of Arts in Creative Arts",
    required_combinations: [],
    minimum_points: "4",
    specific_requirements: []
  });
  const handleDelete = async (input: any) => {
    console.log(input)
    localStorage.setItem("programme", JSON.stringify(input))
    if (!input.courseAbbr) {
      alert("No course selected for deletion");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${baseURL}/api/update_course.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseAbbr: input.courseAbbr,
          user_role: role
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          success: false,
          error: 'Failed to parse error response'
        }));
        throw new Error(errorData.error || 'Failed to delete course');
      }

      const data = await response.json();
      if (data.success) {
        alert(data.message || "Course deleted successfully");
        fetchProgrammes();
      } else {
        throw new Error(data.error || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {role === "ADMIN" &&<button className='p-3 text-sm m-4 bg-blue-500 hover:bg-blue-700 rounded-md text-white' onClick={modalTwo.openModal}>Add Course</button>}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredProgrammes.length} of {pagination.total} courses
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Filter: {currentFilter === 'default' ? 'All Courses' :
              currentFilter === 'grades' ? 'My Eligible Courses' : 'Custom'}
            <ChevronUpIcon className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
          </button>

          {filterOpen && (
            <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={() => {
                    fetchProgrammes();
                    setFilterOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  All Courses
                </button>
                {role !== "ADMIN" && <button
                  onClick={() => {
                    fetchProgrammes(1,'grades', 100);
                    setFilterOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  My Eligible Courses
                </button>}
                <button
                  onClick={() => {
                    setShowCustomModal(true);
                    setFilterOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Custom Eligibility
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          {!header && (
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  University
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Requirements
                </TableCell>
                {role !== "ADMIN" && <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>}
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Minimum Points
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  View
                </TableCell>
              </TableRow>
            </TableHeader>
          )}

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {programmes.length > 0 ? (
              programmes.map((programme) => (
                <TableRow key={programme.courseAbbr}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {`${programme.course} (${programme.courseAbbr})`}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {programme.university}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {programme.specific_requirements.map((requirement: any, i: any) => (
                      <span key={i} className={`${i % 2 !== 0 ? "text-indigo-500" : ""}`}>
                        {`${requirement.subject}(${requirement.grade})${i < programme.specific_requirements.length - 1 ? "," : ""} `}
                      </span>
                    ))}
                  </TableCell>
                  {
                    role !== "ADMIN" && <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={programme.eligible ? "success" : "error"}>
                        {programme.eligible ? "Eligible" : "Not Eligible"}
                      </Badge>
                    </TableCell>
                  }
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {programme.minimum_points}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Link to={`/programmes/${programme.courseAbbr}`} className='actions'>
                      <button
                        className="more_btn"
                        onClick={() => localStorage.setItem("programme", JSON.stringify(programme))}
                      >
                        <ChevronUpIcon fontSize={16} />
                      </button>
                    </Link>
                    {
                      role === "ADMIN" &&
                      <span className='actions ml-1'>
                        <button
                          className="more_btn green"
                          onClick={() => {
                            setCourse(programme);
                            modalOne.openModal();
                          }}
                        >
                          <PencilIcon fontSize={16} />
                        </button>
                      </span>
                    }
                    {
                      role === "ADMIN" &&
                      <span className='actions ml-1'>
                        <button
                          className="more_btn danger"
                          onClick={() => handleDelete(programme)}
                        >
                          <TrashBinIcon fontSize={16} />
                        </button>
                      </span>
                    }
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-5 py-4 sm:px-6 text-center">
                  No courses match your current filter criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {!splice && (
          <Programmes
            pagination={pagination}
            fetchProgrammes={fetchProgrammes}
            error={error}
            loading={loading}
          />
        )}
      </div>
      {showCustomModal && (
        <CustomFilterModal
          onClose={() => setShowCustomModal(false)}
          onSubmit={handleCustomSubmit}
          setLoading={() => setLoading}
          setError={() => setIsError}
        />
      )}
      <UpdateCourse isOpen={modalOne.isOpen} closeModal={modalOne.closeModal} course={course} setCourse={setCourse} fetchProgrammes={fetchProgrammes} />
      <AddCourse isOpen={modalTwo.isOpen} closeModal={modalTwo.closeModal} course={course} setCourse={setCourse} fetchProgrammes={fetchProgrammes} />
    </div>
  );
};

export default BasicTableOne;