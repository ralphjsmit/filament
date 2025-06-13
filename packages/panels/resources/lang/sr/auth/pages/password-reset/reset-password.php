<?php

return [

    'title' => 'Ресетујте лозинку',

    'heading' => 'Ресетујте лозинку',

    'form' => [

        'email' => [
            'label' => 'Адреса е-поште',
        ],

        'password' => [
            'label' => 'Лозинка',
            'validation_attribute' => 'лозинка',
        ],

        'password_confirmation' => [
            'label' => 'Потврдите лозинку',
        ],

        'actions' => [

            'reset' => [
                'label' => 'Ресетујте лозинку',
            ],

        ],

    ],

    'notifications' => [

        'throttled' => [
            'title' => 'Превише покушаја ресетовања',
            'body' => 'Покушајете поново за :seconds s.',
        ],

    ],

];
