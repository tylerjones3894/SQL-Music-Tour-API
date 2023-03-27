// DEPENDENCIES
const stage = require('express').Router()
const db = require('../models')
const { Stage, Event, Stage_Event } = db 
const { Op } = require('sequelize')

// FIND ALL STAGES
stage.get('/', async (req, res) => {
    try {
        const foundStages = await Stage.findAll({
            attributes: ['name', 'capacity'],
            where: {
                name: { [Op.like]: `%${req.query.name ? req.query.name : ''}%` }
            },
            order: [['name', 'ASC']]
        })
        res.status(200).json(foundStages)
    } catch (error) {
        res.status(500).json(error)
    }
})

// FIND A SPECIFIC STAGE
stage.get('/:name', async (req, res) => {
    try {
        const foundStage = await Stage.findOne({
            where: { name: req.params.name },
            include: {
                model: Event,
                as: 'events',
                through: { attributes: [] }
            },
            order: [
                [{
                    model: Event,
                    as: 'events'
                }, 'date', 'DESC']
            ]
        })
        res.status(200).json(foundStage)
    } catch (error) {
        res.status(500).json(error)
    }
})

// CREATE A STAGE
stage.post('/', async (req, res) => {
    try {
        const newStage = await Stage.create(req.body)
        res.status(201).json({
            message: 'Successfully inserted a new stage',
            data: newStage
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// UPDATE A STAGE
stage.put('/:id', async (req, res) => {
    try {
        const updatedStages = await Stage.update(req.body, {
            where: {
                stage_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully updated ${updatedStages} stage(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// DELETE A STAGE
stage.delete('/:id', async (req, res) => {
    try {
        const deletedStages = await Stage.destroy({
            where: {
                stage_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedStages} stage(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

// EXPORT
module.exports = stage