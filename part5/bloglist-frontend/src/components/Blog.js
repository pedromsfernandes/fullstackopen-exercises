import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  blog: { title, author, url, likes, user },
  loggedUser,
  onLike,
  onRemove
}) => {
  const [showAll, setShowAll] = useState(false)

  const allInfo = (
    <>
      {url && <a href={url}>{url}</a>} <br />
      {likes !== null && <span>{likes} likes</span>}{' '}
      <button onClick={onLike}>like</button>
      <br />
      {user && <span>added by {user.name}</span>} <br />
      {user && loggedUser && loggedUser.username === user.username && (
        <button
          onClick={() =>
            window.confirm(`remove blog ${title} by ${author}`) && onRemove()
          }
        >
          remove
        </button>
      )}
    </>
  )

  return (
    <div
      style={{
        padding: '0.2rem',
        margin: '0.2rem 0',
        border: '1px solid black'
      }}

      className="blog"
    >
      <div onClick={() => setShowAll(showAll => !showAll)} className="default">
        {title} {author}
      </div>
      {showAll && allInfo}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  loggedUser: PropTypes.object,
  onLike: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default Blog
