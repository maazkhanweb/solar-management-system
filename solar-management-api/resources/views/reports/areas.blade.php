@extends('reports.layout')

@section('content')

<table>

    <thead>

        <tr>

            <th>
                ID
            </th>

            <th>
                Area Name
            </th>

            <th>
                Location
            </th>

            <th>
                Manager
            </th>

            <th>
                Phone
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

        @forelse($rows as $area)

            <tr>

                <td>
                    {{ $area->id }}
                </td>

                <td>
                    {{ $area->area_name }}
                </td>

                <td>
                    {{ $area->location }}
                </td>

                <td>
                    {{ $area->manager }}
                </td>

                <td>
                    {{ $area->phone }}
                </td>

                <td>
                    {{ $area->status }}
                </td>

                <td>
                    {{ optional($area->created_at)->format('d M Y') }}
                </td>

            </tr>

        @empty

            <tr>

                <td colspan="7" style="text-align:center;">

                    No Areas Found

                </td>

            </tr>

        @endforelse

    </tbody>

</table>

@endsection