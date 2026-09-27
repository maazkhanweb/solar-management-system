@extends('reports.layout')

@section('content')

<table>

    <thead>

        <tr>

            <th>

                ID

            </th>

            <th>

                Name

            </th>

            <th>

                Email

            </th>

            <th>

                Role

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

        @forelse($rows as $user)

            <tr>

                <td>

                    {{ $user->id }}

                </td>

                <td>

                    {{ $user->name }}

                </td>

                <td>

                    {{ $user->email }}

                </td>

                <td>

                    {{ $user->role }}

                </td>

                <td>

                    {{ $user->status }}

                </td>

                <td>

                    {{ optional($user->created_at)->format('d M Y') }}

                </td>

            </tr>

        @empty

            <tr>

                <td colspan="6" style="text-align:center;">

                    No Users Found

                </td>

            </tr>

        @endforelse

    </tbody>

</table>

@endsection