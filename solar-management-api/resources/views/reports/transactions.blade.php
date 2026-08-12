@extends('reports.layout')

@section('content')

<table>

    <thead>

        <tr>

            <th>
                ID
            </th>

            <th>
                Inventory Item
            </th>

            <th>
                Transaction Type
            </th>

            <th>
                Quantity
            </th>

            <th>
                From Area
            </th>

            <th>
                To Area
            </th>

            <th>
                Performed By
            </th>

            <th>
                Created At
            </th>

        </tr>

    </thead>

    <tbody>

        @forelse($rows as $transaction)

            <tr>

                <td>
                    {{ $transaction->id }}
                </td>

                <td>
                    {{ $transaction->inventoryItem?->item_name ?? '-' }}
                </td>

                <td>
                    {{ $transaction->transaction_type }}
                </td>

                <td>
                    {{ $transaction->quantity }}
                </td>

                <td>
                    {{ $transaction->fromArea?->area_name ?? 'Warehouse' }}
                </td>

                <td>
                    {{ $transaction->toArea?->area_name ?? '-' }}
                </td>

                <td>
                    {{ $transaction->user?->name ?? '-' }}
                </td>

                <td>
                    {{ optional($transaction->created_at)->format('d M Y') }}
                </td>

            </tr>

        @empty

            <tr>

                <td colspan="8" style="text-align:center;">

                    No Inventory Transactions Found

                </td>

            </tr>

        @endforelse

    </tbody>

</table>

@endsection