const investigation = require('../model/InvestigationModel');
const testimonial = require('../model/TestimonialModel');
const proof = require('../model/ProofModel');
const moment = require('moment');

const investigationObjToModel = investigation => {
    return {
        title : investigation.title,
        description : investigation.description,
        start : moment(investigation.start).format("Y-MM-DD HH:mm:SS"),
        end : (investigation.end ? moment(investigation.end).format("Y-MM-DD HH:mm:SS") : undefined),
        investigator : investigation.investigator,
        realm : 1
    }
}

const testimonialObjToModel = testimonial => {
    return {
        description : testimonial.description,
        depositionDate : moment(testimonial.depositionDate).format("Y-MM-DD HH:mm:SS"),
        witness : testimonial.witness,
        investigationId : testimonial.investigationId
    }
}

const proofObjToModel = proof => {
    return {
        description : proof.description,
        discoveryDate : moment(proof.discoveryDate).format("Y-MM-DD HH:mm:SS"),
        title : proof.title,
        investigationId : proof.investigationId
    }
}

const investigationModelToObj = investigation => {
    return {
        title : investigation.title,
        description : investigation.description,
        id : investigation.id,
        start : moment(investigation.start).utcOffset(0, true).format(),
        end : (investigation.end ? moment(investigation.end).utcOffset(0, true).format() : undefined),
        investigator : investigation.investigator,
        createdAt : investigation.createdAt,
        updatedAt : investigation.updatedAt
    }
}

const SeraphController = {
    getAllInvestigations : async () => {
        let result = await investigation.findAll();
        let investigations = [];
        for(line of result){
            investigations.push(investigationModelToObj(line));
        }
        return investigations;
    },
    getInvestigation : async id => {
        let result = investigationModelToObj(await investigation.findById(id));
        return result;
    },
    createInvestigation : async newInvestigation => {
        return result = await investigation.create(investigationObjToModel(newInvestigation));
    },
    createTestimonial : async newTestimonial => {
        return result = await testimonial.create(testimonialObjToModel(newTestimonial));
    },
    createProof : async newProof => {
        return result = await proof.create(proofObjToModel(newProof));
    },
    getRecords : async investigationId => {
        let testimonials = await testimonial.findAll({where:{investigationId: investigationId}});
        let proofs = await proof.findAll({where:{investigationId: investigationId}});
        return { testimonials : testimonials, proofs : proofs};
    }
}

module.exports = SeraphController;