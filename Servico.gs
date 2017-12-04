/**
* @fileOverview
* Modulo das rotinas principais do aplicativo.
*/

function abrirApp(state) {
  var html = HtmlService.createTemplateFromFile('_index');
  html.idPasta = state.folderId;
  html.nomePasta = DriveApp.getFolderById(state.folderId).getName();
  return html.evaluate()
  .setTitle(Config_.UI.TITULO)
  .setFaviconUrl(Config_.UI.FAVICON_URL);
}

function obterDadosPastaDistribuicao() {
  try {
    var urlDistribuicao = PropertiesService.getScriptProperties().getProperty(Config_.STORAGE.URL.PASTA_DISTRIBUICAO);
    var idDistribuicao = PropertiesService.getScriptProperties().getProperty(Config_.STORAGE.ID.PASTA_DISTRIBUICAO);
    var params = {
      q: '"' + idDistribuicao + '" in parents and trashed = false' // os arquivos postos na lixeira continuam vinculados à pasta original
    };
    var response = Drive.Files.list(params);
    return {
      urlDistribuicao: urlDistribuicao,
      planilhas: response.items.map(function(file) {
        return {
          name: file.title,
          id: file.id,
          thumbnailLink: file.thumbnailLink,
          thumbnail: obterImagem_(file.thumbnailLink),
          iconLink: file.iconLink,
          selected: false,
          type: (function() {
            return Object.keys(Config_.PLANILHA.NOME).reduce(function(def, nome) {
              if (file.title.indexOf(Config_.PLANILHA.NOME[nome]) >= 0) {
                def = nome;
              }
              return def;
            }, '');
          })()
        }
      })
    };
  } catch (e) {
    Erros_.informar(e).logCentral();
    throw e;
  }
}

function criarPlanilhas(dados) {
  try {
    
    if (dados && dados.identificador && Array.isArray(dados.planilhas) && dados.planilhas.length > 0 && dados.idPasta) {
      var pasta = DriveApp.getFolderById(dados.idPasta);
      return dados.planilhas.map(function(item) {
        var nome = (item.type.length > 0) ? dados.identificador + ' (' + item.type + ')' : dados.identificador;
        return DriveApp.getFileById(item.id).makeCopy(nome, pasta).getUrl();
      });
    } else {
      throw new Error('Os parâmetros fornecidos estão irregulares.')
    }
  } catch (e) {
    Erros_.informar(e).logCentral();
    throw e;
  }
}

