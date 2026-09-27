@extends('reports.layout')

@section('content')

<table>

    <thead>

        <tr>

            <th>
                ID
            </th>

            <th>
                Consumer Name
            </th>

            <th>
                Reference Number
            </th>

            <th>
                Bill Month
            </th>

            <th>
                Bill Year
            </th>

            <th>
                Units Consumed
            </th>

            <th>
                Bill Amount
            </th>

            <th>
                Status
            </th>

            <th>
                Created At
            </th>

        </tr>

    </thead>

    <tbody>

        @forelse($rows as $bill)

            <tr>

                <td>
                    {{ $bill->id }}
                </td>

                <td>
                    {{ $bill->consumer_name }}
                </td>

                <td>
                    {{ $bill->reference_number }}
                </td>

                <td>
                    {{ $bill->bill_month }}
                </td>

                <td>
                    {{ $bill->bill_year }}
                </td>

                <td>
                    {{ $bill->units_consumed }}
                </td>

                <td>
                    {{ number_format($bill->bill_amount, 2) }}
                </td>

                <td>
                    {{ $bill->status }}
                </td>

                <td>
                    {{ optional($bill->created_at)->format('d M Y') }}
                </td>

            </tr>

        @empty

            <tr>

                <td colspan="9" style="text-align:center;">

                    No WAPDA Bills Found

                </td>

            </tr>

        @endforelse

    </tbody>

</table>

@endsection