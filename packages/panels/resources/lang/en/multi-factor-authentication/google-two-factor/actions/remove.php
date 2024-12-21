<?php

return [

    'label' => 'Remove',

    'modal' => [

        'heading' => 'Remove two-factor authentication app',

        'description' => 'Are you sure you want to remove two-factor authentication app?',

        'form' => [

            'code' => [

                'label' => 'Enter a code from the app',

                'validation_attribute' => 'code',

                'actions' => [

                    'use_recovery_code' => [
                        'label' => 'Use a recovery code instead',
                    ],

                ],

                'messages' => [

                    'invalid' => 'The code you entered is invalid.',

                ],

            ],

            'recovery_code' => [

                'label' => 'Or, enter a recovery code',

                'validation_attribute' => 'recovery code',

                'messages' => [

                    'invalid' => 'The recovery code you entered is invalid.',

                ],

            ],

        ],

        'actions' => [

            'submit' => [
                'label' => 'Remove two-factor authentication',
            ],

        ],

    ],

    'notifications' => [

        'removed' => [
            'title' => 'Two-factor app authentication has been removed',
        ],

    ],

];
