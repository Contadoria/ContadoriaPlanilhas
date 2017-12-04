/**
* @fileOverview
* Modulo das rotinas de OAuth2.
*/

function doGet(e) {

  var MODO_DESENVOLVIMENTO = false;
  var TEST_FOLDER_ID = '0B2B1B7RRK5HmYlNUU1NveWVKeWM';
  
  if (MODO_DESENVOLVIMENTO) {
    var mockState = {
      action: 'create',
      folderId: TEST_FOLDER_ID,
      userId: ''
    }
    return abrirApp(mockState);
  }
  if (e && e.parameters && e.parameter.state) {
    return abrirApp(JSON.parse(e.parameters.state));
  } else if (e && e.parameters && e.parameters.code) {
    return obterToken(e.parameters.code);
  }
  return instalar();
}

function obterAuthUrl(){
  return Config_.GOOGLE.URL.AUTHORIZE + '?' +
    ['redirect_uri='+ Config_.GOOGLE.URL.REDIRECT,
     'response_type=code',
     'client_id=' + PropertiesService.getScriptProperties().getProperty(Config_.STORAGE.GOOGLE.CLIENT_ID),
     'approval_prompt=force',
     'scope=' + encodeURIComponent(Config_.GOOGLE.SCOPES.join(' ')),
     'access_type=offline'].join('&');
}

function obterToken(code) {
  
  var params = [
    'client_id=' + PropertiesService.getScriptProperties().getProperty(Config_.STORAGE.GOOGLE.CLIENT_ID),
    'client_secret=' + PropertiesService.getScriptProperties().getProperty(Config_.STORAGE.GOOGLE.CLIENT_SECRET),
    'redirect_uri=' + encodeURIComponent(Config_.GOOGLE.URL.REDIRECT),
    'code=' + encodeURIComponent(code),
    'scope=',
    'grant_type=authorization_code'
  ].join('&');
  
  var options = {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    muteHttpExceptions: true,
    payload: params
  };
  var resposta = JSON.parse(UrlFetchApp.fetch(Config_.GOOGLE.URL.TOKEN, options).getContentText());
  
  if (resposta && resposta.access_token) {
    var props = PropertiesService.getUserProperties();
    props.setProperty(Config_.STORAGE.GOOGLE.TOKEN, resposta.access_token);
    props.setProperty(Config_.STORAGE.GOOGLE.REFRESH, resposta.refresh_token);
    props.setProperty(Config_.STORAGE.GOOGLE.EXPIRY, resposta.expires_in * 1000 + new Date().getTime());
    var html = HtmlService.createTemplateFromFile('_sucesso');
    return html.evaluate()
    .setTitle(Config_.UI.TITULO)
    .setFaviconUrl(Config_.UI.FAVICON_URL);
  } else {
    var html = HtmlService.createTemplateFromFile('_falha');
    html.resposta = resposta;
    return html.evaluate()
    .setTitle(Config_.UI.TITULO)
    .setFaviconUrl(Config_.UI.FAVICON_URL);
  }
}

function instalar() {
  var html = HtmlService.createTemplateFromFile('_auth');
  html.authUrl = obterAuthUrl();
  return html.evaluate()
  .setTitle(Config_.UI.TITULO)
  .setFaviconUrl(Config_.UI.FAVICON_URL);
}

function refreshToken() {
  var params = [
    'client_id=' + PropertiesService.getScriptProperties().getProperty(Config_.STORAGE.GOOGLE.CLIENT_ID),
    'client_secret=' + PropertiesService.getScriptProperties().getProperty(Config_.STORAGE.GOOGLE.CLIENT_SECRET),
    'refresh_token=' + PropertiesService.getUserProperties().getProperty(Config_.STORAGE.GOOGLE.REFRESH),
    'grant_type=refresh_token'
  ].join('&');
  
  var options = {
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    muteHttpExceptions: true
  };
  var resposta = JSON.parse(UrlFetchApp.fetch(Config_.GOOGLE.URL.TOKEN + '?' + params, options).getContentText());
  
  if (resposta && resposta.access_token) {
    var props = PropertiesService.getUserProperties();
    var props = PropertiesService.getUserProperties();
    props.setProperty(Config_.STORAGE.GOOGLE.TOKEN, resposta.access_token);
    props.setProperty(Config_.STORAGE.GOOGLE.EXPIRY, resposta.expires_in * 1000 + new Date().getTime());
    return resposta.access_token;
  } else {
    return null;
  }
}

function obterHttpParams() {
  return {
    'contentType': 'application/json',
    'headers': {
      'Authorization': 'Bearer ' + isTokenValid(),
      'Accept': 'application/json'
    }
  };
}

function isTokenValid() {

  var now = new Date().getTime();
  
  var props = PropertiesService.getUserProperties();
  var storedToken = props.getProperty(Config_.STORAGE.GOOGLE.TOKEN);
  var storedRefresh = props.getProperty(Config_.STORAGE.GOOGLE.REFRESH);
  var expiry = props.getProperty(Config_.STORAGE.GOOGLE.EXPIRY);
  
  if (expiry <= now) {
    storedToken = refreshToken();
  }
  
  return storedToken;  
}