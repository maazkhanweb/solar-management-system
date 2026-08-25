import { useEffect, useState } from "react";

import AddMasterModal from "./AddMasterModal";

import "./MasterSelect.css";

const ADD_NEW = "__ADD_NEW__";

const MasterSelect = ({

    label = "",

    value = "",

    options = [],

    title = "Add New",

    placeholder = "Select",

    modalPlaceholder = "Enter Value",

    onChange = () => {},

    /*
    |--------------------------------------------------------------------------
    | NEW PROPS
    |--------------------------------------------------------------------------
    */

    onAddNew = null,

}) => {

    const [items, setItems] = useState([]);

    const [selectedValue, setSelectedValue] = useState("");

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {

        setItems(options);

    }, [options]);

    useEffect(() => {

        setSelectedValue(value);

    }, [value]);

    const handleSelectChange = (e) => {

        const value = e.target.value;

        if (value === ADD_NEW) {

            setShowModal(true);

            return;

        }

        setSelectedValue(value);

        onChange(value);

    };

    const handleSave = async (newValue) => {

        const value = newValue.trim();

        if (!value) return;

        try {

            /*
            |--------------------------------------------------------------------------
            | Backend Save
            |--------------------------------------------------------------------------
            */

            if (onAddNew) {

                const createdItem = await onAddNew(value);

                const itemValue =

                    createdItem?.area_name ||

                    createdItem?.name ||

                    value;

                const exists = items.some(

                    item =>

                        item.toLowerCase() ===

                        itemValue.toLowerCase()

                );

                if (!exists) {

                    setItems(prev => [

                        ...prev,

                        itemValue,

                    ]);

                }

                setSelectedValue(itemValue);

                onChange(itemValue);

            }

            /*
            |--------------------------------------------------------------------------
            | Local Only
            |--------------------------------------------------------------------------
            */

            else {

                const exists = items.some(

                    item =>

                        item.toLowerCase() ===

                        value.toLowerCase()

                );

                if (!exists) {

                    setItems(prev => [

                        ...prev,

                        value,

                    ]);

                }

                setSelectedValue(value);

                onChange(value);

            }

            setShowModal(false);

        } catch (error) {

            console.error(error);

            alert("Failed to save.");

        }

    };

    return (

        <>

            <div className="ms-select">

                {

                    label && (

                        <label className="ms-label">

                            {label}

                        </label>

                    )

                }

                <select

                    className="ms-dropdown"

                    value={selectedValue}

                    onChange={handleSelectChange}

                >

                    <option value="">

                        {placeholder}

                    </option>

                    {

                        items.map((item, index) => (

                            <option

                                key={index}

                                value={item}

                            >

                                {item}

                            </option>

                        ))

                    }

                    <option value={ADD_NEW}>

                        + Add New

                    </option>

                </select>

            </div>

            <AddMasterModal

                isOpen={showModal}

                title={title}

                placeholder={modalPlaceholder}

                onClose={() => setShowModal(false)}

                onSave={handleSave}

            />

        </>

    );

};

export default MasterSelect;