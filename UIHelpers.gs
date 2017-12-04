/**
* @fileOverview
* Módulo das rotinas auxiliares de UI.
*/

/**
* Rotina para incluir conteúdo de arquivos no template html.
*
* @public
* @param {String} nomeArquivo Nome do arquivo cujo conteúdo deva ser inserido no template.
* @return {string} Retorna uma string html com o conteúdo a ser inserido. 
*/
function incluir(nomeArquivo) {
  return HtmlService.createHtmlOutputFromFile(nomeArquivo).getContent();
}

/**
* Rotina para envio dos dados iniciais ao cliente.
*
* @public
* @param {string} errString String com os dados do erro. 
* @return {void} 
*/
function registrarErro(errString) {
  try {
    Erros_.informar(errString).logCentral();
  } catch (e) {
  }
}

/**
* Rotina para obtenção de imagem e conversão em base64.
*
* @private
* @param {string} url Url da imagem. 
* @return {string} Retorna imagem em formato base64 ou o próprio url, se houver um erro
*/
function obterImagem_(url) {
  try {
    var headers = {
      'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
    };
    var options = {
      'method': 'get',
      'headers': headers,
      'muteHttpExceptions': true
    };  
    return 'data:image/jpeg;base64,' + Utilities.base64Encode(UrlFetchApp.fetch(url, options).getBlob().getBytes());
  } catch(e) {
    Erros_.informar(e).logCentral();
    throw e;
    return url;
  }
}