import { EmailReportViewModel } from '../model/viewmodel/EmailReportViewModel';
import { IHTMLReportCreator } from './IHTMLReportCreator';
import { Report } from '../model/Report';
import { ReportConfiguration } from '../config/ReportConfiguration';
const fs = require("fs");
const js2xmlparser = require("js2xmlparser");
const xsltProcessor = require("xslt-processor");
const { xmlParse, xsltProcess } = xsltProcessor;

export class HTMLReportCreator implements IHTMLReportCreator {

  createHtmlReport(report: Report, reportConfiguration: ReportConfiguration): string {
    const currDir = __dirname;
    console.log(`CurrentDir: ${currDir}`);
    var xsltTemplatePath = `${currDir}\\EmailTemplate.xslt`;
    console.log("Loading Email Template: " + xsltTemplatePath);

    // Create a view model object before serialize to xml
    const reportViewModel = new EmailReportViewModel(report, reportConfiguration);

    // Serialize gathered data into xml 
    const xmlString: string = js2xmlparser.parse("EmailReportViewModel", reportViewModel);
    // Read XSLT email template 
    const buffer = fs.readFileSync(xsltTemplatePath);
    // Parse the xml string as XmlDocument/Node
    const xmlDoc = xmlParse(xmlString, "text/xml");
    // Parse XSLT as XMLDocument
    const xsltDoc = xmlParse(buffer.toString(), "application/xml");
    // Fill the XSLT document template with the xml doc data
    const outXmlString = xsltProcess(xmlDoc, xsltDoc);
    return outXmlString;
  }
}