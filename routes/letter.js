var express = require('express');
var router = express.Router();
var Mustache = require('mustache')
const fs = require('fs')
const path = require("path");
const latex = require('node-latex')

Mustache.tags = [ '<<', '>>' ];
Mustache.escape = text => text;

/* POST home page. */
router.post('/', function(req, res, next) {
  const b = req.body;
  let arguments = {
    recipient: b.recipient || "",
    name: b.sender_name || "",
    surname: b.sender_surname,
    street: b.sender_street || "",
    city: b.sender_city || "",
    zip: b.sender_zip || "",
    email: b.sender_email || "",
    phone: b.sender_phone || "",
    purpose: b.purpose || "",
    opening: b.opening || "",
    text: b.text || "",
    closing: b.closing || "",
    signature: b.signature || ""
  }


  if (!arguments.recipient.trim().length){
    arguments.recipient = "Recipient";
  }
  let addressLines = arguments.recipient.split("\n")
  arguments.recipient = addressLines.join("\\\\ ")

  let textLines = arguments.text.split("\n")
  arguments.text = textLines.join("\\\\ ")

  const sourcePath = path.resolve(__dirname, '../sources/templates/letter01');

  fs.readFile(sourcePath + "/letter.mustache", 'ascii' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    let options = {};
    options.inputs = sourcePath;

    lines = data.split("\n")
    latexCodeLines = []
    for(line of lines){
      latexCodeLines.push(Mustache.render(line, arguments))
    }
    const latexCode = latexCodeLines.join("\n")
    const pdf = latex(latexCode, options);

    // pdf.pipe(output)
    // pdf.on('error', err => console.error(err))
    // pdf.on('finish', () => console.log('PDF generated!'))

    pdf.pipe(res);
  });
  
});

module.exports = router;
