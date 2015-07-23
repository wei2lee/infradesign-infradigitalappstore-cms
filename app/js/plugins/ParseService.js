angular.module('ParseServices', [])

.service('ParseSDK', function () {
    //initialize parse
    Parse.initialize("N59sh8HxHKoO6MLT84zWAcQ1gQL3cxiZqBSWU2Bb", "Du9EmhSrxz1lCFUeGF34fc2Ybq5RK6ZJaiQvxKrf");


    this.TeamClassName = "Team";
    this.TeamProperties = ['name', 'defaultCountry', 'createdBy'];
    this.UserRoleClassName = "UserRole";
    this.UserRoleProperties = ['name', 'remarks'];
    this.MemberClassName = "Member";
    this.MemberProperties = ['username', 'fullName', 'country', 'createdBy', 'password', 'lastAccess'];

    this.ClientClassName = "Client";
    this.ClientProperties = ['name', 'email', 'contact', 'createdBy'];
    this.AppClassName = "App";
    this.AppProperties = ['displayname', 'appid', 'name', 'platform', 'internaluse', 'requirement', 'lastupdate', 'logosrc', 'version', 'versionsrc', 'binarysrc', 'plistsrc', 'downloadsrc', 'downloadusername', 'downloadpassword', 'downloadrequireauthencation', 'provisionexpire', 'createdBy'];
})

.factory('ParseQuery', ['$q', '$rootScope', function ($q, $rootScope) {
    return function (query, options) {
        var defer = $q.defer();

        //default function call to find
        var functionToCall = 'find';
        if (options != undefined && options.functionToCall != undefined)
            functionToCall = options.functionToCall;

        console.log(functionToCall, query);

        //wrap defer resolve/reject in $apply so angular updates watch listeners
        var defaultParams = [{
            success: function (data) {
                $rootScope.$apply(function () {
                    defer.resolve(data);
                });
            },
            error: function (data, error) {
                console.log('error:', error);
                $rootScope.$apply(function () {
                    defer.reject(error);
                });
            }
    }];

        //check for additional parameters to add
        if (options && options.params)
            defaultParams = options.params.concat(defaultParams);


        query[functionToCall].apply(query, defaultParams);

        return defer.promise;
    }
}])

.factory('ParseObject', ['ParseQuery', function (ParseQuery) {

        return function (parseData, fields) {

            //verify parameters
            if (parseData == undefined) throw new Error('Missing parseData');
            if (fields == undefined) throw new Error('Missing fields.');

            //internal parse object reference
            var parseObject = parseData;
            var model;

            //instantiate new parse object from string 
            if (typeof parseData == 'string') {
                var ParseModel = Parse.Object.extend(parseData);
                parseObject = new ParseModel();
            }

            //expose underlying parse obejct through data property
            Object.defineProperty(this, 'data', {
                get: function () {
                    return parseObject;
                }
            });

            //add dynamic properties from fields array
            var self = this;
            for (var i = 0; i < fields.length; i++) {
                //add closure
                (function () {
                    var propName = fields[i];
                    Object.defineProperty(self, propName, {
                        get: function () {
                            return parseObject.get(propName);
                        },
                        set: function (value) {
                            parseObject.set(propName, value);
                        }
                    });
                })();
            }

            //instance methods
            this.save = function () {
                return ParseQuery(parseObject, {
                    functionToCall: 'save',
                    params: [null]
                })
            }
            this.delete = function () {
                return ParseQuery(parseObject, {
                    functionToCall: 'destroy'
                });
            }
            this.fetch = function () {
                return ParseQuery(parseObject, {
                    functionToCall: 'fetch'
                });
            }
        };

}])
    .factory('ParseClient', ['ParseObject', 'ParseSDK', function (ParseObject, ParseSDK) {
        return function (parseData) {
            var o = new ParseObject(parseData || ParseSDK.ClientClassName, ParseSDK.ClientProperties);
            o.className = ParseSDK.ClientClassName;

            (function () {
                Object.defineProperty(o, 'appNames', {
                    get: function () {
                        if (!this.apps) return '';
                        else return _.map(this.apps, function (app) {
                            return app.displayname
                        }).join(', ');
                    }
                });
            })();

            return o;
        };
}])
    .factory('ParseApp', ['ParseObject', 'ParseClient', 'ParseSDK', function (ParseObject, ParseClient, ParseSDK) {
        return function (parseData) {
            var o = new ParseObject(parseData || ParseSDK.AppClassName, ParseSDK.AppProperties);
            o.className = ParseSDK.AppClassName;
            (function () {
                Object.defineProperty(o, 'client', {
                    get: function () {
                        if (!this.data.get('client')) return undefined;
                        else return new ParseClient(this.data.get('client'));
                    },
                    set: function (value) {
                        if (!value) this.data.set('client', undefined);
                        else this.data.set('client', value.data);
                    }
                });
            })();
            return o;
        };
}])
    .factory('ParseUserRole', ['ParseObject', 'ParseSDK', function (ParseObject, ParseSDK) {
        return function (parseData) {
            var o = new ParseObject(parseData || ParseSDK.UserRoleClassName, ParseSDK.UserRoleProperties);
            o.className = ParseSDK.UserRoleClassName;
            return o;
        };
}])
    .factory('ParseMember', ['ParseObject', 'ParseUserRole', 'ParseSDK', function (ParseObject, ParseUserRole, ParseSDK) {
        return function (parseData) {
            var o = new ParseObject(parseData || ParseSDK.MemberClassName, ParseSDK.MemberProperties);
            o.className = ParseSDK.MemberClassName;
            (function () {
                Object.defineProperty(o, 'userRole', {
                    get: function () {
                        if (!this.data.get('userRole')) return undefined;
                        else return new ParseUserRole(this.data.get('userRole'));
                    },
                    set: function (value) {
                        if (!value) this.data.set('userRole', undefined);
                        else this.data.set('userRole', value.data);
                    }
                });
            })();
            (function () {
                Object.defineProperty(o, 'team', {
                    get: function () {
                        if (!this.data.get('team')) return undefined;
                        else return new ParseUserRole(this.data.get('team'));
                    },
                    set: function (value) {
                        if (!value) this.data.set('team', undefined);
                        else this.data.set('team', value.data);
                    }
                });
            })();
            return o;
        };
}])
    .factory('ParseTeam', ['ParseObject', 'ParseSDK', function (ParseObject, ParseSDK) {
        return function (parseData) {
            var o = new ParseObject(parseData || ParseSDK.TeamClassName, ParseSDK.TeamProperties);
            o.className = ParseSDK.TeamClassName;
            (function () {
                Object.defineProperty(o, 'memberFullnames', {
                    get: function () {
                        if (!this.members) return '';
                        else return _.map(this.members, function (member) {
                            return member.fullName
                        }).join(', ');
                    }
                });
            })();
            return o;
        };
}])


;