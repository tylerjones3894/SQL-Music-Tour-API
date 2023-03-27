// DEPENDENCIES
const band = require('express').Router()
const db = require('../models')
const { Band, Meet_Greet, Event, Set_Time } = db 
const { Op } = require('sequelize')

// FIND ALL BANDS
band.get('/', async (req, res) => {
    try {
        const foundBands = await Band.findAll({
            order: [ [ 'available_start_time', 'ASC' ] ],
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` }
            }
        })
        res.status(200).json(foundBands)
    } catch (error) {
        res.status(500).json(error)
    }
})

// FIND ONE BAND BY ID
band.get('/:name', async (req, res) => {
    try {
        const foundBand = await Band.findOne({
            attributes: [['name', 'Band Name'], ['available_start_time', 'Start Time'], ['end_time', 'End Time']],
            where: {
                name: req.params.name
            },
            include: [
                {
                    model: Meet_Greet,
                    as: 'meet_greets',
                    attributes: {
                        exclude: ['meet_greet_id', 'band_id', 'event_id']
                    },
                    include: {
                        model: Event,
                        as: 'event',
                        attributes: {
                            exclude: ['event_id']
                        },
                        where: {
                            name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%` }
                        }
                    }
                },
                {
                    model: Set_Time,
                    as: 'set_times',
                    attributes: {
                        exclude: ['set_time_id', 'event_id', 'band_id', 'stage_id']
                    },
                    include: {
                        model: Event,
                        as: 'event',
                        attributes: {
                            exclude: ['event_id']
                        },
                        where: {
                            name: { [Op.like]: `%${req.query.event ? req.query.event : ''}%` }
                        }
                    }
                }
            ]
        })
        res.status(200).json(foundBand)
    } catch (e) {
        res.status(500).json(e)
    }
})

// CREATE A BAND
band.post('/', async (req, res) => {
    try {
        const newBand = await Band.create(req.body)
        res.status(200).json({
            message: 'Successfully inserted a new band',
            data: newBand
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// UPDATE A BAND
band.put('/:id', async (req, res) => {
    try {
        const updatedBands = await Band.update(req.body, {
            where: {
                band_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedBands} band(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// DELETE A BAND
band.delete('/:id', async (req, res) => {
    try {
        const deletedBands = await Band.destroy({
            where: {
                band_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedBands} band(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// EXPORT
module.exports = band
