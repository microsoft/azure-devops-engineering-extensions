import { EmailReportViewModel } from '../model/viewmodel/EmailReportViewModel';
import { IHTMLReportCreator } from './IHTMLReportCreator';
import { Report } from '../model/Report';
import { ReportConfiguration } from '../config/ReportConfiguration';
const fs = require("fs");
const o2x = require('object-to-xml');
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
    const xmlString: string = "<EmailReportViewModel>" + o2x(reportViewModel) + "</EmailReportViewModel>";
    // Read XSLT email template 
    const buffer = fs.readFileSync(xsltTemplatePath);
    // Parse the xml string as XmlDocument/Node
    const xmlDoc = xmlParse(xmlString, "text/xml");
    // Parse XSLT as XMLDocument
    const xsltDoc = xmlParse(buffer.toString(), "application/xml");
    // Fill the XSLT document template with the xml doc data
    let outXmlString = xsltProcess(xmlDoc, xsltDoc);
    // For some reason, HTML produced has <br/> not read correctly if they are part of xml nodevalues. Do string replace to fix the jankiness
    outXmlString = outXmlString.split("&amp;lt;br/&amp;gt;").join("<br/>");
    return outXmlString;
  }
}