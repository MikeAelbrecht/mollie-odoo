odoo.define('mollie_pos_terminal.PaymentScreen', function (require) {
    "use strict";

    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const Registries = require('point_of_sale.Registries');
    const { onMounted } = owl.hooks;

    const PosMolliePaymentScreen = PaymentScreen => class extends PaymentScreen {
        constructor() {
            super(...arguments);
            onMounted(() => {
                const pendingPaymentLine = this.currentOrder.paymentlines.find(
                    paymentLine => paymentLine.payment_method.use_payment_terminal === 'mollie' &&
                        (!paymentLine.is_done() && paymentLine.get_payment_status() == 'waitingCard')
                );
                if (pendingPaymentLine) {
                    const paymentTerminal = pendingPaymentLine.payment_method.payment_terminal;
                    paymentTerminal.set_most_recent_mollie_uid(pendingPaymentLine.mollieUID);
                    pendingPaymentLine.set_payment_status('waitingCard');
                    paymentTerminal.start_mollie_status_polling().then(isPaymentSuccessful => {
                        if (isPaymentSuccessful) {
                            pendingPaymentLine.set_payment_status('done');
                        } else {
                            pendingPaymentLine.set_payment_status('retry');
                        }
                    });
                }
            });
        }
        async _isOrderValid(isForceValidate) {

            let mollieLine = this.currentOrder.paymentlines.find(
                (paymentLine) => paymentLine.payment_method.use_payment_terminal === "mollie"
            );
            mollieLine = this.currentOrder.paymentlines.models[0];

            if (mollieLine
                && mollieLine.payment_method.split_transactions
                && mollieLine.payment_method.mollie_payment_default_partner
                && !this.currentOrder.get_client()) {
                var partner = this.env.pos.db.get_partner_by_id(mollieLine.payment_method.mollie_payment_default_partner[0]);
                this.currentOrder.set_client(partner);
            }

            return super._isOrderValid(...arguments)
        }
    };

    Registries.Component.extend(PaymentScreen, PosMolliePaymentScreen);

    return PaymentScreen;
});
