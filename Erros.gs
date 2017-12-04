/**
* @fileOverview
* Módulo de tratamento de erros.
*/

'use strict';

var Erros_ = (function(erros) {
  
  /**
  * API para alerta e registro no Log central.
  *
  * @private
  * @param {(Error|Object|string)} erro Objeto de erro nativo ou objeto comum com as propriedades do erro ou string com mensagem de erro.
  * @return {Object} Retorna uma API que dá acesso aos seguintes métodos/propriedades:
  *  a) logCentral (flag=[true] -> this);
  *  b) dados ( () -> Json);
  */
  erros.informar = function(erro) {
    
    if (({}).toString.call(erro).match(/\s([a-zA-Z]+)/)[1].toLowerCase() === 'string') {
      var descricao = 'Erro';
      var detalhes = erro;
    } else {
      var name = (erro && erro.name) || '';
      var message = (erro && erro.message) || '';
      var stack = (erro && erro.stack) || '';
      var descricao = name;
      var detalhes = (name + ": " + message + '\n' + stack).replace(/\n{2,}/g, '\n');
    }
    
    var payload = {
      Timestamp: '',
      Resultado: 'ERRO',
      Descricao: descricao,
      Detalhes: detalhes,
      UsuarioAtivo: Session.getActiveUser().getEmail() || '',
      UsuarioEfetivo: Session.getEffectiveUser().getEmail() || ''
    };
    
    return {
      
      logCentral: function(flag) {
        if (flag !== false) {
          try { 
            var logUrl = PropertiesService.getScriptProperties().getProperty(Config_.STORAGE.URL.ERROS);
            UrlFetchApp.fetch(logUrl, {
              method: 'post',
              payload: payload,
              followRedirects: true,
              muteHttpExceptions: true
            });
          } catch(e) {
            
          }
        }
        return this;
      },
      
      dados: function() {
        var obj = {
          name: erro.name || 'Erro Desconhecido',
          message: erro.message || 'Não informado',
          stack: erro.stack ? String.fromCharCode(10) + erro.stack : ''
        };
        return JSON.stringify(obj);
      }
    };
  };
  
  return erros;
  
})(Erros_ || Object.create(null));