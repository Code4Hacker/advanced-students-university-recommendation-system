import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/modal'
import { baseURL } from '../../baseURL/base_url';

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

const UpdateCourse: React.FC<ModalProps> = ({ isOpen, closeModal, course, setCourse, fetchProgrammes }) => {
        const [input, setInput] = useState({
        collegeAbbr: course.collegeAbbr,
        courseAbbr: course.courseAbbr,
        course: course.course,
        minimum_points: course.minimum_points,
        specific_requirements: [...course.specific_requirements] as Requirement[]
    });

    const [newRequirement, setNewRequirement] = useState<Requirement>({
        subject: '',
        grade: ''
    });

    // Initialize form with course data when modal opens or course changes
    useEffect(() => {
        if (isOpen) {
            setInput({
                collegeAbbr: course.collegeAbbr,
                courseAbbr: course.courseAbbr,
                course: course.course,
                minimum_points: course.minimum_points,
                specific_requirements: [...course.specific_requirements]
            });
        }
    }, [isOpen, course]);

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

    const handleSave = async () => {
        try {
            const requirementsToSave = input.specific_requirements.filter(
                req => req.subject.trim() && req.grade.trim()
            );

            const response = await fetch(`${baseURL}/api/update_course.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseAbbr: input.courseAbbr,
                    courseData: {
                        ...input,
                        specific_requirements: requirementsToSave
                    }
                })
            });

            const data = await response.json();
            if (data.success) {
                setCourse({
                    ...input,
                    specific_requirements: requirementsToSave
                });
                 fetchProgrammes();
                closeModal();
            } else {
                console.error('Update failed:', data.error);
            }
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] p-6 lg:p-10">
            <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                <div>
                    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                        Edit Course Details
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Feel free to update any field here according to your consideration.
                    </p>
                </div>

                <div className="mt-8">
                    <div className="mt-6">
                        <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-gray-400">
                            The University
                        </label>
                        <div className="flex flex-wrap items-center gap-4 mb-4 bg-green-800 opacity-50 p-2 text-white rounded-md sm:gap-5">
                            {course.university} ( {course.universityAbbr} )
                        </div>
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

export default UpdateCourse