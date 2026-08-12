/**
 * ============================================================================
 * File:
 * src/pages/dashboard/billManagement/WapdaBillManagement.jsx
 * ============================================================================
 */

import { useEffect, useState } from "react";

import WapdaBillTable from "../../../components/dashboard/wapda-bill/WapdaBillTable";
import WapdaBillModal from "../../../components/dashboard/wapda-bill/WapdaBillModal";
import DeleteBillModal from "../../../components/dashboard/wapda-bill/DeleteBillModal";
import BillAnalysisModal from "../../../components/dashboard/wapda-bill/BillAnalysisModal";

import billService from "../../../services/billService";
import billAnalysisService from "../../../services/billAnalysisService";
import authService from "../../../services/authService";

import "./WapdaBillManagement.css";

function WapdaBillManagement() {

    const [bills, setBills] = useState([]);

    const [areas, setAreas] = useState([]);

    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false);

    /* ==========================================
       NEW
    ========================================== */

    const [isAnalysisModalOpen, setIsAnalysisModalOpen] =
        useState(false);

    const [selectedBill, setSelectedBill] =
        useState(null);

    const [billAnalysis, setBillAnalysis] =
        useState(null);

    const [filters, setFilters] = useState({

        search: "",

        month: "",

        year: "",

        area_id: "",

        status: "",

    });

    useEffect(() => {

        loadBills();

        loadAreas();

    }, []);

    /* ==========================================
       LOAD BILLS
    ========================================== */

    const loadBills = async () => {

        try {

            setLoading(true);

            const response =
                await billService.getBills(filters);

            setBills(response.data.data);

        } catch (error) {

            console.error(
                "Failed to load bills:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    /* ==========================================
       LOAD AREAS
    ========================================== */

    const loadAreas = async () => {

        try {

            const response =
                await authService.getAreaOptions();

            setAreas(response.areas);

        } catch (error) {

            console.error(
                "Failed to load areas:",
                error
            );

        }

    };

    /* ==========================================
       SAVE BILL
    ========================================== */

    const handleSaveBill = async (formData) => {

        try {

            setLoading(true);

            if (selectedBill) {

                await billService.updateBill(
                    selectedBill.id,
                    formData
                );

            } else {

                await billService.createBill(
                    formData
                );

            }

            setIsModalOpen(false);

            setSelectedBill(null);

            await loadBills();

        } catch (error) {

            console.error(
                "Failed to save bill:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    /* ==========================================
       EDIT BILL
    ========================================== */

    const handleEditBill = (bill) => {

        setSelectedBill(bill);

        setIsModalOpen(true);

    };

    /* ==========================================
       ANALYSIS
       (NOW OPENS MODAL)
    ========================================== */

    const handleViewAnalysis = async (bill) => {

        try {

            setLoading(true);

            const response =
                await billAnalysisService.getAnalysis(
                    bill.id
                );

            setSelectedBill(bill);

            setBillAnalysis(response.analysis);

            setIsAnalysisModalOpen(true);

        } catch (error) {

            console.error(
                "Failed to load analysis:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    /* ==========================================
       DELETE
    ========================================== */

    const handleDeleteClick = (bill) => {

        setSelectedBill(bill);

        setIsDeleteModalOpen(true);

    };

    const handleDeleteBill = async () => {

        try {

            setLoading(true);

            await billService.deleteBill(
                selectedBill.id
            );

            setIsDeleteModalOpen(false);

            setSelectedBill(null);

            await loadBills();

        } catch (error) {

            console.error(
                "Failed to delete bill:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    /* ==========================================
       ADD BILL
    ========================================== */

    const handleAddBill = () => {

        setSelectedBill(null);

        setIsModalOpen(true);

    };

    /* ==========================================
       FILTERS
    ========================================== */

    const handleFilterChange = (e) => {

        const { name, value } = e.target;

        setFilters((prev) => ({

            ...prev,

            [name]: value,

        }));

    };

    const handleSearch = async () => {

        await loadBills();

    };

    const handleResetFilters = async () => {

        const resetFilters = {

            search: "",

            month: "",

            year: "",

            area_id: "",

            status: "",

        };

        setFilters(resetFilters);

        try {

            setLoading(true);

            const response =
                await billService.getBills(
                    resetFilters
                );

            setBills(response.data.data);

        } catch (error) {

            console.error(
                "Failed to reset filters:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <section className="bill-management-page">

            {/* ==========================================
                Header
            ========================================== */}

            <div className="bill-management-header">

                <div>

                    <h1>

                        WAPDA Bill Management

                    </h1>

                    <p>

                        Manage electricity bills, OCR extraction,
                        AI analysis and solar comparison.

                    </p>

                </div>

                <button
                    className="primary-btn"
                    onClick={handleAddBill}
                >

                    + Add New Bill

                </button>

            </div>

            {/* ==========================================
                Bills Table
            ========================================== */}

            <WapdaBillTable

                bills={bills}

                loading={loading}

                filters={filters}

                areas={areas}

                onFilterChange={handleFilterChange}

                onSearch={handleSearch}

                onReset={handleResetFilters}

                onEdit={handleEditBill}

                onDelete={handleDeleteClick}

                onAnalysis={handleViewAnalysis}

            />

            {/* ==========================================
                Add / Edit Modal
            ========================================== */}

            <WapdaBillModal

    isOpen={isModalOpen}

    onClose={() => {

        setIsModalOpen(false);

        setSelectedBill(null);

    }}

    selectedBill={selectedBill}

    areas={areas}

    onSave={handleSaveBill}

/>

            {/* ==========================================
                Delete Modal
            ========================================== */}

            <DeleteBillModal

    isOpen={isDeleteModalOpen}

    selectedBill={selectedBill}

    onClose={() => {

        setIsDeleteModalOpen(false);

        setSelectedBill(null);

    }}

    onConfirm={handleDeleteBill}

/>

            {/* ==========================================
                NEW
                Analysis Modal
            ========================================== */}

            <BillAnalysisModal

                isOpen={isAnalysisModalOpen}

                bill={selectedBill}

                analysis={billAnalysis}

                onClose={() => {

                    setIsAnalysisModalOpen(false);

                    setSelectedBill(null);

                    setBillAnalysis(null);

                }}

            />

        </section>

    );

}

export default WapdaBillManagement;