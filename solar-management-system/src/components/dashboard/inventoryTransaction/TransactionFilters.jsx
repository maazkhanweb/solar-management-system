import "./TransactionFilters.css";

import {
    RiRefreshLine,
} from "react-icons/ri";

const TransactionFilters = ({
    search,
    setSearch,
    filters,
    setFilters,
    setCurrentPage,
    areas = [],
    users = [],
}) => {

    /**
     * Handle Filter Change
     */
    const handleFilterChange = (event) => {

        const { name, value } = event.target;

        setFilters((previous) => ({

            ...previous,

            [name]: value,

        }));

        if (setCurrentPage) {

            setCurrentPage(1);

        }

    };

    /**
     * Search
     */
    const handleSearch = (event) => {

        setSearch(event.target.value);

        if (setCurrentPage) {

            setCurrentPage(1);

        }

    };

    /**
     * Reset Filters
     */
    const handleReset = () => {

        setSearch("");

        setFilters({

            action: "",

            area: "",

            user: "",

            date: "",

        });

        if (setCurrentPage) {

            setCurrentPage(1);

        }

    };

    return (

        <div className="transaction-filters">

            {/* Search */}

            <div className="transaction-search">

                <input
                    type="text"
                    placeholder="Search by Item, Serial Number or Remarks..."
                    value={search}
                    onChange={handleSearch}
                />

            </div>

            {/* Transaction Type */}

            <select
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
            >

                <option value="">
                    All Transaction Types
                </option>

                <option value="ADD">
                    Added
                </option>

                <option value="UPDATE">
                    Updated
                </option>

                <option value="ASSIGN">
                    Assigned
                </option>

                <option value="RETURN">
                    Returned
                </option>

                <option value="DELETE">
                    Deleted
                </option>

            </select>

            {/* Area */}

            <select
                name="area"
                value={filters.area}
                onChange={handleFilterChange}
            >

                <option value="">
                    All Areas
                </option>

                {

                    areas.map((area) => (

                        <option
                            key={area.id}
                            value={area.id}
                        >

                            {area.area_name}

                        </option>

                    ))

                }

            </select>

            {/* User */}

            <select
                name="user"
                value={filters.user}
                onChange={handleFilterChange}
            >

                <option value="">
                    All Users
                </option>

                {

                    users.map((user) => (

                        <option
                            key={user.id}
                            value={user.id}
                        >

                            {user.name}

                        </option>

                    ))

                }

            </select>

            {/* Date */}

            <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
            />

            {/* Reset */}

            <button
                type="button"
                className="transaction-reset-btn"
                onClick={handleReset}
            >

                <RiRefreshLine />

                <span>

                    Reset

                </span>

            </button>

        </div>

    );

};

export default TransactionFilters;