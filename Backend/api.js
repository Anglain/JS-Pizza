
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;
    console.log("Creating Order", order_info);

        //LiqPay functions and variables ==========================================================
    function base64(str) {
        return new Buffer(str).toString('base64');
    }

    var crypto = require('crypto');
    function sha1(string) {
        var sha1 = crypto.createHash('sha1');
        sha1.update(string);
        return sha1.digest('base64');
    }

    var LIQPAY_PUBLIC_KEY = "i65356881542";
    var LIQPAY_PRIVATE_KEY = "51K5OhklamJIBs1ZVQeLGxhl7LaPYiVEpbgGTQNs";

    var description = "Замовник: " + order_info.name + " Телефон: " + order_info.phone + " Адреса: " + order_info.address;
    description += "Піци: ";

    order_info.order.forEach(function(pizza) {
        console.log(pizza);
        description += "[" + pizza.pizza.title + " [" + (pizza.size === "big_size" ? "Велика" : "Мала") + "] " + pizza.quantity+ "шт. ] ";
    });


    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: parseInt(order_info.price),
        currency: "UAH",
        description: description,
        order_id: Math.random(),
        // Важливо щоб було 1, бо інакше візьме гроші!
        sandbox: 1
    };

    var data = base64(JSON.stringify(order));

    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);

    res.send({
        success: true,

        name: order_info.name,
        phone: order_info.phone,
        address: order_info.address,

        pizzas: order_info.order.length,
        price: order_info.price,

        data: data,
        signature: signature
    });
};