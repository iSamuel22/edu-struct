import React from 'react';
import { FileText, Save, Upload, Download, FileDown, LogIn, LogOut, User, Trash2 } from "lucide-react";
import { User as UserType } from '@/utils/auth';

interface HeaderProps {
  onNewPlan: () => void;
  onLoadPlan: () => void;
  onSavePlan: () => void;
  onExportPlan: () => void;
  onExportPlanAsPdf: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onDeleteClick: () => void;
  currentUser: any;
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
  return (
    <header className="glass sticky top-0 z-10 px-6 py-4 mb-8 rounded-b-xl flex justify-between items-center animate-fade-in">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-medium">EduCraft</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {currentUser ? (
          <>
            <button 
              onClick={onNewPlan}
              className="btn btn-ghost text-sm flex items-center gap-1"
              aria-label="Novo plano"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Novo</span>
            </button>
            
            <button 
              onClick={onLoadPlan}
              className="btn btn-ghost text-sm flex items-center gap-1"
              aria-label="Carregar plano"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Carregar</span>
            </button>
            
            <button 
              onClick={onSavePlan}
              className="btn btn-ghost text-sm flex items-center gap-1"
              aria-label="Salvar plano"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Salvar</span>
            </button>
            
            {canDelete && (
              <button 
                onClick={onDeleteClick}
                className="btn btn-ghost text-sm flex items-center gap-1 text-destructive"
                aria-label="Excluir plano"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Excluir</span>
              </button>
            )}
            
            <div className="relative group">
              <button 
                className="btn btn-primary text-sm flex items-center gap-1"
                aria-label="Exportar plano"
              >
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
              
              <div className="absolute right-0 mt-1 w-40 bg-background shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button 
                  onClick={onExportPlan}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  <span>TXT</span>
                </button>
                <button 
                  onClick={onExportPlanAsPdf}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
            
            <div className="ml-4 border-l pl-4 border-border flex items-center gap-2">
              <span className="text-sm hidden md:inline">Olá, {currentUser.name}</span>
              <button 
                onClick={onLogout}
                className="btn btn-ghost text-sm flex items-center gap-1"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
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
      </div>
    </header>
  );
};

export default Header;
