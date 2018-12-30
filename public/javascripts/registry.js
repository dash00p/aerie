function registryCtrl($http) {
    var vm = this;
    vm.messageEdited = vm.messageError = false;
    vm.orderByValue = 'category';
    vm.orderByReverse = false;

    $http.get(`${bot_url}/registry/channel/all`).then( res => {
        vm.channels = res.data;
    });

    vm.showInitialPost = channelId => {
        vm.messageEdited = vm.messageError = false;
        $http.get(`${bot_url}/registry/channel/${channelId}/firstPost`).then( res => {
            vm.reservedMessages = res.data;
            vm.message = JSON.parse(JSON.stringify(vm.reservedMessages[0]));
            vm.message.content = "";
            vm.reservedMessages.forEach( m => {
                vm.message.content += m.content+"\n";
            });

            vm.selectedChannel = vm.channels.find(c => c.id === channelId);
            $('#messageModal').modal('show');
        });
    }

    vm.updateInitialPost = () => {
        vm.messageEdited = vm.messageError = false;

        if(vm.message.content.length <= 2000){
            $http.post(`${bot_url}/registry/message/${vm.message.id}`, {text:vm.message.content, channelNumber: vm.selectedChannel.id})
            .then( res => {
                vm.messageEdited = true;
            })
            .catch( res => {
                vm.messageError = true;
                vm.messageErrorText = res.data.message;
            });
        }
        else{
            let stringStart = 0;
            const postNumber = Math.ceil(vm.message.content.length/2000);
            let j = 0;
            for(i=0; i < postNumber; i++){
                let content = vm.message.content.substring(stringStart, 2000+i*2000);
                const contentLength = content.lastIndexOf(" ");

                if(contentLength > -1 && i !== postNumber-1)
                    content = content.substring(0, contentLength);
                stringStart += content.length+1;

                $http.post(`${bot_url}/registry/message/${vm.reservedMessages[i].id}`, {text:content, channelNumber: vm.selectedChannel.id})
                .then( res => {
                    j++;
                    if(j === postNumber)
                        vm.messageEdited = true;
                })
                .catch( res => {
                    vm.messageError = true;
                    vm.messageErrorText = res.data.message;
                });
            }
        }
    }

    //TODO
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

    // vm.dynamicOrderFunction = () => {
    //     return vm.orderByValue;
    // }

    vm.changeOrderBy = newValue => {
        if(newValue===vm.orderByValue)
            vm.orderByReverse = !vm.orderByReverse;
        else
            vm.orderByReverse = false;
        vm.orderByValue = newValue;
    }

    vm.orderByIcon = column => {
        if(vm.orderByValue === column && vm.orderByReverse)
            return true;
        else
            return false;
    }
};

app.controller("registryCtrl", registryCtrl);