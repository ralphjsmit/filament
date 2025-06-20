<?php

return [

    'single' => [

        'label' => 'Видалити',

        'modal' => [

            'heading' => 'Видалити :label',

            'actions' => [

                'delete' => [
                    'label' => 'Видалити',
                ],

            ],

        ],

        'notifications' => [

            'deleted' => [
                'title' => 'Видалено',
            ],

        ],

    ],

    'multiple' => [

        'label' => 'Видалити вибране',

        'modal' => [

            'heading' => 'Видалити вибране :label',

            'actions' => [

                'delete' => [
                    'label' => 'Видалити',
                ],

            ],

        ],

        'notifications' => [

            'deleted' => [
                'title' => 'Видалено',
            ],

            'deleted_partial' => [
                'title' => 'Видалено :count із :total',
                'missing_authorization_failure_message' => 'У вас немає дозволу на видалення :count.',
                'missing_processing_failure_message' => 'Не вдалося видалити :count.',
            ],

            'deleted_none' => [
                'title' => 'Не вдалося видалити',
                'missing_authorization_failure_message' => 'У вас немає дозволу на видалення :count.',
                'missing_processing_failure_message' => 'Не вдалося видалити :count.',
            ],


        ],

    ],

];
