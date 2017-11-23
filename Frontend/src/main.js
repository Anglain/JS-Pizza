
var map;
var directionDisplay;
var directionService;

var point;
var marker;
var markerHome;

function initialize() {
        //Тут починаємо працювати з картою ==========================================================
    var mapProp = {
        center: new google.maps.LatLng(50.464379,30.519131),
        zoom: 13
    };

    var html_element = document.getElementById("google-maps-id");
    map = new google.maps.Map(html_element, mapProp);

    var rendererOptions = {
        map: map,
        suppressMarkers : true
    };
    directionDisplay = new google.maps.DirectionsRenderer(rendererOptions);

    directionService = new google.maps.DirectionsService();

    point = new google.maps.LatLng(50.464379,30.519131);
    marker = new google.maps.Marker({
        position: point,
        map: map,
        icon: "assets/images/map-icon.png"
    });
        //Карта створена і показана =================================================================
    markerHome = new google.maps.Marker({
        map: map,
        icon: "assets/images/home-icon.png"
    });

    google.maps.event.addListener(map, 'click',function(me){
        var coordinates = me.latLng;
        markerHome.setPosition(coordinates);

        geocodeLatLng(coordinates, function(err, address){
            if(!err) {
                    //Дізнаємося адресу =============================================================
                $('#addressInput').val(address);
                $('#ord-address').text(address);

                calculateRoute(point, coordinates, function callback(err, data) {
                    if(!err){
                        $('#ord-time').text(data.duration);
                    } else {
                        console.error("Неможливо встановити шлях!");
                        $('#ord-time').text("невідомий");
                    }
                });
            } else {
                console.error("Користувач не ввів адресу!");
                $('#ord-time').text("невідомий");
                $('#ord-address').text('невідома');
            }
        })
    });
}

function geocodeAddress(address, callback) {
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var coordinates = results[0].geometry.location;
            markerHome.setPosition(coordinates);

            calculateRoute(point, coordinates, function callback(err, data) {
                if(!err){
                    $('#ord-time').text(data.duration);
                } else {
                    $('#ord-time').text("невідомий");
                    console.error("Неможливо визначити шлях!");
                }
            });

            callback(null, results[0].formatted_address);
        } else {
            $('#ord-time').text("невідомий");
            $('#ord-address').text('невідома');
            callback(new Error("Can't find address"));
        }
    });
}

function geocodeLatLng(latlng, callback){
        //Модуль, що відповідає за роботу з адресою =================================================
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var address = results[1].formatted_address;
            callback(null, address);
        } else {
            callback(new Error("Can't find address"));
        }
    });
}

function calculateRoute(A_latlng, B_latlng, callback) {
        //Визначаємо маршрут ========================================================================
    var request = {
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    };

    directionService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionDisplay.setDirections(result);

            var leg = result.routes[ 0 ].legs[ 0 ];
            callback(null, {
                duration: leg.duration.text
            });
        }
        else {
            callback(new Error("Can't find direction"));
        }
    });
}

$(function(){
        //Цей код виконуватиметься коли сторінка завантажена =======================================
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();

        //Ініціалізуємо карту коли завантажилась сторінка ==========================================
    google.maps.event.addDomListener(window, 'load', initialize);

    $(".name-input-help").hide();
    $(".phone-input-help").hide();

    function nameCheck(field, help, value){
        if (value.match(/^[a-zA-Zа-яА-Я \-]{1,25}$/)) {

            field.addClass("has-success");
            field.removeClass("has-error");
            help.hide();

            return true;
        } else {

            field.addClass("has-error");
            field.removeClass("has-success");
            help.show();

            return false;
        }
    }

    $("#nameInput").keyup(function(){
        nameCheck($(".name-group"), $(".name-input-help"), $("#nameInput").val());
    });

    function phoneNumberCheck(field, help, value){
        if ((value.startsWith("+380") && value.length === 13 ||
             value.startsWith("0") && value.length === 10) &&
             value.substr(1).match(/^\d+$/)) {

            field.addClass("has-success");
            field.removeClass("has-error");
            help.hide();

            return true;
        } else {

            field.addClass("has-error");
            field.removeClass("has-success");
            help.show();

            return false;
        }
    }

    $("#phoneInput").keyup(function(){
        phoneNumberCheck($(".phone-group"), $(".phone-input-help"), $("#phoneInput").val());
    });

    function addressCheck(field, help, value) {
        if (value !== "") {

            field.addClass("has-success");
            field.removeClass("has-error");
            help.hide();

            return true;
        } else {

            field.addClass("has-error");
            field.removeClass("has-success");
            help.show();

            return false;
        }
    }

    var $addressInput = $("#addressInput");

    $addressInput.keyup(function(){
        addressCheck($(".address-group"), $(".address-input-help"), $addressInput.val());
    });

    $addressInput.focusout(function(){
        geocodeAddress($addressInput.val(), function (err, coordinates) {
            if (!err) {
                console.log("Updating address...");

                $("#ord-address").text($addressInput.val());

                markerHome.setMap(null);
                markerHome = new google.maps.Marker({
                    position: coordinates,
                    map: map,
                    icon: "assets/images/home-icon.png"
                });

                console.log("Calculating route...");

                calculateRoute(new google.maps.LatLng(50.464379, 30.519131), coordinates, function (err, data) {
                    if (!err) {
                        $("#ord-time").text(data.duration);
                    } else {
                        $("#ord-time").text("невідомий");
                    }
                })
            } else {
                console.log("Address update failed.");
            }
        });
    });

    $(".order-next-button").click(function() {
        var nameCorrect = nameCheck($(".name-group"), $(".name-input-help"), $("#nameInput").val());
        var phoneNumberCorrect = phoneNumberCheck($(".phone-group"), $(".phone-input-help"), $("#phoneInput").val());
        var addressCorrect = addressCheck($(".address-group"), $(".address-input-help"), $("#addressInput").val());

        if (nameCorrect && phoneNumberCorrect && addressCorrect) {
            PizzaCart.createOrder(function(err, data){
                if (err) {
                    alert("Can't create order!\n" + err.toString());
                } else {
                    console.log("Order successful.\n" + JSON.stringify(data));
                }
            });
        }
    });
});