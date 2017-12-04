/**
* @fileOverview
* Módulo com os parâmetros de configuração.
*/

'use strict';

var Config_ = (function(config) {
  
  config.UI = {
    TITULO: 'Contadoria Planilhas',
    FAVICON_URL: 'https://raw.githubusercontent.com/Contadoria/contadoria.github.io/bab78523c78bd27b577d54a034f60d3c0a43cd8c/images/favicon-planilhas.png'
  };
  
  config.STATUS = {
    OK: 'ok',
    ERRO: {
      USUARIO: 'erro usuario',
      SISTEMA: 'erro sistema'
    }
  };
  
  config.PLANILHA = {
    NOME: {
      TC: 'CalculoTC',
      RMI: 'CalculoRMI',
      ATRASADOS: 'CalculoAtrasados',
      ESTATISTICA: 'Estatística Template'
    }
  };
  
  config.GOOGLE = {
    URL: {
      AUTHORIZE: 'https://accounts.google.com/o/oauth2/auth',
      TOKEN: 'https://accounts.google.com/o/oauth2/token',
      REDIRECT: ScriptApp.getService().getUrl(),
      DRIVE_API: 'https://www.googleapis.com/drive/v3'
    },
    SCOPES: [
      'https://www.googleapis.com/auth/drive.install',
      'https://www.googleapis.com/auth/drive'
    ]
  };
  
  config.STORAGE = {
    URL: {
      ERROS: 'ERROS_URL',
      PASTA_DISTRIBUICAO: 'PASTA_DISTRIBUICAO_URL'
    },
    ID: {
      PASTA_DISTRIBUICAO: 'PASTA_DISTRIBUICAO_ID'
    },
    GOOGLE: {
      TOKEN: 'GOOGLE_OAUTH_TOKEN',
      REFRESH: 'GOOGLE_OAUTH_REFRESH',
      EXPIRY: 'GOOGLE_OAUTH_EXPIRY',
      CLIENT_ID: 'CLIENT_ID',
      CLIENT_SECRET: 'CLIENT_SECRET'
    },
  };
  
  return config;
  
})(Config_ || Object.create(null));