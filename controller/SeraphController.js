const investigation = require('../model/InvestigationModel');
const testimonial = require('../model/TestimonialModel');
const proof = require('../model/ProofModel');
const moment = require('moment');

const objectToModel = investigation => {
    return {
        title : investigation.title,
        description : investigation.description,
        start : moment(investigation.start).format("Y-MM-DD HH:mm:SS"),
        end : (investigation.end ? moment(investigation.end).format("Y-MM-DD HH:mm:SS") : undefined),
        investigator : investigation.investigator,
        realm : 1
    }
}

const modelToObject = investigation => {
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
            investigations.push(modelToObject(line));
        }
        return investigations;
    },
    getInvestigation : async id => {
        let result = modelToObject(await investigation.findById(id));
        return result;
    },
    create : async investigation => {
        return result = await investigation.create(objectToModel(investigation));
    }
}

module.exports = SeraphController;