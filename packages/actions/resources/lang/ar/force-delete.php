<?php

return [

    'single' => [

        'label' => 'حذف نهائي',

        'modal' => [

            'heading' => 'حذف نهائي لـ :label',

            'actions' => [

                'delete' => [
                    'label' => 'حذف',
                ],

            ],

        ],

        'notifications' => [

            'deleted' => [
                'title' => 'تم الحذف',
            ],

        ],

    ],

    'multiple' => [

        'label' => 'حذف المحدد نهائيا',

        'modal' => [

            'heading' => 'حذف نهائي لـ :label',

            'actions' => [

                'delete' => [
                    'label' => 'حذف',
                ],

            ],

        ],

        'notifications' => [

            'deleted' => [
                'title' => 'تم الحذف',
            ],

            'deleted_partial' => [
                'title' => 'تم حذف :count من :total',
                'missing_authorization_failure_message' => 'ليس لديك إذن لحذف :count.',
                'missing_processing_failure_message' => 'لم يتم حذف :count.',
            ],

            'deleted_none' => [
                'title' => 'لم يتم حذف أي شيء',
                'missing_authorization_failure_message' => 'ليس لديك إذن لحذف :count.',
                'missing_processing_failure_message' => 'لم يتم حذف أي شيء.',
            ],

        ],

    ],

];
