const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mockArticles = [
  {
    slug: 'global-incorporation-strategies-2024',
    title: 'Global Incorporation Strategies for 2024',
    excerpt: 'Discover the most advantageous jurisdictions for establishing a holding company with strong legal identity...',
    content: '<p>Discover the most advantageous jurisdictions for establishing a holding company with strong legal identity. We analyze tax implications, legal frameworks, and long-term asset protection strategies.</p>',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600',
    published: true,
    categoryName: 'Incorporation',
  },
  {
    slug: 'ultimate-guide-corporate-compliance',
    title: 'The Ultimate Guide to Corporate Compliance',
    excerpt: 'Navigate the complex web of multi-jurisdictional reporting and maintain your corporate veil...',
    content: '<p>Navigate the complex web of multi-jurisdictional reporting and maintain your corporate veil. Compliance is no longer just a legal necessity; it is a strategic advantage.</p>',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    published: true,
    categoryName: '360° Compliance',
  },
  {
    slug: 'protecting-your-brand-trademark',
    title: 'Protecting Your Global Brand Sovereignty',
    excerpt: 'Expert analysis on securing intellectual property rights across the US, EU, and key emerging markets...',
    content: '<p>Expert analysis on securing intellectual property rights across the US, EU, and key emerging markets. Your brand is your most valuable asset. Learn how to protect it.</p>',
    coverImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600',
    published: true,
    categoryName: 'Trademark',
  },
  {
    slug: 'corporate-tax-optimization-2024',
    title: 'Corporate Tax Optimization for HNIs',
    excerpt: 'An actionable blueprint for structuring your assets to legally minimize corporate tax burdens globally...',
    content: '<p>An actionable blueprint for structuring your assets to legally minimize corporate tax burdens globally. Strategic planning can significantly enhance your net worth.</p>',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    published: true,
    categoryName: 'Taxes',
  },
  {
    slug: 'offshore-banking-and-incorporation',
    title: 'Offshore Banking & Jurisdiction Analysis',
    excerpt: 'How tier-one custodians view various incorporation structures when assessing compliance and risk.',
    content: '<p>How tier-one custodians view various incorporation structures when assessing compliance and risk. Offshore banking offers unique advantages for asset protection and privacy.</p>',
    coverImage: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=600',
    published: true,
    categoryName: 'Incorporation',
  },
  {
    slug: 'double-taxation-treaties-matrix',
    title: 'Double Taxation Treaties Matrix',
    excerpt: 'Re-evaluating cross-border dividend flows in light of new OECD minimum tax frameworks.',
    content: '<p>Re-evaluating cross-border dividend flows in light of new OECD minimum tax frameworks. Stay ahead of regulatory changes and optimize your international investments.</p>',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600',
    published: true,
    categoryName: 'Taxes',
  },
  {
    slug: 'institutional-shift-bitcoin-etfs',
    title: 'The Institutional Shift: Why ETFs Changed Bitcoin Forever',
    excerpt: 'Examining the massive liquidity inflow from Wall Street giants and what it means for the future.',
    content: '<p>Examining the massive liquidity inflow from Wall Street giants and what it means for the future. The integration of digital assets into traditional finance marks a pivotal moment.</p>',
    coverImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=600',
    published: true,
    categoryName: 'Crypto & Policy',
  },
  {
    slug: 'commercial-real-estate-renaissance',
    title: "Commercial Real Estate's Quiet Renaissance",
    excerpt: 'Beyond the office collapse, multi-family and industrial properties are hitting record valuations.',
    content: '<p>Beyond the office collapse, multi-family and industrial properties are hitting record valuations. Discover the underlying trends driving this resurgence.</p>',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    published: true,
    categoryName: 'Real Estate',
  }
];

async function main() {
  console.log('Seeding database with mock articles...');
  
  // Create an author to assign the articles to
  let author = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });
  
  if (!author) {
    author = await prisma.user.findFirst();
  }
  
  if (!author) {
    console.error('No users found in the database. Please create an admin user first.');
    return;
  }

  for (const item of mockArticles) {
    // Upsert Category
    let category = await prisma.category.findFirst({
      where: { name: item.categoryName }
    });
    
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: item.categoryName,
          slug: item.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: `Category for ${item.categoryName}`,
        }
      });
    }

    // Upsert Article
    const existing = await prisma.article.findUnique({
      where: { slug: item.slug }
    });

    if (!existing) {
      await prisma.article.create({
        data: {
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: item.content,
          coverImage: item.coverImage,
          published: item.published,
          categoryId: category.id,
          authorId: author.id,
        }
      });
      console.log(`Created article: ${item.title}`);
    } else {
      console.log(`Article already exists: ${item.title}`);
    }
  }
  
  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
