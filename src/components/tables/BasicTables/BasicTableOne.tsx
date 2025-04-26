// BasicTableOne.tsx
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { ChevronUpIcon } from "../../../icons";
import { Link } from "react-router";
import Programmes from "../../../pages/Programmes/Programmes";
import useProgrammes from "../../../hooks/useProgrammes";
import CustomFilterModal from './CustomFilterModel';

interface ShowHeader {
  header?: boolean,
  splice?: boolean
}

const BasicTableOne: React.FC<ShowHeader> = ({ header, splice }) => {
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
    applyFilter,
    handleCustomSubmit
  } = useProgrammes(6);

  const [filterOpen, setFilterOpen] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Filter Controls */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-white/[0.05]">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredProgrammes.length} of {pagination.total} eligible courses
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Filter: {currentFilter === 'default' ? 'All Eligible' :
              currentFilter === 'grades' ? 'By My Grades' : 'Custom'}
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
                  All Eligible Courses
                </button>
                <button
                  onClick={() => {
                    applyFilter('grades');
                    setFilterOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Match My Grades
                </button>
                <button
                  onClick={() => {
                    setShowCustomModal(true);
                    setFilterOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Custom Eligibility Check
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          {!header && (
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  University
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Requirements
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Eligible
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Minimum Points
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  View
                </TableCell>
              </TableRow>
            </TableHeader>
          )}

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredProgrammes.length > 0 ? (
              filteredProgrammes.map((programme) => (
                <TableRow key={programme.courseAbbr}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {`${programme.course} (${programme.courseAbbr})`}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {programme.college}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {programme.specific_requirements.map((requirement, i) => (
                      <span key={i} className={`${i % 2 !== 0 ? "text-indigo-500" : ""}`}>
                        {`${requirement.subject}(${requirement.grade})${i < programme.specific_requirements.length - 1 ? "," : ""} `}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge size="sm" color="success">
                      Eligible
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {programme.minimum_points}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <Link to={`/one-project/ddjfhd`}>
                      <button
                        className="more_btn"
                        onClick={() => window.localStorage.setItem("programme", JSON.stringify(programme))}
                      >
                        <ChevronUpIcon fontSize={16} />
                      </button>
                    </Link>
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
          setLoading={(loading) => {}}
          setError={(error) => {}}
        />
      )}
    </div>
  );
};

export default BasicTableOne;