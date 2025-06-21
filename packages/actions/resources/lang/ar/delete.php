<?php

return [

    'single' => [

        'label' => 'حذف',

        'modal' => [

            'heading' => 'حذف :label',

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

        'label' => 'حذف المحدد',

        'modal' => [

            'heading' => 'حذف المحدد :label',

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
                'title' => 'تم حذف :count من أصل :total',
                'missing_authorization_failure_message' => 'ليس لديك صلاحية لحذف :count.',
                'missing_processing_failure_message' => 'تعذر حذف :count.',
            ],

            'deleted_none' => [
                'title' => 'فشل في الحذف',
                'missing_authorization_failure_message' => 'ليس لديك صلاحية لحذف :count.',
                'missing_processing_failure_message' => 'تعذر حذف :count.',
            ],

        ],

    ],

];
