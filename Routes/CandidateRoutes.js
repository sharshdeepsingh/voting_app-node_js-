const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const Candidate = require('../Models/candidate'); // Ensure the model name is correct
const { jwtAuthMiddleware, generateToken } = require('./../jwt');


const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId); // Ensure you are using the User model correctly
        if(user.role === 'admin'){
            return true;
        }
    } catch (err) {
        return false;
    }
}

router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (! await checkAdminRole(req.user.id)) {
            console.log('admin role not found');
            return res.status(404).json({ message: 'user is not of admin role' });
        }
        else{
            console.log('admin role found')
        }
        const data = req.body;
        const newCandidate = new Candidate(data); // Use the correct model name
        const response = await newCandidate.save();
        console.log('Data is saved');
        res.status(200).json({ response: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:candidateId', jwtAuthMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdminRole(req.user.id); // Await the result
        if (!isAdmin) {
            return res.status(404).json({ message: 'user is not of admin role' });
        }
        const candidateId = req.params.candidateId;
        const updatedCandidateData = req.body;
        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, { // Use the correct model name
            new: true,
            runValidators: true
        });
        if (!response) {
            return res.status(404).json({ err: 'candidate not found' });
        }
        console.log('candidate data is updated');
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
});

router.delete('/:candidateId', jwtAuthMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdminRole(req.user.id); // Await the result
        if (!isAdmin) {
            return res.status(404).json({ message: 'user is not of admin role' });
        }
        const get_id = req.params.candidateId;
        const result = await Candidate.findOneAndDelete({ _id: get_id }); // Use the correct model name and query
        if (!result) {
            return res.status(404).json('Candidate not found');
        }
        console.log('person deleted successfully');
        res.status(200).json({ message: 'person deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'internal server error' });
    }
});

module.exports = router;