const event = require('express').Router()
const db = require('../models')
const { Event, Meet_Greet, Set_Time, Band, Stage, Stage_Event } = db
const { Op } = require('sequelize')

// FIND ALL EVENTS
event.get('/', async (req, res) => {
    try {
        const foundEvents = await Event.findAll({
            order: [['date', 'ASC']],
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` }
            }
        })
        res.status(200).json(foundEvents)
    } catch (e) {
        res.status(500).json(e)
    }
})

// FIND ONE EVENT
event.get('/:name', async (req, res) => {
    try {
        const foundEvent = await Event.findOne({
            where: { name: req.params.name },
            include: [
                {
                    model: Meet_Greet,
                    as: 'meet_greets',
                    include: {
                        model: Band,
                        as: 'band'
                    },
                    separate: true,
                    order: [['meet_start_time', 'ASC']]
                },
                {
                    model: Set_Time,
                    as: 'set_times',
                    include: [
                        {
                            model: Band,
                            as: 'band'
                        },
                        {
                            model: Stage,
                            as: 'stage'
                        }
                    ]
                },
                {
                    model: Stage,
                    as: 'stages',
                    through: {
                        attributes: []
                    }
                }
            ]
        })
        res.status(200).json(foundEvent)
    } catch (e) {
        res.status(500).json(e)
    }
})

// CREATE ONE EVENT
event.post('/', async (req, res) => {
    try {
        const newEvent = await Event.create(req.body)
        res.status(201).json(newEvent)
    } catch (e) {
        res.status(500).json(e)
    }
})

// UPDATE ONE EVENT
event.put('/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.update(req.body, {
            where: { event_id: req.params.id }
        })
        res.status(200).json({
            message: `Updated ${updatedEvent} event(s)`
        })
    } catch (e) {
        res.status(500).json(e)
    }
})

// DELETE AN EVENT
event.delete('/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.destroy({
            where: { event_id: req.params.id }
        })
        res.status(200).json({
            message: `Deleted ${deletedEvent} event(s)`
        })
    } catch (e) {
        res.status(500).json(e)
    }
})

module.exports = event