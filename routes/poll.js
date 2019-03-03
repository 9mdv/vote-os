const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Vote = require('../models/Vote')

const Pusher = require('pusher')

const pusher = new Pusher({
  appId: '727149',
  key: '0dedd7c16dd91941349d',
  secret: 'd36889e33bed6998bdca',
  cluster: 'ap1',
  encrypted: true
})

router.get('/', (req, res) => {
  Vote.find().then(votes => {
    res.json({ success: true, votes })
  })
})

router.post('/', (req, res) => {
  const newVote = {
    os: req.body.os,
    points: 1
  }

  new Vote(newVote).save().then(vote => {
    pusher.trigger('os-poll', 'os-vote', {
      points: vote.points,
      os: vote.os
    })

    return res.json({ success: true, message: 'Thank you for voting!' })
  })
})

module.exports = router
