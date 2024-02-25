const builder = require('xmlbuilder');
const fs = require('fs');
const xml2js = require('xml2js');

class HistoryWriter {
    constructor(filePath) {
        this.filePath = filePath;
    }

    readHistory() {
        if(!fs.existsSync(this.filePath)){
            return []
        }
        let data = fs.readFileSync(this.filePath, 'utf8', (err) => {
            if (err) {
                console.log('Fail reading file')
                return;
            }


        });

        let parsed;
        xml2js.parseString(data, (err, parsedXmlDoc) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }

            parsed = parsedXmlDoc.root.HistoryObject.map(historyObject => ({
                typeName: 'HistoryObject',
                unixTimestamp: parseInt(historyObject.TimeStamp[0]),
                duration: parseInt(historyObject.Duration[0]),
                type: historyObject.Type[0]
            }));
        });
        return parsed;
    }

    writeHistory(newData) {
        fs.readFile(this.filePath, 'utf8', (err, readData) => {
            if (err) {
                console.log('Fail reading file')
            }

            let xmlDoc = this.createXmlDoc(readData, newData);

            fs.writeFile(this.filePath, xmlDoc, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    createXmlDoc(xmlString, historyObject) {
        // console.log("xmlString: " + xmlString)
        let doc;
        if (xmlString) {
            xml2js.parseString(xmlString, (err, parsedXmlDoc) => {
                if (err) {
                    console.error('Error parsing XML:', err);
                    return;
                }
                doc = builder.create(parsedXmlDoc);

            });
        }
        else {
            console.log('File empty. create <root>')
            doc = builder.create('root');
        }

        // for (let i = 0; i < data.length; i++) {
        //     let tmp = data[i];

        doc.element(historyObject.typeName)
            .element('TimeStamp').text(historyObject.unixTimestamp).up()
            .element('Duration').text(historyObject.duration).up()
            .element('Type').text(historyObject.type).up();
        // }

        let xmlDoc = doc.toString({ pretty: true });
        return xmlDoc;
    }
}

module.exports = HistoryWriter;