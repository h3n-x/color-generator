import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Fondo con degradado radial azul claro */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-radial"></div>
      
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        {children}
      </main>
    </div>
  );
};

export default Layout;
