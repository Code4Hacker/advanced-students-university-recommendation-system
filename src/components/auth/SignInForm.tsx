// SignInForm.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { baseURL } from "../../baseURL/base_url";
const API_URL = `${baseURL}/api/general-requests.php`;
export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isNewStudent, setIsNewStudent] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    subjects: [
      { subject: "", grade: "" },
      { subject: "", grade: "" },
      { subject: "", grade: "" },
    ],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (
    index: number,
    field: "subject" | "grade",
    value: string
  ) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index][field] = value;
    setFormData((prev) => ({ ...prev, subjects: newSubjects }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isNewStudent) {
        const response = await axios.post(`${API_URL}?action=register`, formData, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.data.success) {
          localStorage.setItem("student_id", response.data.student_id);
          await getEligibleCourses(response.data.student_id);
          navigate("/dashboard");
        } else {
          setError(response.data.error);
        }
      } else {
        const response = await axios.post(
          `${API_URL}?action=signin`,
          {
            username: formData.username,
            password: formData.password,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          localStorage.setItem("student", JSON.stringify(response.data.student));
          localStorage.setItem("subjects", JSON.stringify(response.data.subjects));
          // After successful sign-in, get eligible courses
          await getEligibleCourses(response.data.student.student_id);
          navigate("/dashboard");
        } else {
          setError(response.data.error);
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const getEligibleCourses = async (studentId: string) => {
    try {
      const response = await axios.post(
        `${API_URL}?action=get_courses`,
        { student_id: studentId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        console.log("Eligible courses:", response.data.courses);
        localStorage.setItem("eligible_courses", JSON.stringify(response.data.courses));
        return response.data.courses;
      } else {
        console.error("Failed to get courses:", response.data.error);
        setError(response.data.error);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch eligible courses");
    }
  };
  const store = window.localStorage.getItem("subjects");
  const navigation  = useNavigate();
  useEffect(() => {
    if (store) {
      navigation("/dashboard")
    }
  },[]);
  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {isNewStudent ? "Register" : "Sign In"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isNewStudent
                ? "Enter your details and subjects to register!"
                : "Enter your username and password to sign in!"}
            </p>
          </div>
          {error && (
            <div className="mb-4 text-sm text-red-500">{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Username <span className="text-error-500">*</span>
                </Label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter Username"
                />
              </div>
              {isNewStudent && (
                <>
                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      type="email"
                    />
                  </div>
                  <div>
                    <Label>
                      Full Name <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                </>
              )}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              {isNewStudent && (
                <div className="space-y-4">
                  <Label>Form Six Subjects <span className="text-error-500">*</span></Label>
                  {formData.subjects.map((subject, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder={`Subject ${index + 1}`}
                        value={subject.subject}
                        onChange={(e) =>
                          handleSubjectChange(index, "subject", e.target.value)
                        }
                      />
                      <select
                        value={subject.grade}
                        onChange={(e) =>
                          handleSubjectChange(index, "grade", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="">Select Grade</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
              {!isNewStudent && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
              <div>
                <Button
                  className="w-full"
                  size="sm"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : isNewStudent
                      ? "Register"
                      : "Sign in"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              {isNewStudent ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => setIsNewStudent(!isNewStudent)}
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                {isNewStudent ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}