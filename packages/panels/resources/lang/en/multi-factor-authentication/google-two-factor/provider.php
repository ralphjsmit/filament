<?php

return [

    'management_form' => [

        'actions' => [
            'label' => 'Two factor authentication app',
        ],

    ],

    'login_form' => [

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

];
