javascript:(function () {
    'use strict';
    var to_int = function (str) {
            return parseInt(str.replace(/,/g, ''), 10);
        },
        sum = function (jQuery_obj) {
            var result = 0;
            jQuery_obj.each(function () {
                result += to_int(this.innerHTML);
            });
            return result;
        },
        about = '\n\n\n\nDJBuy 1.4, chingc.tumblr.com',
        my_location = location.hostname + location.pathname,
        shop_music = /djmaxcrew\.com\/maxshop\/shop_music_detail\.asp/.test(my_location),
        shop_item = /djmaxcrew\.com\/maxshop\/shop_dj_(icon|title).asp/.test(my_location),
        message,
        points,
        points_needed,
        purchase_id,
        purchase_success;
    if (shop_music || shop_item) {
        points = to_int($('.login_maxpoint .point_blue').text());
        points_needed = shop_music ? sum($('.i_check:enabled').siblings('font')) : sum($('.point > font'));
        message = 'Available Max Points: ' + points + '\nMax Points Needed: ' + points_needed + '\n\n';
        if (points_needed === 0) {
            alert(message + 'Nothing to buy.  Returning...' + about);
            history.back();
        } else if (points_needed > points) {
            alert(message + 'Not enought Max Points to buy everything.' + about);
        } else {
            if (confirm(message + 'Proceed with purchase?' + about)) {
                purchase_id = [];
                purchase_success = true;
                if (shop_music) {
                    $('.i_check:enabled').each(function () {
                        purchase_id.push(this.value);
                    });
                    $.ajax({
                        url: 'http://' + location.hostname + '/maxshop/ProcShopMusic.asp?si=' + purchase_id.join('|'),
                        async: false
                    }).done(function () {
                        alert('Purchased!' + about);
                    }).fail(function () {
                        alert('Unable to make purchase.' + about);
                    });
                    history.back();
                } else {
                    $('li[onclick]').each(function () {
                        var pid;
                        pid = /moveShopItemConfirm\('(\w+)'\)/.exec(this.onclick);
                        if (pid) {
                            purchase_id.push(pid[1])
                        }
                    });
                    $.each(purchase_id, function (i, value) {
                        $.ajax({
                            url: 'http://' + location.hostname + '/maxshop/ProcShopItem.asp?i=' + value,
                            async: false
                        }).fail(function () {
                            purchase_success = false;
                        });
                    });
                    if (purchase_success) {
                        alert('Items purchased!' + about);
                    } else {
                        alert('Unable to make one or more purchases.' + about);
                    }
                    location.reload();
                }
            }
        }
    }
}());
