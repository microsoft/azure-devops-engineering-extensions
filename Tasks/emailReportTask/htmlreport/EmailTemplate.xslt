<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
  <xsl:output method="html" indent="yes" />
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>
          <xsl:value-of select="EmailReportViewModel/Title" />
        </title>
        <style>                  
          .single-line {
          white-space: nowrap;
          display: inline-block;
          }

          .overall-test-section td{
          padding:0 10px 0 10px;
          padding:0 10px 0 10px;
          }

          .overall-test-main-data {
          font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;
          font-size:18px;
          }

          .comment {
          word-break:break-all;
          }
          .overall-test-additional-data, .overall-test-additional-data td {
          font-size:14px;
          }

          .no-border {
          border: none;
          }

          .test-result-icon {
          width:25px !important;
          padding:0px !important;
          }

          .grey-text {
          color: rgb(128,128,128);
          }

          .failed-background {
          background:#fff1f0;
          }

          .passed-background {
          background:#ebffeb;
          }

          th{
          font-weight: normal;
          }
          td{
          font-weight: 300;
          }

          a.bold {
          font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif !important;
          }

          h1, h2, h3, h4, th {
          font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif !important;
          }

          /* CLIENT-SPECIFIC STYLES */
          body, table, td, a{-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;} /* Prevent WebKit and Windows mobile changing default text sizes */
          table, td{mso-table-lspace: 0pt; mso-table-rspace: 0pt;} /* Remove spacing between tables in Outlook 2007 and up */
          img{-ms-interpolation-mode: bicubic;} /* Allow smoother rendering of resized image in Internet Explorer */
          /* RESET STYLES */
          img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none;}
          table{border-collapse: collapse !important;}
          /* iOS BLUE LINKS */
          a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          }
          /* BASE STYLES */
          body{
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          }
          h1, h2, h3, h4, table, td, th, a, p, span, div, i, em, li, ul, .img-block, img, .comment {
          font-family: Segoe UI, Helvetica, Arial, sans-serif;
          }

          a {
          text-decoration: none;
          color: #007ACC;
          /*   word-break: break-all; */
          }
          a:visited {
          /*   color: red; */
          }
          td {
          font-size: 16px;
          }
          p {
          /*   margin: 0; */
          }
          .img-block {
          display: block;
          color: #ccc;
          font-size: 10px;
          max-width: 100%;
          }
          .img-padding {
          padding: 0 20px 0 0;
          }
          /* buttons */
          .btn-primary:hover {
          border-color: #005faa !important;
          }
          .btn-default:hover {
          border-color: #aeaeae !important;
          }

          .btn-primary:active {
          border-color: #005faa !important;
          background: #005faa !important;
          }
          .btn-default:active {
          border-color: #aeaeae !important;
          background: #aeaeae !important;
          }

          .subhead {
          font-size: 16px;
          padding-bottom: 8px;
          }
          .comment {
          color: #333333;
          font-size: 14px;
          border-radius: 5px;
          text-align: left;
          }
          .comment-gfx {
          padding-top: 20px;
          }
          .note {
          font-size: 13px;
          }

          /* INFO TABLE */
          .activity-table {
          display: table;
          }
          .active {
          background: #CEF1DE;
          font-family: Segoe UI, Helvetica, Arial, sans-serif;
          /*   font-size: 14px;  */
          olor: #333333;
          padding: 2px 4px;
          display: inline-block;
          }
          .inactive {
          background: #eeeeee;
          font-family: Segoe UI, Helvetica, Arial, sans-serif;
          /*     font-size: 14px; */
          text-decoration: line-through;
          color: #666666;padding: 2px 4px;
          display: inline-block;
          }
          .row-label {
          font-family: Segoe UI, Helvetica, Arial, sans-serif;
          /*     font-size: 14px; */
          color: #333;
          padding: 2px 4px;
          line-height: 16px;
          text-align: left;
          }

          /* LISTS */
          .num {
          background: #f2f2f2;
          /*   border-radius: 5px; */
          height: 20px;
          padding: 0 7px;
          font-size: 14px;
          font-size: 1em;
          }
          .code li {
          font-family: Menlo,Monaco,Consolas,"Courier New",monospace !important;
          font-size: 14px;
          text-align: left;
          }
          .list li {
          padding: 5px;
          /*   word-break: break-all; */
          }
          .data {
          word-break: break-all;
          font-family:monospace;
          }
          .red {
          color: red;
          }
          ul, ol {
          padding: 0 20px;
          }
          ul {
          list-style-type: circle;
          }
          .anchors {
          list-style-type: square;
          }
          ul ul, ol ul {
          padding: 0 30px;
          }

          /* OTHER */
          .author {
          font-size: 13px;
          color: #666;
          font-style: italic;
          padding: 5px 0 0;
          }
          .code {
          padding:0;
          list-style:none;
          color: #666666;
          }
          .code li {
          font-family: Menlo,Monaco,Consolas,"Courier New",monospace !important;
          }

          .foot-logo {
          /*     padding: 15px 0 0px; */
          /*     opacity: .7; */
          }

          /* MOBILE STYLES */
          @media screen and (max-width: 525px) {
          .container {
          padding: 0!important;
          }
          .header {
          padding: 10px 30px !important;
          }
          .mobile-sm-txt {
          font-size: 14px !important;
          }
          .mobile-sm-txt span {
          display: block;
          }

          /* ALLOWS FOR FLUID TABLES */
          .wrapper {
          width: 100% !important;
          max-width: 100% !important;
          }

          /* ADJUSTS LAYOUT OF LOGO IMAGE */
          .logo img {
          margin: 0 auto !important;
          }

          /* HIDE CONTENT ON MOBILE */
          .mobile-hide {
          display: none !important;
          }

          /* GIVE IMAGES MAX WIDTH SO THEY SQUISH NICE */
          .img-max {
          max-width: 100% !important;
          width: 100% !important;
          height: auto !important;
          }

          /* FULL-WIDTH TABLES */
          .responsive-table {
          width: 100% !important;
          }

          /* UTILITY CLASSES FOR ADJUSTING PADDING ON MOBILE */
          .padding {
          padding: 10px 5% 15px 5% !important;
          }
          .img-padding {
          padding: 0 0 10px 0;
          }
          .padding-meta {
          padding: 20px !important;
          }

          .no-padding {
          padding: 0 !important;
          }
          /*     .section-padding {
          padding: 50px 15px 50px 15px !important;
          } */

          /* CONTENT */
          .comment {
          padding: 16px 22px !important;
          }
          .logo {
          margin: 0 auto;
          padding: 10px 0 10px 5% !important;
          }
          .gfx-promo {
          padding-bottom: 20px;
          width: 40% !important;
          }
          .gfx-promo img {
          width: 100%;
          }

          /* ADJUST BUTTONS ON MOBILE */
          .mobile-button-container {
          margin: 0 auto;
          width: 100% !important;
          margin-bottom: 10px !important;
          }
          .mobile-button {
          padding: 10px !important;
          border: 0 !important;
          font-size: 16px !important;
          display: block !important;
          }
          .mobile-center {
          text-align: center !important;
          margin: 0 auto;
          }
          .mobile-promos {
          text-align: center !important;
          padding: 30px !important;
          }

          .foot-logo {
          padding: 5px 0 25px !important;
          }

          }
          /* EXTRA SMALL - PHONE */
          @media screen and (max-width: 413px) {
          body[class="body-padding"] {
          padding: 0 !important;
          }
          /* HIDE CONTENT ON MOBILE */
          td[class="mobile-hide-xs"], td[class="mobile-hide-xs comment-gfx"]{
          display:none;
          }
          /* ADJUST BUTTONS ON MOBILE */
          /*     td[class="mobile-wrapper"]{
          padding: 10px 5% 15px 5% !important;
          } */
          table[class="mobile-button-container"]{
          margin:0 auto;
          width:100% !important;
          }

          }
          /* ANDROID CENTER FIX */
          div[style*="margin: 16px 0;"] { margin: 0 !important; }


          /* build template specific styles **/
          .check-list {
          font-size: 14px;
          padding: 0;
          margin: 0;

          }
          .check-list ul {
          padding: 0;
          padding-left: 5%;
          }
          .check-list li:before {
          }
          .check-list li li:hover {
          /*   background-position: 4px 9px; */
          /*   outline: 1px solid #ddd; */
          }
          .check-list li a {
          color: #444444;
          color: black;
          }
          .check-list li {
          list-style: none;
          padding: 5px 0 5px 30px;
          background-size: 16px;
          background-position: 1px 9px;
          }
          .check-list .step-fail {
          background-size: 16px;
          background-position: 1px 9px;
          }
          .check-list .step-msg {
          display: block;
          color: #666666;
          }

          h2 {
          font-size: 20px; font-weight:300; line-height: 24px;
          }
          h2.mobile-center {
          margin-bottom: 15px;
          }
          .info-table th, .info-table td {
          font-size: 14px;
          }
          .info-table td {
          word-break: break-word;
          padding: 3px;
          padding-bottom: 10px;
          }
          .info-table th {
          font-weight: normal;
          padding-right: 10px;
          text-align: left;
          }

          .issues th {
          vertical-align: top;
          }
          .issues .error {
          background-size: 20px;
          }
          .issues .warning {
          background-size: 20px;
          }

          .test-results {
          float: left;
          }
          .test {
          margin-bottom: 30px;
          }
          .test td {
          font-size: 14px;
          padding: 0 20px 0 8px;
          }
          .test-clr {
          color: white;
          /*   width: 10px; */
          padding: 1px 4px;
          font-weight: 600;
          }
          .test-clr.red {
          background: red;
          }

          .change-list {
          padding: 0;
          list-style: none;
          font-size: 14px;
          }
          .change-list li {
          padding-bottom: 15px;
          }
          .change-list .change-desc {
          display: inline-block;
          /*   font-size: 15px; */
          }


          .donut {
          position: relative;
          display: block !important;
          stroke-dasharray: 100;
          /*   float: right; */
          /*   margin-left: 320px; */
          }
          .donut-num {
          position: absolute;
          top: 59px;
          left: 50%;
          margin-left: -65px;
          width: 160px;
          text-align: center;
          font-size: 30px;
          line-height: 30px;
          font-weight: 400;
          color: #339933;
          }
          .donut svg {
          width: 150px;
          margin-right: 15px;
          }
          .donut.sm svg {
          width: 100px;
          margin-right: 15px;
          }
          @media screen and (max-width: 525px) {
          .test-results {
          float: none;
          }
          .donut {
          width: 100%;
          text-align: center;
          float: none;
          margin: 0 auto;
          }
          }
          .donut svg {
          transition: all .3s ease;
          fill: none;
          stroke-width: 7;
          stroke-miterlimit: 10;
          }
        </style>
      </head>
      <body>
        <div style="display:none;font-size: 1px;  max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
          <xsl:value-of select="EmailReportViewModel/EmailSubject" />
        </div>
        <!-- OUTER WRAPPER -->
        <div class="container"
             style="background:#e8e8e8; min-height:100vh; font-family: Segoe UI, Helvetica, Arial, sans-serif;  color:#444444; font-size:14px; padding: 10px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="">
            <tr>
              <td style="background: #e8e8e8;"></td>
              <td width="660" style="background: #ffffff;">
                <!--[if (gte mso 9)|(IE)]>
                <table border="0" cellpadding="0" cellspacing="0" style="width:660px; height:0;">
                  <tr>
                    <td style="background:#e8e8e8;"></td>
                  </tr>
                </table>
                <![endif]-->
                <!-- INNER WRAPPER -->
                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                  <!-- TOP BANNER -->
                  <tr>
                    <xsl:choose>
                      <xsl:when
                        test="EmailReportViewModel/HasFailedTests = 'true' or EmailReportViewModel/HasTaskFailures = 'true' or EmailReportViewModel/HasCanceledPhases = 'true'">
                        <xsl:apply-templates select="EmailReportViewModel" mode="failed-banner" />
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:apply-templates select="EmailReportViewModel" mode="success-banner" />
                      </xsl:otherwise>
                    </xsl:choose>
                  </tr>
                  <!-- /TOP BANNER -->
                  <!-- SECTION HERO fff1f0 fad8e0-->
                  <tr>
                    <td valign="middle">
                      <xsl:attribute name="style">
                        <xsl:choose>
                          <xsl:when
                            test="EmailReportViewModel/HasFailedTests = 'true' or EmailReportViewModel/HasTaskFailures = 'true'">
                            padding: 20px 30px 30px 30px;color: black;border-bottom: 2px solid #e8e8e8;background:#fff1f0;
                          </xsl:when>
                          <xsl:otherwise>padding: 20px 30px 30px 30px;color: black;border-bottom: 2px solid #e8e8e8;background:#ebffeb;</xsl:otherwise>
                        </xsl:choose>
                      </xsl:attribute>
                      <!-- HERO -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"
                             class="responsive-table">
                        <tr>
                          <td>
                            <!-- COPY -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <!-- INNER HERO LEFT -->
                                <td>
                                  <table style="width:100%">
                                    <xsl:if test="EmailReportViewModel/AllTests != ''">
                                      <tr>
                                        <td>
                                          <!-- SUB-SECTION -->
                                          <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                            <tr>
                                              <!-- TEST Summary -->
                                              <td style="padding-bottom:15px;">
                                                <xsl:apply-templates select="EmailReportViewModel/AllTests" />
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </xsl:if>
                                    <tr>
                                      <td style="padding:20px 0px 0 0px">
                                        <table cellpadding="0" border="0" cellspacing="0" class="info-table">
                                          <xsl:if test="EmailReportViewModel/Build != ''">
                                            <tr>
                                              <td>Build</td>
                                              <td style="padding-left:10px;">
                                                <a>
                                                  <xsl:attribute name="href">
                                                    <xsl:value-of select="EmailReportViewModel/Build/Url" />
                                                  </xsl:attribute>
                                                  <xsl:value-of select="EmailReportViewModel/Build/Number" />
                                                </a>
                                                <xsl:text> on branch </xsl:text>
                                                <xsl:value-of select="EmailReportViewModel/Build/Branch" />
                                              </td>
                                            </tr>
                                          </xsl:if>
                                          <xsl:if test="EmailReportViewModel/Release != ''">
                                            <xsl:for-each select="EmailReportViewModel/Artifacts/ArtifactViewModel">
                                              <xsl:if test="IsPrimary = 'true'">
                                                <tr>
                                                  <td>Build</td>
                                                  <td style="padding-left:10px;">
                                                    <a>
                                                      <xsl:attribute name="href">
                                                        <xsl:value-of select="BuildSummaryUrl" />
                                                      </xsl:attribute>
                                                      <xsl:value-of select="Version" />
                                                    </a>
                                                    <xsl:text> on branch </xsl:text>
                                                    <xsl:value-of select="BranchName" />
                                                  </td>
                                                </tr>
                                              </xsl:if>
                                            </xsl:for-each>
                                            <tr>
                                              <td>Release environment</td>
                                              <td style="padding-left:10px;">
                                                <a>
                                                  <xsl:attribute name="href">
                                                    <xsl:value-of select="EmailReportViewModel/Release/ReleaseDefinitionUrl" />
                                                  </xsl:attribute>
                                                  <xsl:value-of
                                                    select="EmailReportViewModel/Release/CurrentEnvironment/EnvironmentName" />
                                                </a>
                                                <xsl:text> of </xsl:text>
                                                <a>
                                                  <xsl:attribute name="href">
                                                    <xsl:value-of select="EmailReportViewModel/Release/ReleaseSummaryUrl" />
                                                  </xsl:attribute>
                                                  <xsl:value-of select="EmailReportViewModel/Release/ReleaseName" />
                                                </a>
                                              </td>
                                            </tr>
                                          </xsl:if>
                                        </table>
                                      </td>
                                    </tr>
                                    <xsl:if test="EmailReportViewModel/AllTests != ''">
                                      <!-- View All Results Button-->
                                      <tr>
                                        <td style="padding:20px 0px 0 0px">
                                          <!-- /SUBSECTION -->
                                          <!-- PRIMARY BUTTON WRAPPER -->
                                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                              <td align="">
                                                <!-- BULLETPROOF BUTTON -->
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                  <tr>
                                                    <td align="" style="padding: 5px 0 15px 0;" class="padding">
                                                      <!-- PRIMARY BTN -->
                                                      <table border="0" cellspacing="0" cellpadding="0"
                                                             class="mobile-button-container" align="left">
                                                        <tr>
                                                          <td align="center" bgcolor="#007acc">
                                                            <a target="_blank"
                                                               style="font-size: 14px; font-family: Segoe UI, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 6px 16px; border: 2px solid #007acc; display: inline-block;"
                                                               class="mobile-button btn-primary">
                                                              <xsl:attribute name="href">
                                                                <xsl:value-of
                                                                  select="EmailReportViewModel/AllTests/Url" />
                                                              </xsl:attribute>
                                                              View all results
                                                            
                                                            </a>
                                                          </td>
                                                          <td style="width: 8px;" class="mobile-hide"></td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </xsl:if>
                                  </table>
                                  <!-- /PRIMARY -->
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <xsl:for-each select="EmailReportViewModel/SummaryGroups/TestSummaryGroupViewModel">
                    <xsl:if test="SummaryItems/TestSummaryItemViewModel">
                      <tr>
                        <td style="padding: 0px 0 15px 0;border-bottom: 2px solid #e8e8e8">
                          <xsl:apply-templates select="." />
                        </td>
                      </tr>
                    </xsl:if>
                  </xsl:for-each>
                  <xsl:if test="EmailReportViewModel/HasTestResultsToShow = 'true'">
                    <xsl:choose>
                      <xsl:when test="EmailReportViewModel/TestResultsGroups/TestResultsGroupViewModel">
                        <tr>
                          <td style="border-bottom: 2px solid #e8e8e8">
                            <table style="width:100%">
                              <tr>
                                <td>
                                  <xsl:apply-templates select="EmailReportViewModel/TestResultsGroups" />
                                </td>
                              </tr>
                              <xsl:choose>
                                <xsl:when test="EmailReportViewModel/HasFilteredTests = 'true'">
                                  <tr>
                                    <td
                                      style="padding:0px 30px 30px 30px;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
                                      Test results are truncated.
                                      
                                      <a>
                                        <xsl:attribute name="href">
                                          <xsl:value-of select="EmailReportViewModel/TestTabLink" />
                                        </xsl:attribute>
                                        View all results
                                      
                                      </a>
                                    </td>
                                  </tr>
                                </xsl:when>
                              </xsl:choose>
                            </table>
                          </td>
                        </tr>
                      </xsl:when>
                    </xsl:choose>
                  </xsl:if>
                  <xsl:choose>
                    <xsl:when test="EmailReportViewModel/HasCanceledPhases = 'true'">
                      <tr>
                        <td style="border-bottom: 2px solid #e8e8e8">
                          <xsl:apply-templates select="EmailReportViewModel/PhaseIssuesSummary" />
                        </td>
                      </tr>
                    </xsl:when>
                  </xsl:choose>
                  <tr>
                    <td style="border-bottom: 2px solid #e8e8e8">
                      <xsl:apply-templates select="EmailReportViewModel/Phases" />
                    </td>
                  </tr>
                  <xsl:choose>
                    <xsl:when test="EmailReportViewModel/ShowAssociatedChanges = 'true'">
                      <tr>
                        <td style="border-bottom: 2px solid #e8e8e8">
                          <xsl:apply-templates select="EmailReportViewModel/AssociatedChanges" />
                        </td>
                      </tr>
                    </xsl:when>
                  </xsl:choose>
                  <xsl:choose>
                    <xsl:when test="EmailReportViewModel/DataMissing = 'true'">
                      <tr>
                        <td
                          style="font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;padding:10px 30px 20px 30px;color:red;border-bottom: 2px solid #e8e8e8;">
                          Failed to get all data for the email report. Please look at the Email Report task log under
                          
                          <xsl:if test="EmailReportViewModel/Build != ''">
                            <a>
                              <xsl:attribute name="href">
                                <xsl:value-of select="EmailReportViewModel/Build/Url" />
                              </xsl:attribute>
                              build logs.
                            
                            </a>
                          </xsl:if>
                          <xsl:if test="EmailReportViewModel/Release != ''">
                            <a>
                              <xsl:attribute name="href">
                                <xsl:value-of select="EmailReportViewModel/Release/ReleaseLogsLink" />
                              </xsl:attribute>
                              release logs.
                            
                            </a>
                          </xsl:if>
                        </td>
                      </tr>
                    </xsl:when>
                  </xsl:choose>
                  <!-- FOOTER -->
                  <tr>
                    <td class="mobile-center" style="padding: 0 30px; text-align: left; background:#dddddd;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"
                             class="responsive-table">
                        <tr>
                          <td colspan="2" class="mobile-center"
                              style="padding-top: 15px; font-size: 12px; line-height: 18px; font-family: Segoe UI, Helvetica, Arial, sans-serif;  color:#444444; text-align: left;">
                            <xsl:text>We sent you this notification based on the configuration in the </xsl:text>
                            <xsl:if test="EmailReportViewModel/Build != ''">
                              <xsl:text>build - </xsl:text>
                              <xsl:value-of select="EmailReportViewModel/Build/Number"></xsl:value-of>
                              <xsl:text> of definition - </xsl:text>
                              <a>
                                <xsl:attribute name="href">
                                  <xsl:value-of select="EmailReportViewModel/Build/DefinitionUrl" />
                                </xsl:attribute>
                                <xsl:value-of select="EmailReportViewModel/Build/DefinitionName" />
                              </a>
                            </xsl:if>
                            <xsl:if test="EmailReportViewModel/Release != ''">
                              <xsl:text>release environment - </xsl:text>
                              <xsl:value-of select="EmailReportViewModel/Release/CurrentEnvironment/EnvironmentName"></xsl:value-of>
                              <xsl:text> of release definition - </xsl:text>
                              <a>
                                <xsl:attribute name="href">
                                  <xsl:value-of select="EmailReportViewModel/Release/ReleaseDefinitionUrl" />
                                </xsl:attribute>
                                <xsl:value-of select="EmailReportViewModel/Release/ReleaseDefinitionName" />
                              </a>
                            </xsl:if>
                            <xsl:text>.</xsl:text>
                          </td>
                        </tr>
                        <tr>
                          <td class="mobile-center"
                              style="padding: 7px 0; font-size: 12px; line-height: 5px; font-family: Segoe UI, Helvetica, Arial, sans-serif;  color:#444444; text-align: left;"></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- /FOOTER -->
                </table>
                <!-- /INNER WRAPPER -->
              </td>
              <td style="background: #e8e8e8;"></td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
  <xsl:template match="EmailReportViewModel" mode="failed-banner">
    <td style="padding: 10px 30px 10px 30px; background:#DA0A00;">
      <table border="0" cellpadding="0" cellspacing="0" class="mobile-center" style="vertical-align: middle;">
        <tbody>
          <tr>
            <td style="padding-right: 15px;" valign="top">
              <div>❌</div>
            </td>
            <td valign="middle"
                style="font-size: 14px; line-height:20px; color: white; font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif; padding-top: 0px; vertical-align: middle; text-transform:uppercase;">
              <xsl:if test="Build != ''">
                <xsl:value-of select="Build/Number" />
              </xsl:if>
              <xsl:if test="Release != ''">
                <xsl:value-of select="Release/CurrentEnvironment/EnvironmentName" />
              </xsl:if>
              <xsl:text> failed</xsl:text>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </xsl:template>
  <xsl:template match="EmailReportViewModel" mode="success-banner">
    <td style="padding: 10px 30px 10px 30px; background:#339933;">
      <table border="0" cellpadding="0" cellspacing="0" class="mobile-center" style="vertical-align: middle;">
        <tbody>
          <tr>
            <td style="padding-right: 15px;" valign="top">
              <div>✔</div>
            </td>
            <td valign="middle"
                style="font-size: 14px; font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif; line-height:20px; color: white; font-family: Segoe UI, Helvetica, Arial, sans-serif; padding-top: 0px; vertical-align: middle; text-transform:uppercase;">
              <xsl:if test="Build != ''">
                <xsl:value-of select="Build/Number" />
              </xsl:if>
              <xsl:if test="Release != ''">
                <xsl:value-of select="Release/CurrentEnvironment/EnvironmentName" />
              </xsl:if>
              <xsl:text> passed</xsl:text>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </xsl:template>
  <xsl:template match="TestSummaryGroupViewModel">
    <table style="text-align: left; width: 100%;">
      <tr style="background:rgb(240,249,254);">
        <td
        style="padding: 10px 0px 10px 30px;text-align: left;min-width:120px;
              font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
          <xsl:text>Summary by </xsl:text>
          <xsl:value-of select="GroupName" />
        </td>
        <td
          style="padding: 10px 0px 10px 0px; text-align: left;
              font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
          Tests
        </td>
        <td
          style="padding: 10px 0px 10px 0px; text-align: left;
              font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
          Pass rate
        </td>
        <td
          style="padding: 10px 30px 10px 0px; text-align: left;
              font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
          Duration
        </td>
      </tr>
      <xsl:for-each select="SummaryItems/TestSummaryItemViewModel">
        <tr>
          <td style="padding: 10px 0 10px 30px;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
            <xsl:value-of select="Name" />
          </td>
          <td
            style="padding: 10px 0 10px 0px;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
            <xsl:value-of select="PassedTests" />
            <xsl:text>/</xsl:text>
            <xsl:value-of select="TotalTests" />
            <xsl:text> Passed</xsl:text>
          </td>
          <td
            style="padding: 10px 0 10px 0px;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
            <xsl:value-of select="PassingRate" />
          </td>
          <td
            style="padding: 10px 30px 10px 0px;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
            <xsl:value-of select="Duration" />
          </td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>
  <xsl:template match="TestResultsGroups">
    <xsl:for-each select="TestResultsGroupViewModel">
      <table style="text-align: left; width: 100%;">
        <tr style="background:rgb(240,249,254);">
          <td
            style="padding: 10px 30px 10px 30px;text-align: left;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
            <xsl:text>Test Results for </xsl:text>
            <xsl:value-of select="GroupName" />
          </td>
        </tr>
        <tr>
          <td style="padding:20px 30px 30px 30px;">
            <table style="width:100%">
              <xsl:apply-templates select="FailedTests/TestResultViewModel" />
              <xsl:apply-templates select="OtherTests/TestResultViewModel" />
              <xsl:apply-templates select="PassedTests/TestResultViewModel" />
            </table>
          </td>
        </tr>
      </table>
    </xsl:for-each>
  </xsl:template>
  <xsl:template match="TestResultViewModel">
    <tr>
      <td style="padding: 0px 0px 20px 0px">
        <table style="width:100%;">
          <tr>
            <td class="test-result-icon" style="width:25px;padding:0px;">
              <xsl:choose>
                <xsl:when test="TestOutcome = 'Passed'">
                  <div>✔</div>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:choose>
                    <xsl:when test="TestOutcome = 'Failed'">
                      <div>❌</div>
                    </xsl:when>
                    <xsl:otherwise>
                      <div>▷</div>
                    </xsl:otherwise>
                  </xsl:choose>
                </xsl:otherwise>
              </xsl:choose>
            </td>
            <td style="font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
              <a class="bold"
                 style="font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif !important;display:inline;">
                <xsl:attribute name="href">
                  <xsl:value-of select="Url" />
                </xsl:attribute>
                <xsl:value-of select="TestCaseTitle" />
              </a>
              <xsl:if test="TestOutcome = 'Failed' and FailingSinceTime = ''">
                <sup
                  style="padding-left:3px;color:red;font-weight:bold;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,Ubuntu,Arial,sans-serif">
                  New
                </sup>
              </xsl:if>
            </td>
            <td
              style="text-align:right;font-family: Segoe UI Semibold, Segoe UI, Helvetica,vssi emailtask Arial, sans-serif;">
              <xsl:value-of select="Duration" />
            </td>
          </tr>
          <tr>
            <td class="test-result-icon" style="width:25px;padding:0px;"></td>
            <td>
              <xsl:choose>
                <xsl:when test="FailingSinceTime != ''">
                  <xsl:text>Failing since </xsl:text>
                  <a>
                    <xsl:choose>
                      <xsl:when test="FailingSinceBuild != ''">
                        <xsl:attribute name="href">
                          <xsl:value-of select="FailingSinceBuild/Url" />
                        </xsl:attribute>
                        <xsl:value-of select="FailingSinceBuild/Number" />
                      </xsl:when>
                      <xsl:when test="FailingSinceRelease != ''">
                        <xsl:attribute name="href">
                          <xsl:value-of select="FailingSinceRelease/Url" />
                        </xsl:attribute>
                        <xsl:value-of select="FailingSinceRelease/Name" />
                      </xsl:when>
                    </xsl:choose>
                  </a>
                  <xsl:text> on </xsl:text>
                  <xsl:value-of select="FailingSinceTime" />
                </xsl:when>
                <xsl:otherwise>
                  <xsl:if test="Owner != ''">
                    <xsl:text>Owner: </xsl:text>
                    <xsl:value-of select="Owner"/>
                  </xsl:if>
                </xsl:otherwise>
              </xsl:choose>
            </td>
            <td style="text-align: right;">
              <xsl:value-of select="Priority" />
            </td>
          </tr>
          <xsl:if test="Owner != '' and FailingSinceTime != ''">
            <tr>
              <td class="test-result-icon" style="width:25px;padding:0px;"></td>
              <td>
                <xsl:text>Owner: </xsl:text>
                <xsl:value-of select="Owner"/>
              </td>
              <td style="text-align: right;"></td>
            </tr>
          </xsl:if>
          <xsl:choose>
            <xsl:when test="ErrorMessage != ''">
              <tr>
                <td class="test-result-icon" style="width:25px;padding-top:10px;"></td>
                <td colspan="2" class="comment" style="padding-top:10px;padding-bottom:10px;">
                  <xsl:value-of select="ErrorMessage" disable-output-escaping="yes" />
                </td>
              </tr>
            </xsl:when>
          </xsl:choose>
          <xsl:choose>
            <xsl:when test="StackTrace != ''">
              <tr>
                <td class="test-result-icon" style="width:25px;padding:0px;"></td>
                <td colspan="2">
                  <div style="display:block;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">Stack trace</div>
                  <div class="comment">
                    <xsl:value-of select="StackTrace" disable-output-escaping="yes" />
                  </div>
                </td>
              </tr>
            </xsl:when>
          </xsl:choose>
          <xsl:choose>
            <xsl:when test="AssociatedBugs/WorkItemViewModel">
              <tr>
                <td class="test-result-icon" style="width:25px;padding-top:10px;"></td>
                <td colspan="2" style="padding-top:10px;">
                  <div style="display:block;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
                    Associated Bugs
                  </div>
                  <table>
                    <xsl:for-each select="AssociatedBugs/WorkItemViewModel">
                      <tr>
                        <td style="padding-bottom:20px;">
                          <xsl:apply-templates select="." />
                        </td>
                      </tr>
                    </xsl:for-each>
                  </table>
                </td>
              </tr>
            </xsl:when>
          </xsl:choose>
          <xsl:if test="TestOutcome = 'Failed'">
            <tr>
              <td class="test-result-icon" style="width:25px;padding-top:10px;"></td>
              <td colspan="2" style="padding-top:10px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="">
                      <!-- BULLETPROOF BUTTON -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="" style="padding: 5px 0 15px 0;" class="padding">
                            <!-- PRIMARY BTN -->
                            <table border="0" cellspacing="0" cellpadding="0"
                                   class="mobile-button-container" align="left">
                              <tr>
                                <td align="center" bgcolor="#da0a00">
                                  <a target="_blank"
                                     style="font-size: 12px; font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; padding: 6px 16px; border: 2px solid #da0a00; display: inline-block;"
                                     class="mobile-button btn-primary">
                                    <xsl:attribute name="href">
                                      <xsl:value-of
                                        select="CreateBugLink" />
                                    </xsl:attribute>
                                    Create Bug
                                  
                                  </a>
                                </td>
                                <td style="width: 8px;" class="mobile-hide"></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </xsl:if>
        </table>
      </td>
    </tr>
  </xsl:template>
  <xsl:template match="WorkItemViewModel">
    <table style="border-radius:0px;border-left:6px solid rgb(204, 41, 61)">
      <tr>
        <td style="padding:0px 0px 0px 10px">
          <a>
            <xsl:attribute name="href">
              <xsl:value-of select="Url" />
            </xsl:attribute>
            <xsl:value-of select="Id" />
          </a>
        </td>
        <td style="padding:0px 0px 0px 10px">
          <table style="padding:0px">
            <tr>
              <td>
                <xsl:choose>
                  <xsl:when test="State  = 'Active'">
                    <xsl:attribute name="style">
                      color: rgb(0, 122, 204);font-size:18px;padding:0px
                    </xsl:attribute>
                  </xsl:when>
                  <xsl:when test="State  = 'Resolved'">
                    <xsl:attribute name="style">
                      color: rgb(255, 157, 0);font-size:18px;padding:0px
                    </xsl:attribute>
                  </xsl:when>
                  <xsl:when test="State  = 'Closed'">
                    <xsl:attribute name="style">
                      rgb(51, 153, 51);font-size:18px;padding:0px
                    </xsl:attribute>
                  </xsl:when>
                </xsl:choose>
                ●
              
              </td>
              <td style="padding:0px 0px 0px 5px">
                <xsl:value-of select="State" />
              </td>
            </tr>
          </table>
        </td>
        <td style="padding:0px 0px 0px 10px">
          <xsl:value-of select="Title" />
        </td>
      </tr>
      <tr>
        <td colspan="3" class="comment" style="padding-left:10px;">
          <xsl:choose>
            <xsl:when test=" (AssignedTo) and (AssignedTo  = '') ">
              Unassigned
            </xsl:when>
            <xsl:otherwise>
              Assigned to <xsl:value-of select="AssignedTo" />
            </xsl:otherwise>
          </xsl:choose>
        </td>
      </tr>
    </table>
  </xsl:template>
  <xsl:template match="AllTests">
    <table class="mobile-center single-line overall-test-section" style="width: 100%">
      <tr class="overall-test-header">
        <td style="border-right: 2px #e8e8e8 solid;padding: 0 10px 0 10px">TOTAL TESTS</td>
        <td style="border-right: 2px #e8e8e8 solid;padding: 0 10px 0 10px">FAILED TESTS</td>
        <td style="border-right: 2px #e8e8e8 solid;padding: 0 10px 0 10px">PASS RATE</td>
        <td style="padding: 0 10px 0 10px">DURATION</td>
      </tr>
      <tr>
        <td style="border-right: 2px #e8e8e8 solid;padding: 0 10px 0 10px">
          <!-- TOTAL TESTS SECTION-->
          <table>
            <tr>
              <td class="overall-test-main-data"
                  style="padding: 0 10px 0 10px;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
                <xsl:value-of select="TotalTests" />
              </td>
              <td class="overall-test-additional-data" style="padding: 0 10px 0 10px;">
                <table>
                  <tr>
                    <td style="padding: 0 10px 0 0px">
                      <xsl:value-of select="PassedTests" />
                    </td>
                    <td style="padding: 0 0px 0 10px">Passed</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 10px 0 0px">
                      <xsl:value-of select="FailedTests" />
                    </td>
                    <td style="padding: 0 0px 0 10px">Failed</td>
                  </tr>
                  <tr>
                    <td style="padding: 0 10px 0 0px">
                      <xsl:value-of select="OtherTests" />
                    </td>
                    <td style="padding: 0 0px 0 10px">Others</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
        <td style="border-right: 2px #e8e8e8 solid;padding: 0 10px 0 10px">
          <!-- FAILED TESTS SECTION-->
          <table>
            <tr>
              <td
                style="padding: 0 10px 0 10px;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;"
                class="overall-test-main-data">
                <xsl:value-of select="FailedTests" />
              </td>
              <!--
              <td style="padding: 0 10px 0 10px" class="overall-test-additional-data"><table><tr><td style="padding: 0 10px 0 0px"><xsl:value-of select="FailedTests" /></td><td style="padding: 0 0px 0 10px">New</td></tr><tr><td style="padding: 0 10px 0 0px">0</td><td style="padding: 0 0px 0 10px">Existing</td></tr></table></td>-->
            </tr>
          </table>
        </td>
        <td class="overall-test-main-data"
            style="border-right: 2px #e8e8e8 solid;padding: 0 10px 0 10px;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
          <!-- PASS RATE SECTION-->
          <xsl:value-of select="PassingRate" />
        </td>
        <td class="overall-test-main-data" style="padding: 0 10px 0 10px">
          <!-- DURATION SECTION-->
          <xsl:value-of select="Duration" />
        </td>
      </tr>
    </table>
  </xsl:template>
  <xsl:template match="PhaseIssuesSummary">
    <table style="text-align: left; width: 100%;">
      <tr style="background:rgb(240,249,254);">
        <td
            style="padding: 10px 30px 10px 30px;">
          <table style="padding:0px;width:100%">
            <tr>
              <td
                  style="padding:0px;text-align:left;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
                <xsl:value-of select="Name" />
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <td>
        <xsl:apply-templates select="Tasks" />
      </td>
    </table>
  </xsl:template>
  <xsl:template match="Phases">
    <xsl:for-each select="PhaseViewModel">
      <table style="text-align: left; width: 100%;">
        <tr style="background:rgb(240,249,254);">
          <td
            style="padding: 10px 30px 10px 30px;">
            <table style="padding:0px;width:100%">
              <tr>
                <td
                  style="padding:0px;text-align:left;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
                  <xsl:value-of select="Name" />
                </td>
                <td
                  style="padding:0px;text-align:right;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
                  <xsl:value-of select="TasksDuration" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <td>
          <xsl:apply-templates select="DeploymentJob/Tasks" />
        </td>
      </table>
    </xsl:for-each>
  </xsl:template>
  <xsl:template match="Tasks">
    <table style="text-align: left; width: 100%;">
      <tr>
        <td style="padding:20px 30px 30px 30px;">
          <table style="width:100%">
            <xsl:for-each select="TaskResultViewModel">
              <tr>
                <td style="padding: 0px 0px 20px 0px">
                  <table style="width:100%;">
                    <tr>
                      <td class="test-result-icon" style="width:25px;padding:0px;">
                        <xsl:choose>
                          <xsl:when test="HasFailed = 'true'">
                            <div>❌</div>
                          </xsl:when>
                          <xsl:when test="HasSkipped = 'true'">
                            <div>⊘</div>
                          </xsl:when>
                          <xsl:when test="NotYetRun = 'true'">
                            <div>🕓</div>
                          </xsl:when>
                          <xsl:when test="HasPartiallySucceeded = 'true'">
                            <div>⚠</div>
                          </xsl:when>
                          <xsl:when test="GotCancelled = 'true'">
                            <div>⏹</div>
                          </xsl:when>
                          <xsl:otherwise>
                            <div>✔</div>
                          </xsl:otherwise>
                        </xsl:choose>
                      </td>
                      <td style="padding:0px;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
                        <xsl:value-of select="Name" />
                      </td>
                      <td
                        style="padding:0px;text-align:right;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
                        <xsl:value-of select="Duration" />
                      </td>
                    </tr>
                    <xsl:choose>
                      <xsl:when test="HasNotRunOnSomeAgents = 'true'">
                        <tr>
                          <td class="test-result-icon" style="width:25px;padding:0px;"></td>
                          <td colspan="2" style="padding-top:10px;">
                            <xsl:value-of select="NotRunMessage" />
                          </td>
                        </tr>
                      </xsl:when>
                      <xsl:when test="IssuesSummary/Issues/TaskIssueViewModel">
                        <xsl:choose>
                          <xsl:when test="IssuesSummary/ErrorCount > 0">
                            <tr>
                              <td class="test-result-icon" style="width:25px;padding:0px;"></td>
                              <td colspan="2" style="padding-top:10px;">
                                <xsl:value-of select="IssuesSummary/ErrorMessage" />
                              </td>
                            </tr>
                          </xsl:when>
                        </xsl:choose>
                        <tr>
                          <td class="test-result-icon" style="width:25px;padding:0px;"></td>
                          <td colspan="2" style="padding-top:10px;">
                            <a>
                              <xsl:if test="/EmailReportViewModel/Build != ''">
                                <xsl:attribute name="href">
                                  <xsl:value-of select="/EmailReportViewModel/Build/Url" />
                                </xsl:attribute>
                              </xsl:if>
                              <xsl:if test="/EmailReportViewModel/Release != ''">
                                <xsl:attribute name="href">
                                  <xsl:value-of select="/EmailReportViewModel/Release/ReleaseLogsLink" />
                                </xsl:attribute>
                              </xsl:if>
                              <xsl:text>Step completed with </xsl:text>
                              <xsl:value-of select="IssuesSummary/ErrorCount" />
                              <xsl:text> errors and </xsl:text>
                              <xsl:value-of select="IssuesSummary/WarningCount" />
                              <xsl:text> warnings </xsl:text>
                            </a>
                          </td>
                        </tr>
                        <xsl:for-each select="IssuesSummary/Issues/TaskIssueViewModel">
                          <tr>
                            <td class="test-result-icon" style="width:25px;padding-top:10px;vertical-align:top;"></td>
                            <td colspan="2" style="padding-top:10px;">
                              <table style="padding:0;width:100%">
                                <tr>
                                  <td class="test-result-icon" style="width:25px;padding:0px;vertical-align:top;">
                                    <xsl:choose>
                                      <xsl:when test="IssueType = 'Error'">
                                        <div>❌</div>
                                      </xsl:when>
                                      <xsl:otherwise>
                                        <div>⚠</div>
                                      </xsl:otherwise>
                                    </xsl:choose>
                                  </td>
                                  <td>
                                    <div class="comment">
                                      <xsl:value-of select="Message" />
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </xsl:for-each>
                      </xsl:when>
                    </xsl:choose>
                  </table>
                </td>
              </tr>
            </xsl:for-each>
          </table>
        </td>
      </tr>
    </table>
  </xsl:template>
  <xsl:template match="AssociatedChanges">
    <table style="text-align: left; width: 100%;">
      <tr style="background:rgb(240,249,254);">
        <td
          style="padding: 10px 30px 10px 30px;font-family: Segoe UI Semibold, Segoe UI, Helvetica, Arial, sans-serif;">
          New commits tested since last results
        </td>
      </tr>
      <xsl:for-each select="ChangeViewModel">
        <tr>
          <td style="padding: 10px 30px 10px 30px">
            <table>
              <tr>
                <td>
                  <a>
                    <xsl:attribute name="href">
                      <xsl:value-of select="Url" />
                    </xsl:attribute>
                    <xsl:text>Commit </xsl:text>
                    <xsl:value-of select="ShortId" />
                  </a>
                  <xsl:text> by </xsl:text>
                  <xsl:value-of select="AuthorName" />
                  <xsl:text> on </xsl:text>
                  <xsl:value-of select="TimeStamp" />
                </td>
              </tr>
              <tr>
                <td style="font-size:14px;">
                  <xsl:value-of select="Message" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>