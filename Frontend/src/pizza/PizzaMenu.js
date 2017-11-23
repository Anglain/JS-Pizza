
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');

var API = require("../API");
var Pizza_List = [];

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

var $pizzaListName = $(".pizza-counter-text");
var $pizzaButtons = $(".pizza-filter-button");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    $(".pizza-counter-number").html(list.length);

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza, size: pizza.size});

        var $node = $(html_code);

        if (pizza.is_small && !pizza.is_big) {
            $node.find(".buy-small-stats").removeClass("col-sm-6");
            $node.find(".buy-small-stats").addClass("col-sm-12");
        } else if (pizza.is_big && !pizza.is_small) {
            $node.find(".buy-big-stats").removeClass("col-sm-6");
            $node.find(".buy-big-stats").addClass("col-sm-12");
        } else {
            $node.find(".buy-small-stats").removeClass("col-sm-12");
            $node.find(".buy-big-stats").removeClass("col-sm-12");
            $node.find(".buy-small-stats").addClass("col-sm-6");
            $node.find(".buy-big-stats").addClass("col-sm-6");
        }

        $node.find(".buy-big-button").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small-button").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){

        if (filter === "vega") {
            if (!pizza.content.meat && !pizza.content.chicken && !pizza.content.ocean) {
                pizza_shown.push(pizza);
            }
        } else if (pizza.content[filter]) {
            pizza_shown.push(pizza);
        } else if (!filter){
            pizza_shown.push(pizza);
        }

    });

    $(".pizza-counter-number").html(pizza_shown.length);
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

$("#filter-all").click(function(){
    $pizzaListName.html("Усі піци");
    $pizzaButtons.removeClass("active");
    $("#filter-all").addClass("active");
    filterPizza();
});

$("#filter-meat").click(function(){
    $pizzaListName.html("М'ясні піци");
    $pizzaButtons.removeClass("active");
    $("#filter-meat").addClass("active");
    filterPizza("meat");
});

$("#filter-mushrooms").click(function(){
    $pizzaListName.html("Піци з грибами");
    $pizzaButtons.removeClass("active");
    $("#filter-mushrooms").addClass("active");
    filterPizza("mushroom");
});

$("#filter-ocean").click(function(){
    $pizzaListName.html("Піци з морепродуктами");
    $pizzaButtons.removeClass("active");
    $("#filter-ocean").addClass("active");
    filterPizza("ocean");
});

$("#filter-pineapples").click(function(){
    $pizzaListName.html("Піци з ананасами");
    $pizzaButtons.removeClass("active");
    $("#filter-pineapples").addClass("active");
    filterPizza("pineapple");
});

$("#filter-vega").click(function(){
    $pizzaListName.html("Вегетаріанські піци");
    $pizzaButtons.removeClass("active");
    $("#filter-vega").addClass("active");
    filterPizza("vega");
});

function initialiseMenu() {
    //Показуємо усі піци
    API.getPizzaList(function (err, list) {
        if (err) {
            alert("Can't load pizza list from server!\n" + err.toString());
        } else {
            Pizza_List = list;
            showPizzaList(Pizza_List);
        }
    })
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;