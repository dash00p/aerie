function adminCtrl($http) {
    var vm = this;
    vm.users = [];
    vm.userToEdit = {}
    vm.userOriginalRights = [];
    vm.rights = [];

    $http.get(`user/list`).then(res => {
        vm.users = res.data;
    });
    $http.get(`index/rights/all`).then(res => {
        vm.rights = res.data;
    })

    vm.openModalUser = user => {
        vm.userToEdit = user;
        $http.get(`user/${user.id}/rights`).then(res => {
            vm.userOriginalRights = res.data;
            vm.userToEdit.rights = [];
            for (right of vm.rights) {
                let rightToPush = right;
                if (typeof vm.userOriginalRights.find(r => r === right.id) !== 'undefined')
                    rightToPush.isActive = true;
                else
                    rightToPush.isActive = false;
                vm.userToEdit.rights.push(rightToPush);

            }
            $('#editUserModal').modal('show');
        });
    }

    vm.saveUser = () => {
        let newRights = vm.userToEdit.rights;
        for (right of vm.rights) {
            let newRight = newRights.find(r => r.id === right.id);
            let oldRight = vm.userOriginalRights.find(r => r === right.id);
            //Old & new values are the same so we won't update them
            if ((newRight.isActive && oldRight) || (!newRight.isActive && !oldRight)) {
                newRights = newRights.filter(r => r !== newRight);
            }

        }
        //TODO Close Modal after http request
        vm.userToEdit.rights = undefined;
        if (newRights.length > 0) {
            let rightsToRemove = newRights.filter(r => !r.isActive);
            let rightsToAdd = newRights.filter(r => r.isActive);
            if (rightsToRemove.length > 0) {
                $http.delete(`user/${vm.userToEdit.id}/rights`, {data : {rightsToRemove : rightsToRemove}, headers: {'Content-Type': 'application/json;charset=utf-8'}}).then(res => {
                });
            }

            if(rightsToAdd.length > 0){
                $http.post(`user/${vm.userToEdit.id}/rights`, {rightsToAdd: rightsToAdd}).then( res => {

                });
            }

        }
        // $http.patch(`user`, {user : vm.userToEdit}).then( res => {

        // })
        // .catch( err => {

        // });
    }

    vm.changeOrderBy = newValue => {
        if (newValue === vm.orderByValue)
            vm.orderByReverse = !vm.orderByReverse;
        else
            vm.orderByReverse = false;
        vm.orderByValue = newValue;
    }

    vm.orderByIcon = column => {
        if (vm.orderByValue === column && vm.orderByReverse)
            return true;
        else
            return false;
    }
};

app.controller("adminCtrl", adminCtrl);