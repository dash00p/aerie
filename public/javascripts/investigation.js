function investigationCtrl($http) {
    var vm = this;
    vm.testimonials = [];
    vm.proofs = [];
    vm.newTestimonial = {};
    vm.newProof = {};
    vm.editTestimonial = vm.editProof = false;
    vm.investigation = {
        id : investigationId,
        status : investigationStatus
    }

    $http.get(`/seraph/investigation/${investigationId}/records`).then(res => {
        vm.testimonials = res.data.testimonials;
        vm.proofs = res.data.proofs;
    });

    vm.openTestimonialModal = () => {

    }

    vm.changeInvestigationStatus = (newStatus) => {
        vm.investigation.status = newStatus;
        $http.patch(`/seraph/investigation`, {investigationId : vm.investigation.id, properties :{status: newStatus}})
        .then( res => {
            createToast('👌','Enquête mise à jour avec succès !');
        })
        .catch( res => {
            //TODO
        });
    }

    vm.saveTestimonial = () => {
        if (!vm.checkTestimonialCoherence())
            return;

        if (vm.editTestimonial) {
            $http.patch(`/seraph/testimonial`, { testimonial: vm.newTestimonial })
                .then(res => {
                    createToast('👌', 'Témoignage mis à jour avec succès !');
                })
                .catch(res => {

                });
        }
        else {
            vm.newTestimonial.investigationId = investigationId;
            $http.post(`/seraph/testimonial`, { newTestimonial: vm.newTestimonial })
                .then(res => {
                    createToast('👌', 'Témoignage créé avec succès !');
                    vm.testimonials.push(res.data);
                    vm.newTestimonial = {};
                    $('#newTestimonialModal').modal('hide');
                })
                .catch(res => {

                });
        }
    }

    vm.saveProof = () => {
        if (!vm.checkProofCoherence())
            return;

        if (vm.editProof) {
            $http.patch(`/seraph/proof`, { proof: vm.newProof })
                .then(res => {
                    createToast('👌', 'Preuve mise à jour avec succès !');
                })
                .catch(res => {

                });
        }
        else {
            vm.newProof.investigationId = investigationId;
            $http.post(`/seraph/proof`, { newProof: vm.newProof })
                .then(res => {
                    createToast('👌', 'Preuve ajoutée avec succès !');
                    vm.proofs.push(res.data);
                    vm.newProof = {};
                    $('#newProofModal').modal('hide');
                })
                .catch(res => {

                });
        }
    }

    vm.checkTestimonialCoherence = () => {
        if (!vm.newTestimonial.depositionDate) {
            vm.newTestimonial.error = {
                message: "La date de la déposition n'a pas été renseignée."
            }
            return false;
        }

        if (!vm.newTestimonial.witness || vm.newTestimonial.witness === "") {
            vm.newTestimonial.error = {
                message: "Le nom du témoin est obligatoire."
            }
            return false;
        }

        return true;
    }

    vm.checkProofCoherence = () => {
        if (!vm.newProof.discoveryDate) {
            vm.newProof.error = {
                message: "La date de la découverte n'a pas été renseignée."
            }
            return false;
        }

        if (!vm.newProof.title || vm.newProof.title === "") {
            vm.newProof.error = {
                message: "Le nom de la preuve est obligatoire."
            }
            return false;
        }

        return true;
    }
};

app.controller("investigationCtrl", investigationCtrl);

$(() =>{
    $('[data-toggle="tooltip"]').tooltip()
});