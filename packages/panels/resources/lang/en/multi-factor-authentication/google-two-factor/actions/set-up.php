<?php

return [

    'label' => 'Set up',

    'modal' => [

        'heading' => 'Set up two-factor authentication app',

        'description' => <<<'BLADE'
            You'll need an app like Google Authenticator (<x-filament::link href="https://itunes.apple.com/us/app/google-authenticator/id388497605" target="_blank">iOS</x-filament::link>, <x-filament::link href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank">Android</x-filament::link>) to complete this process.
            BLADE,

        'content' => [

            'qr_code' => [

                'instruction' => 'Scan this QR code with your authenticator app:',

                'alt' => 'QR code to scan with an authenticator app',

            ],

            'text_code' => [

                'instruction' => 'Or enter this code manually:',

                'copy_hint' => '(click to copy)',

                'messages' => [
                    'copied' => 'Copied',
                ],

            ],

            'recovery_codes' => [

                'instruction' => 'Please save the following recovery codes in a safe place. You won\'t see them again, but you\'ll need them if you lose access to your app:',

            ],

        ],

        'form' => [

            'code' => [

                'label' => 'Enter a code from the app',

                'validation_attribute' => 'code',

                'below_content' => 'You\'ll need to put a code like this in each time you sign in.',

                'messages' => [

                    'invalid' => 'The code you entered is invalid.',

                ],

            ],

        ],

        'actions' => [

            'submit' => [
                'label' => 'Enable two-factor authentication',
            ],

        ],

    ],

    'notifications' => [

        'enabled' => [
            'title' => 'Two-factor app authentication has been enabled',
        ],

    ],

];
