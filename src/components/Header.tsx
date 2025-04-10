import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Save, 
  Download, 
  FileDown, 
  LogIn, 
  LogOut, 
  User, 
  Trash2,
  Settings,
  UserCog,
  ChevronDown,
  ChevronLeft,
  Edit2,
  List,
  Menu,
  X,
  Copy
} from "lucide-react";
import { User as UserType } from '@/utils/auth';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onSavePlan: () => void;
  onExportPlan: () => void;
  onExportPlanAsPdf: () => void;
  onCopyPlan?: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onDeleteClick: () => void;
  onUserSettings?: () => void;
  onRenamePlan?: () => void;
  onToggleChecklist?: () => void;
  isChecklistVisible?: boolean;
  currentUser: any;
  canDelete: boolean;
  currentPlanTitle?: string;
  showActions?: boolean;
  onBackToDashboard?: () => void;
  isLoading?: boolean; // Adicionar indicador de carregamento
}

const Header: React.FC<HeaderProps> = ({ 
  onSavePlan, 
  onExportPlan,
  onExportPlanAsPdf,
  onCopyPlan,
  onLoginClick,
  onLogout,
  onDeleteClick,
  onUserSettings,
  onRenamePlan,
  onToggleChecklist,
  isChecklistVisible,
  currentUser,
  canDelete,
  currentPlanTitle,
  showActions = true,
  onBackToDashboard,
  isLoading = false
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Handle clicks outside the user menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    }
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="glass sticky top-0 z-10 px-3 sm:px-6 py-3 sm:py-4 mb-4 sm:mb-8 rounded-b-xl flex justify-between items-center animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3">
        {showActions && onBackToDashboard ? (
          <button
            onClick={onBackToDashboard}
            className="text-muted-foreground hover:text-primary transition-colors mr-2"
            title="Voltar para o Dashboard"
          >
            <ChevronLeft size={20} />
          </button>
        ) : null}
        
        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-medium">EduCraft</h1>
          {currentUser && currentPlanTitle && showActions && (
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground truncate max-w-[140px] sm:max-w-none">
                {currentPlanTitle}
              </p>
              {onRenamePlan && (
                <button 
                  onClick={onRenamePlan}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Renomear plano"
                >
                  <Edit2 size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Indicador de carregamento */}
      {isLoading && (
        <div className="flex items-center gap-2 text-primary text-sm animate-pulse">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Sincronizando...</span>
        </div>
      )}
      
      {currentUser ? (
        <>
          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-2">
            {showActions && (
              <>
                <button 
                  onClick={onSavePlan}
                  className="btn btn-ghost text-sm flex items-center gap-1"
                  aria-label="Salvar plano"
                >
                  <Save className="h-4 w-4" />
                  <span>Salvar</span>
                </button>
                
                {onCopyPlan && (
                  <button 
                    onClick={onCopyPlan}
                    className="btn btn-ghost text-sm flex items-center gap-1"
                    aria-label="Copiar plano"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copiar</span>
                  </button>
                )}
                
                {canDelete && (
                  <button 
                    onClick={onDeleteClick}
                    className="btn btn-ghost text-sm flex items-center gap-1 text-destructive"
                    aria-label="Excluir plano"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Excluir</span>
                  </button>
                )}
                
                {onToggleChecklist && (
                  <button 
                    onClick={onToggleChecklist}
                    className={`btn ${isChecklistVisible ? 'btn-primary' : 'btn-ghost'} text-sm flex items-center gap-1`}
                    aria-label="Checklist"
                    title="Visualizar checklist do plano"
                  >
                    <List className="h-4 w-4" />
                    <span>Checklist</span>
                  </button>
                )}
                
                <div className="relative group">
                  <button 
                    className="btn btn-ghost text-sm flex items-center gap-1"
                    aria-label="Exportar plano"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exportar</span>
                  </button>
                  
                  <div className="absolute right-0 mt-1 w-40 bg-background shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <button 
                      onClick={onExportPlanAsPdf}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                    >
                      <FileDown className="h-4 w-4" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {/* User Menu Dropdown */}
            <div className="relative ml-4 border-l pl-4 border-border" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 hover:text-primary transition-colors py-1 px-2 rounded-md"
                aria-label="Menu do usuário"
                aria-expanded={isUserMenuOpen}
              >
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{currentUser.name}</span>
                  <span className="text-xs text-muted-foreground">{currentUser.username}</span>
                </div>
                <User className="h-5 w-5" />
                <ChevronDown className="h-4 w-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background shadow-lg rounded-md overflow-hidden z-50 border border-border animate-scale-in origin-top-right">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.username}</p>
                  </div>
                  
                  <div className="p-1">
                    {onUserSettings && (
                      <button 
                        onClick={() => {
                          onUserSettings();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent rounded-md flex items-center gap-2"
                      >
                        <UserCog className="h-4 w-4" />
                        <span>Configurações da conta</span>
                      </button>
                    )}
                    
                    <button 
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent rounded-md flex items-center gap-2 text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-accent transition-colors mobile-menu-button"
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          {/* Mobile menu drawer */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/20 md:hidden"
              aria-hidden="true"
            >
              <div
                ref={mobileMenuRef}
                className="absolute right-0 top-0 h-full w-64 bg-background shadow-xl animate-slide-in p-4 overflow-y-auto flex flex-col"
              >
                {/* Mobile user info */}
                <div className="p-3 border-b border-border mb-4">
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground break-all">{currentUser.username}</p>
                </div>
                
                {/* Mobile menu items */}
                <div className="space-y-3">
                  {showActions && (
                    <>
                      {onBackToDashboard && (
                        <button 
                          onClick={() => {
                            onBackToDashboard();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full px-3 py-3 text-left font-medium hover:bg-accent rounded-md flex items-center gap-3"
                        >
                          <ChevronLeft className="h-5 w-5" />
                          <span>Voltar ao Dashboard</span>
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          onSavePlan();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full px-3 py-3 text-left font-medium hover:bg-accent rounded-md flex items-center gap-3"
                      >
                        <Save className="h-5 w-5" />
                        <span>Salvar Plano</span>
                      </button>
                      
                      {onCopyPlan && (
                        <button 
                          onClick={() => {
                            onCopyPlan();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full px-3 py-3 text-left font-medium hover:bg-accent rounded-md flex items-center gap-3"
                        >
                          <Copy className="h-5 w-5" />
                          <span>Copiar Plano</span>
                        </button>
                      )}
                      
                      {canDelete && (
                        <button 
                          onClick={() => {
                            onDeleteClick();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full px-3 py-3 text-left font-medium hover:bg-accent rounded-md flex items-center gap-3 text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span>Excluir Plano</span>
                        </button>
                      )}
                      
                      {currentPlanTitle && onRenamePlan && (
                        <button 
                          onClick={() => {
                            onRenamePlan();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full px-3 py-3 text-left font-medium hover:bg-accent rounded-md flex items-center gap-3"
                        >
                          <Edit2 className="h-5 w-5" />
                          <span>Renomear Plano</span>
                        </button>
                      )}
                      
                      {onToggleChecklist && (
                        <button 
                          onClick={() => {
                            onToggleChecklist();
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full px-3 py-3 text-left font-medium hover:bg-accent rounded-md flex items-center gap-3 ${isChecklistVisible ? 'text-primary' : ''}`}
                        >
                          <List className="h-5 w-5" />
                          <span>Ver Checklist</span>
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          onExportPlanAsPdf();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full px-3 py-3 text-left font-medium hover:bg-accent rounded-md flex items-center gap-3"
                      >
                        <FileDown className="h-5 w-5" />
                        <span>Exportar como PDF</span>
                      </button>
                    </>
                  )}
                </div>
                
                {/* Mobile settings and logout */}
                <div className="mt-auto pt-4 border-t border-border">
                  {onUserSettings && (
                    <button 
                      onClick={() => {
                        onUserSettings();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-3 py-3 text-left font-medium hover:bg-accent rounded-md flex items-center gap-3"
                    >
                      <UserCog className="h-5 w-5" />
                      <span>Configurações da conta</span>
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-3 py-3 text-left font-medium hover:bg-accent rounded-md flex items-center gap-3 text-destructive"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <button 
          onClick={onLoginClick}
          className="btn btn-primary text-sm flex items-center gap-1"
          aria-label="Entrar"
        >
          <LogIn className="h-4 w-4" />
          <span>Entrar</span>
        </button>
      )}
    </header>
  );
};

export default Header;
