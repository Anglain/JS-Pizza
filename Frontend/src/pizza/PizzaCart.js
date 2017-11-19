/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//Змінні для Local Storage
var Storage = require("./Storage");

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

var $noOrder = $(".no-order");

var $orderSumTitle = $(".sum-title");
var $orderSumNumber = $(".sum-number");

var orderPrice = 0;

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var unique = true;
    var i;

    for (i = 0; i < Cart.length; i++) {
        if (Cart[i].pizza === pizza && Cart[i].size === size) {
            unique = false;
            break;
        }
    }

    if (unique) {
        Cart.push({
            pizza: pizza,
            size: size,
            price: pizza[size].price,
            quantity: 1
        });

        orderPrice += Cart[Cart.length-1].pizza[Cart[i].size].price;
    } else {
        Cart[i].quantity++;
        Cart[i].price = Cart[i].pizza[Cart[i].size].price * Cart[i].quantity;
        orderPrice += Cart[i].pizza[Cart[i].size].price;
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика

    var toggleRemoving;

    for (var i = 0; i < Cart.length; i++) {
        if(!toggleRemoving) {
            if (Cart[i].pizza === cart_item.pizza && Cart[i].size === cart_item.size) {
                toggleRemoving = true;
            }
        } else {
            Cart[i] = Cart[i+1];
        }
    }
    Cart.length--;

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Зчитати вміст корзини який збережено в Local Storage то показати його

    var savedCart = Storage.read("cart");

    if (savedCart) {
        Cart = savedCart;

        for (var i = 0; i < Cart.length; i++) {
            orderPrice += Cart[i].price;
        }
    }

    updateCart();
}

//Очистити замовлення
$(".clear-order").click(function() {
    Cart.length = 0;

    updateCart();
});

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Показати оновлений кошик на екрані та зберегти вміcт кошика в Local Storage

    //Очищуємо старі піци в кошику
    $cart.html("");

    //Змінюємо кнопку "Замовити" та напис із сумою замовлення
    if (Cart.length === 0) {
        $cart.append($noOrder);

        $noOrder.css("display","block");

        $orderSumTitle.css("display","none");
        $orderSumNumber.css("display","none");

        $(".button-order").prop("disabled", "disabled");
    } else {
        $noOrder.css("display","none");

        $orderSumTitle.css("display","inline");
        $orderSumNumber.css("display","block");

        $orderSumNumber.html(orderPrice);
        $orderSumNumber.append(" грн.");

        $(".button-order").prop("disabled", "");
    }

    $(".order-counter").html(Cart.length);

    //Оновлення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity++;
            orderPrice += cart_item.pizza[cart_item.size].price;

            cart_item.price = cart_item.pizza[cart_item.size].price * cart_item.quantity;

            console.log(cart_item.price);

            updateCart();
        });

        $node.find(".minus").click(function(){
            //Зменшуємо кількість замовлених піц
            if (cart_item.quantity > 1) {

                cart_item.quantity--;
                orderPrice -= cart_item.pizza[cart_item.size].price;

                cart_item.price = cart_item.pizza[cart_item.size].price * cart_item.quantity;
                console.log(cart_item.price);

            } else {
                removeFromCart(cart_item);
            }

            updateCart();
        });

        $node.find(".remove").click(function(){
            removeFromCart(cart_item);

            updateCart();
        });

        cart_item.price = cart_item.pizza[cart_item.size].price * cart_item.quantity;

        $cart.append($node);
    }

    Storage.write("cart", Cart);

    Cart.forEach(showOnePizzaInCart);

}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;
exports.Cart = Cart;