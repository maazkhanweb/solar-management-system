/**
 * ============================================================================
 * File: src/components/dashboard/wapda-bill/BillOCRUpload.jsx
 * Description:
 * OCR Bill Image Upload Component
 * ============================================================================
 */

import { useRef, useState } from "react";
import "./BillOCRUpload.css";

const BillOCRUpload = ({
    onFileSelect,
    loading = false,
}) => {

    const fileInputRef = useRef(null);

    const [preview, setPreview] = useState(null);

    const [fileName, setFileName] = useState("");

    const [success, setSuccess] = useState(false);

    const handleSelect = async (event) => {

        const file = event.target.files[0];

        if (!file) return;

        setPreview(URL.createObjectURL(file));

        setFileName(file.name);

        setSuccess(false);

        try {

            await onFileSelect(file);

            setSuccess(true);

        } catch (error) {

            setSuccess(false);

            console.error(error);

        }

    };

    const openFilePicker = () => {

        fileInputRef.current.click();

    };

    return (

        <div className="ocr-upload-container">

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                style={{ display: "none" }}
                onChange={handleSelect}
            />

            <button
                type="button"
                className="ocr-upload-button"
                onClick={openFilePicker}
                disabled={loading}
            >

                {

                    loading

                        ? "Scanning Bill..."

                        : "Upload Bill Image"

                }

            </button>

            {

                preview && (

                    <div className="ocr-preview">

                        <img
                            src={preview}
                            alt="Bill Preview"
                        />

                    </div>

                )

            }

            {

                fileName && (

                    <p className="ocr-file-name">

                        {fileName}

                    </p>

                )

            }

            {

                success && (

                    <div className="ocr-success">

                        ✅ Bill scanned successfully.

                    </div>

                )

            }

        </div>

    );

};

export default BillOCRUpload;