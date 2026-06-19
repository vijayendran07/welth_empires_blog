const prisma = require('../../utils/prisma');

// Helper to create slugs
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
};

exports.createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, pdfReportUrl, pdfReportSize, published, categoryId, tags, expertTip, customAuthorName, customAuthorBio, customAuthorAvatar } = req.body;
    const authorId = req.user.id;
    
    // Create slug from title, appending a random string to ensure uniqueness if needed
    let slug = slugify(title);
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const articleData = {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      pdfReportUrl,
      pdfReportSize,
      expertTip,
      customAuthorName,
      customAuthorBio,
      customAuthorAvatar,
      published: published || false,
      author: { connect: { id: authorId } },
    };

    if (categoryId) {
      articleData.category = { connect: { id: categoryId } };
    }

    if (tags && tags.length > 0) {
      // Connect or create tags
      articleData.tags = {
        connectOrCreate: tags.map(tag => ({
          where: { slug: slugify(tag) },
          create: { name: tag, slug: slugify(tag) }
        }))
      };
    }

    const article = await prisma.article.create({
      data: articleData,
      include: {
        author: { select: { name: true, avatarUrl: true } },
        category: true,
        tags: true,
      }
    });

    res.status(201).json(article);
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const { published, category, author } = req.query;
    
    const where = {};
    if (published !== undefined) where.published = published === 'true';
    if (category) where.category = { slug: category };
    if (author) where.authorId = author;

    const articles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        published: true,
        createdAt: true,
        views: true,
        customAuthorName: true,
        customAuthorBio: true,
        customAuthorAvatar: true,
        author: { select: { id: true, name: true, avatarUrl: true, bio: true, role: true, createdAt: true } },
        category: true,
        tags: true,
        _count: { select: { comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(articles);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        category: true,
        tags: true,
        comments: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment view count
    await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } }
    });

    res.json(article);
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true, bio: true } },
        category: true,
        tags: true,
        comments: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Get article by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, coverImage, pdfReportUrl, pdfReportSize, published, categoryId, tags, expertTip, customAuthorName, customAuthorBio, customAuthorAvatar } = req.body;

    const article = await prisma.article.findUnique({ where: { id }, include: { tags: true } });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    // Check authorization (Author can edit their own, Admin can edit any)
    if (article.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to edit this article' });
    }

    const updateData = {
      title,
      content,
      excerpt,
      coverImage,
      pdfReportUrl,
      pdfReportSize,
      expertTip,
      customAuthorName,
      customAuthorBio,
      customAuthorAvatar,
      published
    };

    if (title && title !== article.title) {
      updateData.slug = slugify(title);
    }

    if (categoryId !== undefined) {
      updateData.category = categoryId ? { connect: { id: categoryId } } : { disconnect: true };
    }

    // Handle tag updates by resetting and reconnecting/creating
    if (tags) {
      updateData.tags = {
        set: [], // Disconnect existing
        connectOrCreate: tags.map(tag => ({
          where: { slug: slugify(tag) },
          create: { name: tag, slug: slugify(tag) }
        }))
      };
    }

    const updated = await prisma.article.update({
      where: { id },
      data: updateData,
      include: { author: { select: { name: true } }, category: true, tags: true }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) return res.status(404).json({ message: 'Article not found' });

    if (article.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete this article' });
    }

    await prisma.article.delete({ where: { id } });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { id: articleId } = req.params;
    const { text, name } = req.body;

    if (!text || !name) {
      return res.status(400).json({ message: 'Name and text are required' });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        name,
        articleId
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { likes: { increment: 1 } }
    });

    res.json(comment);
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
