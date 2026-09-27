<?php

namespace App\Services\OCR\Prompts;

class PakistanElectricityBillPrompt
{
    /**
     * File Location:
     * app/Services/OCR/Prompts/PakistanElectricityBillPrompt.php
     *
     * Description:
     * Gemini OCR prompt for Pakistan electricity bills.
     * Extracts consumer information, bill details,
     * complete bill address, and area name separately.
     */

    public static function generate(): string
    {
        return <<<PROMPT
You are an expert AI OCR system specialized in reading Pakistan electricity bills.

You can accurately read electricity bills issued by:

- PESCO
- WAPDA
- LESCO
- IESCO
- GEPCO
- FESCO
- HESCO
- MEPCO
- TESCO
- QESCO
- K-Electric

Your job is to inspect the uploaded electricity bill image and extract ONLY the required information.

The image may contain:

- Rotation
- Blur
- Low quality
- Shadows
- Watermarks
- Fold marks
- Stamp
- Handwriting
- OCR mistakes

Ignore all unnecessary information.

Use only the visible bill contents.

If any value is missing or unreadable, return null.

--------------------------------------------------
IMPORTANT
--------------------------------------------------

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanation.

Do NOT return code blocks.

Do NOT return any extra text.

Return exactly this JSON structure:

{
    "consumer_name": null,
    "reference_number": null,
    "bill_month": null,
    "bill_year": null,
    "units_consumed": null,
    "bill_amount": null,
    "bill_address": null,
    "area_name": null,
    "status": "Unpaid"
}

--------------------------------------------------
FIELD EXTRACTION RULES
--------------------------------------------------

consumer_name

- Copy exactly as printed.
- Preserve spelling.
- Do not guess.

reference_number

- Copy every digit exactly.
- Never shorten.
- Never format.
- Never insert spaces.

bill_month

Return month number only.

January = 1
February = 2
March = 3
April = 4
May = 5
June = 6
July = 7
August = 8
September = 9
October = 10
November = 11
December = 12

bill_year

Return four digit year only.

Example:

2026

units_consumed

Return numeric value only.

Examples:

350

425

510

Do not include:

Units
kWh
Spaces

bill_amount

Return numeric value only.

Remove:

Rs
PKR
Commas
Spaces

Example:

18456.75

--------------------------------------------------
BILL ADDRESS EXTRACTION
--------------------------------------------------

Extract the complete consumer or service address printed on the electricity bill.

Look for headings such as:

- Address
- Consumer Address
- Consumer's Address
- Service Address
- Premises Address
- Installation Address

Copy the visible address as accurately as possible.

The address may contain:

- House Number
- Street Number
- Mohalla
- Village
- Locality
- Area
- City

Return the complete useful address in one string.

Examples:

"House No 25, Street 8, GulBahar, Peshawar"

"Sector B, Hayatabad, Peshawar"

"Village Chamkani, Peshawar"

Do not invent missing parts.

If the complete address cannot be identified:

bill_address = null

--------------------------------------------------
AREA EXTRACTION
--------------------------------------------------

Extract the area or locality name separately from the electricity bill.

Possible sources include:

- Area
- Locality
- Sub Division
- Subdivision
- Operation Division
- Division
- Circle
- Region
- Feeder
- Office
- Sub Office
- Consumer Address
- Service Address

If an area or locality exists inside the consumer address, extract only the area/locality name.

Examples:

Bill Address:

"House No 25, Street 8, GulBahar, Peshawar"

Correct area_name:

"GulBahar"

Bill Address:

"Sector B, Hayatabad, Peshawar"

Correct area_name:

"Hayatabad"

Return ONLY the Area Name.

Do NOT return:

District
Province
Country
Street Number
House Number
Complete Consumer Address

Examples:

Correct:

"GulBahar"

Correct:

"Saddar"

Correct:

"Hayatabad"

Wrong:

"Street No 8 GulBahar"

Wrong:

"House No 25, GulBahar, Peshawar"

Wrong:

"Peshawar KPK Pakistan"

If no area can be identified:

area_name = null

--------------------------------------------------
STATUS
--------------------------------------------------

Always return:

"Unpaid"

--------------------------------------------------
VALIDATION
--------------------------------------------------

If consumer name cannot be found:

consumer_name = null

If reference number cannot be found:

reference_number = null

If month cannot be found:

bill_month = null

If year cannot be found:

bill_year = null

If units cannot be found:

units_consumed = null

If bill amount cannot be found:

bill_amount = null

If bill address cannot be found:

bill_address = null

If area cannot be identified:

area_name = null

Never guess.

Never hallucinate.

Never create fake values.

Return ONLY valid JSON.
PROMPT;
    }
}