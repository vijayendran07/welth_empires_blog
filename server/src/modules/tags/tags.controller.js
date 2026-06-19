const prisma = require('../../utils/prisma');

const slugify = (text) => {
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');
};

exports.getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: { select: { articles: true } }
      },
      orderBy: { name: 'asc' }
    });
    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    let slug = slugify(name);
    
    const existing = await prisma.tag.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    const tag = await prisma.tag.create({
      data: { name, slug }
    });

    res.status(201).json(tag);
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.tag.delete({ where: { id } });
    res.json({ message: 'Tag deleted' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
