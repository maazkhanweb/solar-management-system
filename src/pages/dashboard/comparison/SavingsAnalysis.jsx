import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    RiArrowLeftLine,
    RiBarChartBoxLine,
    RiCheckLine,
    RiFlashlightLine,
    RiLightbulbLine,
    RiPlantLine,
} from "react-icons/ri";

import "./SavingsAnalysis.css";

import fanAc from "../../../assets/images/acdc/fan-ac.png";
import fanDc from "../../../assets/images/acdc/fan-dc.png";
import bulbAc from "../../../assets/images/acdc/bulb-ac.png";
import bulbDc from "../../../assets/images/acdc/bulb-dc.png";
import fridgeAc from "../../../assets/images/acdc/fridge-ac.png";
import fridgeDc from "../../../assets/images/acdc/fridge-dc.png";
import pumpAc from "../../../assets/images/acdc/pump-ac.png";
import pumpDc from "../../../assets/images/acdc/pump-dc.png";
import ironAc from "../../../assets/images/acdc/iron-ac.png";
import ironDc from "../../../assets/images/acdc/iron-dc.png";


function getNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }

    const number = Number(
        String(value).replace(/[^0-9.-]/g, "")
    );

    return Number.isFinite(number)
        ? number
        : 0;
}


function SavingsAnalysis() {

    const navigate = useNavigate();
    const location = useLocation();


    /*
    |--------------------------------------------------------------------------
    | Bill Data
    |--------------------------------------------------------------------------
    */

    const billData =
        location.state?.billData ||
        (() => {

            try {

                return JSON.parse(
                    sessionStorage.getItem(
                        "comparison_acdc_bill_data"
                    ) || "null"
                );

            } catch {

                return null;

            }

        })();


    const [viewMode, setViewMode] =
        useState("card");


    /*
    |--------------------------------------------------------------------------
    | Bill Values
    |--------------------------------------------------------------------------
    */

    const unitsConsumed =
        getNumber(
            billData?.units_consumed ??
            billData?.unitsConsumed ??
            billData?.consumed_units
        );


    const billAmount =
        getNumber(
            billData?.current_bill ??
            billData?.currentBill ??
            billData?.payable_before_due
        );


    /*
    |--------------------------------------------------------------------------
    | Estimated Savings
    |--------------------------------------------------------------------------
    */

    const estimatedRange =
        useMemo(() => {

            const current =
                unitsConsumed || 0;

            return {

                low: Math.round(
                    current * 0.30
                ),

                high: Math.round(
                    current * 0.60
                ),

            };

        }, [unitsConsumed]);


    /*
    |--------------------------------------------------------------------------
    | Appliance Data
    |--------------------------------------------------------------------------
    */

    const applianceData = [

        {
            key: "fan",

            name: "پنکھا",

            urdu: "پنکھا",

            acImage: fanAc,

            dcImage: fanDc,

            ac: "1 AC Fan",

            acPower: "80W",

            dc: "3 DC Fans",

            dcPower: "25W each",

            saving: "تقریباً 69% کم بجلی",

            note:
                "DC پنکھے بجلی کے استعمال میں نمایاں کمی کر سکتے ہیں۔",
        },


        {
            key: "lighting",

            name: "لائٹنگ",

            urdu: "لائٹ / بلب",

            acImage: bulbAc,

            dcImage: bulbDc,

            ac: "1 AC Bulb",

            acPower: "100W",

            dc: "1 DC / LED Bulb",

            dcPower: "12W",

            saving: "تقریباً 80–90% کم بجلی",

            note:
                "LED یا DC بلب استعمال کرنے سے بجلی کی کھپت بہت کم ہو سکتی ہے۔",
        },


        {
            key: "refrigerator",

            name: "فریج",

            urdu: "ریفریجریٹر",

            acImage: fridgeAc,

            dcImage: fridgeDc,

            ac: "1 AC Refrigerator",

            acPower: "200–300W",

            dc: "DC / Inverter Refrigerator",

            dcPower: "60–120W",

            saving: "تقریباً 50–70% کم بجلی",

            note:
                "Inverter فریج زیادہ مؤثر طریقے سے کام کرتے ہیں اور بجلی کی کھپت کم کرتے ہیں۔",
        },


        {
            key: "pump",

            name: "واٹر پمپ",

            urdu: "پانی کا پمپ",

            acImage: pumpAc,

            dcImage: pumpDc,

            ac: "1 AC Water Pump",

            acPower: "750–1000W",

            dc: "DC / Solar Pump",

            dcPower: "200–400W",

            saving: "تقریباً 50–70% کم بجلی",

            note:
                "DC یا Solar پمپ بجلی کے استعمال کو نمایاں طور پر کم کر سکتے ہیں۔",
        },


        {
            key: "iron",

            name: "استری",

            urdu: "استری",

            acImage: ironAc,

            dcImage: ironDc,

            ac: "1 AC Iron",

            acPower: "1000–1200W",

            dc: "DC / Efficient Iron",

            dcPower: "300–500W",

            saving: "تقریباً 50–60% کم بجلی",

            note:
                "زیادہ مؤثر استری استعمال کریں اور غیر ضروری طور پر زیادہ دیر تک استعمال نہ کریں۔",
        },

    ];


    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {

        navigate(
            "/comparison-ac-dc",
            {
                state: {
                    billData,
                },
            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Number Format
    |--------------------------------------------------------------------------
    */

    const formatUnits = (value) =>
        Number(value || 0).toLocaleString("en-US");


    return (

        <section className="acdc-savings-page">


            {/* =========================================================
                Back
            ========================================================== */}

            <button
                type="button"
                className="acdc-savings-back"
                onClick={handleBack}
            >

                <RiArrowLeftLine />

                ڈیش بورڈ پر واپس جائیں

            </button>


            {/* =========================================================
                Page Heading
            ========================================================== */}

            <div className="acdc-savings-title-row">

                <div className="acdc-savings-title-icon">

                    <RiBarChartBoxLine />

                </div>


                <h1>

                    Comparison: AC vs DC

                    <span>
                        عام گھریلو آلات کا موازنہ
                    </span>

                </h1>


                <p>

                    مختلف گھریلو آلات کا موازنہ کریں اور دیکھیں
                    کہ DC متبادل آپ کے بجلی کے بل میں کس طرح
                    کمی لا سکتے ہیں۔ یہ تجزیہ آپ کے اپ لوڈ کیے
                    گئے بل اور عام استعمال کے انداز پر مبنی ہے۔

                </p>

            </div>


            {/* =========================================================
                Summary Cards
            ========================================================== */}

            <div className="acdc-summary-grid">


                {/* Bill Consumption */}

                <article className="acdc-summary-card acdc-blue">

                    <div className="acdc-summary-icon">

                        <RiBarChartBoxLine />

                    </div>


                    <div>

                        <h3>
                            آپ کے بل کا بجلی استعمال
                        </h3>

                        <span>
                            ماہانہ استعمال شدہ یونٹس
                        </span>

                        <strong>
                            {formatUnits(unitsConsumed)}
                        </strong>

                        <b>
                            Units
                        </b>

                        <small>
                            آپ کے اپ لوڈ کیے گئے بل کے مطابق
                        </small>

                    </div>

                </article>


                {/* Savings */}

                <article className="acdc-summary-card acdc-green">

                    <div className="acdc-summary-icon">

                        <RiPlantLine />

                    </div>


                    <div>

                        <h3>
                            ممکنہ بجلی کی بچت
                        </h3>

                        <span>
                            اندازاً ممکنہ بچت
                        </span>

                        <strong>
                            40% - 70%
                        </strong>

                        <small>
                            مؤثر DC آلات اور بہتر استعمال کی عادات
                            اپنانے سے بجلی کی کھپت کم کی جا سکتی ہے۔
                        </small>

                    </div>

                </article>


                {/* Key Insight */}

                <article className="acdc-summary-card acdc-yellow">

                    <div className="acdc-summary-icon">

                        <RiLightbulbLine />

                    </div>


                    <div>

                        <h3>
                            اہم بات
                        </h3>

                        <span>
                            بجلی کی بچت کا اہم نکتہ
                        </span>

                        <p>

                            کچھ گھریلو آلات دوسرے آلات کے مقابلے
                            میں بہت زیادہ بجلی استعمال کرتے ہیں۔
                            زیادہ مؤثر آلات استعمال کرنے سے آپ کے
                            بجلی کے بل میں نمایاں کمی آ سکتی ہے۔

                        </p>

                    </div>

                </article>

            </div>


            {/* =========================================================
                Appliance Comparison
            ========================================================== */}

            <section className="acdc-appliance-section">


                <div className="acdc-section-header">

                    <h2>

                        گھریلو آلات کا موازنہ

                        <span>
                            AC اور DC آلات
                        </span>

                    </h2>


                    <div className="acdc-view-toggle">

                        <span>
                            دیکھیں:
                        </span>


                        <button
                            className={
                                viewMode === "table"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setViewMode("table")
                            }
                        >
                            ٹیبل
                        </button>


                        <button
                            className={
                                viewMode === "card"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setViewMode("card")
                            }
                        >
                            کارڈ
                        </button>

                    </div>

                </div>


                {/* =====================================================
                    Card View
                ====================================================== */}

                {viewMode === "card" ? (

                    <div className="acdc-appliance-card-grid">

                        {applianceData.map(
                            (item) => (

                                <article
                                    className="acdc-appliance-card"
                                    key={item.key}
                                >

                                    <header>

                                        <strong>
                                            {item.name}
                                        </strong>

                                        <span>
                                            {item.urdu}
                                        </span>

                                    </header>


                                    <div className="acdc-appliance-comparison">


                                        {/* AC */}

                                        <div className="acdc-appliance-side ac">

                                            <img
                                                src={item.acImage}
                                                alt={item.name}
                                            />


                                            <small>
                                                AC (روایتی)
                                            </small>


                                            <b>
                                                {item.ac}
                                            </b>


                                            <span>
                                                ({item.acPower})
                                            </span>

                                        </div>


                                        {/* DC */}

                                        <div className="acdc-appliance-side dc">

                                            <img
                                                src={item.dcImage}
                                                alt={item.name}
                                            />


                                            <small>
                                                DC (موثر)
                                            </small>


                                            <b>
                                                {item.dc}
                                            </b>


                                            <span>
                                                ({item.dcPower})
                                            </span>

                                        </div>

                                    </div>


                                    {/* Saving */}

                                    <div className="acdc-saving-note">

                                        <RiFlashlightLine />


                                        <div>

                                            <strong>
                                                {item.saving}
                                            </strong>

                                            <p>
                                                {item.note}
                                            </p>

                                        </div>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                ) : (


                    /* =================================================
                       Table View
                    ================================================== */

                    <div className="acdc-table-wrap">

                        <table className="acdc-table">

                            <thead>

                                <tr>

                                    <th>
                                        آلہ
                                        <br />
                                        <span>
                                            گھریلو سامان
                                        </span>
                                    </th>


                                    <th>
                                        AC
                                        <br />
                                        <span>
                                            روایتی
                                        </span>
                                    </th>


                                    <th>
                                        DC
                                        <br />
                                        <span>
                                            مؤثر متبادل
                                        </span>
                                    </th>


                                    <th>
                                        موازنہ / فائدہ
                                        <br />
                                        <span>
                                            بجلی کی بچت
                                        </span>
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {applianceData.map(
                                    (item) => (

                                        <tr
                                            key={item.key}
                                        >

                                            {/* Appliance */}

                                            <td>

                                                <strong>
                                                    {item.name}
                                                </strong>

                                                <span>
                                                    {item.urdu}
                                                </span>

                                            </td>


                                            {/* AC */}

                                            <td>

                                                <div className="acdc-table-device">

                                                    <img
                                                        src={item.acImage}
                                                        alt=""
                                                    />

                                                    <span>

                                                        {item.ac}

                                                        <br />

                                                        {item.acPower}

                                                    </span>

                                                </div>

                                            </td>


                                            {/* DC */}

                                            <td>

                                                <div className="acdc-table-device">

                                                    <img
                                                        src={item.dcImage}
                                                        alt=""
                                                    />

                                                    <span>

                                                        {item.dc}

                                                        <br />

                                                        {item.dcPower}

                                                    </span>

                                                </div>

                                            </td>


                                            {/* Benefit */}

                                            <td>

                                                <div className="acdc-table-benefit">

                                                    <RiFlashlightLine />

                                                    <div>

                                                        <strong>
                                                            {item.saving}
                                                        </strong>

                                                        <p>
                                                            {item.note}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* =========================================================
                Information Cards
            ========================================================== */}

            <div className="acdc-info-grid">


                {/* Peak Hours */}

                <article className="acdc-info-card peak">

                    <h2>

                        🕘 زیادہ لوڈ کے اوقات

                        <span>
                            Peak Hours
                        </span>

                    </h2>


                    <strong>

                        ☀️ 5:00 PM -

                        <br />

                        11:00 PM

                    </strong>


                    <p>

                        اس وقت بجلی کا لوڈ اور نرخ عام طور پر
                        زیادہ ہوتے ہیں۔ جہاں ممکن ہو، اس دوران
                        زیادہ بجلی استعمال کرنے والے آلات کے
                        استعمال سے گریز کریں۔

                    </p>

                </article>


                {/* Best Opportunities */}

                <article className="acdc-info-card opportunities">

                    <h2>

                        📈 زیادہ بچت کے مواقع

                        <span>
                            Best Opportunities
                        </span>

                    </h2>


                    <div>

                        <b className="high">
                            ⚡ زیادہ اثر
                        </b>

                        <span>
                            واٹر پمپ، فریج، استری
                        </span>

                    </div>


                    <div>

                        <b className="medium">
                            ⚙ درمیانہ اثر
                        </b>

                        <span>
                            پنکھے
                        </span>

                    </div>


                    <div>

                        <b className="easy">
                            💡 آسان بچت
                        </b>

                        <span>
                            LED / DC لائٹس
                        </span>

                    </div>

                </article>


                {/* Quick Tips */}

                <article className="acdc-info-card tips">

                    <h2>

                        ⚙️ اہم مشورے

                        <span>
                            Quick Tips
                        </span>

                    </h2>


                    {[
                        "جہاں ممکن ہو DC اور مؤثر آلات استعمال کریں۔",

                        "پرانے آلات کو توانائی بچانے والے مؤثر آلات سے تبدیل کریں۔",

                        "زیادہ لوڈ کے اوقات میں غیر ضروری بھاری آلات استعمال نہ کریں۔",

                        "زیادہ واٹ والے بلب کے بجائے LED لائٹس استعمال کریں۔",

                        "دن کے وقت زیادہ بجلی والے کاموں کے لیے سولر توانائی استعمال کریں۔",
                    ].map(
                        (tip) => (

                            <p key={tip}>

                                <RiCheckLine />

                                {tip}

                            </p>

                        )
                    )}

                </article>

            </div>


            {/* =========================================================
                Estimated Savings
            ========================================================== */}

            <section className="acdc-estimate-section">


                <div className="acdc-section-header">

                    <h2>

                        ⚖ ممکنہ بچت کا اندازہ

                        <span>
                            مثال کے طور پر ممکنہ بچت
                        </span>

                    </h2>


                    <select defaultValue="example">

                        <option value="example">
                            گھریلو استعمال کی مثال
                        </option>

                    </select>

                </div>


                <p className="acdc-estimate-description">

                    یہ ایک اندازاً حساب ہے جو عام بجلی کے استعمال
                    کی بنیاد پر تیار کیا گیا ہے۔ اصل بچت آپ کے
                    استعمال ہونے والے آلات، استعمال کے اوقات اور
                    سولر سسٹم کے مطابق مختلف ہو سکتی ہے۔

                    {billAmount > 0 && (

                        <>
                            {" "}
                            موجودہ بل کی رقم: Rs.{" "}
                            {billAmount.toLocaleString("en-US")}.
                        </>

                    )}

                </p>


                <div className="acdc-estimate-grid">


                    {/* Current Consumption */}

                    <div className="estimate-box blue">

                        <h3>
                            موجودہ ماہانہ بجلی کا استعمال
                        </h3>

                        <span>
                            (اندازاً)
                        </span>


                        <strong>
                            {formatUnits(unitsConsumed)} Units
                        </strong>

                    </div>


                    {/* After Efficient Alternatives */}

                    <div className="estimate-box green">

                        <h3>
                            مؤثر آلات استعمال کرنے کے بعد
                        </h3>

                        <span>
                            (اندازاً)
                        </span>


                        <strong>

                            {formatUnits(
                                estimatedRange.low
                            )}

                            {" - "}

                            {formatUnits(
                                estimatedRange.high
                            )}

                            <br />

                            Units

                        </strong>


                        <b>
                            40% - 70% ممکنہ بچت
                        </b>

                    </div>


                    {/* Benefits */}

                    <div className="estimate-box yellow">

                        <h3>
                            ⭐ فوائد
                        </h3>


                        {[
                            "ماہانہ بجلی کے بل میں کمی۔",

                            "بجلی کا زیادہ مؤثر استعمال۔",

                            "سولر سسٹم کے ساتھ بہتر مطابقت۔",

                            "لوڈ شیڈنگ کے دوران زیادہ بیک اپ۔",

                            "ماحول کے لیے بہتر۔",
                        ].map(
                            (benefit) => (

                                <p key={benefit}>

                                    <RiCheckLine />

                                    {benefit}

                                </p>

                            )
                        )}

                    </div>

                </div>

            </section>

        </section>

    );

}


export default SavingsAnalysis;