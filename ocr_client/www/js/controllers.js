var requestToken = "";
var accessToken = "";
var refreshToken = "";
var server = " https://gxjfsjaijq.localtunnel.me/api/photo";
var filePath = "";
var clientId = "408107061519-gavm04vvrd5a7gd049eb9pphnlbsoqpk.apps.googleusercontent.com";
var clientSecret = "53htzkKzHsx7P6EKqchW3VLA";
angular.module('starter.controllers', []).controller('AppCtrl', function($scope, $ionicModal, $timeout,$cordovaCamera,$location) {
    // Form data for the login modal
    $scope.loginData = {};
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };
    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };
    $scope.takpic = function() {
        console.log('Getting camera');

        $cordovaCamera.getPicture({
            quality: 95,
            targetWidth: 500,
            targetHeight: 700,
            correctOrientation: true,
            saveToPhotoAlbum: false,
            allowEdit: true,
            destinationType: Camera.DestinationType.FILE_URI
        }).then(function(imageData) {
            $scope.lastPhoto = imageData;
              $location.path("/app/preview");
        }, false);
    },
    function(err) {
        console.err(err);
    };
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
}).controller('PlaylistsCtrl', function($scope) {
    $scope.playlists = [{
        title: 'Reggae',
        id: 1
    }, {
        title: 'Chill',
        id: 2
    }, {
        title: 'Dubstep',
        id: 3
    }, {
        title: 'Indie',
        id: 4
    }, {
        title: 'Rap',
        id: 5
    }, {
        title: 'Cowbell',
        id: 6
    }];
}).controller('PlaylistCtrl', function($scope, $stateParams) {}).controller('Oauth2Controller', function($scope, $state, $stateParams, $cordovaOauth) {
    $scope.login = function() {
        $cordovaOauth.google(clientId, ["email"]).then(function(result) {
            console.log(result);
            $state.go('app.camera');
        }, function(error) {
            console.log(error);
        });
    }
}).controller('CameraController', function($scope, cloudStorage, $stateParams, $location, $ionicLoading, $ionicPlatform, $cordovaCamera, $cordovaFileTransfer) {
    $scope.takpic = function() {
        console.log('Getting camera');
        $scope.loadingIndicator = $ionicLoading.show({
            content: 'Loading Data',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 500,
            // template: ''
            templateUrl: "templates/loading.html"
        });
        $cordovaCamera.getPicture({
            quality: 95,
            targetWidth: 500,
            targetHeight: 700,
            correctOrientation: true,
            saveToPhotoAlbum: false,
            allowEdit: true,
            destinationType: Camera.DestinationType.FILE_URI
        }).then(function(imageData) {
            $scope.lastPhoto = imageData;
            $location.path("/preview");
            var promise = cloudStorage.uploadImage();
            promise.then(function(id) {
                $scope.bucketName = id;
                $ionicLoading.hide();
            }, function(reason) {
                alert('Failed: ' + reason);
            }, function(update) {
                alert('Got notification: ' + update);
            });
        }, false);
    },
    function(err) {
        console.err(err);
    };
}).controller('PreviewController', function($scope, $stateParams) {


    
}).factory('cloudStorage', function($http, $q) {
    return {
        uploadImage: function(scope) {
            return $q(function(resolve, reject) {
                storageUrl = "http=//storage.googleapis.com/";
                OAuthTokenUrl = "https=//www.googleapis.com/oauth2/v3/token";
                PROJECT = 'ocr-reader';
                API_VERSION = 'v1';
                client_id = '408107061519-gavm04vvrd5a7gd049eb9pphnlbsoqpk.apps.googleusercontent.com';
                apiKey = 'AIzaSyA2yKehqV5296cVMEl_4cBZizYb8LeThtQ';
                scopes = 'https=//www.googleapis.com/auth/devstorage.full_control';
                GROUP = 'group-00b4903a97e9044550fb2523ac838375db9fca182dbe778d84b1c0a027075b8f';
                ROLE = 'READER';
                object = "";
                BUCKET = 'ocr-images';
                ROLE_OBJECT = 'READER';
                ENTITY = 'allUsers';
                client_secret: "53htzkKzHsx7P6EKqchW3VLA";
                var refreshToken = '1/S-1R4m4AO_llhSd5_yv4-a15xFAai7RW7z6j1XFxOk8MEudVrK5jSpoR30zcRFq6';
                $http({
                    method: "post",
                    url: "https://accounts.google.com/o/oauth2/token",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&refresh_token=" + refreshToken + "&grant_type=refresh_token"
                }).success(function(data) {
                    accessToken = data.access_token;
                    gapi.auth.setToken({
                        access_token: accessToken
                    });
                    gapi.client.load('storage', API_VERSION).then(function() {
                        var request = gapi.client.storage.buckets.list({
                            'project': PROJECT
                        });
                        request.execute(function(resp) {
                            resolve(JSON.stringify(resp.items[0]));
                        });
                    });;
                }).error(function(data, status) {
                    reject(data);
                });
            });
        }
    }
});