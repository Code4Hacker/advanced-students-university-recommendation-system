import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../ui/table";
  
  import Badge from "../../ui/badge/Badge";
  import { ChevronUpIcon } from "../../../icons";
  import { Link, useNavigate } from "react-router";
  import { useEffect, useState } from "react";
import { UniversityProgram } from "../../../hooks/useProgrammes";
  
  
  interface ShowHeader {
    header?: boolean,
  }
  const HomeTable: React.FC<ShowHeader> = ({ header }) => {
     const [programme, setProgramme] = useState<UniversityProgram[]>([]);
     const navigate = useNavigate();
    useEffect(() => {
        setProgramme(JSON.parse(window.localStorage.getItem("eligible_courses")!));

        
    },[])
    if(programme === null){
        navigate("/")
    }
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            {
              !header ?
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      University
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Requirements
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Eligible
                    </TableCell>
                    {/* <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Status
                    </TableCell> */}
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Minimum Points
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      View
                    </TableCell>
                  </TableRow>
                </TableHeader> : ""
            }
            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {
                
                programme !== null ? programme.map((programme) => (
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
                      {programme.specific_requirements.map((requirement:any, i:any) => <span key={i} className={`${i % 2 != 0 && "text-indigo-500"}`}>{`${requirement.subject}(${requirement.grade})${i < programme.specific_requirements.length - 1 ? ",":""} `}</span>)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          // programme.status === "Active"
                          //   ? "success"
                          //   : programme.status === "Pending"
                          //     ? "warning"
                          //     : 
                          "error"
                        }
                      >
                        {"Not Yet Added"}
                      </Badge>
                    </TableCell>
                    {/* <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {programme.grade_scale}
                    </TableCell> */}
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
  
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {programme.minimum_points}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Link to={`/one-project/ddjfhd`}>
                        <button className="more_btn" onClick={() => window.localStorage.setItem("programme", JSON.stringify(programme))}><ChevronUpIcon fontSize={16} /></button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )) : <TableRow>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      "No Data Available"
                    </div>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
  
          </Table>
        </div>
      </div>
    );
  }
  export default HomeTable;