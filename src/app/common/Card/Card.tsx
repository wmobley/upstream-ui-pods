import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  subtitle?: string;
  tags?: string[];
  to?: string;
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  tags,
  to,
  className = '',
  children,
}) => {
  const CardContent = () => (
    <div
      className={`relative flex-col h-full transform items-end border-2 border-black bg-white transition-transform hover:scale-105 ${className}`}
    >
      <div className="flex flex-row h-1/2">{children}</div>
      <div className="p-4 h-1/2 transition-opacity sm:p-6 lg:p-8">
        <div className="flex flex-col h-full">
          <h2 className="mt-4 text-xl font-medium sm:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {tags && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="h-64 sm:h-80 lg:h-96">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default Card;
