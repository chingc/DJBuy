javascript:(/* DJBuy, version 1.3, https://github.com/smwst/DJBuy */ function () {
    'use strict';
    var to_int = function (str) {
            return parseInt(str.replace(/,/g, ''), 10);
        },
        match = /djmaxcrew\.com\/maxshop\/shop_music_detail\.asp\?m=[01]&i=[a-zA-Z0-9]+/,
        message,
        points,
        points_needed,
        purchase_id;
    if (match.test(location.hostname + location.pathname + location.search)) {
        points = to_int($('.login_maxpoint .point_blue').text());
        points_needed = (function () {
            var sum = 0;
            $('.i_check:enabled').siblings('font').each(function () {
                sum += to_int(this.innerHTML);
            });
            return sum;
        }());
        message = 'Available Max Points: ' + points + '\nMax Points Needed: ' + points_needed + '\n\n';
        if (points_needed === 0) {
            alert(message + 'Nothing to buy.  Returning...');
            history.back();
        } else if (points_needed > points) {
            alert(message + 'Not enought Max Points to buy everything.');
        } else {
            if (confirm(message + 'Proceed with purchase?')) {
                purchase_id = [];
                $('.i_check:enabled').each(function () {
                    purchase_id.push(this.value);
                });
                $.ajax({
                    url: 'http://' + location.hostname + '/maxshop/ProcShopMusic.asp?si=' + purchase_id.join('|')
                }).done(function () {
                    alert('Purchased!  You have ' + (points - points_needed) + ' Max Points left.\n\nReturning...');
                    history.back();
                }).fail(function () {
                    alert('Unable to make purchase.\n\nReload the page or try again later.');
                });
            }
        }
    }
}());
