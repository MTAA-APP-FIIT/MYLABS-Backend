const user = require("../models/user");
const friends = require("../models/friends");
const bcrypt = require('bcrypt');
const { json } = require("express/lib/response");
const jwt = require('jsonwebtoken')

// For GET /users
const getusers = async (req, res) => {
  try {
    const users = await user.findAll();
    if (users == null){
      res.sendStatus(404)
    }
    res.send(users);
    
  } catch {
    res.sendStatus(400)
  }
};

// For GET /users/:id
const getuser = async (req, res) => {
  try {
    const userreturn = await user.findOne({
      where: {
        id: req.params.id,
    }
    });
    if (userreturn == null){
      res.sendStatus(404)
    }
    
    res.send(userreturn);
  } catch {
    res.sendStatus(400)
  } 
   
};

// For PATCH /users/:id
const patchuser = async (req, res) => {
  try {
    const userreturn = await user.findOne({
      where: {
        id: req.params.id,
    }
    });
    if (userreturn == null) {
      res.sendStatus(404)
    }

    userreturn.update(req.body)
    res.send(userreturn)
  } catch {
    res.sendStatus(400)
  }
};

// For GET /users/:id/friends
const getfriends = async (req, res) => {
  try {
    const friendsreturn = await friends.findAll({
      where: {
        user_id: req.params.id,
    }
    });
    if (friendsreturn.length === 0) {
      res.sendStatus(404)
    }
    else {
      res.send(friendsreturn);
    }
  } catch {
    res.sendStatus(400)
  }
};

// For PATCH /users/:id/friends
const updatefriends = async (req, res) => {
  try {
    const friendsreturn = await friends.findOne({
      where: {
        user_id: req.params.id,
        friend_id: req.body.friend_id
    }
    });
    if (friendsreturn.length === 0) {
      res.sendStatus(404)
    }

    const customJson = Object.assign({updated_at:Date.now()}, req.body);
    friendsreturn.update(customJson)
    res.send(customJson)
  } catch{
    res.sendStatus(400)
  }
  
  
};

// For POST /users/:id/friends
const createfriends = async (req, res) => {
  try {
    if (req.body.friend_id == req.params.id) return res.sendStatus(400)
    
    const user1_exists = await user.findOne({
      where: {
        id:req.params.id
    }
    });
    
    const user2_exists = await user.findOne({
      where: {
        id:req.body.friend_id
    }
    });
    if (user2_exists && user1_exists){
      const customJson = Object.assign({user_id:req.params.id}, req.body);
      customJson.created_at = Date.now()
      customJson.updated_at = Date.now()
      
      await friends.create(customJson);
      res.send(customJson);
    }
    else {
      res.sendStatus(404)
    }
  } catch {
    res.sendStatus(400)
  }
};

// For DELETE /users/:id/friends
const declinefriends = async (req, res) => {
  try {
    
    const friendsreturn = await friends.findOne({
      where: {
        user_id: req.params.id,
        friend_id: req.body.friend_id
    }
    })
    if (friendsreturn.length < 1) {
      res.sendStatus(404)
    }

    await friends.destroy({
      where: {
        user_id: req.params.id,
        friend_id: req.body.friend_id
      }
    });

    await friends.destroy({
      where: {
        user_id: req.body.friend_id,
        friend_id: req.params.id 
      }
    });
    res.sendStatus(200)
  } catch {
    res.sendStatus(400)
  }
};


const createuser = async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      req.body.password = hashedPassword
      req.body.created_at = Date.now()
      req.body.updated_at = Date.now()
      await user.create(req.body);

    } catch {
      res.sendStatus(400)
    }
    
    
};

const login = async (req, res) => {
    const userreturn = await user.findOne({
      where: {
        email: req.body.email,
    }
    });

    if (!userreturn){
      res.sendStatus(404)
    }
    else {
      hashed = await bcrypt.compare(req.body.password, userreturn.password)
      if (hashed){
        const token = jwt.sign({ email: req.body.email }, 'secret', { expiresIn: '1h' });
        console.log(token)
        res.status(200).json({"token": token, "id": userreturn.id});
      }
      else {
        res.sendStatus(404)
      }
    }
};


module.exports = { getusers, getuser, patchuser, createuser, getfriends, createfriends, updatefriends, declinefriends, login};