<?php

return [

    'single' => [

        'label' => 'Force delete',

        'modal' => [

            'heading' => 'Force delete :label',

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

        'label' => 'Force delete selected',

        'modal' => [

            'heading' => 'Force delete selected :label',

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
