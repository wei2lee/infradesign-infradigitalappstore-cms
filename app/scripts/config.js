/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written stat for all view in theme.
 *
 */


var resolvePluginDataTable = {
    loadPlugin: function ($ocLazyLoad) {
        return $ocLazyLoad.load([
//            {
//                serie: true,
//                files: ['js/plugins/dataTables/jquery.dataTables.js', 'css/plugins/dataTables/dataTables.bootstrap.css']
//            },
//            {
//                serie: true,
//                files: ['js/plugins/dataTables/dataTables.bootstrap.js']
//            },
//            {
//                name: 'datatables',
//                //files: ['js/plugins/dataTables/angular-datatables.min.js']
//                files: ['js/plugins/angular-datatables/dist/angular-datatables.js']
//            }
        ]);
    }
};

var resolvePluginDropZone = {
    loadPlugin: function ($ocLazyLoad) {
        return $ocLazyLoad.load([
//            {
//                files: ['css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
//                        }
                    ]);
    }
}

var resolvePluginForm = {
    loadPlugin: function ($ocLazyLoad) {
        return $ocLazyLoad.load([
            {
                name: 'datePicker',
                files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
            },
            {
                files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
            }
        ]);
    }
}

function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            data: {
                pageTitle: 'Login',
                specialClass: 'gray-bg'
            }
        })
        .state('index', {
            abstract: true,
            url: "/",
            templateUrl: "views/common/content.html",
        })
        .state('index.team-list', {
            url: "team/list",
            templateUrl: "views/team-list.html",
            data: {
                pageTitle: 'Team Management - List'
            },
            ncyBreadcrumb: {
                label: 'Team Management / List'
            },
            resolve: resolvePluginDataTable
        })
        .state('index.team-create', {
            url: "team/create",
            templateUrl: "views/team-create-edit.html",
            data: {
                pageTitle: 'Team Management - Create'
            },
            ncyBreadcrumb: {
                label: 'Team Management / Create'
            },
        })
        .state('index.team-edit', {
            url: "team/edit/{objectId}",
            templateUrl: "views/team-create-edit.html",
            data: {
                pageTitle: 'Team Management - Edit'
            },
            ncyBreadcrumb: {
                label: 'Team Management / Edit'
            },
            resolve: resolvePluginDataTable
        })
        .state('index.user-create', {
            url: "team/{teamId}/user/create",
            templateUrl: "views/user-create-edit.html",
            data: {
                pageTitle: 'Team Management - Create Team Member'
            }
        })
        .state('index.user-edit', {
            url: "team/{teamId}/user/edit/{objectId}",
            templateUrl: "views/user-create-edit.html",
            data: {
                pageTitle: 'Team Management - Edit Team Member'
            }
        })
        .state('index.role-list', {
            url: "role/list",
            templateUrl: "views/role-list.html",
            data: {
                pageTitle: 'Role Management - List'
            },
            resolve: resolvePluginDataTable
        })
        .state('index.role-create', {
            url: "role/create",
            templateUrl: "views/role-create-edit.html",
            data: {
                pageTitle: 'Role Management - Create'
            }
        })
        .state('index.role-edit', {
            url: "role/edit/{objectId}",
            templateUrl: "views/role-create-edit.html",
            data: {
                pageTitle: 'Role Management - Edit'
            }
        })
        .state('index.client-list', {
            url: "client/list",
            templateUrl: "views/client-list.html",
            data: {
                pageTitle: 'Client Management - List'
            },
            resolve: resolvePluginDataTable
        })
        .state('index.client-create', {
            url: "client/create",
            templateUrl: "views/client-create-edit.html",
            data: {
                pageTitle: 'Client Management - Create'
            },
            resolve: resolvePluginDropZone
        })
        .state('index.client-edit', {
            url: "client/edit/{objectId}",
            templateUrl: "views/client-create-edit.html",
            data: {
                pageTitle: 'Client Management - Edit'
            },
            resolve: resolvePluginDropZone
        })

    .state('index.app-list', {
            url: "app/list",
            templateUrl: "views/app-list.html",
            data: {
                pageTitle: 'App Management - List'
            },
            resolve: resolvePluginDataTable
        })
        .state('index.app-create', {
            url: "client/{clientId}/app/create",
            templateUrl: "views/app-create-edit.html",
            data: {
                pageTitle: 'App Management - Create'
            },
            resolve: resolvePluginForm
        })
        .state('index.app-edit', {
            url: "client/{clientId}/app/edit/{objectId}",
            templateUrl: "views/app-create-edit.html",
            data: {
                pageTitle: 'App Management - Edit'
            },
            resolve: resolvePluginForm
        })
}
angular
    .module('inspinia')
    .config( [
        '$compileProvider',
        function( $compileProvider )
        {   
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|itms-services):/);
        }
    ])
    .config(config)
    .factory('modalalert', function ($modal) {
        var _this = this;
        this.openAlert = function (controller, type, title, message) {
            if (typeof type != 'object') {
                controller.alert = {
                    "type": type,
                    "title": title,
                    "message": message,
                };
            } else {
                controller.alert = {
                    "type": type.type || 'danger',
                    "title": type.title || '',
                    "message": type.message || ''
                };
            }
            $('html,body').animate({
                    scrollTop: 0
                },
                '500'
            );
        }

        this.openAlertWithError = function (controller, type, title, error) {
            if (typeof type != 'object') {
                controller.alert = {
                    "type": type,
                    "title": title,
                    "message": (error && error.message) ? error.message : error,
                };
            } else {
                controller.alert = {
                    "type": type.type || 'danger',
                    "title": type.title || '',
                    "message": type.message || ''
                };
            }
            $('html,body').animate({
                    scrollTop: 0
                },
                '500'
            );
        }


        this.closeAlert = function (controller) {
            if (controller.alert)
                controller.alert = null;
        }

        this.openLoading = function (controller, message) {
            function LoadingCtrl() {
                this.loading = {
                    "message": message
                }
            }
            $loading = $modal.open({
                templateUrl: 'views/common/modal-loading.html',
                backdrop: 'static',
                "controller": LoadingCtrl,
                "controllerAs": "controller"
            });
            controller.$loading = $loading;
            return $loading;
        }

        this.closeLoading = function (controller) {
            if (controller.$loading) {
                controller.$loading.dismiss('cancel');
                controller.$loading = null;
            }
        }
        return this;
    })
    .service('u', function (ParseMember, ParseUserRole) {
        this.allowAccessCMS = function (o) {
            if (o.className == 'UserRole') {
                return (o.data ? o.data.id : o.id) == 'qpo4jjDrCc';
            } else if (o.className == 'Member') {
                return (o.data ? o.userRole.data.id : o.get('userRole').id) == 'qpo4jjDrCc';
            }
        }
        this.allowAccessContent = function (o) {
            if (o.className == 'UserRole') {
                return ['qpo4jjDrCc'].indexOf(o.data ? o.data.id : o.id) >= 0;
            } else if (o.className == 'Member') {
                return ['qpo4jjDrCc'].indexOf(o.data ? o.userRole.data.id : o.get('userRole').id) >= 0;
            }
        }
        this.allowDeleteRow = function (o) {
            if (o.className == 'UserRole') {
                return ['qpo4jjDrCc'].indexOf(o.data ? o.data.id : o.id) < 0;
            } else {
                return true;
            }
        }
        this.objectIdsForContentSiteUsers = function () {
            return ['qpo4jjDrCc'];
        }
    })
    .service('authencation', function ($state, $cookies, ParseMember, u) {
        this.isAuthencated = function () {
            return $cookies.get('logon') == 1;
        };
        this.login = function (username, password) {
            var loginQuery = new Parse.Query("Member");
            loginQuery.equalTo('username', username);
            loginQuery.equalTo('password', password);
            loginQuery.include('userRole');
            var $d = $.Deferred();
            var find = loginQuery.first();
            find.done(function (result) {
                if (result) {
                    if (u.allowAccessCMS(result)) {
                        $cookies.put('logon', 1);
                        var logonUser = new ParseMember(result);
                        $cookies.put('logonUser.id', logonUser.data.id);
                        $cookies.put('logonUser.username', logonUser.username);
                        $cookies.put('logonUser.userRole.id', logonUser.userRole.data.id);
                        $cookies.put('logonUser.userRole.name', logonUser.userRole.name);
                        $d.resolve(result);
                    } else {
                        $cookies.put('logon', 0);
                        $cookies.put('logonUser.id', '');
                        $cookies.put('logonUser.username', '');
                        $cookies.put('logonUser.userRole.id', '');
                        $cookies.put('logonUser.userRole.name', '');
                        $d.reject(new Parse.Error(0, 'User doesn\'t have access CMS system.'));
                    }
                } else {
                    $cookies.put('logon', 0);
                    $cookies.put('logonUser.id', '');
                    $cookies.put('logonUser.username', '');
                    $cookies.put('logonUser.userRole.id', '');
                    $cookies.put('logonUser.userRole.name', '');
                    $d.reject(new Parse.Error(0, 'Username is not matched with password.'));
                }
            }).fail(function (error) {
                $d.reject(error);
            });
            return $d.promise();
        }
        this.logout = function () {
            $cookies.put('logon', 0);
            $cookies.put('logonUser', undefined);
            $state.go('login');
        };
    })
    .value('ftpBase', "https://store.infradigital.com.my/infradesign/appstore/")
    .value('countries', [
        {
            code: 'AF',
            name: 'Afghanistan'
      }, {
            code: 'AL',
            name: 'Albania'
      }, {
            code: 'DZ',
            name: 'Algeria'
      }, {
            code: 'AS',
            name: 'American Samoa'
      }, {
            code: 'AD',
            name: 'Andorre'
      }, {
            code: 'AO',
            name: 'Angola'
      }, {
            code: 'AI',
            name: 'Anguilla'
      }, {
            code: 'AQ',
            name: 'Antarctica'
      }, {
            code: 'AG',
            name: 'Antigua and Barbuda'
      }, {
            code: 'AR',
            name: 'Argentina'
      }, {
            code: 'AM',
            name: 'Armenia'
      }, {
            code: 'AW',
            name: 'Aruba'
      }, {
            code: 'AU',
            name: 'Australia'
      }, {
            code: 'AT',
            name: 'Austria'
      }, {
            code: 'AZ',
            name: 'Azerbaijan'
      }, {
            code: 'BS',
            name: 'Bahamas'
      }, {
            code: 'BH',
            name: 'Bahrain'
      }, {
            code: 'BD',
            name: 'Bangladesh'
      }, {
            code: 'BB',
            name: 'Barbade'
      }, {
            code: 'BY',
            name: 'Belarus'
      }, {
            code: 'BE',
            name: 'Belgium'
      }, {
            code: 'BZ',
            name: 'Belize'
      }, {
            code: 'BJ',
            name: 'Benin'
      }, {
            code: 'BM',
            name: 'Bermuda'
      }, {
            code: 'BT',
            name: 'Bhutan'
      }, {
            code: 'BO',
            name: 'Bolivia'
      }, {
            code: 'BQ',
            name: 'Bonaire, Sint Eustatius and Saba'
      }, {
            code: 'BA',
            name: 'Bosnia and Herzegovina'
      }, {
            code: 'BW',
            name: 'Botswana'
      }, {
            code: 'BV',
            name: 'Bouvet Island'
      }, {
            code: 'BR',
            name: 'Brazil'
      }, {
            code: 'IO',
            name: 'British Indian Ocean Territory'
      }, {
            code: 'VG',
            name: 'British Virgin Islands'
      }, {
            code: 'BN',
            name: 'Brunei'
      }, {
            code: 'BG',
            name: 'Bulgaria'
      }, {
            code: 'BF',
            name: 'Burkina Faso'
      }, {
            code: 'BI',
            name: 'Burundi'
      }, {
            code: 'KH',
            name: 'Cambodia'
      }, {
            code: 'CM',
            name: 'Cameroon'
      }, {
            code: 'CA',
            name: 'Canada'
      }, {
            code: 'CV',
            name: 'Cape Verde'
      }, {
            code: 'KY',
            name: 'Cayman Islands'
      }, {
            code: 'CF',
            name: 'Central African Republic'
      }, {
            code: 'TD',
            name: 'Chad'
      }, {
            code: 'CL',
            name: 'Chile'
      }, {
            code: 'CN',
            name: 'China'
      }, {
            code: 'CX',
            name: 'Christmas Island'
      }, {
            code: 'CC',
            name: 'Cocos (Keeling) Islands'
      }, {
            code: 'CO',
            name: 'Colombia'
      }, {
            code: 'KM',
            name: 'Comoros'
      }, {
            code: 'CG',
            name: 'Congo'
      }, {
            code: 'CD',
            name: 'Congo (Dem. Rep.)'
      }, {
            code: 'CK',
            name: 'Cook Islands'
      }, {
            code: 'CR',
            name: 'Costa Rica'
      }, {
            code: 'ME',
            name: 'Crna Gora'
      }, {
            code: 'HR',
            name: 'Croatia'
      }, {
            code: 'CU',
            name: 'Cuba'
      }, {
            code: 'CW',
            name: 'Curaçao'
      }, {
            code: 'CY',
            name: 'Cyprus'
      }, {
            code: 'CZ',
            name: 'Czech Republic'
      }, {
            code: 'CI',
            name: "Côte D'Ivoire"
      }, {
            code: 'DK',
            name: 'Denmark'
      }, {
            code: 'DJ',
            name: 'Djibouti'
      }, {
            code: 'DM',
            name: 'Dominica'
      }, {
            code: 'DO',
            name: 'Dominican Republic'
      }, {
            code: 'TL',
            name: 'East Timor'
      }, {
            code: 'EC',
            name: 'Ecuador'
      }, {
            code: 'EG',
            name: 'Egypt'
      }, {
            code: 'SV',
            name: 'El Salvador'
      }, {
            code: 'GQ',
            name: 'Equatorial Guinea'
      }, {
            code: 'ER',
            name: 'Eritrea'
      }, {
            code: 'EE',
            name: 'Estonia'
      }, {
            code: 'ET',
            name: 'Ethiopia'
      }, {
            code: 'FK',
            name: 'Falkland Islands'
      }, {
            code: 'FO',
            name: 'Faroe Islands'
      }, {
            code: 'FJ',
            name: 'Fiji'
      }, {
            code: 'FI',
            name: 'Finland'
      }, {
            code: 'FR',
            name: 'France'
      }, {
            code: 'GF',
            name: 'French Guiana'
      }, {
            code: 'PF',
            name: 'French Polynesia'
      }, {
            code: 'TF',
            name: 'French Southern Territories'
      }, {
            code: 'GA',
            name: 'Gabon'
      }, {
            code: 'GM',
            name: 'Gambia'
      }, {
            code: 'GE',
            name: 'Georgia'
      }, {
            code: 'DE',
            name: 'Germany'
      }, {
            code: 'GH',
            name: 'Ghana'
      }, {
            code: 'GI',
            name: 'Gibraltar'
      }, {
            code: 'GR',
            name: 'Greece'
      }, {
            code: 'GL',
            name: 'Greenland'
      }, {
            code: 'GD',
            name: 'Grenada'
      }, {
            code: 'GP',
            name: 'Guadeloupe'
      }, {
            code: 'GU',
            name: 'Guam'
      }, {
            code: 'GT',
            name: 'Guatemala'
      }, {
            code: 'GG',
            name: 'Guernsey and Alderney'
      }, {
            code: 'GN',
            name: 'Guinea'
      }, {
            code: 'GW',
            name: 'Guinea-Bissau'
      }, {
            code: 'GY',
            name: 'Guyana'
      }, {
            code: 'HT',
            name: 'Haiti'
      }, {
            code: 'HM',
            name: 'Heard and McDonald Islands'
      }, {
            code: 'HN',
            name: 'Honduras'
      }, {
            code: 'HK',
            name: 'Hong Kong'
      }, {
            code: 'HU',
            name: 'Hungary'
      }, {
            code: 'IS',
            name: 'Iceland'
      }, {
            code: 'IN',
            name: 'India'
      }, {
            code: 'ID',
            name: 'Indonesia'
      }, {
            code: 'IR',
            name: 'Iran'
      }, {
            code: 'IQ',
            name: 'Iraq'
      }, {
            code: 'IE',
            name: 'Ireland'
      }, {
            code: 'IM',
            name: 'Isle of Man'
      }, {
            code: 'IL',
            name: 'Israel'
      }, {
            code: 'IT',
            name: 'Italy'
      }, {
            code: 'JM',
            name: 'Jamaica'
      }, {
            code: 'JP',
            name: 'Japan'
      }, {
            code: 'JE',
            name: 'Jersey'
      }, {
            code: 'JO',
            name: 'Jordan'
      }, {
            code: 'KZ',
            name: 'Kazakhstan'
      }, {
            code: 'KE',
            name: 'Kenya'
      }, {
            code: 'KI',
            name: 'Kiribati'
      }, {
            code: 'KP',
            name: 'Korea (North)'
      }, {
            code: 'KR',
            name: 'Korea (South)'
      }, {
            code: 'KW',
            name: 'Kuwait'
      }, {
            code: 'KG',
            name: 'Kyrgyzstan'
      }, {
            code: 'LA',
            name: 'Laos'
      }, {
            code: 'LV',
            name: 'Latvia'
      }, {
            code: 'LB',
            name: 'Lebanon'
      }, {
            code: 'LS',
            name: 'Lesotho'
      }, {
            code: 'LR',
            name: 'Liberia'
      }, {
            code: 'LY',
            name: 'Libya'
      }, {
            code: 'LI',
            name: 'Liechtenstein'
      }, {
            code: 'LT',
            name: 'Lithuania'
      }, {
            code: 'LU',
            name: 'Luxembourg'
      }, {
            code: 'MO',
            name: 'Macao'
      }, {
            code: 'MK',
            name: 'Macedonia'
      }, {
            code: 'MG',
            name: 'Madagascar'
      }, {
            code: 'MW',
            name: 'Malawi'
      }, {
            code: 'MY',
            name: 'Malaysia'
      }, {
            code: 'MV',
            name: 'Maldives'
      }, {
            code: 'ML',
            name: 'Mali'
      }, {
            code: 'MT',
            name: 'Malta'
      }, {
            code: 'MH',
            name: 'Marshall Islands'
      }, {
            code: 'MQ',
            name: 'Martinique'
      }, {
            code: 'MR',
            name: 'Mauritania'
      }, {
            code: 'MU',
            name: 'Mauritius'
      }, {
            code: 'YT',
            name: 'Mayotte'
      }, {
            code: 'MX',
            name: 'Mexico'
      }, {
            code: 'FM',
            name: 'Micronesia'
      }, {
            code: 'MD',
            name: 'Moldova'
      }, {
            code: 'MC',
            name: 'Monaco'
      }, {
            code: 'MN',
            name: 'Mongolia'
      }, {
            code: 'MS',
            name: 'Montserrat'
      }, {
            code: 'MA',
            name: 'Morocco'
      }, {
            code: 'MZ',
            name: 'Mozambique'
      }, {
            code: 'MM',
            name: 'Myanmar'
      }, {
            code: 'NA',
            name: 'Namibia'
      }, {
            code: 'NR',
            name: 'Nauru'
      }, {
            code: 'NP',
            name: 'Nepal'
      }, {
            code: 'NL',
            name: 'Netherlands'
      }, {
            code: 'AN',
            name: 'Netherlands Antilles'
      }, {
            code: 'NC',
            name: 'New Caledonia'
      }, {
            code: 'NZ',
            name: 'New Zealand'
      }, {
            code: 'NI',
            name: 'Nicaragua'
      }, {
            code: 'NE',
            name: 'Niger'
      }, {
            code: 'NG',
            name: 'Nigeria'
      }, {
            code: 'NU',
            name: 'Niue'
      }, {
            code: 'NF',
            name: 'Norfolk Island'
      }, {
            code: 'MP',
            name: 'Northern Mariana Islands'
      }, {
            code: 'NO',
            name: 'Norway'
      }, {
            code: 'OM',
            name: 'Oman'
      }, {
            code: 'PK',
            name: 'Pakistan'
      }, {
            code: 'PW',
            name: 'Palau'
      }, {
            code: 'PS',
            name: 'Palestine'
      }, {
            code: 'PA',
            name: 'Panama'
      }, {
            code: 'PG',
            name: 'Papua New Guinea'
      }, {
            code: 'PY',
            name: 'Paraguay'
      }, {
            code: 'PE',
            name: 'Peru'
      }, {
            code: 'PH',
            name: 'Philippines'
      }, {
            code: 'PN',
            name: 'Pitcairn'
      }, {
            code: 'PL',
            name: 'Poland'
      }, {
            code: 'PT',
            name: 'Portugal'
      }, {
            code: 'PR',
            name: 'Puerto Rico'
      }, {
            code: 'QA',
            name: 'Qatar'
      }, {
            code: 'RO',
            name: 'Romania'
      }, {
            code: 'RU',
            name: 'Russia'
      }, {
            code: 'RW',
            name: 'Rwanda'
      }, {
            code: 'RE',
            name: 'Réunion'
      }, {
            code: 'BL',
            name: 'Saint Barthélemy'
      }, {
            code: 'SH',
            name: 'Saint Helena'
      }, {
            code: 'KN',
            name: 'Saint Kitts and Nevis'
      }, {
            code: 'LC',
            name: 'Saint Lucia'
      }, {
            code: 'MF',
            name: 'Saint Martin'
      }, {
            code: 'PM',
            name: 'Saint Pierre and Miquelon'
      }, {
            code: 'VC',
            name: 'Saint Vincent and the Grenadines'
      }, {
            code: 'WS',
            name: 'Samoa'
      }, {
            code: 'SM',
            name: 'San Marino'
      }, {
            code: 'SA',
            name: 'Saudi Arabia'
      }, {
            code: 'SN',
            name: 'Senegal'
      }, {
            code: 'RS',
            name: 'Serbia'
      }, {
            code: 'SC',
            name: 'Seychelles'
      }, {
            code: 'SL',
            name: 'Sierra Leone'
      }, {
            code: 'SG',
            name: 'Singapore'
      }, {
            code: 'SX',
            name: 'Sint Maarten'
      }, {
            code: 'SK',
            name: 'Slovakia'
      }, {
            code: 'SI',
            name: 'Slovenia'
      }, {
            code: 'SB',
            name: 'Solomon Islands'
      }, {
            code: 'SO',
            name: 'Somalia'
      }, {
            code: 'ZA',
            name: 'South Africa'
      }, {
            code: 'GS',
            name: 'South Georgia and the South Sandwich Islands'
      }, {
            code: 'SS',
            name: 'South Sudan'
      }, {
            code: 'ES',
            name: 'Spain'
      }, {
            code: 'LK',
            name: 'Sri Lanka'
      }, {
            code: 'SD',
            name: 'Sudan'
      }, {
            code: 'SR',
            name: 'Suriname'
      }, {
            code: 'SJ',
            name: 'Svalbard and Jan Mayen'
      }, {
            code: 'SZ',
            name: 'Swaziland'
      }, {
            code: 'SE',
            name: 'Sweden'
      }, {
            code: 'CH',
            name: 'Switzerland'
      }, {
            code: 'SY',
            name: 'Syria'
      }, {
            code: 'ST',
            name: 'São Tomé and Príncipe'
      }, {
            code: 'TW',
            name: 'Taiwan'
      }, {
            code: 'TJ',
            name: 'Tajikistan'
      }, {
            code: 'TZ',
            name: 'Tanzania'
      }, {
            code: 'TH',
            name: 'Thailand'
      }, {
            code: 'TG',
            name: 'Togo'
      }, {
            code: 'TK',
            name: 'Tokelau'
      }, {
            code: 'TO',
            name: 'Tonga'
      }, {
            code: 'TT',
            name: 'Trinidad and Tobago'
      }, {
            code: 'TN',
            name: 'Tunisia'
      }, {
            code: 'TR',
            name: 'Turkey'
      }, {
            code: 'TM',
            name: 'Turkmenistan'
      }, {
            code: 'TC',
            name: 'Turks and Caicos Islands'
      }, {
            code: 'TV',
            name: 'Tuvalu'
      }, {
            code: 'UG',
            name: 'Uganda'
      }, {
            code: 'UA',
            name: 'Ukraine'
      }, {
            code: 'AE',
            name: 'United Arab Emirates'
      }, {
            code: 'GB',
            name: 'United Kingdom'
      }, {
            code: 'UM',
            name: 'United States Minor Outlying Islands'
      }, {
            code: 'US',
            name: 'United States of America'
      }, {
            code: 'UY',
            name: 'Uruguay'
      }, {
            code: 'UZ',
            name: 'Uzbekistan'
      }, {
            code: 'VU',
            name: 'Vanuatu'
      }, {
            code: 'VA',
            name: 'Vatican City'
      }, {
            code: 'VE',
            name: 'Venezuela'
      }, {
            code: 'VN',
            name: 'Vietnam'
      }, {
            code: 'VI',
            name: 'Virgin Islands of the United States'
      }, {
            code: 'WF',
            name: 'Wallis and Futuna'
      }, {
            code: 'EH',
            name: 'Western Sahara'
      }, {
            code: 'YE',
            name: 'Yemen'
      }, {
            code: 'ZM',
            name: 'Zambia'
      }, {
            code: 'ZW',
            name: 'Zimbabwe'
      }, {
            code: 'AX',
            name: 'Åland Islands'
      }
    ])
    .run(function ($rootScope, $state, authencation) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            console.log($state.current.name + '>' + toState.name + ' : ' + authencation.isAuthencated());
            if (toState.name == 'login' && authencation.isAuthencated()) {
                if ($state.current.name != 'index.team-list') {
                    $state.go('index.team-list');
                }
            } else if (toState.name == 'login' && !authencation.isAuthencated()) {

            } else if (toState.name != 'login' && authencation.isAuthencated()) {

            } else if (toState.name != 'login' && !authencation.isAuthencated()) {
                //if ($state.current.name != 'login') {
                $state.go('login');
                //}
            }
        });
    });