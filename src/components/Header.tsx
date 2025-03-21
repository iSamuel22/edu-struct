import React from 'react';
import { FileText, Save, Upload, Download, FileDown, LogIn, LogOut, Trash2, Menu } from "lucide-react";

interface User {
  name: string;
  email: string;
}

interface HeaderProps {
  onNewPlan: () => void;
  onLoadPlan: () => void;
  onSavePlan: () => void;
  onExportPlan: () => void;
  onExportPlanAsPdf: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onDeleteClick: () => void;
  currentUser: User | null;
  canDelete: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onNewPlan, 
  onLoadPlan, 
  onSavePlan, 
  onExportPlan,
  onExportPlanAsPdf,
  onLoginClick,
  onLogout,
  onDeleteClick,
  currentUser,
  canDelete
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-2 sm:gap-3">
          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <h1 className="text-lg sm:text-xl font-medium">EduCraft</h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {currentUser ? (
            <>
              <button 
                onClick={onNewPlan}
                className="btn btn-ghost text-sm flex items-center gap-1 px-2 py-1.5"
                aria-label="Novo plano"
              >
                <FileText className="h-4 w-4" />
                <span>Novo</span>
              </button>
              
              <button 
                onClick={onLoadPlan}
                className="btn btn-ghost text-sm flex items-center gap-1 px-2 py-1.5"
                aria-label="Carregar plano"
              >
                <Upload className="h-4 w-4" />
                <span>Carregar</span>
              </button>
              
              <button 
                onClick={onSavePlan}
                className="btn btn-ghost text-sm flex items-center gap-1 px-2 py-1.5"
                aria-label="Salvar plano"
              >
                <Save className="h-4 w-4" />
                <span>Salvar</span>
              </button>
              
              {canDelete && (
                <button 
                  onClick={onDeleteClick}
                  className="btn btn-ghost text-sm flex items-center gap-1 text-destructive px-2 py-1.5"
                  aria-label="Excluir plano"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Excluir</span>
                </button>
              )}
              
              <div className="relative group">
                <button 
                  className="btn btn-primary text-sm flex items-center gap-1 px-3 py-1.5"
                  aria-label="Exportar plano"
                >
                  <Download className="h-4 w-4" />
                  <span>Exportar</span>
                </button>
                
                <div className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button 
                    onClick={onExportPlan}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>TXT</span>
                  </button>
                  <button 
                    onClick={onExportPlanAsPdf}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
              
              <div className="ml-4 border-l pl-4 border-gray-200 flex items-center gap-2">
                <span className="text-sm">Olá, {currentUser.name}</span>
                <button 
                  onClick={onLogout}
                  className="btn btn-ghost text-sm flex items-center gap-1 px-2 py-1.5"
                  aria-label="Sair"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={onLoginClick}
              className="btn btn-primary text-sm flex items-center gap-1 px-3 py-1.5"
              aria-label="Entrar"
            >
              <LogIn className="h-4 w-4" />
              <span>Entrar</span>
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          {currentUser ? (
            <>
              <button 
                onClick={onSavePlan}
                className="btn btn-ghost text-sm flex items-center gap-1 px-2 py-1.5"
                aria-label="Salvar plano"
              >
                <Save className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="btn btn-ghost text-sm p-1"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button 
              onClick={onLoginClick}
              className="btn btn-primary text-sm flex items-center gap-1 px-3 py-1.5"
              aria-label="Entrar"
            >
              <LogIn className="h-4 w-4" />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && currentUser && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-2 space-y-1">
            <button 
              onClick={onNewPlan}
              className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span>Novo plano</span>
            </button>
            
            <button 
              onClick={onLoadPlan}
              className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>Carregar plano</span>
            </button>
            
            <button 
              onClick={onExportPlan}
              className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar como TXT</span>
            </button>
            
            <button 
              onClick={onExportPlanAsPdf}
              className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar como PDF</span>
            </button>
            
            {canDelete && (
              <button 
                onClick={onDeleteClick}
                className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir plano</span>
              </button>
            )}

            <div className="pt-2 mt-2 border-t border-gray-100">
              <div className="px-2 py-1 text-sm text-gray-500">
                Olá, {currentUser.name}
              </div>
              <button 
                onClick={onLogout}
                className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
