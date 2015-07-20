/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function () {
    angular.module('inspinia', [
            'ParseServices',
            'ui.router', // Routing
            'oc.lazyLoad',
            'ui.bootstrap', // Bootstrap
            'ngIdle',
            'countrySelect',
            'ngCookies',
            'datatables'
        ]);
})();

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

//console.log("abc()abc()abc".replace("(", "+"));