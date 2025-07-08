<?php

return [

    'notifications' => [

        'blocked' => [
            'title' => 'E-Mail-Adressenänderung blockiert',
            'body' => 'Sie haben erfolgreich einen Versuch zur E-Mail-Adressenänderung zu :email blockiert. Falls Sie die ursprüngliche Anfrage nicht gestellt haben, kontaktieren Sie uns bitte umgehend.',
        ],

        'failed' => [
            'title' => 'E-Mail-Adressenänderung konnte nicht blockiert werden',
            'body' => 'Leider konnten Sie nicht verhindern, dass die E-Mail-Adresse zu :email geändert wurde, da sie bereits verifiziert war, bevor Sie sie blockiert haben. Falls Sie die ursprüngliche Anfrage nicht gestellt haben, kontaktieren Sie uns bitte umgehend.',
        ],

    ],

]; 