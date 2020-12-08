const _ = require('lodash')

const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (mostFavorite, item) => {
    return (!mostFavorite || (item.likes > mostFavorite.likes)) ? item : mostFavorite
  }
  const mostFavouriteBlog = blogs.reduce(reducer, null)
  return mostFavouriteBlog
    ? { title: mostFavouriteBlog.title, author: mostFavouriteBlog.author, likes: mostFavouriteBlog.likes }
    : null
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return _(blogs)
    .countBy('author')
    .entries()
    .map(_.partial(_.zipObject, ['author', 'blogs']))
    .maxBy('blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const sumLikes = array => array.reduce((sum, item) => sum + item.likes, 0)

  return _(blogs)
    .groupBy('author')
    .mapValues(sumLikes)
    .entries()
    .map(_.partial(_.zipObject, ['author', 'likes']))
    .maxBy('likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
