import React, { useState, useEffect } from 'react'
import { Modal } from '../../ui/modal';
import { baseURL } from '../../../baseURL/base_url';
import toast, { Toaster } from 'react-hot-toast';

interface ModalProps {
    isOpen: boolean,
    closeModal: () => void,
    course: any,
    setCourse: (course: any) => void,
    fetchProgrammes: () => void
}


interface Requirement {
    subject: string;
    grade: string;
}

interface College {
    collegeAbbr: string;
    collegeName: string;
}

const AddCourse: React.FC<ModalProps> = ({ isOpen, closeModal, course, setCourse, fetchProgrammes }) => {
    const [input, setInput] = useState({
        collegeAbbr: "",
        courseAbbr: "",
        course: "",
        minimum_points: "",
        universityAbbr: "UDOM",
        specific_requirements: [] as Requirement[],
        user_role: "USER"
    });
    const [newRequirement, setNewRequirement] = useState<Requirement>({
        subject: '',
        grade: ''
    });
    const [colleges, setColleges] = useState<College[]>([]);
    const [loadingColleges, setLoadingColleges] = useState(false);

    useEffect(() => {
        const fetchColleges = async () => {
            setLoadingColleges(true);
            try {
                const response = await fetch(`${baseURL}/api/get_colleges.php?universityAbbr=${input.universityAbbr}`);
                const data = await response.json();
                if (data.success) {
                    setColleges(data.colleges);
                    if (data.colleges.length > 0) {
                        setInput(prev => ({
                            ...prev,
                            collegeAbbr: data.colleges[0].collegeAbbr
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching colleges:", error);
            } finally {
                setLoadingColleges(false);
            }
        };

        if (isOpen) {
            fetchColleges();
        }
    }, [input.universityAbbr, isOpen]);

    const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newUniversity = e.target.value;
        setInput(prev => ({
            ...prev,
            universityAbbr: newUniversity,
            collegeAbbr: ""
        }));
    };

    const handleAddRequirement = () => {
        if (newRequirement.subject.trim() && newRequirement.grade.trim()) {
            setInput(prev => ({
                ...prev,
                specific_requirements: [
                    ...prev.specific_requirements,
                    {
                        subject: newRequirement.subject.trim(),
                        grade: newRequirement.grade.trim().toUpperCase()
                    }
                ]
            }));
            setNewRequirement({ subject: '', grade: '' });
        }
    };

    const handleRemoveRequirement = (index: number) => {
        setInput(prev => {
            const updated = [...prev.specific_requirements];
            updated.splice(index, 1);
            return { ...prev, specific_requirements: updated };
        });
    };

    const handleUpdateRequirement = (index: number, field: keyof Requirement, value: string) => {
        setInput(prev => {
            const updated = [...prev.specific_requirements];
            updated[index] = {
                ...updated[index],
                [field]: field === 'grade' ? value.toUpperCase() : value
            };
            return { ...prev, specific_requirements: updated };
        });
    };

    useEffect(() => {
        const store = localStorage.getItem("student");
        if (store) {
            setInput((prev) => ({
                ...prev,
                user_role: (JSON.parse(store)).role
            }))
        }
    }, []);

    const handleSave = async () => {
        try {
            const requirementsToSave = input.specific_requirements.filter(
                req => req.subject.trim() && req.grade.trim()
            );
            const payload = {
                courseAbbr: input.courseAbbr,
                user_role: input.user_role,
                courseData: {
                    course: input.course,
                    collegeAbbr: input.collegeAbbr,
                    minimum_points: input.minimum_points,
                    universityAbbr: input.universityAbbr,
                    specific_requirements: requirementsToSave
                }
            };
            const response = await fetch(`${baseURL}/api/add_courses.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log("payload", data)
            
            if (data.success === true) {
                alert(data.message);
                
                setCourse({
                    ...input,
                    specific_requirements: requirementsToSave
                });
                fetchProgrammes();
                closeModal();
            } else {
                console.error('Update failed:', data.error);
                toast.error(data.error)
            }
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
            <Toaster/>
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                        Add New Course
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Feel free to add any field here according to your consideration.
                    </p>
                </div>

                <div className="mt-8">
                    <div className="mt-6">
                        <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-gray-400">
                            The University
                        </label>
                        <div className="flex flex-wrap items-center gap-4 mb-4 opacity-50 p-2 rounded-md sm:gap-5">
                            <select
                                value={input.universityAbbr}
                                onChange={handleUniversityChange}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value='UDOM'>The University of Dodoma</option>
                                <option value="UDSM">University of Dar es Salaam</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                            College
                        </label>
                        {loadingColleges ? (
                            <div className="p-2 text-gray-500">Loading colleges...</div>
                        ) : (
                            <select
                                value={input.collegeAbbr}
                                onChange={(e) => setInput(prev => ({
                                    ...prev,
                                    collegeAbbr: e.target.value
                                }))}
                                className="w-full p-2 border rounded-md"
                            >
                                {colleges.map(college => (
                                    <option key={college.collegeAbbr} value={college.collegeAbbr}>
                                        {college.collegeName} ({college.collegeAbbr})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Course Name
                        </label>
                        <input
                            type="text"
                            value={input.course}
                            onChange={(e) => setInput(prev => ({ ...prev, course: e.target.value }))}
                            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Course Abbreviation
                        </label>
                        <input
                            type="text"
                            value={input.courseAbbr}
                            onChange={(e) => setInput(prev => ({ ...prev, courseAbbr: e.target.value }))}
                            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                    </div>

                    <div className="mt-6">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Specific Requirements
                        </label>

                        {input.specific_requirements.map((req, index) => (
                            <div key={index} className="relative grid gap-2 grid-cols-2 mb-2">
                                <input
                                    type="text"
                                    value={req.subject}
                                    onChange={(e) => handleUpdateRequirement(index, 'subject', e.target.value)}
                                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={req.grade}
                                        onChange={(e) => handleUpdateRequirement(index, 'grade', e.target.value)}
                                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRequirement(index)}
                                        className="btn btn-danger flex items-center justify-center rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="relative grid gap-2 grid-cols-2 mt-4">
                            <input
                                type="text"
                                placeholder='Subject eg. Physics'
                                value={newRequirement.subject}
                                onChange={(e) => setNewRequirement(prev => ({ ...prev, subject: e.target.value }))}
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder='Grade eg. C'
                                    value={newRequirement.grade}
                                    onChange={(e) => setNewRequirement(prev => ({ ...prev, grade: e.target.value }))}
                                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddRequirement}
                                    className="btn btn-success flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                            Minimum Point Required
                        </label>
                        <input
                            type="number"
                            placeholder='Eg. 4'
                            value={input.minimum_points}
                            onChange={(e) => setInput(prev => ({ ...prev, minimum_points: e.target.value }))}
                            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-6 sm:justify-end">
                    <button
                        onClick={closeModal}
                        type="button"
                        className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="btn btn-success flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default AddCourse