/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */

function MainCtrl($state, $cookies) {
    var _this = this;
    this.$state = $state;
    this.userName = $cookies.get('logonUser.username');
    this.userClass = $cookies.get('logonUser.userRole.name');
    this.userAvatar = 'img/avatar.png';
}

function TopNavBarCtrl(authencation) {
    this.authencation = authencation;
}

function LoginCtrl($scope, authencation, $modal, $timeout, $state, ParseSDK, modalalert) {
    var _this = this;
    this.login = function () {
        modalalert.openLoading(_this, 'Login...');
        modalalert.closeAlert(_this);
        authencation.login($scope.userName, $scope.password).done(function (result) {
            $state.go('index.team-list');
            Parse.Cloud.run('afterLogin', {
                objectId: result.id
            });
        }).fail(function (error) {
            modalalert.openAlertWithError(_this, 'danger', 'Fail', error);
        }).always(function () {
            modalalert.closeLoading(_this);
        });
    }
}

function ClientListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseClient, ParseApp, $rootScope, $state, modalalert, countries, $timeout) {
    var _this = this;
    this.clients = [];
    this.delete = function (client) {
        var indexOf = _this.clients.indexOf(client);
        _this.clients.splice(indexOf, 1);
        client.data.destroy().fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (client) {
        $rootScope.editClient = client;
        $state.go('index.client-edit', {
            objectId: client.data.id
        });
    };

    var clientQuery = new Parse.Query(new ParseClient().className);
    clientQuery.find().done(function (result) {
        _this.clients = _.map(result, function (o) {
            o = new ParseClient(o);
            return o;
        });
        var appQuery = new Parse.Query(new ParseApp().className);
        return appQuery.find();
    }).done(function (result) {
        _this.apps = _.map(result, function (o) {
            return new ParseApp(o);
        });
        _.each(_this.clients, function (client) {
            client.apps = _.filter(_this.apps, function (app) {
                return app.client && app.client.data.id == client.data.id;
            });
        });
    }).fail(function (error) {
        modalalert.openAlertWithError(_this, error);
    }).always(function () {
        $scope.$apply();
    });
}

function ClientCreateEditCtrl($scope, ParseClient, $rootScope, $state, $stateParams, $timeout, modalalert) {
    var _this = this;
    this.isEdit = $state.current.name.indexOf("client-edit") >= 0;
    this.delete = function () {
        modalalert.openLoading(_this, 'Deleting...');
        modalalert.closeAlert(_this);
        this.client.data.destroy().done(function (result) {
            $state.go('index.client-list');
        }).fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            modalalert.closeLoading(_this);
            $scope.$apply();
        });
    }
    this.save = function () {
        modalalert.openLoading(_this, 'Saving...');
        modalalert.closeAlert(_this);
        this.client.data.save().done(function (result) {
            var client = new ParseClient(result);
            modalalert.openAlert(_this, {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + client.name + ' is saved to the system.' : 'New record ' + client.name + ' is added to the system.',
                type: 'success'
            });
            if (!_this.isEdit) {
                _this.client = new ParseClient();
                $scope.form.$setPristine();
                $scope.$apply();
            }
        }).fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            modalalert.closeLoading(_this);
            $scope.$apply();
        });
    }

    var fetch = null;
    if (this.isEdit) {
        if ($rootScope.editClient) {
            fetch = Parse.Promise.as($rootScope.editClient.data);
        } else {
            var item = new ParseClient();
            item.data.id = $stateParams.objectId;
            fetch = item.data.fetch()
        }
    } else {
        fetch = Parse.Promise.as(new ParseClient().data);
    }
    fetch.done(function (result) {
        _this.client = new ParseClient(result);
    }).fail(function (error) {
        modalalert.openAlertWithError(_this, error);
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });
    });
}


function AppListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseApp, ParseClient, $rootScope, $state, $stateParams, $timeout, modalalert) {
    var _this = this;
    this.apps = [];
    this.client = null;
    this.delete = function (app) {
        var indexOf = _this.client.apps.indexOf(app);
        _this.client.apps.splice(indexOf, 1);
        app.data.destroy().fail(function (error) {
            modalalert.openAlertWithError(_this, error);
            console.log(error.message);
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (client, app) {
        $rootScope.editClient = client;
        $rootScope.editApp = app;
        $state.go('index.app-edit', {
            clientId: client.data.id,
            objectId: app.data.id
        });
    };

    var fetchClient = null;
    var fetchApps = null;
    if ($rootScope.editClient) {
        fetchClient = Parse.Promise.as($rootScope.editClient.data);
        var appQuery = new Parse.Query(new ParseApp().className);
        appQuery.include('client');
        fetchApps = appQuery.find();
    } else {
        var item = new ParseClient();
        item.data.id = $stateParams.objectId;
        fetchClient = item.data.fetch()

        var appQuery = new Parse.Query(new ParseApp().className);
        appQuery.include('client');
        fetchApps = appQuery.find();
    }

    Parse.Promise.when(fetchClient, fetchApps).done(function (client, apps) {
        _this.client = new ParseClient(client);
        _this.apps = _.map(apps, function (o) {
            return new ParseApp(o);
        });
        console.log(_this.apps);
        _this.apps = _.filter(_this.apps, function (o) {
            return o.client && o.client.data.id == $stateParams.objectId;
        });
        _this.client.apps = _this.apps;
    }).fail(function (error) {
        modalalert.openAlertWithError(_this, error);
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });
    });
}


function AppCreateEditCtrl(ftpBase, $scope, ParseApp, ParseClient, $modal, $rootScope, $state, $stateParams, $timeout, u, modalalert, $http, Upload) {
    var _this = this;
    this.isEdit = $state.current.name.indexOf("app-edit") >= 0;
    this.client = $rootScope.editClient;
    this.base = ftpBase;
    this.versionsrcuploadfiles = [];

    this.save = function () {
        modalalert.openLoading(_this, 'Saving...');
        modalalert.closeAlert(_this);
        this.app.data.save().done(function (result) {
            var app = new ParseApp(result);
            modalalert.openAlert(_this, {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + app.name + ' is saved to the system.' : 'New record ' + app.name + ' is added to the system.',
                type: 'success'
            });
            if (!_this.isEdit) {
                _this.app = new ParseApp();
                $scope.form.$setPristine();
                $scope.$apply();
            }
            
            $.post('resources/upload_versionsrc.php', {
                'versionsrcname': _this.versionsrcname(_this.app),
                'versioncontent': _this.versioncontent(_this.app),
                'versionsrcdir': _this.versionsrcdir(_this.app)
            }).done(function(result){
                //console.log(result);
            }).fail(function(error){
                $timeout(function(){
                    modalalert.openAlertWithError(_this, 'danger', 'Fail', error);
                });
            });
        }).fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            modalalert.closeLoading(_this);
            $scope.$apply();
        });
    }

    var fetchClient = null;
    var fetchApp = null;
    if (this.isEdit) {
        if ($rootScope.editClient) {
            fetchClient = Parse.Promise.as($rootScope.editClient.data);
        } else {
            var item = new ParseClient();
            item.data.id = $stateParams.clientId;
            fetchClient = item.data.fetch()
        }
        if ($rootScope.editApp) {
            fetchApp = Parse.Promise.as($rootScope.editApp.data);
        } else {
            var item = new ParseApp();
            item.data.id = $stateParams.objectId;
            fetchApp = item.data.fetch()
        }
    } else {
        if ($rootScope.editClient) {
            fetchClient = Parse.Promise.as($rootScope.editClient.data);
        } else {
            var item = new ParseClient();
            item.data.id = $stateParams.clientId;
            fetchClient = item.data.fetch()
        }
        fetchApp = Parse.Promise.as(new ParseApp().data);
    }

    Parse.Promise.when(fetchClient, fetchApp).done(function (client, app) {
        _this.client = new ParseClient(client);
        _this.app = new ParseApp(app);
        _this.app.client = _this.client;
    }).fail(function (error) {
        modalalert.openAlertWithError(_this, error);
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });
    });

    this.onlogoupload = function (files) {
        if (files.length == 0) return;
        var parseFile = new Parse.File(files[0].name, files[0]);
        _this.app.logosrc = '';
        parseFile.save().done(function (result) {
            $timeout(function () {
                _this.app.logosrc = result.url();
            });
        }).fail(function (error) {
            if (error.code == Parse.Error.INVALID_FILE_NAME) {
                error.message += " file name can only contain character set in a-zA-Z0-9_";
            }
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            $scope.$apply();
        });
    };

    this.parseversionsrc = function (data, data2) {
        if (_this.app && _this.app.client && _this.app.platform == 'ios') {
            plist = new PlistParser(data);
            result = plist.parse();
            var ver = result.items[0].metadata['bundle-version'];
            _this.app.version = ver;
            if (typeof data2 == 'function') {
                var lastmodifieddate = data2()['last-modified'];
                var parseddate = new Date(lastmodifieddate);
                _this.app.lastupdate = parseddate;
            } else {
                var lastmodifieddate = data2.lastModifiedDate;
                var parseddate = new Date(lastmodifieddate);
                _this.app.lastupdate = parseddate;
            }
        } else if (_this.app && _this.app.client && _this.app.platform == 'android') {
            var ver = data;
            _this.app.version = ver;
            if (typeof data2 == 'function') {
                console.log(data2());
                var lastmodifieddate = data2()['last-modified'];
                var parseddate = new Date(lastmodifieddate);
                _this.app.lastupdate = parseddate;
            } else {
                var lastmodifieddate = data2.lastModifiedDate;
                var parseddate = new Date(lastmodifieddate);
                _this.app.lastupdate = parseddate;
            }
        } else {
            return '';
        }
    };

    this.onversionsrcupload = function (files) {
        if (files[0]) {
            _this.versionsrcuploadfiles = files;
            var fr = new FileReader();
            fr.onload = function () {
                $timeout(function () {
                    _this.parseversionsrc(fr.result, files[0]);
                });
            };
            fr.readAsText(files[0]);
        }
    }
    this.onversionsrcurl = function (data) {
        if (_this.app && _this.app.client && _this.app.platform == 'ios') {
            $http.get(_this.versionsrc(_this.app)).
            success(function (data, status, headers, config) {
                _this.parseversionsrc(data, headers);
            }).
            error(function (data, status, headers, config) {
                modalalert.openAlert(_this, {
                    title: 'Fail',
                    message: 'Download version src fail',
                    type: 'danger'
                });
            });
        } else if (_this.app && _this.app.client && _this.app.platform == 'android') {
            $http.get(_this.versionsrc(_this.app)).
            success(function (data, status, headers, config) {
                _this.parseversionsrc(data, headers);
            }).
            error(function (data, status, headers, config) {
                modalalert.openAlert(_this, {
                    title: 'Fail',
                    message: 'Download version src fail',
                    type: 'danger'
                });
            });
        } else {
            return '';
        }
    }

    this.onprovisionexpireupload = function (files) {
        if (files.length == 0) return;
        var fr = new FileReader();
        fr.onload = function () {
            $timeout(function () {
                var splits = fr.result.split("\n");
                var j = 0;
                for (k in splits) {
                    var split = splits[k];
                    if (split.indexOf("<key>ExpirationDate</key>") >= 0) {
                        var m = splits[j + 1].match(/<date>(.+?)<\/date>/);
                        _this.app.provisionexpire = new Date(m[1]);
                        break;
                    }
                    j++;
                }
            });
        };
        fr.readAsText(files[0]);
    };

    this.appid = function (app) {
        if (app && app.client) {
            return 'com.' + app.client.name + '.' + app.name;
        } else {
            return '';
        }
    }

    this.binarysrc = function (app) {
        if (app && app.client) {
            return _this.base + app.client.name + '/' + app.name + '/' + app.client.name + '_' + app.name + '.' + (app.platform == 'ios' ? 'ipa' : 'apk');
        } else {
            return '';
        }
    }

    this.plistsrc = function (app) {
        if (app && app.client && app.platform == 'ios') {
            return _this.base + app.client.name + '/' + app.name + '/' + app.client.name + '_' + app.name + '.' + 'plist';
        } else {
            return '';
        }
    }

    this.plistcontent = function (app) {
        if (app && app.client && app.platform == 'ios') {
            var str =


                "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n" +
                "<plist version=\"1.0\">\n" +
                "<dict>\n" +
                "	<key>items</key>\n" +
                "	<array>\n" +
                "		<dict>\n" +
                "			<key>assets</key>\n" +
                "			<array>\n" +
                "				<dict>\n" +
                "					<key>kind</key>\n" +
                "					<string>software-package</string>\n" +
                "					<key>url</key>\n" +
                "					<string>" + _this.app.binarysrc + "</string>\n" +
                "				</dict>\n" +
                "			</array>\n" +
                "			<key>metadata</key>\n" +
                "			<dict>\n" +
                "				<key>bundle-identifier</key>\n" +
                "				<string>" + _this.app.appid + "</string>\n" +
                "				<key>bundle-version</key>\n" +
                "				<string>" + _this.app.version + "</string>\n" +
                "				<key>kind</key>\n" +
                "				<string>software</string>\n" +
                "				<key>title</key>\n" +
                "				<string>" + _this.app.displayname + "</string>\n" +
                "			</dict>\n" +
                "		</dict>\n" +
                "	</array>\n" +
                "</dict>\n" +
                "</plist>";

            return str;



        } else {
            return '';
        }
    }

    this.downloadsrc = function (app) {
        if (app && app.client && app.platform == 'ios') {
            return 'itms-services://?action=download-manifest&url=' + _this.plistsrc(app);
        } else if (app && app.client && app.platform == 'android') {
            return _this.binarysrc(app);
        } else {
            return '';
        }
    }
    this.versionsrc = function (app) {
        if (app && app.client && app.platform == 'ios') {
            return _this.plistsrc(app);
        } else if (app && app.client && app.platform == 'android') {
            return _this.base + app.client.name + '/' + app.name + '/' + app.client.name + '_' + app.name + '.' + 'txt';
        } else {
            return '';
        }
    }

    this.versionsrcdir = function (app) {
        if (app && app.client) {
            return app.client.name + '/' + app.name;
            return '';
        }
    }

    this.versionsrcname = function (app) {
        if (app && app.client && app.platform == 'ios') {
            return app.client.name + '_' + app.name + '.' + 'plist';
        } else if (app && app.client && app.platform == 'android') {
            return app.client.name + '_' + app.name + '.' + 'txt';
        } else {
            return '';
        }
    }

    this.versioncontent = function (app) {
        if (app && app.client && app.platform == 'ios' && app.version) {
            return _this.plistcontent(app);
        } else if (app && app.client && app.platform == 'android' && app.version) {
            return app.version;
        } else {
            return '';
        }
    }

    this.version = function (app) {
        return app.version;
    }

    $scope.$watchGroup(['controller.app.platform', 'controller.app.name', 'controller.autobinarysrc', 'controller.app.displayname'], function (newvals, oldvals) {
        var platform = newvals[0];
        var name = newvals[1];
        var autobinarysrc = newvals[2];
        var displayname = newvals[3];
        if (platform && name) {
            _this.app.binarysrc = _this.binarysrc(_this.app);
        }
        if (name) {
            _this.app.versionsrc = _this.versionsrc(_this.app);
        }
        if (name) {
            _this.app.appid = _this.appid(_this.app);
        }
        if (platform && name) {
            _this.app.downloadsrc = _this.downloadsrc(_this.app);
        }
    });
}



function TeamListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseTeam, ParseMember, ParseUserRole, $rootScope, $state, modalalert, countries, $timeout) {
    var _this = this;
    this.teams = [];
    this.delete = function (team) {
        var indexOf = _this.teams.indexOf(team);
        _this.teams.splice(indexOf, 1);
        team.data.destroy().fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (team) {
        $rootScope.editTeam = team;
        $state.go('index.team-edit', {
            objectId: team.data.id
        });
    };

    var teamQuery = new Parse.Query(new ParseTeam().className);
    teamQuery.find().done(function (result) {
        _this.teams = _.map(result, function (o) {
            o = new ParseTeam(o);
            return o;
        });
        var userQuery = new Parse.Query("Member");
        return userQuery.find();
    }).done(function (result) {
        _this.users = _.map(result, function (o) {
            return new ParseMember(o);
        });
        _.each(_this.teams, function (team) {
            team.members = _.filter(_this.users, function (user) {
                return user.team && user.team.data.id == team.data.id;
            });
        });
    }).fail(function (error) {
        modalalert.openAlertWithError(_this, error);
    }).always(function () {
        $scope.$apply();
    });

    this.countryCodeToName = function (code) {
        var find = _.where(countries, {
            'code': code
        });
        return find.length ? find[0].name : '';
    }
}

function TeamCreateEditCtrl($scope, ParseTeam, $rootScope, $state, $stateParams, $timeout, modalalert) {
    var _this = this;
    this.isEdit = $state.current.name.indexOf("team-edit") >= 0;
    this.delete = function () {
        modalalert.openLoading(_this, 'Deleting...');
        modalalert.closeAlert(_this);
        this.team.data.destroy().done(function (result) {
            $state.go('index.team-list');
        }).fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            modalalert.closeLoading(_this);
            $scope.$apply();
        });
    }
    this.save = function () {
        modalalert.openLoading(_this, 'Saving...');
        modalalert.closeAlert(_this);
        this.team.data.save().done(function (result) {
            var team = new ParseTeam(result);
            modalalert.openAlert(_this, {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + team.name + ' is saved to the system.' : 'New record ' + team.name + ' is added to the system.',
                type: 'success'
            });
            if (!_this.isEdit) {
                _this.team = new ParseTeam();
                $scope.form.$setPristine();
                if (!_this.team.defaultCountry) _this.team.defaultCountry = 'MY';
                $scope.$apply();
            }
        }).fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            modalalert.closeLoading(_this);
            $scope.$apply();
        });
    }

    var fetch = null;
    if (this.isEdit) {
        if ($rootScope.editTeam) {
            fetch = Parse.Promise.as($rootScope.editTeam.data);
        } else {
            var item = new ParseTeam();
            item.data.id = $stateParams.objectId;
            fetch = item.data.fetch()
        }
    } else {
        fetch = Parse.Promise.as(new ParseTeam().data);
    }
    fetch.done(function (result) {
        _this.team = new ParseTeam(result);
        if (!_this.team.defaultCountry) _this.team.defaultCountry = 'MY';
    }).fail(function (error) {
        modalalert.openAlertWithError(_this, error);
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });
    });
}

function MemberListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseMember, ParseUserRole, ParseTeam, $rootScope, $state, $stateParams, $timeout, modalalert) {
    var _this = this;
    this.users = [];
    this.team = null;
    this.delete = function (user) {
        var indexOf = _this.team.members.indexOf(user);
        _this.team.members.splice(indexOf, 1);
        user.data.destroy().fail(function (error) {
            modalalert.openAlertWithError(_this, error);
            console.log(error.message);
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (team, user) {
        $rootScope.editTeam = team;
        $rootScope.editUser = user;
        $state.go('index.user-edit', {
            teamId: team.data.id,
            objectId: user.data.id
        });
    };

    var fetchTeam = null;
    var fetchUsers = null;
    if ($rootScope.editTeam) {
        fetchTeam = Parse.Promise.as($rootScope.editTeam.data);
        var userQuery = new Parse.Query("Member");
        userQuery.include('userRole');
        fetchUsers = userQuery.find();
    } else {
        var item = new ParseTeam();
        item.data.id = $stateParams.objectId;
        fetchTeam = item.data.fetch()

        var userQuery = new Parse.Query("Member");
        userQuery.include('userRole');
        fetchUsers = userQuery.find();
    }

    Parse.Promise.when(fetchTeam, fetchUsers).done(function (team, users) {
        _this.team = new ParseTeam(team);
        _this.users = _.map(users, function (o) {
            return new ParseMember(o);
        });
        console.log(_this.users);
        _this.users = _.filter(_this.users, function (o) {
            return o.team && o.team.data.id == $stateParams.objectId;
        });
        _this.team.members = _this.users;
    }).fail(function (error) {
        modalalert.openAlertWithError(_this, error);
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });
    });
}


function UserCreateEditCtrl($scope, ParseMember, ParseUserRole, ParseTeam, $modal, $rootScope, $state, $stateParams, $timeout, u, modalalert) {
    var _this = this;
    this.isEdit = $state.current.name.indexOf("user-edit") >= 0;
    this.roles = [];
    this.userRole = null;
    this.team = $rootScope.editTeam;



    this.delete = function () {
        modalalert.openLoading(_this, 'Deleting...');
        modalalert.closeAlert(_this);
        this.user.data.destroy().done(function (result) {
            $state.go('index.team-edit', {
                objectId: _this.team.data.id
            });
        }).fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            $loading.dismiss('cancel');
            $scope.$apply();
        });
    }


    this.save = function () {
        _this.user.userRole = _this.userRole;
        modalalert.openLoading(_this, 'Saving...');
        modalalert.closeAlert(_this);
        this.user.data.save().done(function (result) {
            var user = new ParseMember(result);
            modalalert.openAlert(_this, {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + user.username + ' is saved to the system.' : 'New record ' + user.username + ' is added to the system.',
                type: 'success'
            });
            if (!_this.isEdit) {
                _this.user = new ParseMember();
                _this.userRole = _this.user.userRole;
                _this.user.country = _this.team.defaultCountry;
                $scope.form.$setPristine();
                $scope.$apply();
            }
        }).fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            modalalert.closeLoading(_this);
            $scope.$apply();
        });
    }

    var fetchTeam = null;
    var fetchUser = null;
    var fetchRoles = null;
    if (this.isEdit) {
        if ($rootScope.editTeam) {
            fetchTeam = Parse.Promise.as($rootScope.editTeam.data);
        } else {
            var item = new ParseTeam();
            item.data.id = $stateParams.teamId;
            fetchTeam = item.data.fetch()
        }
        if ($rootScope.editUser) {
            fetchUser = Parse.Promise.as($rootScope.editUser.data);
        } else {
            var item = new ParseMember();
            item.data.id = $stateParams.objectId;
            fetchUser = item.data.fetch()
        }
    } else {
        if ($rootScope.editTeam) {
            fetchTeam = Parse.Promise.as($rootScope.editTeam.data);
        } else {
            var item = new ParseTeam();
            item.data.id = $stateParams.teamId;
            fetchTeam = item.data.fetch()
        }
        fetchUser = Parse.Promise.as(new ParseMember().data);
    }
    var fetchRoleQuery = new Parse.Query("UserRole");
    fetchRoleQuery.containedIn('objectId', u.objectIdsForContentSiteUsers());
    fetchRoles = fetchRoleQuery.find();

    Parse.Promise.when(fetchTeam, fetchUser, fetchRoles).done(function (team, user, roles) {
        _this.team = new ParseTeam(team);
        _this.user = new ParseMember(user);
        _this.user.team = _this.team;
        if (!_this.user.country) _this.user.country = _this.team.defaultCountry || 'MY';
        _this.roles = _.map(roles, function (o) {
            return new ParseUserRole(o);
        });
        _this.userRole = _this.user.userRole;
    }).fail(function (error) {
        modalalert.openAlertWithError(_this, error);
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });


    });
}




function RoleListCtrl($scope, DTOptionsBuilder, DTColumnDefBuilder, ParseUserRole, $rootScope, $state, $stateParams, u, modalalert) {
    var _this = this;
    this.roles = [];
    this.delete = function (role) {
        var indexOf = _this.roles.indexOf(role);
        _this.roles.splice(indexOf, 1);
        role.data.destroy().fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            $scope.$apply();
        });
    };

    this.edit = function (role) {
        $rootScope.editRole = role;
        $state.go('index.role-edit', {
            objectId: role.data.id
        });
    };

    var roleQuery = new Parse.Query("UserRole");
    roleQuery.find().done(function (result) {
        _this.roles = _.map(result, function (o) {
            o = new ParseUserRole(o);
            o.allowDeleteRow = u.allowDeleteRow(o);
            return o;
        });
    }).fail(function (error) {
        modalalert.openAlertWithError(_this, error);
    }).always(function () {
        $scope.$apply();
    });
}

function RoleCreateEditCtrl($scope, ParseUserRole, $modal, $rootScope, $state, $stateParams, $timeout, u, modalalert) {
    var _this = this;
    this.isEdit = $state.current.name.indexOf("role-edit") >= 0;

    this.delete = function () {
        modalalert.openLoading(_this, 'Deleting...');
        modalalert.closeAlert(_this);
        this.role.data.destroy().done(function (result) {
            $state.go('index.role-list');
        }).fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            modalalert.closeLoading(_this);
            $scope.$apply();
        });
    }

    this.save = function () {
        modalalert.openLoading(_this, 'Saving...');
        modalalert.closeAlert(_this);
        _this.role.data.save().done(function (result) {
            var role = new ParseUserRole(result);
            modalalert.openAlert(_this, {
                title: 'Success',
                message: _this.isEdit ? 'Record ' + role.name + ' is saved to the system.' : 'New record ' + role.name + ' is added to the system.',
                type: 'success'
            });
            if (!_this.isEdit) {
                _this.role = new ParseUserRole();
                $scope.form.$setPristine();
                $scope.$apply();
            }
        }).fail(function (error) {
            modalalert.openAlertWithError(_this, error);
        }).always(function () {
            modalalert.closeLoading(_this);
            $scope.$apply();
        });
    }

    var fetch = null;
    if (this.isEdit) {
        if ($rootScope.editRole) {
            fetch = Parse.Promise.as($rootScope.editRole.data);
        } else {
            var item = new ParseUserRole();
            item.data.id = $stateParams.objectId;
            fetch = item.data.fetch()
        }
    } else {
        fetch = Parse.Promise.as(new ParseUserRole().data);
    }
    fetch.done(function (result) {
        _this.role = new ParseUserRole(result);
        _this.role.allowDeleteRow = u.allowDeleteRow(_this.role);
    }).fail(function (error) {
        modalalert.openAlertWithError(_this, error);
    }).always(function () {
        $timeout(function () {
            $scope.$apply();
        });
    });
}

function ModalInstanceCtrl($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)
    .controller('TopNavBarCtrl', TopNavBarCtrl)
    .controller('LoginCtrl', LoginCtrl)
    .controller('MemberListCtrl', MemberListCtrl)
    .controller('UserCreateEditCtrl', UserCreateEditCtrl)
    .controller('TeamListCtrl', TeamListCtrl)
    .controller('TeamCreateEditCtrl', TeamCreateEditCtrl)
    .controller('ClientCreateEditCtrl', ClientCreateEditCtrl)
    .controller('ClientListCtrl', ClientListCtrl)
    .controller('AppCreateEditCtrl', AppCreateEditCtrl)
    .controller('AppListCtrl', AppListCtrl)
    .controller('RoleCreateEditCtrl', RoleCreateEditCtrl)
    .controller('RoleListCtrl', RoleListCtrl);