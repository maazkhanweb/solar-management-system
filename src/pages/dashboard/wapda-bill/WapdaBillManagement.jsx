/**
 * ============================================================================
 * File:
 * src/pages/dashboard/wapda-bill/WapdaBillManagement.jsx
 *
 * Description:
 * WAPDA Bill Management page.
 * Includes:
 * - Bill listing
 * - Add/Edit/Delete bill
 * - Bill analysis
 * - Bill statistics
 * ============================================================================
 */

import { useEffect, useState } from "react";

import WapdaBillTable from "../../../components/dashboard/wapda-bill/WapdaBillTable";
import WapdaBillModal from "../../../components/dashboard/wapda-bill/WapdaBillModal";
import DeleteBillModal from "../../../components/dashboard/wapda-bill/DeleteBillModal";
import BillAnalysisCard from "../../../components/dashboard/wapda-bill/BillAnalysisCard";

import billService from "../../../services/billService";
import billAnalysisService from "../../../services/billAnalysisService";
import authService from "../../../services/authService";

import "./WapdaBillManagement.css";


function WapdaBillManagement() {

    const [bills, setBills] = useState([]);

    const [areas, setAreas] = useState([]);

    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false);

    const [selectedBill, setSelectedBill] =
        useState(null);

    const [billAnalysis, setBillAnalysis] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | LOAD DATA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadBills();

        loadAreas();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | LOAD BILLS
    |--------------------------------------------------------------------------
    */

    const loadBills = async () => {

        try {

            setLoading(true);

            const response =
                await billService.getBills();

            setBills(
                response.data.data
            );

        } catch (error) {

            console.error(
                "Failed to load bills:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | LOAD AREAS
    |--------------------------------------------------------------------------
    */

    const loadAreas = async () => {

        try {

            const response =
                await authService.getAreaOptions();

            setAreas(
                response.areas
            );

        } catch (error) {

            console.error(
                "Failed to load areas:",
                error
            );

        }

    };


    /*
    |--------------------------------------------------------------------------
    | SAVE BILL
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | EDIT BILL
    |--------------------------------------------------------------------------
    */

    const handleEditBill = (bill) => {

        setSelectedBill(bill);

        setIsModalOpen(true);

    };


    /*
    |--------------------------------------------------------------------------
    | CLOSE ANALYSIS
    |--------------------------------------------------------------------------
    */

    const handleCloseAnalysis = () => {

        setBillAnalysis(null);

        setSelectedBill(null);

    };


    /*
    |--------------------------------------------------------------------------
    | VIEW ANALYSIS
    |--------------------------------------------------------------------------
    */

    const handleViewAnalysis = async (bill) => {

        try {

            setLoading(true);

            /*
            |--------------------------------------------------------------------------
            | IMPORTANT
            |--------------------------------------------------------------------------
            | Keep the original selected bill.
            | The analysis API may not return consumer name,
            | reference number, area, bill period or address.
            | BillAnalysisCard will use this bill as fallback data.
            |--------------------------------------------------------------------------
            */

            setSelectedBill(bill);

            const response =
                await billAnalysisService.getAnalysis(
                    bill.id
                );

            setBillAnalysis(
                response.analysis
            );

        } catch (error) {

            console.error(
                "Failed to load analysis:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | DELETE CLICK
    |--------------------------------------------------------------------------
    */

    const handleDeleteClick = (bill) => {

        setSelectedBill(bill);

        setIsDeleteModalOpen(true);

    };


    /*
    |--------------------------------------------------------------------------
    | DELETE BILL
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | ADD BILL
    |--------------------------------------------------------------------------
    */

    const handleAddBill = () => {

        setSelectedBill(null);

        setIsModalOpen(true);

    };


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="bill-management">


            {/* ================================================================
                PAGE HEADER
            ================================================================= */}

            <div className="bill-header">

                <div>

                    <h1>
                        WAPDA Bill Management
                    </h1>

                    <p>
                        Manage electricity bills, monitor payments,
                        perform OCR extraction and AI-powered analysis.
                    </p>

                </div>


                <div className="bill-header-actions">

                    <button
                        type="button"
                        className="add-bill-btn"
                        onClick={handleAddBill}
                    >

                        + Add New Bill

                    </button>

                </div>

            </div>


            {/* ================================================================
                STATISTICS
            ================================================================= */}

            <div className="bill-stats">


                <div className="bill-stat-card">

                    <div className="bill-stat-title">
                        Total Bills
                    </div>

                    <div className="bill-stat-value">

                        {bills.length}

                    </div>

                    <div className="bill-stat-subtitle">
                        Available Records
                    </div>

                </div>


                <div className="bill-stat-card">

                    <div className="bill-stat-title">
                        Paid Bills
                    </div>

                    <div className="bill-stat-value">

                        {
                            bills.filter(
                                bill =>
                                    bill.status === "Paid"
                            ).length
                        }

                    </div>

                    <div className="bill-stat-subtitle">
                        Successfully Paid
                    </div>

                </div>


                <div className="bill-stat-card">

                    <div className="bill-stat-title">
                        Unpaid Bills
                    </div>

                    <div className="bill-stat-value">

                        {
                            bills.filter(
                                bill =>
                                    bill.status === "Unpaid"
                            ).length
                        }

                    </div>

                    <div className="bill-stat-subtitle">
                        Pending Bills
                    </div>

                </div>


                <div className="bill-stat-card">

                    <div className="bill-stat-title">
                        Total Amount
                    </div>

                    <div className="bill-stat-value">

                        Rs.

                        {
                            bills
                                .reduce(
                                    (
                                        total,
                                        bill
                                    ) =>
                                        total +
                                        Number(
                                            bill.bill_amount || 0
                                        ),
                                    0
                                )
                                .toLocaleString()
                        }

                    </div>

                    <div className="bill-stat-subtitle">
                        Overall Collection
                    </div>

                </div>


            </div>


            {/* ================================================================
                TABLE
            ================================================================= */}

            <div className="bill-table-wrapper">

                <div className="bill-table-header">

                    <div>

                        <h2 className="bill-table-title">
                            Electricity Bills
                        </h2>

                        <p className="bill-table-subtitle">
                            Manage, edit, delete and analyze all WAPDA bills.
                        </p>

                    </div>

                </div>


                {
                    loading ? (

                        <div
                            style={{
                                padding: "60px",
                                textAlign: "center",
                            }}
                        >

                            Loading Bills...

                        </div>

                    ) : (

                        <WapdaBillTable

                            bills={bills}

                            onEdit={handleEditBill}

                            onDelete={handleDeleteClick}

                            onViewAnalysis={
                                handleViewAnalysis
                            }

                        />

                    )
                }


            </div>


            {/* ================================================================
                BILL MODAL
            ================================================================= */}

            <WapdaBillModal

                isOpen={isModalOpen}

                onClose={() => {

                    setIsModalOpen(false);

                    setSelectedBill(null);

                }}

                onSave={handleSaveBill}

                selectedBill={selectedBill}

                areas={areas}

            />


            {/* ================================================================
                DELETE MODAL
            ================================================================= */}

            <DeleteBillModal

                isOpen={isDeleteModalOpen}

                selectedBill={selectedBill}

                onClose={() => {

                    setIsDeleteModalOpen(false);

                    setSelectedBill(null);

                }}

                onConfirm={handleDeleteBill}

            />


            {/* ================================================================
                BILL ANALYSIS
            ================================================================= */}

            {
                billAnalysis && (

                    <BillAnalysisCard

                        analysis={billAnalysis}

                        bill={selectedBill}

                        onClose={handleCloseAnalysis}

                    />

                )
            }


        </div>

    );

}


export default WapdaBillManagement;