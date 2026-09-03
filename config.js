/**
 * =========================================================================
 * PROJETO CRESCER • FACISC - ARQUIVO DE CONFIGURAÇÃO CENTRALIZADA
 * =========================================================================
 * 
 * Este arquivo controla as integrações e endpoints da aplicação sem expor
 * nenhum formulário ou campo de configuração técnica para os usuários finais.
 */

const APP_CONFIG = {
    // Identificação do Projeto
    PROJECT_NAME: "Projeto Crescer • FACISC",
    INSTITUTION: "Federação das Associações Empresariais de Santa Catarina",

    // Planilha do Google Corporativa
    SPREADSHEET_ID: "10N0u6C8KH4LONP9taFFr5TuYYLaF2amrHYmSYUrjEyg",
    SPREADSHEET_URL: "https://docs.google.com/spreadsheets/d/10N0u6C8KH4LONP9taFFr5TuYYLaF2amrHYmSYUrjEyg/edit?usp=sharing",

    // URL do Web App gerada após implantar o script no Google Apps Script
    // Cole aqui a URL gerada (Ex: "https://script.google.com/macros/s/AKfycb.../exec")
    WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbzeYoZ60vsebha0N47vUlE7bcyQJtPfa6XMIGpImhju0LyNMWosnoenXYaG0m4AfUkL/exec",

    // Opções gerais
    AUTO_SAVE_LOCAL_DRAFT: true,
    ENABLE_ANIMATIONS: true
};

// Congela o objeto para evitar mutações acidentais
Object.freeze(APP_CONFIG);
