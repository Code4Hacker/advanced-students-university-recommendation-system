import { Link } from "react-router";

export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl px-4 py-5 text-center`}
    >
      <Link
        to="/"
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600"
      >
        Sign Out
      </Link>
    </div>
  );
}
