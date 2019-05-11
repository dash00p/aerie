const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const model = require('../model/EventModel');
const moment = require('moment');

const modelToObject = event => {
    return {
        title : event.title,
        description : event.description,
        id : event.id,
        start : moment(event.start).utcOffset(0, true).format(),
        end : moment(event.end).utcOffset(0, true).format(),
        createdAt : event.createdAt,
        updatedAt : event.updatedAt
    }
}

const ObjetToModel = event => {
    return {
        title : event.title,
        description : '',
        start: moment(event.start).format("Y-MM-DD HH:mm:SS"),
        end: moment(event.end).format("Y-MM-DD HH:mm:SS"),
        type: 1
    }
}

const EventController = {
    getUpcoming : async () => {
        let result = await model.findAll();
        let events = [];
        for(line of result){
            events.push(modelToObject(line));
        }
        return events;
    },
    create : async event =>{
        return result = await model.create(ObjetToModel(event));
    },
    update : async event => {
        return result = await model.update(ObjetToModel(event), {where:{id: event.id}});
    }
}

module.exports = EventController;