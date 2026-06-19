const prisma = require('../../utils/prisma');

exports.getAnalytics = async (req, res) => {
  try {
    // 1. Total Articles & Total Views
    const articles = await prisma.article.findMany({
      select: { views: true, published: true, createdAt: true }
    });
    
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(a => a.published).length;
    const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);

    // 2. Total Authors
    const authorsCount = await prisma.user.count({
      where: { role: { in: ['AUTHOR', 'ADMIN'] } }
    });

    // 3. Category Distribution
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    // 4. Traffic trend (articles published per day for last 7 days)
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });
    
    const trafficTrend = last7Days.map(day => {
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      
      const count = articles.filter(a => {
        const created = new Date(a.createdAt);
        return created >= day && created < nextDay;
      }).length;
      
      // Sum of views for articles published on that day
      const views = articles
        .filter(a => {
          const created = new Date(a.createdAt);
          return created >= day && created < nextDay;
        })
        .reduce((sum, a) => sum + (a.views || 0), 0);

      return {
        name: day.toLocaleDateString('en-US', { weekday: 'short' }),
        views: views, // Show actual views of articles published on this day
        count: count
      };
    });

    res.json({
      totalArticles,
      publishedArticles,
      totalViews,
      authorsCount,
      categories: categories.map(c => ({ name: c.name, count: c._count.articles })),
      trafficTrend
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
