import { Link } from 'react-router-dom';

const AuthorCard = ({ author }) => {
  const fallbackAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(author.name) + '&background=131b2e&color=fff';

  return (
    <Link to={`/author/${author.id}`} className="group flex flex-col items-center p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-surface-container group-hover:border-primary transition-colors">
        <img 
          src={author.avatarUrl || fallbackAvatar} 
          alt={author.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="font-headline-md text-[20px] font-bold text-primary mb-1 group-hover:text-tertiary-container transition-colors">
        {author.name}
      </h4>
      <p className="text-[11px] uppercase tracking-widest font-bold text-secondary mb-3">
        {author.role === 'ADMIN' ? 'Editor-in-Chief' : 'Senior Contributor'}
      </p>
      <p className="text-label-sm text-secondary line-clamp-3 mb-4 font-normal max-w-xs">
        {author.bio || 'Expert in wealth management, global markets, and tax compliance strategies.'}
      </p>
      <div className="mt-auto w-full pt-4 border-t border-outline-variant flex justify-center gap-6 text-primary">
        <span className="material-symbols-outlined text-[20px] hover:text-tertiary-container transition-colors">language</span>
        <span className="material-symbols-outlined text-[20px] hover:text-tertiary-container transition-colors">mail</span>
      </div>
    </Link>
  );
};

export default AuthorCard;
