function registryCtrl($http) {
    var vm = this;
    vm.messageEdited = false;

    $http.get(`${bot_url}/registry/channel/all`).then( res => {
        vm.channels = res.data;
    });

    vm.showInitialPost = channelId => {
        vm.messageEdited = false;
        $http.get(`${bot_url}/registry/channel/${channelId}/firstPost`).then( res => {
            vm.message = res.data;
            vm.selectedChannel = vm.channels.find(c => c.id === channelId);
            $('#messageModal').modal('show')
        });
    }

    vm.updateInitialPost = () => {
        $http.post(`${bot_url}/registry/message/${vm.message.id}`, {text:vm.message.content, channelNumber: vm.selectedChannel.id}).then( res => {
            vm.messageEdited = true;
        });
    }

    vm.insertPost = () => {
        $http.post(`${bot_url}/registry/message/new`, {text:vm.message.content, channelNumber: vm.selectedChannel.id}).then( res => {
            vm.messageEdited = true;
        });
    }

    vm.pinPost = () => {
        $http.post(`${bot_url}/registry/message/${vm.message.id}/${vm.message.pinned?'pin':'unpin'}`, {channelNumber: vm.selectedChannel.id}).then( res => {
            vm.messagePinned = true;
        });
    }
};

app.controller("registryCtrl", registryCtrl);