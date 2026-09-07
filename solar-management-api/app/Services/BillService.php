<?php

namespace App\Services;

use App\Models\Bill;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * ============================================================================
 * File:
 * app/Services/BillService.php
 *
 * Description:
 * Handles WAPDA Bill management including:
 * - Fetching bills
 * - Creating bills
 * - Updating bills
 * - Deleting bills
 * - Area relationship loading
 * - Bill image storage
 * - Role-based access control
 * ============================================================================
 */

class BillService
{
    /**
     * Get all bills with filters.
     */
    public function getAllBills(
        array $filters = []
    ): LengthAwarePaginator {

        $query = Bill::with([
            'area',
            'createdBy',
            'updatedBy',
        ]);


        /*
        |--------------------------------------------------------------------------
        | Role Based Access
        |--------------------------------------------------------------------------
        */

        $user = Auth::user();

        if (
            $user &&
            $user->role === 'Manager'
        ) {

            $query->where(
                'created_by',
                $user->id
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['search'])) {

            $search = trim(
                $filters['search']
            );

            $query->where(
                function ($query) use ($search) {

                    $query
                        ->where(
                            'consumer_name',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'reference_number',
                            'like',
                            "%{$search}%"
                        )
                        ->orWhere(
                            'bill_address',
                            'like',
                            "%{$search}%"
                        );

                }
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Month
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['month'])) {

            $query->where(
                'bill_month',
                $filters['month']
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Year
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['year'])) {

            $query->where(
                'bill_year',
                $filters['year']
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['status'])) {

            $query->where(
                'status',
                $filters['status']
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        $perPage =
            $filters['per_page'] ?? 10;


        return $query
            ->latest()
            ->paginate($perPage);

    }


    /**
     * Store new bill.
     */
    public function storeBill(
        array $data
    ): Bill {

        return DB::transaction(
            function () use ($data) {

                /*
                |--------------------------------------------------------------------------
                | Store Bill Image
                |--------------------------------------------------------------------------
                */

                if (
                    isset($data['bill_image']) &&
                    $data['bill_image'] instanceof UploadedFile
                ) {

                    $data['bill_image'] =
                        $data['bill_image']
                            ->store(
                                'bills',
                                'public'
                            );

                }


                /*
                |--------------------------------------------------------------------------
                | Create Bill
                |--------------------------------------------------------------------------
                |
                | area_id is optional.
                | bill_address is optional.
                |
                | If area_id is selected, the Area relationship
                | will be loaded with the saved bill.
                |
                */

                return Bill::create(
                    $data
                )->load([
                    'area',
                    'createdBy',
                    'updatedBy',
                ]);

            }
        );

    }


    /**
     * Update existing bill.
     */
    public function updateBill(
        Bill $bill,
        array $data
    ): Bill {

        $this->authorizeBill(
            $bill
        );


        return DB::transaction(
            function () use ($bill, $data) {

                /*
                |--------------------------------------------------------------------------
                | Update Bill Image
                |--------------------------------------------------------------------------
                */

                if (
                    isset($data['bill_image']) &&
                    $data['bill_image'] instanceof UploadedFile
                ) {

                    if (
                        !empty($bill->bill_image) &&
                        Storage::disk('public')
                            ->exists(
                                $bill->bill_image
                            )
                    ) {

                        Storage::disk('public')
                            ->delete(
                                $bill->bill_image
                            );

                    }


                    $data['bill_image'] =
                        $data['bill_image']
                            ->store(
                                'bills',
                                'public'
                            );

                }


                /*
                |--------------------------------------------------------------------------
                | Update Bill
                |--------------------------------------------------------------------------
                */

                $bill->update(
                    $data
                );


                return $bill->fresh([
                    'area',
                    'createdBy',
                    'updatedBy',
                ]);

            }
        );

    }


    /**
     * Delete bill.
     */
    public function deleteBill(
        Bill $bill
    ): bool {

        $this->authorizeBill(
            $bill
        );


        return DB::transaction(
            function () use ($bill) {

                /*
                |--------------------------------------------------------------------------
                | Delete Bill Image
                |--------------------------------------------------------------------------
                */

                if (
                    !empty($bill->bill_image) &&
                    Storage::disk('public')
                        ->exists(
                            $bill->bill_image
                        )
                ) {

                    Storage::disk('public')
                        ->delete(
                            $bill->bill_image
                        );

                }


                return $bill->delete();

            }
        );

    }


    /**
     * Get single bill.
     */
    public function getBill(
        Bill $bill
    ): Bill {

        $this->authorizeBill(
            $bill
        );


        return $bill->load([
            'area',
            'createdBy',
            'updatedBy',
        ]);

    }


    /**
     * Authorize bill access.
     */
    protected function authorizeBill(
        Bill $bill
    ): void {

        $user = Auth::user();


        if (
            $user &&
            $user->role === 'Manager' &&
            $bill->created_by !== $user->id
        ) {

            throw new HttpException(
                403,
                'You are not authorized to access this bill.'
            );

        }

    }
}