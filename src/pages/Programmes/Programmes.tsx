import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import React from 'react';
  
  interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  }
  interface UseProgrammesReturn {
    pagination: Pagination;
    loading: boolean;
    error: string | null;
    fetchProgrammes: (page?: number) => Promise<void>;
  }

const Programmes:React.FC<UseProgrammesReturn> = ({
    pagination,
    loading,
    error,
    fetchProgrammes,
}) => {
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pagination.last_page) {
            fetchProgrammes(page);
        }
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const totalPages = pagination.last_page;
        const currentPage = pagination.current_page;

        // Always show first page
        pages.push(1);

        // Show current page and nearby pages
        if (currentPage > 3) {
            pages.push('...');
        }

        if (currentPage > 2) {
            pages.push(currentPage - 1);
        }

        if (currentPage !== 1 && currentPage !== totalPages) {
            pages.push(currentPage);
        }

        if (currentPage < totalPages - 1) {
            pages.push(currentPage + 1);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        // Always show last page if there's more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            {/* Mobile pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">
                            {(pagination.current_page - 1) * pagination.per_page + 1}
                        </span> to{' '}
                        <span className="font-medium">
                            {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                        </span> of{' '}
                        <span className="font-medium">{pagination.total}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                        <button
                            onClick={() => handlePageChange(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {getPageNumbers().map((page, index) => (
                            <React.Fragment key={index}>
                                {page === '...' ? (
                                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handlePageChange(page as number)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === pagination.current_page
                                                ? 'z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}

                        <button
                            onClick={() => handlePageChange(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Programmes;