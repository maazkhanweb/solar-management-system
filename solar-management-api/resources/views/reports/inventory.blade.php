@extends('reports.layout')

@section('content')

<table>

    <thead>

        <tr>

            <th>
                ID
            </th>

            <th>
                Item Name
            </th>

            <th>
                Item Type
            </th>

            <th>
                Quantity
            </th>

            <th>
                Available Quantity
            </th>

            <th>
                Minimum Stock
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

        @forelse($rows as $item)

            <tr>

                <td>
                    {{ $item->id }}
                </td>

                <td>
                    {{ $item->item_name }}
                </td>

                <td>
                    {{ $item->item_type }}
                </td>

                <td>
                    {{ $item->quantity }}
                </td>

                <td>
                    {{ $item->available_quantity }}
                </td>

                <td>
                    {{ $item->minimum_stock }}
                </td>

                <td>
                    {{ $item->status }}
                </td>

                <td>
                    {{ optional($item->created_at)->format('d M Y') }}
                </td>

            </tr>

        @empty

            <tr>

                <td colspan="8" style="text-align:center;">

                    No Inventory Items Found

                </td>

            </tr>

        @endforelse

    </tbody>

</table>

@endsection