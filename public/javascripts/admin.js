function adminCtrl($http) {
    var vm = this;
    vm.users = [];

    $http.get(`user/list`).then( res => {
        vm.users = res.data;
    });

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

app.controller("adminCtrl", adminCtrl);