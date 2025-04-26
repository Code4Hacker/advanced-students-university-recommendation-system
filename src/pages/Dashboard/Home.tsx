import PageMeta from "../../components/common/PageMeta";
import { Link } from "react-router";
import DashboardCard from "../../components/programmes/DashboardCard";
import HomeTable from "../../components/tables/BasicTables/HomeTable";
import { useEffect } from "react";
import useProgrammes from "../../hooks/useProgrammes";

export default function Home() {
  useProgrammes(6);
  return (
    <>
      <PageMeta
        title="UDOM - Project Management WebApp"
        description="Created by XGemini - 2025"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-12 xl:col-span-12">
          <DashboardCard />
          
        </div>
        
        <div className="col-span-12 c_grid border-t border-gray-100 dark:border-gray-800 pt-8 pl-2 pr-2">
          <h1>Eligible Programmes / Courses</h1>
          <Link to={'/basic-tables'} >
          <span className=" text-blue-700">Check All Availables</span>
          </Link>
        </div>
        <div className="col-span-12 xl:col-span-12">
          <HomeTable header={true} />
        </div>

        {/* <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
