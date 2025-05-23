import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function BasicTables() {
  const [role, setRole] = useState("USER");

  useEffect(() => {
    const store = localStorage.getItem("student");
    if (store) {
      setRole((JSON.parse(store)).role);
    }

  });
  return (
    <>
      <PageMeta
        title="Students"
        description=""
      />
      <PageBreadcrumb pageTitle="Available Courses" />
      <div className="space-y-6">
        <ComponentCard>
          <BasicTableOne role={role}/>
        </ComponentCard>
      </div>
    </>
  );
}
