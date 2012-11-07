javascript:(/* DJBuy, version 1.1, https://github.com/smwst/DJBuy */ function () {
    'use strict';
    var match = /djmaxcrew\.com\/maxshop\/shop_music_detail\.asp\?m=[01]&i=[a-zA-Z0-9]+/,
        points,
        points_needed,
        output,
        si;
    if (match.test(location.hostname + location.pathname + location.search)) {
        points = parseInt($('.login_maxpoint .point_blue').text().replace(/,/g, ''), 10);
        points_needed = (function () {
            var sum = 0;
            $.map($.map($('.i_check:enabled').siblings('font'), function (element) {
                return parseInt(element.innerHTML.replace(/,/g, ''), 10);
            }), function (element) {
                sum += element;
            });
            return sum;
        }());
        output = 'Available Max Points: ' + points + '\nMax Points Needed: ' + points_needed + '\n\n';
        si = [];
        if (points_needed === 0) {
            alert(output + 'Nothing to buy.  Returning...');
            history.back();
        } else if (points_needed > points) {
            alert(output + 'Not enought Max Points to buy everything.');
        } else {
            if (confirm(output + 'Proceed with purchase?')) {
                $.map($('.i_check:enabled'), function (element) {
                    si.push(element.value, '|');
                });
                si.pop();
                $.ajax({
                    url: 'http://www.djmaxcrew.com/maxshop/ProcShopMusic.asp?si=' + si.join('')
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
