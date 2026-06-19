const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = [
  {
    categoryName: 'Incorporation',
    articles: [
      { title: 'Distinct Legal Identity', content: 'A Private Limited Company possesses an independent legal entity distinct from its proprietors. It has the capacity to own assets, engage in contractual agreements, and initiate or defend legal actions under its own name.' },
      { title: 'Continuous Existence', content: 'The company\'s existence persists irrespective of shifts in shareholders or directors. Its existence is not contingent upon the lifespan of its associates.' },
      { title: 'Ease of Funding & Investments', content: 'Raising capital by issuing shares to investors, venture capitalists, or angel investors is easier. This structure attracts external investment and removes capital worries when an entrepreneur starts a company.' },
      { title: 'Tax Benefits', content: 'Private Limited Companies may qualify for various tax benefits and exemptions, making them tax-efficient entities.' },
      { title: 'Credibility and Trust', content: 'Having "Pvt. Ltd." in your company name often instills more confidence and trust in clients, customers, suppliers, and partners.' },
      { title: 'Regulatory Compliance', content: 'Private Limited Companies follow well-defined compliance and governance norms, which ensures transparency.' }
    ]
  },
  {
    categoryName: '360° Compliance',
    articles: [
      { title: 'ADT-1 Filings', content: 'Auditor Appointment Forms - Professional handling of statutory auditor appointment documentation and filings.' },
      { title: 'Board Resolution Preparation', content: 'Drafting and preparing resolutions for board meetings with complete legal compliance and professional documentation.' },
      { title: 'Profit and Loss Statements', content: 'Preparation of detailed Profit and Loss Statements ensuring accuracy and compliance with accounting standards.' },
      { title: 'Accounts Preparation', content: 'Comprehensive preparation of company accounts with meticulous attention to detail and regulatory requirements.' },
      { title: 'Balance Sheet Preparation', content: 'Accurate and compliant preparation of the balance sheet following all statutory norms and accounting principles.' },
      { title: 'AGM Report Preparation', content: 'Drafting and filing the Annual General Meeting (AGM) report with comprehensive documentation.' },
      { title: 'MGT-7 Filings', content: 'Filing of the Annual Return with the Registrar of Companies ensuring timely compliance.' },
      { title: 'AOC-4 Filings', content: 'Filing of the Financial Statements and related documents with complete accuracy.' },
      { title: 'DIN eKYC Filings', content: 'Director Identification Number (DIN) eKYC compliance ensuring all directors meet regulatory requirements.' },
      { title: 'ITR-6 Filings', content: 'Filing the Income Tax Return (ITR-6) for the company with professional tax planning and compliance.' },
      { title: 'DSC Renewal', content: 'Timely renewal of Digital Signature Certificates for directors and signatories to ensure seamless compliance.' },
      { title: 'Auditor Consultation', content: 'Professional consultation with auditors for compliance guidance and regulatory alignment.' }
    ]
  },
  {
    categoryName: 'Trademark',
    articles: [
      { title: 'Distinct Legal Identity - Trademark', content: 'A Private Limited Company possesses an independent legal entity distinct from its proprietors. It has the capacity to own assets, engage in contractual agreements, and initiate or defend legal actions under its own name.' },
      { title: 'Continuous Existence - Trademark', content: 'The company\'s existence persists irrespective of shifts in shareholders or directors. Its existence is not contingent upon the lifespan of its associates.' },
      { title: 'Ease of Funding & Investments - Trademark', content: 'Raising capital by issuing shares to investors, venture capitalists, or angel investors is easier. This structure attracts external investment and removes capital worries when an entrepreneur starts a company.' },
      { title: 'Tax Benefits - Trademark', content: 'Private Limited Companies may qualify for various tax benefits and exemptions, making them tax-efficient entities.' },
      { title: 'Credibility and Trust - Trademark', content: 'Having "Pvt. Ltd." in your company name often instills more confidence and trust in clients, customers, suppliers, and partners.' },
      { title: 'Regulatory Compliance - Trademark', content: 'Private Limited Companies follow well-defined compliance and governance norms, which ensures transparency.' }
    ]
  },
  {
    categoryName: 'Taxes',
    articles: [
      { title: 'Legal Recognition', content: 'A firm can obtain legal recognition as a supplier of goods or services by registering for GST. This validates the company\'s legal status as an official entity.' },
      { title: 'Input Tax Credit (ITC)', content: 'Registered businesses can claim Input Tax Credit for GST paid on purchases, reducing their overall tax liability.' },
      { title: 'Simplified Process', content: 'GST streamlines tax submission and payments through a single online portal, reducing compliance time and complexity.' },
      { title: 'Composition Scheme', content: 'The Composition Scheme allows eligible small businesses to pay tax at a lower rate, reducing compliance burden and simplifying accounting.' },
      { title: 'Higher Threshold for GST Registration', content: 'Only businesses with turnover above the prescribed threshold are required to register, which relieves many small firms from mandatory registration obligations.' },
      { title: 'Eliminates the Cascading Effect of Taxes', content: 'GST allows input tax credit across the supply chain, preventing tax-on-tax and lowering the final tax burden for consumers.' }
    ]
  },
  {
    categoryName: 'Wealth Strategy',
    slug: 'strategy',
    articles: [
      { title: 'The New Paradigm of Offshore Banking', content: 'A comprehensive guide on modern offshore banking strategies, asset protection, and tax-efficient wealth management for high-net-worth individuals and global entities.' },
      { title: 'Asset Protection in Multipolar Jurisdictions', content: 'Detailed walkthrough of trusts, foundation structures, and multi-tier corporate architecture in key secure global zones to maximize legal immunity and control.' },
      { title: 'Optimizing Corporate Tax Structuring', content: 'Step-by-step framework for using dual-jurisdiction holding companies, transfer pricing compliance, and treaty shopping to minimize effective tax rates.' }
    ]
  },
  {
    categoryName: 'Global Markets',
    slug: 'markets',
    articles: [
      { title: 'Navigating Commodity Fluctuations in 2026', content: 'Comprehensive analysis of energy, metal, and agricultural markets amidst rising geopolitical frictions and regional supply chain shifts.' },
      { title: 'The Rise of Tech Sovereignty Zones', content: 'An in-depth look at emerging technology hubs in Southeast Asia, the Middle East, and Europe offering tax holidays, IP protection, and sandbox environments.' },
      { title: 'Cross-Border Capital Allocation', content: 'A tactical guide on hedging foreign exchange risk, executing direct investments in developing markets, and structuring sovereign bond exposures.' }
    ]
  }
];

const generateSlug = (text) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 8);
};

async function main() {
  const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!adminUser) {
    console.error('No ADMIN user found to set as author.');
    return;
  }

  for (const catData of data) {
    let category = await prisma.category.findUnique({ where: { name: catData.categoryName } });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: catData.categoryName,
          slug: catData.slug || generateSlug(catData.categoryName)
        }
      });
      console.log(`Created category: ${category.name}`);
    } else {
      console.log(`Found category: ${category.name}`);
    }

    for (const articleData of catData.articles) {
      // Avoid duplicate articles
      const existing = await prisma.article.findFirst({ where: { title: articleData.title, categoryId: category.id } });
      if (!existing) {
        await prisma.article.create({
          data: {
            title: articleData.title,
            slug: generateSlug(articleData.title),
            content: articleData.content,
            excerpt: articleData.content.substring(0, 150) + (articleData.content.length > 150 ? '...' : ''),
            published: true,
            authorId: adminUser.id,
            categoryId: category.id
          }
        });
        console.log(`  Created article: ${articleData.title}`);
      } else {
        console.log(`  Found article: ${articleData.title}`);
      }
    }
  }
}

main()
  .then(() => {
    console.log('Seed successful.');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Seed failed.', e);
    process.exit(1);
  });
