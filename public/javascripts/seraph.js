function seraphCtrl($http) {
    var vm = this;
    vm.investigations = [];
    vm.newInvestigation = {}
    vm.editInvestigation = false;

    $http.get(`/seraph/investigation/all`).then( res => {
        vm.investigations = res.data;
    });

    vm.openInvestigationModal = () => {

    }

    vm.saveInvestigation = () => {
        if(!vm.checkInvestigationCoherence())
            return;

        if(vm.editInvestigation){
            $http.patch(`/seraph/investigation`, {investigation : vm.newInvestigation})
            .then( res => {
                createToast('👌','Enquête mise à jour avec succès !');
            })
            .catch( res => {
    
            });
        }
        else{
            $http.post(`/seraph/investigation`, {newInvestigation : vm.newInvestigation})
            .then( res => {
                createToast('👌','Enquête créée avec succès !');
                vm.investigation.push(res.data);
                vm.newInvestigation = {};
                $('#newInvestigationModal').modal('hide');
            })
            .catch( res => {
    
            });
        }
    }

    vm.changeInvestigationStatus = (investigation, newStatus, event) => {
        if(event)
            event.stopPropagation();
            
        investigation.status = newStatus;
        $http.patch(`/seraph/investigation`, {investigationId : investigation.id, properties :{status: newStatus}})
        .then( res => {
            createToast('👌','Enquête mise à jour avec succès !');
        })
        .catch( res => {

        });
    }

    vm.checkInvestigationCoherence = () => {
        if(!vm.newInvestigation.start){
            vm.newInvestigation.error = {
                message:"La date de début de l'enquête n'a pas été renseignée."
            }
            return false;            
        }

        if(typeof vm.newInvestigation.end !== "undefined" && moment(vm.newInvestigation.start).isSameOrAfter(moment(vm.newInvestigation.end))){
            vm.newInvestigation.error = {
                message:"La date de fin doit être supérieure à celle du début de l'enquête."
            }
            return false;
        }

        if(!vm.newInvestigation.title || vm.newInvestigation.title === ""){
            vm.newInvestigation.error = {
                message:"Le titre est obligatoire."
            }
            return false;
        }

        // if(!vm.newInvestigation.investigator || vm.newInvestigation.investigator === ""){
        //     vm.newInvestigation.error = {
        //         message:""
        //     }
        // }

        return true;
    }

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

app.controller("seraphCtrl", seraphCtrl);