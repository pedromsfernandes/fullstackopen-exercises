const dummy = blogs => 1;

const totalLikes = blogs => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = blogs => {
  const favorite = blogs.find(
    blog => blog.likes === Math.max(...blogs.map(blog => blog.likes))
  );

  return favorite === undefined
    ? undefined
    : {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
      };
};

const mostBlogs = blogs => {
  const authors = [];

  blogs.forEach(blog => {
    const authorExists = authors.findIndex(
      author => author.author === blog.author
    );

    if (authorExists !== -1) {
      authors[authorExists].blogs++;
    } else {
      authors.push({
        author: blog.author,
        blogs: 1
      });
    }
  });

  return authors.find(
    author => author.blogs === Math.max(...authors.map(author => author.blogs))
  );
};

const mostLikes = blogs => {
  const authors = [];

  blogs.forEach(blog => {
    const authorExists = authors.findIndex(
      author => author.author === blog.author
    );

    if (authorExists !== -1) {
      authors[authorExists].likes += blog.likes;
    } else {
      authors.push({
        author: blog.author,
        likes: blog.likes
      });
    }
  });

  return authors.find(
    author => author.likes === Math.max(...authors.map(author => author.likes))
  );
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
