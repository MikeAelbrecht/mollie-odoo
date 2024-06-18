# coding: utf-8
import logging
from odoo import http
from odoo.http import request

_logger = logging.getLogger(__name__)


class PosMollieController(http.Controller):

    # TODO: '/pos_mollie/webhook' is for backwards compatibility
    # Remove it in v18
    @http.route([
        '/pos_mollie/webhook',
        '/pos_mollie/webhook/<string:order_type>',
    ], type='http', methods=['POST'], auth='public', csrf=False)
    def webhook(self, order_type='pos', **post):
        if not post.get('id'):
            return
        request.env['mollie.pos.terminal.payments']._mollie_process_webhook(post, order_type)
        return ""
