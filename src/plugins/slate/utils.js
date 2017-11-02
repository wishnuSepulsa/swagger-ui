import Marked from "marked"

export function parseDescriptionHeader (api_desc) {
  if (api_desc == undefined) {
    return null;
  }

  var lexer = new Marked.Lexer();
  var tokens = lexer.lex(api_desc);
  var prefix = lexer.options.headerPrefix;

  var htokens = [];
  var curr_parent = -1;

  tokens.map(function(token, index){
    // Get heading and H1 and H2 only.
    if (token.type == 'heading' && token.depth < 3) {
      var id = prefix + token.text.toLowerCase().replace(/[^\w]+/g, '-');
      switch(token.depth) {
        case 1:
          var item = {
            'id': id,
            'name': token.text,
            'operationsArray': []
          };
          curr_parent++;
          htokens.push(item);
          break;
        case 2:
          var item = {
            'id': id,
            'summary': token.text
          };

          if (curr_parent > -1) {
            htokens[curr_parent].operationsArray.push(item);
          }
          break;
      }
    }
  })

  return htokens;
}
