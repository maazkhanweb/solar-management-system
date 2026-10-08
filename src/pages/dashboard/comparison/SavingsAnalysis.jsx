import { useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";



import {

    RiArrowLeftLine,

    RiBarChartBoxLine,

    RiCheckLine,

    RiFlashlightLine,

    RiLightbulbLine,

    RiPlantLine,

    RiAlarmWarningLine,

    RiGlobeLine,

    RiHomeLine,

    RiSubtractLine,

    RiCheckboxCircleLine,

} from "react-icons/ri";



import "./SavingsAnalysis.css";

import comparisonBillService from "../../../services/comparisonBillService";



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





    /*

    |--------------------------------------------------------------------------

    | State

    |--------------------------------------------------------------------------

    */



    const [viewMode, setViewMode] =

        useState("card");



    const [language, setLanguage] =

        useState("ur");



    const isEnglish =

        language === "en";





    /*

    |--------------------------------------------------------------------------

    | Home Analysis

    |--------------------------------------------------------------------------

    */



        /*
    |--------------------------------------------------------------------------
    | Home Analysis
    |--------------------------------------------------------------------------
    */

    const comparisonBill =
        location.state?.comparisonBill || null;

    const comparisonBillId =
        location.state?.comparisonBillId ||
        comparisonBill?.id ||
        null;

    const defaultHomeForm = {
        selected: {
            fan: false,
            bulb: false,
            fridge: false,
            ac: false,
            pump: false,
            iron: false,
            washing: false,
            geyser: false,
            other: false,
        },
        fan: { total: "", ac: "", dc: "", watts: "" },
        bulb: { total: "", ac: "", dc: "", watts: "" },
        fridge: { total: "", ac: "", dc: "", watts: "" },
        ac: { total: "", ac: "", dc: "", watts: "" },
        pump: { total: "", ac: "", dc: "", watts: "" },
        iron: { total: "", ac: "", dc: "", watts: "" },
        washing: { total: "", ac: "", dc: "", watts: "" },
        geyser: { total: "", ac: "", dc: "", watts: "" },
        other: {
            total: "",
            ac: "",
            dc: "",
            watts: "",
            name: "",
        },
    };

    const homeApplianceDefaults = {
        fan: { ac: 80, dc: 25 },
        bulb: { ac: 100, dc: 12 },
        fridge: { ac: 250, dc: 90 },
        ac: { ac: 1500, dc: 600 },
        pump: { ac: 875, dc: 300 },
        iron: { ac: 1100, dc: 400 },
        washing: { ac: 500, dc: 250 },
        geyser: { ac: 2000, dc: 800 },
        other: { ac: 1000, dc: 500 },
    };

    const homeFieldLabels = {
        fan: isEnglish ? "Fans" : "پنکھے",
        bulb: isEnglish ? "Bulbs / Lights" : "بلب / لائٹس",
        fridge: isEnglish ? "Refrigerator" : "فریج",
        ac: isEnglish ? "Air Conditioner" : "ایئر کنڈیشنر",
        pump: isEnglish ? "Water Pump" : "واٹر پمپ",
        iron: isEnglish ? "Iron" : "استری",
        washing: isEnglish ? "Washing Machine" : "واشنگ مشین",
        geyser: isEnglish ? "Geyser" : "گیزر",
        other: isEnglish ? "Other High-Consumption Appliance" : "دیگر زیادہ بجلی استعمال کرنے والا آلہ",
    };

    const homeText = {
        button: isEnglish ? "Home Analysis" : "گھر کا تجزیہ",
        title: isEnglish ? "Home Electricity Analysis" : "گھر کی بجلی کا تجزیہ",
        subtitle: isEnglish
            ? "Select the appliances you have, enter their quantities and optional wattage, then compare the current load with efficient DC alternatives."
            : "اپنے گھر میں موجود آلات منتخب کریں، ان کی تعداد اور اختیاری واٹ درج کریں، پھر موجودہ لوڈ کا مؤثر DC متبادل سے موازنہ کریں۔",
        selectAppliances: isEnglish ? "Select Appliances" : "آلات منتخب کریں",
        selectHint: isEnglish ? "Only selected appliance forms will appear below." : "صرف منتخب کیے گئے آلات کا فارم نیچے ظاہر ہوگا۔",
        total: isEnglish ? "Total Quantity" : "کل تعداد",
        totalAc: isEnglish ? "Total AC" : "کل AC",
        currentAc: isEnglish ? "AC Quantity" : "AC تعداد",
        dc: isEnglish ? "DC Quantity" : "DC تعداد",
        watts: isEnglish ? "Current Watts (optional)" : "موجودہ واٹ (اختیاری)",
        dcWatts: isEnglish ? "DC Watts (optional)" : "DC واٹ (اختیاری)",
        wattsHint: isEnglish ? "Leave empty to use the approximate default." : "خالی چھوڑنے پر تقریباً ڈیفالٹ واٹ استعمال ہوں گے۔",
        analyze: isEnglish ? "Analyze My Home" : "میرے گھر کا تجزیہ کریں",
        reset: isEnglish ? "Reset" : "ری سیٹ",
        results: isEnglish ? "Your Home Analysis" : "آپ کے گھر کا تجزیہ",
        currentPower: isEnglish ? "Current estimated load" : "موجودہ اندازاً لوڈ",
        efficientPower: isEnglish ? "Efficient DC alternative" : "مؤثر DC متبادل",
        saving: isEnglish ? "Potential saving" : "ممکنہ بچت",
        resultNote: isEnglish
            ? "This is an estimate based on the information you entered. Actual savings depend on usage hours, appliance efficiency and operating conditions."
            : "یہ آپ کی درج کردہ معلومات کی بنیاد پر ایک اندازہ ہے۔ اصل بچت استعمال کے اوقات، آلات کی کارکردگی اور استعمال کے حالات کے مطابق مختلف ہو سکتی ہے۔",
        overall: isEnglish ? "Estimated Overall Potential" : "مجموعی ممکنہ بچت کا اندازہ",
        saveState: isEnglish ? "Save Analysis to Bill" : "تجزیہ بل کے ساتھ محفوظ کریں",
        saved: isEnglish ? "Home analysis saved with this bill." : "گھر کا تجزیہ اسی بل کے ساتھ محفوظ ہوگیا ہے۔",
        noBill: isEnglish ? "This analysis is not linked to a saved bill. Upload a bill first if you want the result stored with a bill record." : "یہ تجزیہ کسی محفوظ بل کے ساتھ منسلک نہیں ہے۔ اگر نتیجہ بل کے ریکارڈ کے ساتھ محفوظ کرنا ہے تو پہلے بل اپ لوڈ کریں۔",
        noData: isEnglish
            ? "Please select at least one appliance and enter its quantity."
            : "براہ کرم کم از کم ایک آلہ منتخب کریں اور اس کی تعداد درج کریں۔",
        otherName: isEnglish ? "Appliance Name" : "آلے کا نام",
    };

    const [homeAnalysisOpen, setHomeAnalysisOpen] = useState(
        Boolean(location.state?.comparisonBill || location.state?.comparisonBillId) || true
    );

    const [homeAnalysisSubmitted, setHomeAnalysisSubmitted] = useState(false);
    const [homeSaving, setHomeSaving] = useState(false);
    const [homeSaveMessage, setHomeSaveMessage] = useState("");

    const normalizeSavedHomeForm = (saved) => {
        if (typeof saved === "string") {
            try {
                saved = JSON.parse(saved);
            } catch {
                return defaultHomeForm;
            }
        }

        if (!saved || typeof saved !== "object") return defaultHomeForm;

        const next = JSON.parse(JSON.stringify(defaultHomeForm));
        if (saved.selected) next.selected = { ...next.selected, ...saved.selected };

        Object.keys(next).forEach((key) => {
            if (key === "selected") return;
            if (saved[key] && typeof saved[key] === "object") {
                next[key] = { ...next[key], ...saved[key] };
            }
        });

        return next;
    };

    const savedHomeData = comparisonBill?.home_analysis_data;
    const savedHomeResult = comparisonBill?.home_analysis_result;

    const [homeForm, setHomeForm] = useState(() =>
        normalizeSavedHomeForm(savedHomeData)
    );

    const [homeResults, setHomeResults] = useState(() => {
        if (Array.isArray(savedHomeResult)) return savedHomeResult;
        if (typeof savedHomeResult === "string") {
            try {
                const parsed = JSON.parse(savedHomeResult);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return [];
    });

    const updateHomeSelection = (key, checked) => {
        setHomeForm((previous) => ({
            ...previous,
            selected: {
                ...previous.selected,
                [key]: checked,
            },
        }));
        setHomeAnalysisSubmitted(false);
        setHomeSaveMessage("");
    };

    const updateHomeField = (key, field, value) => {
        setHomeForm((previous) => ({
            ...previous,
            [key]: {
                ...previous[key],
                [field]: value,
            },
        }));
        setHomeAnalysisSubmitted(false);
        setHomeSaveMessage("");
    };

    const applianceDefinitions = [
        { key: "fan" },
        { key: "bulb" },
        { key: "fridge" },
        { key: "ac" },
        { key: "pump" },
        { key: "iron" },
        { key: "washing" },
        { key: "geyser" },
        { key: "other" },
    ];

    const calculateHomeAnalysis = async () => {
        const selectedKeys = applianceDefinitions
            .map((item) => item.key)
            .filter((key) => homeForm.selected[key]);

        if (!selectedKeys.length) {
            setHomeResults([]);
            setHomeAnalysisSubmitted(true);
            setHomeSaveMessage(homeText.noData);
            return;
        }

        const results = selectedKeys.map((key) => {
            const form = homeForm[key];
            const defaults = homeApplianceDefaults[key];

            const total = Math.max(0, getNumber(form.total));
            const explicitAc = Math.max(0, getNumber(form.ac));
            const explicitDc = Math.max(0, getNumber(form.dc));

            const normalizedTotal = Math.max(total, explicitAc + explicitDc);
            const dcCount = Math.min(explicitDc, normalizedTotal);
            const acCount = Math.min(
                explicitAc || Math.max(0, normalizedTotal - dcCount),
                normalizedTotal - dcCount
            );

            const currentWatts = getNumber(form.watts) || defaults.ac;
            const efficientDcWatts = getNumber(form.dcWatts) || defaults.dc;

            const currentPower =
                (acCount * currentWatts) +
                (dcCount * efficientDcWatts);

            const efficientPower =
                normalizedTotal * efficientDcWatts;

            const savingWatts = Math.max(
                0,
                currentPower - efficientPower
            );

            const savingPercent = currentPower > 0
                ? Math.max(
                    0,
                    Math.min(
                        100,
                        Math.round((savingWatts / currentPower) * 100)
                    )
                )
                : 0;

            return {
                key,
                name: key === "other"
                    ? (form.name || homeFieldLabels.other)
                    : homeFieldLabels[key],
                total: normalizedTotal,
                acCount,
                dcCount,
                currentWatts,
                efficientDcWatts,
                currentPower: Math.round(currentPower),
                efficientPower: Math.round(efficientPower),
                savingWatts: Math.round(savingWatts),
                savingPercent,
            };
        }).filter((item) => item.total > 0);

        setHomeResults(results);
        setHomeAnalysisSubmitted(true);
        setHomeSaveMessage("");

        if (comparisonBillId && results.length) {
            try {
                setHomeSaving(true);

                await comparisonBillService.updateBill(
                    comparisonBillId,
                    {
                        home_analysis_data: homeForm,
                        home_analysis_result: results,
                    }
                );

                setHomeSaveMessage(homeText.saved);
            } catch (error) {
                console.error("Home analysis save error:", error);
                setHomeSaveMessage(
                    error?.response?.data?.message ||
                    (isEnglish
                        ? "Analysis calculated, but it could not be saved to the bill."
                        : "تجزیہ ہوگیا لیکن اسے بل کے ساتھ محفوظ نہیں کیا جا سکا۔")
                );
            } finally {
                setHomeSaving(false);
            }
        } else if (results.length) {
            setHomeSaveMessage(homeText.noBill);
        }
    };

    const homeOverallSaving = useMemo(() => {
        if (!homeResults.length) return 0;

        const current = homeResults.reduce(
            (sum, item) => sum + getNumber(item.currentPower),
            0
        );
        const efficient = homeResults.reduce(
            (sum, item) => sum + getNumber(item.efficientPower),
            0
        );

        if (!current) return 0;

        return Math.max(
            0,
            Math.min(
                100,
                Math.round(((current - efficient) / current) * 100)
            )
        );
    }, [homeResults]);

    const resetHomeAnalysis = () => {
        setHomeForm(defaultHomeForm);
        setHomeResults([]);
        setHomeAnalysisSubmitted(false);
        setHomeSaveMessage("");
    };


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

    | Translation

    |--------------------------------------------------------------------------

    */



    const t = {



        back:

            isEnglish

                ? "Back to Dashboard"

                : "ڈیش بورڈ پر واپس جائیں",



        homeAnalysis:

            isEnglish

                ? "Home Analysis"

                : "گھر کا تجزیہ",



        title:

            isEnglish

                ? "Comparison: AC vs DC"

                : "Comparison: AC vs DC",



        titleUrdu:

            isEnglish

                ? "Household Appliance Comparison"

                : "عام گھریلو آلات کا موازنہ",



        description:

            isEnglish

                ? "Compare common household appliances and see how efficient DC alternatives can help reduce electricity consumption. This analysis is based on your uploaded bill and general usage patterns."

                : "مختلف گھریلو آلات کا موازنہ کریں اور دیکھیں کہ DC متبادل آپ کے بجلی کے استعمال میں کس طرح کمی لا سکتے ہیں۔ یہ تجزیہ آپ کے اپ لوڈ کیے گئے بل اور عام استعمال کے انداز پر مبنی ہے۔",



        billConsumption:

            isEnglish

                ? "Your Electricity Consumption"

                : "آپ کے بل کا بجلی استعمال",



        monthlyUnits:

            isEnglish

                ? "Monthly consumed units"

                : "ماہانہ استعمال شدہ یونٹس",



        accordingBill:

            isEnglish

                ? "According to your uploaded bill"

                : "آپ کے اپ لوڈ کیے گئے بل کے مطابق",



        units:

            "Units",



        potentialSavings:

            isEnglish

                ? "Potential Electricity Savings"

                : "ممکنہ بجلی کی بچت",



        estimatedSavings:

            isEnglish

                ? "Estimated potential savings"

                : "اندازاً ممکنہ بچت",



        savingsDescription:

            isEnglish

                ? "Using efficient DC appliances and better usage habits can reduce electricity consumption."

                : "مؤثر DC آلات اور بہتر استعمال کی عادات اپنانے سے بجلی کی کھپت کم کی جا سکتی ہے۔",



        important:

            isEnglish

                ? "Key Insight"

                : "اہم بات",



        importantSubtitle:

            isEnglish

                ? "Important electricity-saving point"

                : "بجلی کی بچت کا اہم نکتہ",



        importantDescription:

            isEnglish

                ? "Some household appliances consume much more electricity than others. Using efficient appliances can significantly reduce your electricity bill."

                : "کچھ گھریلو آلات دوسرے آلات کے مقابلے میں بہت زیادہ بجلی استعمال کرتے ہیں۔ زیادہ مؤثر آلات استعمال کرنے سے آپ کے بجلی کے بل میں نمایاں کمی آ سکتی ہے۔",



        peakHours:

            isEnglish

                ? "Peak Hours"

                : "زیادہ لوڈ کے اوقات",



        peakDescription:

            isEnglish

                ? "Electricity demand and rates may be higher during these hours. Where possible, avoid using high-consumption appliances during this period."

                : "اس وقت بجلی کا لوڈ اور نرخ عام طور پر زیادہ ہو سکتے ہیں۔ جہاں ممکن ہو، اس دوران زیادہ بجلی استعمال کرنے والے آلات کے استعمال سے گریز کریں۔",



        bestOpportunities:

            isEnglish

                ? "Best Opportunities"

                : "زیادہ بچت کے مواقع",



        highImpact:

            isEnglish

                ? "High Impact"

                : "زیادہ اثر",



        highImpactItems:

            isEnglish

                ? "Water pump, refrigerator, iron"

                : "واٹر پمپ، فریج، استری",



        mediumImpact:

            isEnglish

                ? "Medium Impact"

                : "درمیانہ اثر",



        mediumImpactItems:

            isEnglish

                ? "Fans"

                : "پنکھے",



        easySaving:

            isEnglish

                ? "Easy Saving"

                : "آسان بچت",



        easySavingItems:

            isEnglish

                ? "LED / DC lights"

                : "LED / DC لائٹس",



        quickTips:

            isEnglish

                ? "Quick Tips"

                : "اہم مشورے",



        tips: isEnglish

            ? [

                "Use DC and energy-efficient appliances where possible.",

                "Replace old appliances with efficient energy-saving alternatives.",

                "Avoid unnecessary heavy appliance usage during peak hours.",

                "Use LED lights instead of high-wattage bulbs.",

                "Use solar energy for high-consumption activities during the day.",

            ]

            : [

                "جہاں ممکن ہو DC اور مؤثر آلات استعمال کریں۔",

                "پرانے آلات کو توانائی بچانے والے مؤثر آلات سے تبدیل کریں۔",

                "زیادہ لوڈ کے اوقات میں غیر ضروری بھاری آلات استعمال نہ کریں۔",

                "زیادہ واٹ والے بلب کے بجائے LED لائٹس استعمال کریں۔",

                "دن کے وقت زیادہ بجلی والے کاموں کے لیے سولر توانائی استعمال کریں۔",

            ],



        applianceComparison:

            isEnglish

                ? "Household Appliance Comparison"

                : "گھریلو آلات کا موازنہ",



        acDcAppliances:

            isEnglish

                ? "AC and DC Appliances"

                : "AC اور DC آلات",



        view:

            isEnglish

                ? "View:"

                : "دیکھیں:",



        table:

            isEnglish

                ? "Table"

                : "ٹیبل",



        card:

            isEnglish

                ? "Cards"

                : "کارڈ",



        appliance:

            isEnglish

                ? "Appliance"

                : "آلہ",



        household:

            isEnglish

                ? "Household Equipment"

                : "گھریلو سامان",



        traditional:

            isEnglish

                ? "Traditional"

                : "روایتی",



        efficientAlternative:

            isEnglish

                ? "Efficient Alternative"

                : "مؤثر متبادل",



        comparisonBenefit:

            isEnglish

                ? "Comparison / Benefit"

                : "موازنہ / فائدہ",



        electricitySaving:

            isEnglish

                ? "Electricity Saving"

                : "بجلی کی بچت",



        acTraditional:

            isEnglish

                ? "AC (Traditional)"

                : "AC (روایتی)",



        dcEfficient:

            isEnglish

                ? "DC (Efficient)"

                : "DC (مؤثر)",



        estimatedSavingsTitle:

            isEnglish

                ? "Estimated Savings"

                : "ممکنہ بچت کا اندازہ",



        exampleSavings:

            isEnglish

                ? "Example Potential Savings"

                : "مثال کے طور پر ممکنہ بچت",



        estimateDescription:

            isEnglish

                ? "This is an estimated calculation based on typical electricity usage. Actual savings may vary depending on your appliances, usage hours and solar system."

                : "یہ ایک اندازاً حساب ہے جو عام بجلی کے استعمال کی بنیاد پر تیار کیا گیا ہے۔ اصل بچت آپ کے استعمال ہونے والے آلات، استعمال کے اوقات اور سولر سسٹم کے مطابق مختلف ہو سکتی ہے۔",



        currentMonthly:

            isEnglish

                ? "Current Monthly Electricity Usage"

                : "موجودہ ماہانہ بجلی کا استعمال",



        estimated:

            isEnglish

                ? "(Estimated)"

                : "(اندازاً)",



        afterEfficient:

            isEnglish

                ? "After Using Efficient Appliances"

                : "مؤثر آلات استعمال کرنے کے بعد",



        possibleSavings:

            isEnglish

                ? "40% - 70% Potential Savings"

                : "40% - 70% ممکنہ بچت",



        benefits:

            isEnglish

                ? "Benefits"

                : "فوائد",



        benefitsList: isEnglish

            ? [

                "Lower monthly electricity bill.",

                "More efficient electricity usage.",

                "Better compatibility with solar systems.",

                "More backup during load shedding.",

                "Better for the environment.",

            ]

            : [

                "ماہانہ بجلی کے بل میں کمی۔",

                "بجلی کا زیادہ مؤثر استعمال۔",

                "سولر سسٹم کے ساتھ بہتر مطابقت۔",

                "لوڈ شیڈنگ کے دوران زیادہ بیک اپ۔",

                "ماحول کے لیے بہتر۔",

            ],



        currentBill:

            isEnglish

                ? "Current bill amount"

                : "موجودہ بل کی رقم",



        peakAlert:

            isEnglish

                ? "HIGH CONSUMPTION ALERT"

                : "زیادہ بجلی کے استعمال کا الرٹ",



    };





    /*

    |--------------------------------------------------------------------------

    | Appliance Data

    |--------------------------------------------------------------------------

    */



    const applianceData = [



        {

            key: "fan",



            nameUrdu: "پنکھا",

            nameEnglish: "Fan",



            acImage: fanAc,

            dcImage: fanDc,



            ac: "1 AC Fan",

            acPower: "80W",



            dc: "3 DC Fans",

            dcPower: "25W each",



            savingUrdu: "تقریباً 69% کم بجلی",

            savingEnglish: "Approximately 69% less electricity",



            noteUrdu:

                "DC پنکھے بجلی کے استعمال میں نمایاں کمی کر سکتے ہیں۔",



            noteEnglish:

                "DC fans can significantly reduce electricity consumption.",

        },





        {

            key: "lighting",



            nameUrdu: "لائٹنگ",

            nameEnglish: "Lighting",



            acImage: bulbAc,

            dcImage: bulbDc,



            ac: "1 AC Bulb",

            acPower: "100W",



            dc: "1 DC / LED Bulb",

            dcPower: "12W",



            savingUrdu: "تقریباً 80–90% کم بجلی",

            savingEnglish: "Approximately 80–90% less electricity",



            noteUrdu:

                "LED یا DC بلب استعمال کرنے سے بجلی کی کھپت بہت کم ہو سکتی ہے۔",



            noteEnglish:

                "LED or DC bulbs can significantly reduce electricity consumption.",

        },





        {

            key: "refrigerator",



            nameUrdu: "فریج",

            nameEnglish: "Refrigerator",



            acImage: fridgeAc,

            dcImage: fridgeDc,



            ac: "1 AC Refrigerator",

            acPower: "200–300W",



            dc: "DC / Inverter Refrigerator",

            dcPower: "60–120W",



            savingUrdu: "تقریباً 50–70% کم بجلی",

            savingEnglish: "Approximately 50–70% less electricity",



            noteUrdu:

                "Inverter فریج زیادہ مؤثر طریقے سے کام کرتے ہیں اور بجلی کی کھپت کم کرتے ہیں۔",



            noteEnglish:

                "Inverter refrigerators operate more efficiently and can reduce electricity consumption.",

        },





        {

            key: "pump",



            nameUrdu: "واٹر پمپ",

            nameEnglish: "Water Pump",



            acImage: pumpAc,

            dcImage: pumpDc,



            ac: "1 AC Water Pump",

            acPower: "750–1000W",



            dc: "DC / Solar Pump",

            dcPower: "200–400W",



            savingUrdu: "تقریباً 50–70% کم بجلی",

            savingEnglish: "Approximately 50–70% less electricity",



            noteUrdu:

                "DC یا Solar پمپ بجلی کے استعمال کو نمایاں طور پر کم کر سکتے ہیں۔",



            noteEnglish:

                "DC or solar pumps can significantly reduce electricity consumption.",

        },





        {

            key: "iron",



            nameUrdu: "استری",

            nameEnglish: "Iron",



            acImage: ironAc,

            dcImage: ironDc,



            ac: "1 AC Iron",

            acPower: "1000–1200W",



            dc: "DC / Efficient Iron",

            dcPower: "300–500W",



            savingUrdu: "تقریباً 50–60% کم بجلی",

            savingEnglish: "Approximately 50–60% less electricity",



            noteUrdu:

                "زیادہ مؤثر استری استعمال کریں اور غیر ضروری طور پر زیادہ دیر تک استعمال نہ کریں۔",



            noteEnglish:

                "Use an efficient iron and avoid unnecessary prolonged usage.",

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





    /*

    |--------------------------------------------------------------------------

    | Current Language Helpers

    |--------------------------------------------------------------------------

    */



    const getApplianceName = (item) =>

        isEnglish

            ? item.nameEnglish

            : item.nameUrdu;





    const getSaving = (item) =>

        isEnglish

            ? item.savingEnglish

            : item.savingUrdu;





    const getNote = (item) =>

        isEnglish

            ? item.noteEnglish

            : item.noteUrdu;





    /*

    |--------------------------------------------------------------------------

    | Render

    |--------------------------------------------------------------------------

    */



    return (



        <section

            className={`acdc-savings-page ${

                isEnglish

                    ? "language-en"

                    : "language-ur"

            }`}

            dir={isEnglish ? "ltr" : "rtl"}

        >



            {/* =========================================================

                Top Bar

            ========================================================== */}



            <div className="acdc-top-bar">



                <button

                    type="button"

                    className="acdc-savings-back"

                    onClick={handleBack}

                >



                    <RiArrowLeftLine />



                    <span>

                        {t.back}

                    </span>



                </button>





                <button

                    type="button"

                    className="acdc-home-analysis-button"

                    onClick={() => setHomeAnalysisOpen((previous) => !previous)}

                >

                    <RiHomeLine />

                    <span>{t.homeAnalysis}</span>

                </button>





                <div className="acdc-language-switch">



                    <RiGlobeLine />



                    <button

                        type="button"

                        className={

                            isEnglish

                                ? "active"

                                : ""

                        }

                        onClick={() =>

                            setLanguage("en")

                        }

                    >

                        English

                    </button>



                    <span>|</span>



                    <button

                        type="button"

                        className={

                            !isEnglish

                                ? "active"

                                : ""

                        }

                        onClick={() =>

                            setLanguage("ur")

                        }

                    >

                        اردو

                    </button>



                </div>



            </div>





            {/* =========================================================

                Page Heading

            ========================================================== */}



            <div className="acdc-savings-title-row">



                <div className="acdc-savings-title-icon">



                    <RiBarChartBoxLine />



                </div>





                <h1>



                    {t.title}



                    <span>

                        {t.titleUrdu}

                    </span>



                </h1>





                <p>

                    {t.description}

                </p>



            </div>





                        {/* =========================================================
                HOME ANALYSIS
            ========================================================== */}

            {homeAnalysisOpen && (
                <section className="acdc-home-analysis-card">

                    <div className="acdc-home-analysis-header">
                        <div>
                            <div className="acdc-home-analysis-icon">
                                <RiHomeLine />
                            </div>

                            <h2>{homeText.title}</h2>
                            <p>{homeText.subtitle}</p>
                        </div>
                    </div>

                    <div className="acdc-home-analysis-section-title">
                        <div>
                            <h3>{homeText.selectAppliances}</h3>
                            <p>{homeText.selectHint}</p>
                        </div>
                    </div>

                    <div className="acdc-home-check-grid appliance-selector-grid">
                        {applianceDefinitions.map((item) => (
                            <label
                                className={`acdc-home-check-item ${
                                    homeForm.selected[item.key] ? "selected" : ""
                                }`}
                                key={item.key}
                            >
                                <input
                                    type="checkbox"
                                    checked={Boolean(homeForm.selected[item.key])}
                                    onChange={(event) =>
                                        updateHomeSelection(
                                            item.key,
                                            event.target.checked
                                        )
                                    }
                                />
                                <span>{homeFieldLabels[item.key]}</span>
                            </label>
                        ))}
                    </div>

                    {applianceDefinitions
                        .filter((item) => homeForm.selected[item.key])
                        .map((item) => {
                            const form = homeForm[item.key];
                            const isAC = item.key === "ac";

                            return (
                                <article
                                    className="acdc-home-appliance-form-card"
                                    key={item.key}
                                >
                                    <div className="acdc-home-appliance-form-title">
                                        <h4>{homeFieldLabels[item.key]}</h4>
                                        {item.key === "other" && (
                                            <input
                                                type="text"
                                                value={form.name}
                                                placeholder={homeText.otherName}
                                                onChange={(event) =>
                                                    updateHomeField(
                                                        item.key,
                                                        "name",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        )}
                                    </div>

                                    <div className="acdc-home-field-grid">
                                        <label>
                                            <span>
                                                {isAC ? homeText.totalAc : homeText.total}
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={form.total}
                                                onChange={(event) =>
                                                    updateHomeField(
                                                        item.key,
                                                        "total",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </label>

                                        <label>
                                            <span>{homeText.currentAc}</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={form.ac}
                                                onChange={(event) =>
                                                    updateHomeField(
                                                        item.key,
                                                        "ac",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </label>

                                        <label>
                                            <span>{homeText.dc}</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={form.dc}
                                                onChange={(event) =>
                                                    updateHomeField(
                                                        item.key,
                                                        "dc",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </label>

                                        <label>
                                            <span>{homeText.watts}</span>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder={String(
                                                    homeApplianceDefaults[item.key].ac
                                                )}
                                                value={form.watts}
                                                onChange={(event) =>
                                                    updateHomeField(
                                                        item.key,
                                                        "watts",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                            <small>{homeText.wattsHint}</small>
                                        </label>

                                        <label>
                                            <span>{homeText.dcWatts}</span>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder={String(
                                                    homeApplianceDefaults[item.key].dc
                                                )}
                                                value={form.dcWatts}
                                                onChange={(event) =>
                                                    updateHomeField(
                                                        item.key,
                                                        "dcWatts",
                                                        event.target.value
                                                    )
                                                }
                                            />
                                            <small>{homeText.wattsHint}</small>
                                        </label>
                                    </div>
                                </article>
                            );
                        })}

                    <div className="acdc-home-analysis-actions">
                        <button
                            type="button"
                            className="acdc-home-reset-button"
                            onClick={resetHomeAnalysis}
                        >
                            <RiSubtractLine />
                            {homeText.reset}
                        </button>

                        <button
                            type="button"
                            className="acdc-home-submit-button"
                            onClick={calculateHomeAnalysis}
                            disabled={homeSaving}
                        >
                            <RiCheckboxCircleLine />
                            {homeSaving ? "Saving..." : homeText.analyze}
                        </button>
                    </div>

                    {homeAnalysisSubmitted && (
                        <div className="acdc-home-results">
                            <div className="acdc-home-results-header">
                                <div>
                                    <h3>{homeText.results}</h3>
                                    <p>{homeText.resultNote}</p>
                                </div>
                                <strong>{homeOverallSaving}%</strong>
                            </div>

                            {homeResults.length > 0 ? (
                                <div className="acdc-home-results-grid">
                                    {homeResults.map((item) => (
                                        <article
                                            className="acdc-home-result-card"
                                            key={item.key}
                                        >
                                            <h4>{item.name}</h4>

                                            <div className="acdc-home-result-row">
                                                <span>{homeText.currentPower}</span>
                                                <strong>{item.currentPower} W</strong>
                                            </div>

                                            <div className="acdc-home-result-row efficient">
                                                <span>{homeText.efficientPower}</span>
                                                <strong>{item.efficientPower} W</strong>
                                            </div>

                                            <div className="acdc-home-result-row">
                                                <span>
                                                    {isEnglish ? "Load reduction" : "لوڈ میں کمی"}
                                                </span>
                                                <strong>{item.savingWatts} W</strong>
                                            </div>

                                            <div className="acdc-home-result-saving">
                                                <RiFlashlightLine />
                                                <strong>
                                                    {item.savingPercent}% {homeText.saving}
                                                </strong>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="acdc-home-no-data">
                                    {homeText.noData}
                                </div>
                            )}

                            {homeResults.length > 0 && (
                                <div className="acdc-home-overall-card">
                                    <span>{homeText.overall}</span>
                                    <strong>{homeOverallSaving}%</strong>
                                    <p>
                                        {isEnglish
                                            ? "This percentage represents estimated appliance-load reduction from the values entered. It is not a guaranteed reduction in the electricity bill."
                                            : "یہ فیصد درج کردہ معلومات کی بنیاد پر آلات کے لوڈ میں متوقع کمی ظاہر کرتا ہے۔ یہ بجلی کے بل میں یقینی کمی کی ضمانت نہیں ہے۔"}
                                    </p>
                                </div>
                            )}

                            {homeSaveMessage && (
                                <div className="acdc-home-save-message">
                                    {homeSaveMessage}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            )}

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

                            {t.billConsumption}

                        </h3>



                        <span>

                            {t.monthlyUnits}

                        </span>



                        <strong>

                            {formatUnits(

                                unitsConsumed

                            )}

                        </strong>



                        <b>

                            {t.units}

                        </b>



                        <small>

                            {t.accordingBill}

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

                            {t.potentialSavings}

                        </h3>



                        <span>

                            {t.estimatedSavings}

                        </span>



                        <strong>

                            40% - 70%

                        </strong>



                        <small>

                            {t.savingsDescription}

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

                            {t.important}

                        </h3>



                        <span>

                            {t.importantSubtitle}

                        </span>



                        <p>

                            {t.importantDescription}

                        </p>



                    </div>



                </article>



            </div>





            {/* =========================================================

                INFO CARDS — MOVED TO TOP

            ========================================================== */}



            <div className="acdc-info-grid">



                {/* Peak Hours */}



                <article className="acdc-info-card peak">



                    <div className="acdc-alert-label">



                        <RiAlarmWarningLine />



                        <span>

                            {t.peakAlert}

                        </span>



                    </div>





                    <h2>



                        🕘 {t.peakHours}



                    </h2>





                    <strong>



                        ☀️ 5:00 PM -



                        <br />



                        11:00 PM



                    </strong>





                    <p>

                        {t.peakDescription}

                    </p>



                </article>





                {/* Best Opportunities */}



                <article className="acdc-info-card opportunities">



                    <h2>

                        📈 {t.bestOpportunities}

                    </h2>





                    <div>



                        <b className="high">

                            ⚡ {t.highImpact}

                        </b>



                        <span>

                            {t.highImpactItems}

                        </span>



                    </div>





                    <div>



                        <b className="medium">

                            ⚙ {t.mediumImpact}

                        </b>



                        <span>

                            {t.mediumImpactItems}

                        </span>



                    </div>





                    <div>



                        <b className="easy">

                            💡 {t.easySaving}

                        </b>



                        <span>

                            {t.easySavingItems}

                        </span>



                    </div>



                </article>





                {/* Quick Tips */}



                <article className="acdc-info-card tips">



                    <h2>

                        ⚙️ {t.quickTips}

                    </h2>





                    {t.tips.map(

                        (tip, index) => (



                            <p key={index}>



                                <RiCheckLine />



                                <span>

                                    {tip}

                                </span>



                            </p>



                        )

                    )}



                </article>



            </div>





            {/* =========================================================

                MAIN ANALYSIS GRID

                Appliance Comparison + Estimated Savings

            ========================================================== */}



            <div className="acdc-main-analysis-grid">



                {/* =====================================================

                    Appliance Comparison

                ====================================================== */}



                <section className="acdc-appliance-section">



                    <div className="acdc-section-header">



                        <h2>



                            {t.applianceComparison}



                            <span>

                                {t.acDcAppliances}

                            </span>



                        </h2>





                        <div className="acdc-view-toggle">



                            <span>

                                {t.view}

                            </span>





                            <button

                                type="button"

                                className={

                                    viewMode === "table"

                                        ? "active"

                                        : ""

                                }

                                onClick={() =>

                                    setViewMode("table")

                                }

                            >

                                {t.table}

                            </button>





                            <button

                                type="button"

                                className={

                                    viewMode === "card"

                                        ? "active"

                                        : ""

                                }

                                onClick={() =>

                                    setViewMode("card")

                                }

                            >

                                {t.card}

                            </button>



                        </div>



                    </div>





                    {/* =================================================

                        Card View

                    ================================================== */}



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

                                                {getApplianceName(item)}

                                            </strong>



                                        </header>





                                        <div className="acdc-appliance-comparison">



                                            {/* AC */}



                                            <div className="acdc-appliance-side ac">



                                                <img

                                                    src={item.acImage}

                                                    alt={item.ac}

                                                />





                                                <small>

                                                    {t.acTraditional}

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

                                                    alt={item.dc}

                                                />





                                                <small>

                                                    {t.dcEfficient}

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

                                                    {getSaving(item)}

                                                </strong>



                                                <p>

                                                    {getNote(item)}

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



                                            {t.appliance}



                                            <br />



                                            <span>

                                                {t.household}

                                            </span>



                                        </th>





                                        <th>



                                            AC



                                            <br />



                                            <span>

                                                {t.traditional}

                                            </span>



                                        </th>





                                        <th>



                                            DC



                                            <br />



                                            <span>

                                                {t.efficientAlternative}

                                            </span>



                                        </th>





                                        <th>



                                            {t.comparisonBenefit}



                                            <br />



                                            <span>

                                                {t.electricitySaving}

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

                                                        {getApplianceName(item)}

                                                    </strong>



                                                </td>





                                                {/* AC */}



                                                <td>



                                                    <div className="acdc-table-device">



                                                        <img

                                                            src={item.acImage}

                                                            alt={item.ac}

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

                                                            alt={item.dc}

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

                                                                {getSaving(item)}

                                                            </strong>



                                                            <p>

                                                                {getNote(item)}

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





                {/* =====================================================

                    Estimated Savings

                ====================================================== */}



                <section className="acdc-estimate-section">



                    <div className="acdc-section-header">



                        <h2>



                            ⚖ {t.estimatedSavingsTitle}



                            <span>

                                {t.exampleSavings}

                            </span>



                        </h2>









                    </div>





                    <p className="acdc-estimate-description">



                        {t.estimateDescription}





                        {billAmount > 0 && (



                            <>



                                {" "}



                                {t.currentBill}:



                                {" "}



                                Rs.{" "}



                                {billAmount.toLocaleString(

                                    "en-US"

                                )}



                                .



                            </>



                        )}



                    </p>





                    <div className="acdc-estimate-grid">



                        {/* Current */}



                        <div className="estimate-box blue">



                            <h3>

                                {t.currentMonthly}

                            </h3>



                            <span>

                                {t.estimated}

                            </span>





                            <strong>



                                {formatUnits(

                                    unitsConsumed

                                )}



                                {" "}



                                {t.units}



                            </strong>



                        </div>





                        {/* After Efficient */}



                        <div className="estimate-box green">



                            <h3>

                                {t.afterEfficient}

                            </h3>



                            <span>

                                {t.estimated}

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



                                {t.units}



                            </strong>





                            <b>

                                {t.possibleSavings}

                            </b>



                        </div>





                        {/* Benefits */}



                        <div className="estimate-box yellow">



                            <h3>

                                ⭐ {t.benefits}

                            </h3>





                            {t.benefitsList.map(

                                (benefit, index) => (



                                    <p

                                        key={index}

                                    >



                                        <RiCheckLine />



                                        <span>

                                            {benefit}

                                        </span>



                                    </p>



                                )

                            )}



                        </div>



                    </div>



                </section>



            </div>



        </section>



    );



}


export default SavingsAnalysis;