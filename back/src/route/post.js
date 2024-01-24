const express = require('express')
const router = express.Router()

//

//

const { Post } = require('../class/post')

router.post('/post-create', function (req, res) {
  console.log('post r')
  try {
    const { username, text, postId } = req.body

    if (!username || !text) {
      return res.status(400).json({
        massage:
          'Потрібно передати всі дані для створення поста',
      })
    }

    let post = null

    console.log(postId, 'postId')

    if (postId) {
      post = Post.getById(Number(postId))
      console.log(post, 'post')

      if (!post) {
        return res.status(400).json({
          massage: 'Пост з таким ID не існує!',
        })
      }
    }

    const newPost = Post.create(username, text, post)
    console.log(newPost)
    return res.status(200).json({
      post: {
        id: newPost.id,
        text: newPost.text,
        username: newPost.username,
        date: newPost.date,
      },
    })
  } catch (error) {
    return res.status(400).json({
      massage: error.message,
    })
  }
})

//

router.get('/post-list', function (req, res) {
  try {
    const list = Post.getList()

    if (list.length === 0) {
      return res.status(200).json({
        list: [],
      })
    }

    return res.status(200).json({
      list: list.map(({ id, username, text, date }) => ({
        id,
        username,
        text,
        date,
      })),
    })
  } catch (error) {
    return res.status(400).json({
      massage: error.message,
    })
  }
})

//

router.get('/post-item', function (req, res) {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({
        massage: 'Потрібно передати ID поста',
      })
    }

    const post = Post.getById(Number(id))

    if (!post) {
      return res.status(400).json({
        massage: 'Пост з таким ID не існує!',
      })
    }

    return res.status(200).json({
      post: {
        id: post.id,
        username: post.username,
        text: post.text,
        date: post.date,

        reply: post.reply.map((reply) => ({
          id: reply.id,
          text: reply.text,
          username: reply.username,
          date: reply.date,
        })),
      },
    })
  } catch (error) {
    return res.status(400).json({
      massage: error.message,
    })
  }
})

//

module.exports = router
