const Plant = require("../models/Plant");

const createPlant = async (req, res) => {
    try {
        const { name, species, image, careInfo } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Plant name is required"
            });
        }

        const plant = await Plant.create({
            userId: req.user.id,
            name,
            species,
            image,
            careInfo
        });

        res.status(201).json({
            message: "Plant created successfully",
            plant
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getPlants = async (req, res) => {
    try {
        const plants = await Plant.find({ userId: req.user.id });

        res.status(200).json({
            plants
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPlantById = async (req, res) => {
    try {
        const plant = await Plant.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!plant) {
            return res.status(404).json({
                message: "Plant not found"
            });
        }

        res.status(200).json({
            plant
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updatePlant = async (req, res) => {
    try {
        const { name, species, image, careInfo } = req.body;

        const plant = await Plant.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                name,
                species,
                image,
                careInfo
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!plant) {
            return res.status(404).json({
                message: "Plant not found"
            });
        }

        res.status(200).json({
            message: "Plant updated successfully",
            plant
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const deletePlant = async (req, res) => {
    try {
        const plant = await Plant.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!plant) {
            return res.status(404).json({
                message: "Plant not found"
            });
        }

        res.status(200).json({
            message: "Plant deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {
    createPlant,
    getPlants,
    getPlantById,
    updatePlant,
    deletePlant
};