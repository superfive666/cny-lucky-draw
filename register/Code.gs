function doGet() {
  return HtmlService
      .createTemplateFromFile('Index')
      .evaluate()
      .setTitle('CNY Lucky Draw')
      .setFaviconUrl('https://iconarchive.com/download/i63521/gcds/chinese-new-year/firecracker.ico');
}

function getHash(id){
  return 1231 + 23 * id;
}

function register() {
  const property = PropertiesService.getScriptProperties();
  const password = property.getProperty('password');
  const user = property.getProperty('username');
  const url = property.getProperty('url');
  const conn = Jdbc.getConnection(url, {user, password});
  const statement = conn.createStatement();
  const email = Session.getActiveUser().getEmail();
  const username = email.split('@')[0];

  // only will be one username per registering session
  statement.setMaxRows(1);

  console.log('Registering user:', username);

  // no SQL injection as username is obtained directly from session
  statement.executeUpdate(`insert ignore into participant (username) values ('${username}')`);

  // no SQL injection as username is obtained directly from session
  const rs = statement.executeQuery(`select id from participant where username = '${username}'`);
  
  // there should be one and only one record in DB
  rs.next();
  const id = rs.getInt(1);

  rs.close();
  statement.close();
  conn.close();
  
  const hash = getHash(id);
  console.log(`${username} registered with number: ${hash}`)

  return {username, hash};
}

function fetchParticipants() {
  const property = PropertiesService.getScriptProperties();
  const password = property.getProperty('password');
  const user = property.getProperty('username');
  const url = property.getProperty('url');
  const conn = Jdbc.getConnection(url, {user, password});
  const statement = conn.createStatement(Jdbc.ResultSet.TYPE_FORWARD_ONLY,Jdbc.ResultSet.CONCUR_READ_ONLY, Jdbc.ResultSet.HOLD_CURSORS_OVER_COMMIT);
  statement.setMaxRows(500);

  const rs = statement.executeQuery("select * from participant");

  const participants = [];

  while(rs.next()){
    participants.push({id: getHash(rs.getInt(1)), username: rs.getString(2)});
  }

  rs.close();
  statement.close();
  conn.close();

  return participants;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
