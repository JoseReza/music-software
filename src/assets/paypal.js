window.paypal
    .Buttons({
        style: {
            shape: "rect",
            layout: "vertical",
            disableMaxWidth: true
        },
        createOrder() {
            return actions.order.create({
                purchase_units: [{ "description": "Publish music software project audio", "amount": { "currency_code": "USD", "value": 3 } }]
            });
        },
        onApprove(data, actions) {
            publishProject(data);
        },
    })
    .render("#paypal-button-container");