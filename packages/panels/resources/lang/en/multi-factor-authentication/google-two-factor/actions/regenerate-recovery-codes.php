<?php

return [

    'label' => 'Regenerate recovery codes',

    'modal' => [

        'heading' => 'Regenerate two-factor authentication app recovery codes',

        'description' => 'If you lose your recovery codes, you can regenerate them here. Your old recovery codes will be invalidated immediately.',

        'form' => [

            'code' => [

                'label' => 'Enter a code from the app',

                'validation_attribute' => 'code',

                'messages' => [

                    'invalid' => 'The code you entered is invalid.',

                ],

            ],

            'password' => [

                'label' => 'Or, enter your current password',

                'validation_attribute' => 'password',

            ],

        ],

        'actions' => [

            'submit' => [
                'label' => 'Regenerate recovery codes',
            ],

        ],

    ],

    'notifications' => [

        'regenerated' => [

            'title' => 'New two-factor app authentication recovery codes have been generated',

        ],

    ],

    'show_new_recovery_codes' => [

        'modal' => [

            'heading' => 'New recovery codes',

            'description' => 'Please save the following recovery codes in a safe place. You won\'t see them again, but you\'ll need them if you lose access to your app:',

            'actions' => [

                'submit' => [
                    'label' => 'Close',
                ],

            ],

        ],

    ],

];
