/**
 * ============================================================================
 * File:
 * src/components/dashboard/wapda-bill/BillOCRUpload.jsx
 *
 * Description:
 * Reusable OCR upload component for WAPDA bills and Solar reports.
 * ============================================================================
 */

import { useRef, useState } from "react";

import "./BillOCRUpload.css";


const BillOCRUpload = ({
    title = "Bill Image OCR",
    buttonText = "Upload Bill Image",
    loadingText = "Scanning...",
    successText = "Document scanned successfully.",
    onFileSelect,
    loading = false,
}) => {

    const fileInputRef = useRef(null);

    const [preview, setPreview] = useState(null);

    const [fileName, setFileName] = useState("");

    const [success, setSuccess] = useState(false);


    const handleSelect = async (event) => {

        const file = event.target.files?.[0];

        if (!file) {

            return;

        }

        setPreview(

            URL.createObjectURL(file)

        );

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

        fileInputRef.current?.click();

    };


    return (

        <div className="ocr-upload-container">

            <div className="ocr-upload-title">

                {title}

            </div>


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

                        ? loadingText

                        : buttonText

                }

            </button>


            {

                preview && (

                    <div className="ocr-preview">

                        <img
                            src={preview}
                            alt="OCR Preview"
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

                        ✓ {successText}

                    </div>

                )

            }

        </div>

    );

};


export default BillOCRUpload;