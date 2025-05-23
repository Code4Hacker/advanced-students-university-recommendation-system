
import { Link } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TeamCard from "../common/TeamCard";
import Badge from "../ui/badge/Badge";
import BasicTableTask from "../tables/BasicTables/BasicTableTask";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";
import BasicTables from "../../pages/Tables/BasicTables";
import BasicTableOne from "../tables/BasicTables/BasicTableOne";

export default function ProjectSlug() {
  let programme = JSON.parse(window.localStorage.getItem("programme")!);
  console.log(programme)
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={`${programme.course} (${programme.courseAbbr})`} />
      <div className="space-y-6 rounded-2xl bprogramme bprogramme-gray-200 bg-white dark:bprogramme-gray-800 dark:bg-white/[0.03] p-4">
        <h1>University <br />
          <span className="block text-gray-500 text-theme-sm dark:text-white/90">{programme.university} ({programme.universityAbbr})</span></h1>
        <div className="c_grid_">
          <div className="">
            <h1>College</h1>
            <span className="block text-gray-500 text-theme-sm dark:text-white/90">{programme.college} </span>
          </div>
          <div className="">
            <h1>Course Provided</h1>
            <span className="block text-gray-500 text-theme-sm dark:text-white/90">{programme.course} ({programme.courseAbbr})</span>
          </div>
          <div className="">
            <h1>Eligibility Status</h1>
            <Badge
              size="sm"
              color={
                programme.minimum_points < 4
                  ? "error"
                  : "success"
              }
            >
              {programme.minimum_points < 4 ? "Not Eligible" : "Your Eligible"}
            </Badge>
          </div>
        </div>
        <hr />
        <div className="c_grid_">
          <div className="">

            <h1>Grade Scale <br />
              <span className="block text-gray-500 text-theme-sm dark:text-white/90">{programme.grade_scale} </span></h1>
          </div>
          <div className="">
          <h1>Minimum Points Required  
          (<span className=" text-gray-500 text-theme-sm dark:text-white/90">{programme.minimum_points} </span>)</h1>
          </div>
        </div>
        <hr/>
        <div className="c_grid_">

        <h1>Required Combinations <br />
              {
                programme.required_combinations !== undefined && programme.required_combinations?.length > 0? programme.required_combinations.map((i: { long: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; short: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; },k: Key | null | undefined) => <span key={k} className="block text-gray-500 text-theme-sm dark:text-white/90">{i.long} ({i.short})</span>):"Any Combination"
              }</h1>
              
        <h1>Specific Requirement <br />
              {
                programme.specific_requirements !== undefined && programme.specific_requirements?.length > 0? programme.specific_requirements.map((i: { subject: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; grade: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; },k: Key | null | undefined) => <span key={k} className="block text-gray-500 text-theme-sm dark:text-white/90">{i.subject} ({i.grade})</span>):"Any Combination"
              }</h1>
              
        </div>
        <div className="c_grid bprogramme-t bprogramme-gray-100 dark:bprogramme-gray-800 pt-8 pl-2 pr-2">
          <h1 className="header-more">Explore More Eligible <br /> <span>Programmes for you</span></h1>
          <Link to={'/basic-tables'} >
            <span className=" text-blue-700">view all</span>
          </Link>
        </div>
        <BasicTableOne splice={true}/>
        {/* <ComponentCard title="On Going Project">
          <BasicTableOne />
        </ComponentCard> */}
      </div>
    </>
  );
}
