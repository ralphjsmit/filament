<?php

return [

    'single' => [

        'label' => 'استعادة',

        'modal' => [

            'heading' => 'استعادة :label',

            'actions' => [

                'restore' => [
                    'label' => 'استعادة',
                ],

            ],

        ],

        'notifications' => [

            'restored' => [
                'title' => 'تمت الاستعادة',
            ],

        ],

    ],

    'multiple' => [

        'label' => 'استعادة المحدد',

        'modal' => [

            'heading' => 'استعادة :label',

            'actions' => [

                'restore' => [
                    'label' => 'استعادة',
                ],

            ],

        ],

        'notifications' => [

            'restored' => [
                'title' => 'تمت الاستعادة',
            ],

            'restored_partial' => [
                'title' => 'تمت استعادة :count من :total',
                'missing_authorization_failure_message' => 'ليس لديك إذن لاستعادة :count.',
                'missing_processing_failure_message' => ':count لم يتم استعادته.',
            ],

            'restored_none' => [
                'title' => 'لم يتم استعادة أي شيء',
                'missing_authorization_failure_message' => 'ليس لديك إذن لاستعادة :count.',
                'missing_processing_failure_message' => ':count لم يتم استعادته.',
            ],

        ],

    ],

];
