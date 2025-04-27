import { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import axios from "axios";
import { baseURL } from "../../baseURL/base_url";

export default function DashboardCard() {
  const [summary, setSummary] = useState({
    eligible: 0,
    available_university: 0,
    available_courses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const subjects = window.localStorage.getItem("subjects");
        const subjectsData = subjects ? JSON.parse(subjects) : [];

        const response = await axios.post(`${baseURL}/api/summary.php`, {
          subjects: subjectsData
        });

        if (response.data.success) {
          setSummary(response.data.summary);
          localStorage.setItem("summary", JSON.stringify(response.data.summary));
        } else {
          setError(response.data.error || "Failed to load summary");
          const localSummary = localStorage.getItem("summary");
          if (localSummary) {
            setSummary(JSON.parse(localSummary));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load summary");
        const localSummary = localStorage.getItem("summary");
        if (localSummary) {
          setSummary(JSON.parse(localSummary));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
              <div className="mt-5 space-y-2">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* Eligible Courses Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Your Eligible Courses
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {summary.eligible}
            </h4>
          </div>
        </div>
      </div>

      {/* Universities Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Available Universities
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {summary.available_university}
            </h4>
          </div>
        </div>
      </div>

      {/* Programs Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Available Programmes
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {summary.available_courses}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}