import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { ChevronUpIcon } from "../../../icons";
import { useEffect, useState } from "react";
// import { UniversityProgram } from "../../../hooks/useProgrammes";
import axios from "axios";
import { baseURL } from "../../../baseURL/base_url";
import { useNavigate, Link } from "react-router";

interface ShowHeader {
  header?: boolean,
}

const HomeTable: React.FC<ShowHeader> = ({ header }) => {
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchTopCourses = async () => {
          try {
              setLoading(true);
              const student = JSON.parse(localStorage.getItem("student") || "{}");
              
              if (!student?.student_id) {
                  navigate("/");
                  return;
              }

              const response = await axios.get(`${baseURL}/api/get-top-courses.php`, {
                  params: {
                      student_id: student.student_id,
                      limit: 6
                  }
              });

              if (response.data.success) {
                  setProgrammes(response.data.courses);
                  localStorage.setItem("eligible_courses", JSON.stringify(response.data.courses));
              } else {
                  setError(response.data.error || "Failed to fetch courses");
              }
          } catch (err) {
              setError(err instanceof Error ? err.message : "Failed to fetch courses");
              console.error("Fetch error:", err);
          } finally {
              setLoading(false);
          }
      };

      fetchTopCourses();
  }, [navigate]);

  if (loading) {
      return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
      return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (programmes.length === 0) {
      return (
          <div className="p-4 text-center">
              No eligible courses found. You may not meet the requirements for any courses yet.
          </div>
      );
  }

  return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {programmes.map((programme) => (
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
                                  {programme.specific_requirements.map((requirement : any, i: any) => (
                                      <span key={i} className={i % 2 !== 0 ? "text-indigo-500" : ""}>
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
                                  <Link to={`/programmes/${programme.courseAbbr}`}>
                                      <button 
                                          className="more_btn" 
                                          onClick={() => localStorage.setItem("programme", JSON.stringify(programme))}
                                      >
                                          <ChevronUpIcon fontSize={16} />
                                      </button>
                                  </Link>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </div>
      </div>
  );
}

export default HomeTable;