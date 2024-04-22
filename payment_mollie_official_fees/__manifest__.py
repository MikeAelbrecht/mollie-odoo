# -*- coding: utf-8 -*-

{
    'name': 'Fees for Mollie Payments Extended',
    'version': '17.0.0.0',
    'category': 'eCommerce',
    'license': 'LGPL-3',
    'author': 'Mollie',
    'maintainer': 'Applix',
    'website': 'https://www.mollie.com/',

    'summary': 'Add fees features in mollie payment',
    'description': """
        Add fees features in mollie payment
    """,

    'depends': [
        'payment_mollie_official', 'website_sale'
    ],
    'data': [
        'views/payment_method.xml',
        'views/payment_views.xml',
        'views/templates.xml',
    ],

    'images': [],
}
