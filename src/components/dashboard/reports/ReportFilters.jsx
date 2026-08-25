/**
 * ============================================================================
 * File: src/components/dashboard/reports/ReportsFilters.jsx
 * Description:
 * Reports Search Filter
 * (Search Only)
 * ============================================================================
 */

import { useState } from "react";

import "./ReportsFilters.css";

function ReportFilters({

    onSearch,

}) {

    const [search, setSearch] = useState("");

    /**
     * Search Reports
     */

    const handleSearch = (event) => {

        const value = event.target.value;

        setSearch(value);

        if (onSearch) {

            onSearch(value);

        }

    };

    /**
     * Reset Search
     */

    const handleReset = () => {

        setSearch("");

        if (onSearch) {

            onSearch("");

        }

    };

    return (

        <div className="report-filters">

            {/* =====================================================
                Search
            ===================================================== */}

            <div className="filter-group search-group">

                <label>

                    Search Reports

                </label>

                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by Report Name, Module, Type, Status..."
                />

            </div>

            {/* =====================================================
                Buttons
            ===================================================== */}

        </div>

    );

}

export default ReportFilters;