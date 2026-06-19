const prisma = require('../../utils/prisma');

// Mock implementation since Cloudinary is not yet configured.
exports.uploadMedia = async (req, res) => {
  try {
    // In a real implementation, we would use multer + cloudinary here.
    const { url, altText } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL is required for mock upload' });
    }

    const publicId = `mock_${Math.random().toString(36).substr(2, 9)}`;

    const media = await prisma.media.create({
      data: {
        url,
        publicId,
        altText
      }
    });

    res.status(201).json(media);
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadFileMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Generate public URL. Note: req.get('host') could be used, but since we typically use a relative or configured URL,
    // we'll use a relative path that we can serve statically from the backend.
    // Example backend runs on :5000, so we return the relative path or absolute backend path.
    // We'll return the relative path and let the frontend prepend the API base URL if needed,
    // OR we return absolute URL from backend. Let's return absolute backend URL for simplicity:
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const publicId = `file_${req.file.filename.split('.')[0]}`;
    
    // Alt text can be passed in req.body if needed
    const { altText } = req.body;

    const media = await prisma.media.create({
      data: {
        url: fileUrl,
        publicId,
        altText: altText || req.file.originalname
      }
    });

    res.status(201).json(media);
  } catch (error) {
    console.error('Upload file media error:', error);
    res.status(500).json({ message: 'Server error during file upload' });
  }
};

exports.getMedia = async (req, res) => {
  try {
    const mediaList = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(mediaList);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, we would delete from Cloudinary as well.
    await prisma.media.delete({ where: { id } });
    
    res.json({ message: 'Media deleted' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
