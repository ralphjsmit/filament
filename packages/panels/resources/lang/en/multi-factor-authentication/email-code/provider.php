<?php

return [

    'management_form' => [

        'actions' => [
            'label' => 'Email code authentication',
        ],

    ],

    'login_form' => [

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

];
