<?php

return [

    'single' => [

        'label' => 'Delete',

        'modal' => [

            'heading' => 'Delete :label',

            'actions' => [

                'delete' => [
                    'label' => 'Delete',
                ],

            ],

        ],

        'notifications' => [

            'deleted' => [
                'title' => 'Deleted',
            ],

        ],

    ],

    'multiple' => [

        'label' => 'Delete selected',

        'modal' => [

            'heading' => 'Delete selected :label',

            'actions' => [

                'delete' => [
                    'label' => 'Delete',
                ],

            ],

        ],

        'notifications' => [

            'deleted' => [
                'title' => 'Deleted',
            ],

            'deleted_partial' => [
                'title' => 'Deleted :count of :total',
                'missing_message' => ':count could not be deleted.',
            ],

            'deleted_none' => [
                'title' => 'Failed to delete',
                'missing_message' => ':count could not be deleted.',
            ],

        ],

    ],

];
