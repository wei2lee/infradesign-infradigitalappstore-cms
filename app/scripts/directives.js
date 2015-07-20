/**
 * INSPINIA - Responsive Admin Theme
 *
 */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function (scope, element) {
            var listener = function (event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'INSPINIA | Responsive Admin Theme';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'INSPINIA | ' + toState.data.pageTitle;
                $timeout(function () {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function () {
                element.metisMenu();
            });
        }
    };
};

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(200);
                    // Toggle icon from up to down
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function () {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                },
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
        }
    };
};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 100);
                } else if ($('body').hasClass('fixed-sidebar')) {
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 300);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
function dropZone() {
    return function (scope, element, attrs) {
        element.dropzone({
            url: "/upload",
            addRemoveLinks: true,
            autoProcessQueue: false,
            maxFiles: attrs.maxfiles,
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: attrs.maxfiles,
            dictDefaultMessage: '',
            init: function () {
                var _this = this;
                if (attrs.id) {
                    if (scope[attrs.id]) {
                        _.each(scope[attrs.id], function (mockFile) {
                            _this.emit("addedfile", mockFile);
                            _this.emit("thumbnail", mockFile, mockFile.url);
                            _this.emit("complete", mockFile);
                        });
                    } else {
                        scope[attrs.id] = [];
                        var initwatch = scope.$watch(attrs.id, function (newval, oldval) {
                            if ((!oldval || oldval.length == 0) && (newval && newval.length > 0)) {
                                _.each(newval, function (mockFile) {
                                    _this.emit("addedfile", mockFile);
                                    _this.emit("thumbnail", mockFile, mockFile.url);
                                    _this.emit("complete", mockFile);
                                });
                                initwatch();
                            }
                        });
                    }
                } else {
                    alert('dropzone directive must have id');
                    return;
                }
                this.on('success', function (file, json) {});

                this.on('maxfilesexceeded', function (file) {
                    _this.removeFile(file);
                });

                this.on('sending', function (file, xhr, formData) {

                });

                function replaceAll(find, replace, str) {
                    return str.replace(new RegExp(find, 'g'), replace);
                }

                this.on('addedfile', function (file) {
                    if (scope[attrs.id].length + 1 > attrs.maxfiles) {
                        return;
                    } else if (file.url) {
                        return;
                    }
                    console.log('addedfile');
                    console.log(file);
                    console.log(file.name);

                    var parseFile = new Parse.File(file.name, file);
                    parseFile.save().done(function (result) {
                        scope[attrs.id].push({
                            url: parseFile.url(),
                            name: file.name,
                            size: file.size
                        });
                    }).fail(function (error) {
                        if (scope.onDropZoneFileUploadError) {
                            if (error.code == Parse.Error.INVALID_FILE_NAME) {
                                error.message += " file name can only contain character set in a-zA-Z0-9_";
                            }
                            scope.onDropZoneFileUploadError(error);
                        }

                        _this.removeFile(file);
                    });
                });
                this.on('drop', function (file) {
                    console.log('drop');
                });

                this.on('removedfile', function (file) {
                    console.log('removedfile');
                    var index = -1;
                    for (i = 0; i < scope[attrs.id].length; i++) {
                        if (scope[attrs.id][i].url == file.url) {
                            index = i;
                            break;
                        }
                    }
                    if (index >= 0) {
                        scope[attrs.id].splice(index, 1);
                    }
                });
            }
        });
    }
}

/**
 * fitHeight - Directive for set height fit to window height
 */
function fitHeight() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.css("height", $(window).height() + "px");
            element.css("min-height", $(window).height() + "px");
        }
    };
}

/**
 *
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('dropZone', dropZone);