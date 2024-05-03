const express = require('express');
const router = express.Router();
const UserDAO = require('../models/User/UserDao.js');

router.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const newUser = { firstname, lastname, email, password };
  
    try {
      const userId = await UserDAO.registerUser(newUser);
      res.status(201).json({ message: 'Registration successful', userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

  
    try {
      const userId = await UserDAO.login(email,password);
      if(userId!=null)
      res.status(201).json({ message: 'login successful', userId });
    else 
    res.status(404).json({ message: 'error', userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { firstname, lastname, email, password } = req.body;
    const updatedUser = new User(userId, firstname, lastname, email, password);
    try {
        const success = await UserDAO.updateUser(updatedUser);
        if (success) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const success = await UserDAO.deleteUser(userId);
        if (success) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

  router.get('/takeDecision/:need', async (req, res) => {
    const  need  = req.params.need; // Assuming you're sending the 'need' parameter in the request body

    try {
        const message = await UserDAO.takeDecision(need);
        res.status(200).json({ message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;