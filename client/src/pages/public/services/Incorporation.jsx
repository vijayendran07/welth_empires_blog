import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../lib/axios';
import ArticleCard from '../../../components/cards/ArticleCard';

const mockArticles = [
  {
    id: 'mock-1',
    slug: 'global-incorporation-strategies-2024',
    title: 'Global Incorporation Strategies for 2024',
    excerpt: 'Discover the most advantageous jurisdictions for establishing a holding company with strong legal identity...',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600',
    category: { id: 'incorporation', name: 'Incorporation' },
    categoryId: 'incorporation',
    published: true,
    createdAt: '2024-03-12T00:00:00.000Z',
    readTime: '8 min read',
    author: { name: 'Julian Draxler', avatarUrl: '' }
  },
  {
    id: 'mock-2',
    slug: 'ultimate-guide-corporate-compliance',
    title: 'The Ultimate Guide to Corporate Compliance',
    excerpt: 'Navigate the complex web of multi-jurisdictional reporting and maintain your corporate veil...',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600',
    category: { id: 'compliance', name: '360° Compliance' },
    categoryId: 'compliance',
    published: true,
    createdAt: '2024-03-10T00:00:00.000Z',
    readTime: '12 min read',
    author: { name: 'Sarah Mitchell', avatarUrl: '' }
  },
  {
    id: 'mock-3',
    slug: 'protecting-your-brand-trademark',
    title: 'Protecting Your Global Brand Sovereignty',
    excerpt: 'Expert analysis on securing intellectual property rights across the US, EU, and key emerging markets...',
    coverImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600',
    category: { id: 'trademark', name: 'Trademark' },
    categoryId: 'trademark',
    published: true,
    createdAt: '2024-03-08T00:00:00.000Z',
    readTime: '6 min read',
    author: { name: 'Arthur Lee', avatarUrl: '' }
  },
  {
    id: 'mock-4',
    slug: 'corporate-tax-optimization-2024',
    title: 'Corporate Tax Optimization for HNIs',
    excerpt: 'An actionable blueprint for structuring your assets to legally minimize corporate tax burdens globally...',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
    category: { id: 'taxes', name: 'Taxes' },
    categoryId: 'taxes',
    published: true,
    createdAt: '2024-03-05T00:00:00.000Z',
    readTime: '15 min read',
    author: { name: 'Elena Moretti', avatarUrl: '' }
  },
  {
    id: 'mock-5',
    slug: 'offshore-banking-and-incorporation',
    title: 'Offshore Banking & Jurisdiction Analysis',
    excerpt: 'How tier-one custodians view various incorporation structures when assessing compliance and risk.',
    coverImage: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=600',
    category: { id: 'incorporation', name: 'Incorporation' },
    categoryId: 'incorporation',
    published: true,
    createdAt: '2024-03-02T00:00:00.000Z',
    readTime: '10 min read',
    author: { name: 'Marcus Sterling', avatarUrl: '' }
  },
  {
    id: 'mock-6',
    slug: 'double-taxation-treaties-matrix',
    title: 'Double Taxation Treaties Matrix',
    excerpt: 'Re-evaluating cross-border dividend flows in light of new OECD minimum tax frameworks.',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600',
    category: { id: 'taxes', name: 'Taxes' },
    categoryId: 'taxes',
    published: true,
    createdAt: '2024-02-27T00:00:00.000Z',
    readTime: '9 min read',
    author: { name: 'Sophia Sterling', avatarUrl: '' }
  }
];

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const services = [
  {
    id: 'incorporation',
    label: 'Incorporation',
    icon: 'business',
    tagline: 'Private Limited Company Incorporation',
    subtitle: (
      <div className="mt-6 text-[16px] text-gray-600 leading-relaxed block">
        
        <div className="float-right w-[45%] md:w-[35%] lg:w-[30%] aspect-[4/3] rounded-2xl overflow-hidden shadow-md ml-6 lg:ml-8 mb-6 mt-2">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600" 
            alt="Corporate office structure" 
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-[24px] font-extrabold text-gray-900 leading-tight mb-6">
          Establishing Your Corporate Empire
        </h3>
        
        <p className="mb-5">
          <strong>A Private Limited Company</strong> is India's most popular business structure. It offers several critical advantages for the modern empire builder, ensuring your personal assets are protected while unlocking significant growth opportunities.
        </p>

        <h4 className="text-[20px] font-bold text-gray-900 mb-3 mt-8">
          The Foundation of Trust and Scale
        </h4>
        <p className="mb-5">
          Incorporation separates your personal identity from your business entity. This <strong>distinct legal identity</strong> provides perpetual succession, meaning the company lives on regardless of changes in ownership or management, making it an incredibly robust vehicle for multi-generational wealth and investment.
        </p>

        <h4 className="text-[20px] font-bold text-gray-900 mb-3 mt-8">
          Attracting Institutional Capital
        </h4>
        <p className="mb-5">
          Venture capitalists, private equity firms, and major banking institutions heavily favor the Private Limited structure. By organizing your business with formal shares, a clear board of directors, and compliance protocols, you dramatically increase your valuation potential and funding readiness.
        </p>
        
        <div className="clear-both"></div>
      </div>
    ),
    sections: [
      {
        type: 'numbered-cards',
        heading: 'Why Choose Private Limited Company?',
        items: [
          { id: '01', title: 'Distinct Legal Identity', desc: "A Private Limited Company possesses an independent legal entity distinct from its proprietors. It has the capacity to own assets, engage in contractual agreements, and initiate or defend legal actions under its own name." },
          { id: '02', title: 'Continuous Existence', desc: "The company's existence persists irrespective of shifts in shareholders or directors. Its existence is not contingent upon the lifespan of its associates." },
          { id: '03', title: 'Ease of Funding & Investments', desc: "Raising capital by issuing shares to investors, venture capitalists, or angel investors is easier. This structure attracts external investment and removes capital worries when an entrepreneur starts a company." },
          { id: '04', title: 'Tax Benefits', desc: "Private Limited Companies may qualify for various tax benefits and exemptions, making them tax-efficient entities." },
          { id: '05', title: 'Credibility and Trust', desc: 'Having "Pvt. Ltd." in your company name often instills more confidence and trust in clients, customers, suppliers, and partners.' },
          { id: '06', title: 'Regulatory Compliance', desc: "Private Limited Companies follow well-defined compliance and governance norms, which ensures transparency." },
        ]
      }
    ]
  },
  {
    id: 'compliance',
    label: '360° Compliance',
    icon: 'verified_user',
    tagline: '360° Compliance Services',
    subtitle: (
      <div className="mt-6 text-[16px] text-gray-600 leading-relaxed block">
        
        <div className="float-right w-[45%] md:w-[35%] lg:w-[30%] aspect-[4/3] rounded-2xl overflow-hidden shadow-md ml-6 lg:ml-8 mb-6 mt-2">
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600" 
            alt="Corporate governance and compliance" 
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-[24px] font-extrabold text-gray-900 leading-tight mb-6">
          Bulletproof Your Corporate Governance
        </h3>
        
        <p className="mb-5">
          <strong>360° Compliance Services</strong> provide end-to-end statutory and regulatory management for your company. From routine auditor filings to mandatory annual general meeting documentation, maintaining an impeccable compliance record is non-negotiable for modern enterprises.
        </p>

        <h4 className="text-[20px] font-bold text-gray-900 mb-3 mt-8">
          Risk Mitigation & Director Protection
        </h4>
        <p className="mb-5">
          Failing to adhere to regulatory guidelines can result in severe financial penalties, operational roadblocks, and even director disqualification. Our comprehensive compliance suite ensures that <strong>every statutory deadline is met flawlessly</strong>.
        </p>

        <h4 className="text-[20px] font-bold text-gray-900 mb-3 mt-8">
          Focus on Growth, Not Paperwork
        </h4>
        <p className="mb-5">
          We handle the intricate details of MGT-7, AOC-4, DIN eKYC, and continuous board resolution drafting. By outsourcing your corporate secretarial burden to Wealth Empires, your leadership team reclaims hundreds of hours to focus strictly on strategic expansion.
        </p>
        
        <div className="clear-both"></div>
      </div>
    ),
    sections: [
      {
        type: 'checklist-grid',
        heading: 'Our Complete Compliance Suite',
        items: [
          { title: 'ADT-1 Filings', desc: 'Professional handling of statutory auditor appointment documentation and filings.' },
          { title: 'Board Resolution Preparation', desc: 'Drafting and preparing resolutions for board meetings with complete legal compliance and professional documentation.' },
          { title: 'Profit and Loss Statements', desc: 'Preparation of detailed Profit and Loss Statements ensuring accuracy and compliance with accounting standards.' },
          { title: 'Accounts Preparation', desc: 'Comprehensive preparation of company accounts with meticulous attention to detail and regulatory requirements.' },
          { title: 'Balance Sheet Preparation', desc: 'Accurate and compliant preparation of the balance sheet following all statutory norms and accounting principles.' },
          { title: 'AGM Report Preparation', desc: 'Drafting and filing the Annual General Meeting (AGM) report with comprehensive documentation.' },
          { title: 'MGT-7 Filings', desc: 'Filing of the Annual Return with the Registrar of Companies ensuring timely compliance.' },
          { title: 'AOC-4 Filings', desc: 'Filing of the Financial Statements and related documents with complete accuracy.' },
          { title: 'DIN eKYC Filings', desc: 'Director Identification Number (DIN) eKYC compliance ensuring all directors meet regulatory requirements.' },
          { title: 'ITR-6 Filings', desc: 'Filing the Income Tax Return (ITR-6) for the company with professional tax planning and compliance.' },
          { title: 'DSC Renewal', desc: 'Timely renewal of Digital Signature Certificates for directors and signatories to ensure seamless compliance.' },
          { title: 'Auditor Consultation', desc: 'Professional consultation with auditors for compliance guidance and regulatory alignment.' },
        ]
      }
    ]
  },
  {
    id: 'trademark',
    label: 'Trademark',
    icon: 'gavel',
    tagline: 'Trademark Registration & IP Protection',
    subtitle: (
      <div className="mt-6 text-[16px] text-gray-600 leading-relaxed block">
        
        <div className="float-right w-[45%] md:w-[35%] lg:w-[30%] aspect-[4/3] rounded-2xl overflow-hidden shadow-md ml-6 lg:ml-8 mb-6 mt-2">
          <img 
            src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600" 
            alt="Legal protection and trademark" 
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-[24px] font-extrabold text-gray-900 leading-tight mb-6">
          Securing Your Intellectual Property
        </h3>
        
        <p className="mb-5">
          <strong>Trademark Registration & IP Protection</strong> ensures your brand sovereignty remains unchallenged. Secure the identity that defines your empire by preventing competitors from capitalizing on your reputation and market presence.
        </p>

        <h4 className="text-[20px] font-bold text-gray-900 mb-3 mt-8">
          An Indispensable Corporate Asset
        </h4>
        <p className="mb-5">
          A registered trademark is not just a defensive shield; it is a highly valuable intangible asset. It can be licensed, franchised, or sold, generating significant secondary revenue streams while legally preventing market confusion.
        </p>

        <h4 className="text-[20px] font-bold text-gray-900 mb-3 mt-8">
          Global Expansion & Enforcement
        </h4>
        <p className="mb-5">
          With the exclusive right to use the ™ or ® symbols, you project authority and premium positioning. <strong>We manage the entire prosecution lifecycle</strong>—from advanced trademark searches to responding to examiner objections—guaranteeing your IP portfolio is rock solid.
        </p>
        
        <div className="clear-both"></div>
      </div>
    ),
    sections: [
      {
        type: 'numbered-cards',
        heading: 'Why Register Your Trademark?',
        items: [
          { id: '01', title: 'Distinct Legal Identity', desc: "A registered trademark gives your brand a legally distinct identity, protecting it from infringement and unauthorised use in commerce." },
          { id: '02', title: 'Continuous Existence', desc: "A trademark can be renewed indefinitely, giving your brand perpetual protection as long as it remains in active commercial use." },
          { id: '03', title: 'Ease of Funding & Investments', desc: "A registered trademark is a valuable intangible asset that can attract investors and can be licensed or franchised to generate additional revenue streams." },
          { id: '04', title: 'Tax Benefits', desc: "Trademark registration costs and associated legal fees may qualify as business expenses, providing potential tax deductions." },
          { id: '05', title: 'Credibility and Trust', desc: 'Using ™ or ® symbols signals professionalism and brand integrity, building trust with customers, partners, and investors globally.' },
          { id: '06', title: 'Regulatory Compliance', desc: "A trademark registration ensures compliance with IP laws, giving you legal standing to enforce your rights against counterfeiters and infringers." },
        ]
      }
    ]
  },
  {
    id: 'taxes',
    label: 'Taxes',
    icon: 'receipt_long',
    tagline: 'GST Registration & Tax Compliance',
    subtitle: (
      <div className="mt-6 text-[16px] text-gray-600 leading-relaxed block">
        
        <div className="float-right w-[45%] md:w-[35%] lg:w-[30%] aspect-[4/3] rounded-2xl overflow-hidden shadow-md ml-6 lg:ml-8 mb-6 mt-2">
          <img 
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600" 
            alt="Tax calculation and compliance" 
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-[24px] font-extrabold text-gray-900 leading-tight mb-6">
          Mastering Tax Compliance: The Strategic Advantage of GST
        </h3>
        
        <p className="mb-5">
          <strong>Goods and Services Tax (GST)</strong> is a comprehensive, multi-stage, destination-based tax that is levied on every value addition. Discover the advantages that GST registration brings to your business — from immediate legal recognition to significant cost savings through the <span className="font-bold text-[#0052cc]">Input Tax Credit (ITC)</span> mechanism.
        </p>

        <h4 className="text-[20px] font-bold text-gray-900 mb-3 mt-8">
          Unlocking Corporate Synergies
        </h4>
        <p className="mb-5">
          Beyond mere regulatory adherence, proper tax structuring and timely registration ensure that your enterprise avoids the cascading effect of taxes. This maintains operational transparency, reduces the final burden on consumers, and keeps your pricing highly competitive.
        </p>

        <h4 className="text-[20px] font-bold text-gray-900 mb-3 mt-8">
          Scale With Confidence
        </h4>
        <p className="mb-4">
          Registered businesses can seamlessly participate in large-scale corporate supply chains, as most enterprise clients strictly require GST-compliant invoices for their own ITC claims. <strong>Without GST registration, you risk being excluded from high-value B2B contracts.</strong>
        </p>
        <p className="mb-5">
          We handle the entire end-to-end process—from initial documentation to filing and continuous compliance—so you can focus entirely on growing your business empire.
        </p>
        
        <div className="clear-both"></div>
      </div>
    ),
    sections: [
      {
        type: 'checklist-grid',
        heading: 'Advantages of GST Registration',
        items: [
          { title: 'Legal Recognition', desc: 'A firm can obtain legal recognition as a supplier of goods or services by registering for GST. This validates the company\'s legal status as an official entity.' },
          { title: 'Input Tax Credit (ITC)', desc: 'Registered businesses can claim Input Tax Credit for GST paid on purchases, reducing their overall tax liability.' },
          { title: 'Simplified Process', desc: 'GST streamlines tax submission and payments through a single online portal, reducing compliance time and complexity.' },
          { title: 'Composition Scheme', desc: 'The Composition Scheme allows eligible small businesses to pay tax at a lower rate, reducing compliance burden and simplifying accounting.' },
          { title: 'Higher Threshold for GST Registration', desc: 'Only businesses with turnover above the prescribed threshold are required to register, which relieves many small firms from mandatory registration obligations.' },
          { title: 'Eliminates the Cascading Effect of Taxes', desc: 'GST allows input tax credit across the supply chain, preventing tax-on-tax and lowering the final tax burden for consumers.' },
        ]
      }
    ]
  }
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
const NumberedCards = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((item, i) => (
      <div
        key={item.id}
        className="bg-white p-7 rounded-2xl hover:-translate-y-0.5 transition-all duration-300 group shadow-sm hover:shadow-md"
        style={{ animationDelay: `${i * 60}ms` }}
      >
        <div className="text-[40px] font-display-xl font-bold text-gray-200 group-hover:text-[#0052cc] transition-colors mb-5 leading-none">
          {item.id}
        </div>
        <h3 className="text-[16px] font-bold text-gray-900 mb-3">{item.title}</h3>
        <p className="text-gray-500 text-[13.5px] leading-relaxed">{item.desc}</p>
      </div>
    ))}
  </div>
);

const ChecklistGrid = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    {items.map((item, i) => (
      <div
        key={i}
        className="flex gap-4 items-start bg-white rounded-2xl p-5 hover:shadow-md transition-all duration-200 shadow-sm group"
      >
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#0052cc] transition-colors">
          <span className="material-symbols-outlined text-[18px] text-[#0052cc] group-hover:text-white transition-colors">check_circle</span>
        </div>
        <div>
          <h3 className="text-[14.5px] font-bold text-gray-900 mb-1 leading-snug">{item.title}</h3>
          <p className="text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const Services = () => {
  const { serviceId } = useParams();
  const activeTab = serviceId || 'incorporation';
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ARTICLES_PER_PAGE = 3;
  
  // Scroll to top and reset pagination when serviceId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(1);
  }, [serviceId]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles').catch(() => ({ data: [] }));
        const dbArticles = (res.data || [])
          .filter(a => a.published)
          .map(art => {
            let catId = null;
            if (art.category) {
              const dbCatName = art.category.name.toLowerCase();
              if (dbCatName.includes('incorporation') || dbCatName.includes('business') || dbCatName.includes('company')) catId = 'incorporation';
              else if (dbCatName.includes('compliance') || dbCatName.includes('law')) catId = 'compliance';
              else if (dbCatName.includes('trademark') || dbCatName.includes('brand') || dbCatName.includes('ip')) catId = 'trademark';
              else if (dbCatName.includes('tax') || dbCatName.includes('finance')) catId = 'taxes';
            }
            return { ...art, categoryId: catId };
          })
          .filter(art => art.categoryId !== null);
        setArticles([...mockArticles, ...dbArticles]);
      } catch (err) {
        setArticles(mockArticles);
      }
    };
    fetchArticles();
  }, []);

  const active = services.find(s => s.id === activeTab);
  const allActiveArticles = articles.filter(a => a.categoryId === activeTab);
  
  const totalPages = Math.ceil(allActiveArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = allActiveArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="bg-[#fafafc] min-h-screen font-interface-body">




      {/* ── Active Service Content ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-10">

        {/* Service Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#0052cc] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-[20px]">{active.icon}</span>
            </div>
            <h2 className="font-display-xl text-[28px] md:text-[34px] font-bold text-gray-900 tracking-tight">
              {active.tagline}
            </h2>
          </div>
          <div className="text-[15px] text-gray-500 leading-relaxed w-full">
            {active.subtitle}
          </div>
        </div>

        {/* Related Articles Section */}
        {allActiveArticles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-[#0052cc] rounded-full"></div>
              <h3 className="font-bold text-[24px] text-gray-900">Latest Insights on {active.label}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-4">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-[13px] transition-colors ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Previous
                </button>
                
                <span className="text-[13px] font-medium text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>

                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-[13px] transition-colors ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer'
                  }`}
                >
                  Next
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sections */}
        {active.sections.map((section, si) => (
          <div key={si} className="mb-12">
            {/* Section heading */}
            <div className="flex items-center gap-3 mb-7">
              <div className="w-1 h-6 bg-[#0052cc] rounded-full"></div>
              <h3 className="font-bold text-[18px] text-gray-900">{section.heading}</h3>
            </div>

            {section.type === 'numbered-cards' && <NumberedCards items={section.items} />}
            {section.type === 'checklist-grid' && <ChecklistGrid items={section.items} />}
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="mt-10 bg-[#0052cc] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h3 className="font-bold text-[22px] text-white mb-2">Ready to get started?</h3>
            <p className="text-white/80 text-[14px] leading-relaxed max-w-xl">
              Our expert team will guide you through every step of the {active.label} process, ensuring full compliance and peace of mind.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href="/contact"
              className="px-7 py-3 bg-white text-[#0052cc] font-bold text-[14px] rounded-xl hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
            >
              Contact Us
            </a>
            <a
              href="/contact"
              className="px-7 py-3 border border-white/30 text-white font-bold text-[14px] rounded-xl hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
