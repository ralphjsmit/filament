<?php

return [

    'label' => 'Set up',

    'modal' => [

        'heading' => 'Set up email code authentication',

        'description' => 'You\'ll need to enter a code we send you by email each time you sign in. We\'ve sent you an email with a code to get started.',

        'form' => [

            'code' => [

                'label' => 'Enter the code we sent you by email',

                'validation_attribute' => 'code',

                'actions' => [

                    'resend' => [

                        'label' => 'Send a new code by email',

                        'notifications' => [

                            'resent' => [
                                'title' => 'We\'ve sent you a new code by email',
                            ],

                        ],

                    ],

                ],

                'messages' => [

                    'invalid' => 'The code you entered is invalid.',

                ],

            ],

        ],

        'actions' => [

            'submit' => [
                'label' => 'Enable email code authentication',
            ],

        ],

    ],

    'notifications' => [

        'enabled' => [
            'title' => 'Email code authentication has been enabled',
        ],

    ],

];
