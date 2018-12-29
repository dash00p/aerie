app.controller("registryCtrl", function($scope, $http) {
    $http.get(`${bot_url}/registry/channel/all`).then( res => {
        $scope.channels = res.data;
    });

    $scope.showInitialPost = channelId => {
        $http.get(`${bot_url}/registry/channel/${channelId}/firstPost`).then( res => {
            $scope.message = res.data;
            $scope.selectedChannel = channelId;
            $('#messageModal').modal('show')
        });
    }

    $scope.updateInitialPost = () => {
        $http.post(`${bot_url}/registry/message/${$scope.message.id}`, {text:$scope.message.content, channelNumber: $scope.selectedChannel}).then( res => {
            $scope.messageEdited = true;
        });
    }
});