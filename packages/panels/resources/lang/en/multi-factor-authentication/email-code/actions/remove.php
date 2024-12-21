<?php

return [

    'label' => 'Remove',

    'modal' => [

        'heading' => 'Remove email code authentication',

        'description' => 'Are you sure you want to disable email code authentication?',

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
                'label' => 'Remove email code authentication',
            ],

        ],

    ],

    'notifications' => [

        'removed' => [
            'title' => 'Email code authentication has been removed',
        ],

    ],

];
