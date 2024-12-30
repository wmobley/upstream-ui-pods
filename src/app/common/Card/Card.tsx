import { Link } from 'react-router-dom';

interface CardProps {
  title: string;
  subtitle?: string;
  to?: string;
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  to,
  className = '',
  children,
}) => {
  const CardContent = () => (
    <div
      className={`relative flex h-full transform items-end border-2 border-black bg-white transition-transform hover:scale-105 ${className}`}
    >
      <div className="p-4 transition-opacity sm:p-6 lg:p-8">
        <h2 className="mt-4 text-xl font-medium sm:text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        {children}
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
