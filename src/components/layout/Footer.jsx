import { HeartIcon } from '@heroicons/react/24/solid';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Paleta Accesible. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center space-x-1 mt-2 md:mt-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">Hecho con</span>
            <HeartIcon className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">y React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
