const mailSender = require("../mail-sender");
let moment = require("moment");
const dateUtil = require("../../utils/data-time-util");

module.exports.getQuestionRejectedMailTemplate = (question, recipient, askedBy) => {
    let content = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>Technocracy Question</title>
            <style type="text/css">
                body {
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    margin:0 !important;
                    width: 100% !important;
                    -webkit-text-size-adjust: 100% !important;
                    -ms-text-size-adjust: 100% !important;
                    -webkit-font-smoothing: antialiased !important;
                }
                .tableContent img {
                    border: 0 !important;
                    display: block !important;
                    outline: none !important;
                }
                a{
                    color:#382F2E;
                }
        
                p, h2{
                    color:#382F2E;
                }
        
                div,p,ul,h2{
                    margin:0;
                }
        
        
                a.link1{
                    color:#698EC3;
                    font-size:13px;
                    font-weight:bold;
                    text-decoration:none;
                }
        
                a.link2{
        
                }
        
                h2{
                    color:#555555;
                    font-size:21px;
                    font-weight:normal;
                }
        
                .bgBody {background:#ffffff;}
                .bgItem {background:#ffffff;}
        
                p, li{
                    color:#999999;
                    font-size:13px;
                    line-height:19px;
                }
        
        
                @media only screen and (max-width:480px)
        
                {
        
                    table[class="MainContainer"], td[class="cell"]
                    {
                        width: 100% !important;
                        height:auto !important;
                    }
                    td[class="specbundle"]
                    {
                        width: 100% !important;
                        float:left !important;
                        font-size:13px !important;
                        line-height:17px !important;
                        display:block !important;
                        padding-bottom:20px !important;
                    }
                    td[class="specbundle2"]
                    {
                        width:90% !important;
                        float:left !important;
                        font-size:13px !important;
                        line-height:17px !important;
                        display:block !important;
                        padding-left:5% !important;
                        padding-right:5% !important;
                    }
        
                    td[class="specbundle3"]
                    {
                        width:20px !important;
                        float:left !important;
                        display:block !important;
                        background-color:#f2f2f2 !important;
                    }
        
                    td[class="spechide"]
                    {
                        display:none !important;
                    }
                    img[class="banner"]
                    {
                        width: 100% !important;
                        height: auto !important;
                    }
                    td[class="left_pad"]
                    {
                        padding-left:15px !important;
                        padding-right:15px !important;
                    }
        
                }
        
                @media only screen and (max-width:540px)
        
                {
        
                    table[class="MainContainer"], td[class="cell"]
                    {
                        width: 100% !important;
                        height:auto !important;
                    }
                    td[class="specbundle"]
                    {
                        width: 100% !important;
                        float:left !important;
                        font-size:13px !important;
                        line-height:17px !important;
                        display:block !important;
                        padding-bottom:20px !important;
                    }
                    td[class="specbundle2"]
                    {
                        width:90% !important;
                        float:left !important;
                        font-size:13px !important;
                        line-height:17px !important;
                        display:block !important;
                        padding-left:5% !important;
                        padding-right:5% !important;
                    }
        
                    td[class="specbundle3"]
                    {
                        width:20px !important;
                        float:left !important;
                        display:block !important;
                        background-color:#f2f2f2 !important;
                    }
        
                    td[class="spechide"]
                    {
                        display:none !important;
                    }
                    img[class="banner"]
                    {
                        width: 100% !important;
                        height: auto !important;
                    }
                    td[class="left_pad"]
                    {
                        padding-left:15px !important;
                        padding-right:15px !important;
                    }
        
                }
            </style>
        
            <script type="colorScheme" class="swatch active">
            {
                "name":"Default",
                "bgBody":"ffffff",
                "link":"698EC3",
                "color":"999999",
                "bgItem":"ffffff",
                "title":"555555"
            }
        </script>
        
        </head>
        
        <body paddingwidth="0" paddingheight="0" class='bgBody'  style="padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;" offset="0" toppadding="0" leftpadding="0">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tableContent bgBody" align="center" >
            <tbody>
            <tr>
                <td>
                    <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="MainContainer" style='font-family:helvetica, sans-serif;'>
                        <tbody>
                        <tr>
                            <td>
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tbody>
                                    <tr>
                                        <td valign="top" width="20" class="spechide">&nbsp;</td>
                                        <td class='movableContentContainer'>
                                            <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" >
                                                    <tr>
                                                        <td height='25'>&nbsp;</td>
                                                    </tr>
        
                                                    <tr>
                                                        <td class="specbundle2" style="background-color: #007db8;">
                                                            <a href="https://www.tecknocracy.com/">
                                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" >
                                                                    <tr>
        
                                                                        <td align='left' valign='middle' style="width: 90px;">
                                                                            <div class="contentEditableContainer contentImageEditable">
                                                                                <div class="contentEditable" >
                                                                                    <img src="${process.env.CLOUD_IMAGE_PATH}/images/tech-logo.png" style="width: 80px; height: 70px;" alt='Compagnie logo' data-default="placeholder" data-max-width="300" width='129' height='22'>
                                                                                </div>
                                                                            </div>
                                                                        </td>
        
                                                                        <td align='left' valign='top' >
                                                                            <div class="contentEditableContainer contentTextEditable" style='display:inline-block;'>
                                                                                <div class="contentEditable" >
                                                                                    <h3 style="font-size: x-large; color: #f0f8ff;">Technocracy Question</h3>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td  align='left' style="width: 130px; padding-top: 45px;" >
                                                                            <div class="contentEditableContainer contentImageEditable" style='display:inline-block;'>
                                                                                <div class="contentEditable" >
                                                                                    <p style="color: white;">${dateUtil.getDateString()}</p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
        
                                                                    </tr>
                                                                </table>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
        
                                            <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" >
                                                    <tr>
                                                        <td bgcolor='#698EC3' align='center' valign='middle'>
                                                            <div class="contentEditableContainer contentImageEditable">
                                                                <div class="contentEditable" >
                                                                    <a href="https://www.tecknocracy.com/">
                                                                        <img class="banner" src="${process.env.CLOUD_IMAGE_PATH}/images/tech-blog-logo.jpg" alt='featured image' data-default="placeholder" data-max-width="560" height='200' width='560' border="0">
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
        
                                            <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                            <tr>
                                                                                <td>
                                                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" >
                                                                                        <tr>
                                                                                            <td>
                                                                                                <div class="contentEditableContainer contentTextEditable">
                                                                                                    <div class="contentEditable">
                                                                                                        <br/>
                                                                                                        <p>Hey <strong>${askedBy}</strong>,</p>
                                                                                                        <p>Thanks for using <strong>Technocracy</strong>. This question is just asked by you on ${moment(question.createdOn).format('LLLL')} but your question is not approved due some ambiguas and inappropriate content, so please review and edit your question and submit it again.</p>
                                                                                                        <br/>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
        
                                            <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" >
                                                    <tr><td style='border-bottom:1px solid #454649'></td></tr>
                                                </table>
                                            </div>
        
                                            <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" >
                                                    <tr>
                                                        <td style='border-bottom-left-radius:3px;border-bottom-right-radius:3px;' align='left'>
                                                            <div class="contentEditableContainer contentTextEditable" style='display:inline-block;'>
                                                                <div class="contentEditable" >
                                                                    <h4 style="color: #007db8; font-family: inherit;"><a href="https://www.tecknocracy.com/#/question/${question._id}" style="text-decoration: none;color: currentColor;">${question.title}</a></h4>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
        
                                            <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" >
                                                    <tr><td style='border-bottom:1px solid #454649'></td></tr>
                                                </table>
                                            </div>
        
                                            <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td valign="top" class="specbundle2"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" >
                                                            <tr><td height='10'>&nbsp;</td></tr>
                                                            <tr>
                                                                <td align='left' valign='top'>
                                                                    <div class="contentEditableContainer contentTextEditable">
                                                                        <div class="contentEditable">
                                                                            <p >
                                                                                ${question.content.length > 299 ? mailSender.decodeHTML(question.content.substring(0,300)) : mailSender.decodeHTML(question.content)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align='right' valign='top'>
                                                                    <div class="contentEditableContainer contentTextEditable">
                                                                        <div class="contentEditable" >
                                                                            <a target='_blank' href="http://www.tecknocracy.com/#/question/${question._id}" class='link1'>Review it →</a>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
        
                                            <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tbody>
        
                                                    <tr>
                                                        <td>
                                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                <tbody>
                                                                <tr>
                                                                    <td valign="top">
                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center"bgcolor='#F2F2F2'>
                                                                            <tr>
                                                                                <td height='22' colspan='3'>&nbsp;</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td width='10'></td>
                                                                                <td>
                                                                                    <div class='contentEditableContainer contentTextEditable'>
                                                                                        <div class="contentEditable">
                                                                                            <p >
                                                                                                Stay in Touch!
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td width='10'></td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td height='22' colspan='3'>&nbsp;</td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                    <td bgcolor='#F2F2F2' width="140">
                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                            <tr>
                                                                                <td valign="middle" width="65" bgcolor='#ffffff' height="52" align="center">
                                                                                    <div class='contentEditableContainer contentFacebookEditable'>
                                                                                        <div class="contentEditable" valign='middle'>
                                                                                            <a target='_blank' href="https://www.facebook.com/tecknocracy/"><img src="${process.env.CLOUD_IMAGE_PATH}/images/facebook.png" alt='https://www.facebook.com/tecknocracy/' data-default="placeholder" data-max-width="37" width='37' height='37' data-customIcon="true"></a>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td valign="top" width="5">&nbsp;</td>
                                                                                <td valign="middle" width="65" bgcolor='#ffffff' height="52" align="center">
                                                                                    <div class='contentEditableContainer contentTwitterEditable'>
                                                                                        <div class="contentEditable" valign='middle'>
                                                                                            <a target='_blank' href="https://plus.google.com/u/1/collection/4rqoUE"><img src="${process.env.CLOUD_IMAGE_PATH}/images/google.png" alt='https://plus.google.com/u/1/collection/4rqoUE' data-default="placeholder" data-max-width="37" width='37' height='25' data-customIcon="true"></a>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td valign="top" width="5">&nbsp;</td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                    <td bgcolor='#F2F2F2' width="140">
                                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                                            <tbody>
                                                                            <tr>
                                                                                <td valign="middle" width="65" bgcolor='#ffffff' height="52" align="center">
                                                                                    <div class='contentEditableContainer contentFacebookEditable'>
                                                                                        <div class="contentEditable" valign='middle'>
                                                                                            <a target='_blank' href="https://twitter.com/tecknocracy_inc"><img src="${process.env.CLOUD_IMAGE_PATH}/images/twitter.png" alt='facebook link' data-default="placeholder" data-max-width="37" width='37' height='37' data-customIcon="true"></a>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td valign="top" width="5">&nbsp;</td>
                                                                                <td valign="middle" width="65" bgcolor='#ffffff' height="52" align="center">
                                                                                    <div class='contentEditableContainer contentTwitterEditable'>
                                                                                        <div class="contentEditable" valign='middle'>
                                                                                            <a target='_blank' href="#"><img src="${process.env.CLOUD_IMAGE_PATH}/images/linkedin.png" alt='twitter link' data-default="placeholder" data-max-width="37" width='37' height='30' data-customIcon="true"></a>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td valign="top" width="5">&nbsp;</td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
        
                                            <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" >
        
                                                    <tr>
                                                        <td valign='top' align='center'>
                                                            <div class="contentEditableContainer contentTextEditable">
                                                                <div class="contentEditable" >
                                                                    <p style='color:#CCCCCC; font-weight:bold;font-size:13px;line-height: 30px;'>Technocracy Inc. New Delhi, India</p>
                                                                </div>
                                                            </div>
                                                            <div class="contentEditableContainer contentTextEditable">
                                                                <div class="contentEditable" >
                                                                    <a target='_blank' href="https://www.tecknocracy.com" style='line-height: 20px;color:#CCCCCC; font-size:13px;'>https://www.technocracy.com</a>
                                                                </div>
                                                                <div class="contentEditable" >
                                                                    <p style='color:#CCCCCC; font-size:13px;line-height: 15px;'>Contact us:<a target='_blank' href="mailto:editors@tecknocracy.com" style='line-height: 20px;color:#CCCCCC; font-size:13px;'>editors@tecknocracy.com</a></p>
                                                                </div>
                                                            </div>
                                                            <div class="contentEditableContainer contentTextEditable">
                                                                <div class="contentEditable" >
                                                                    <a target='_blank' href='https://www.tecknocracy.com/#/unsubscribe' style='line-height:19px;color:#CCCCCC; font-size:13px;'>Unsubscribe</a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
        
                                            <div class="movableContent" style="border: 0px; padding-top: 0px; position: relative;">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" >
                                                    <tr>
                                                        <td valign='top' align='center'>
                                                            <div class="contentEditableContainer contentTextEditable">
                                                                <div class="contentEditable" >
                                                                    <p style='color:#A8B0B6; font-size:13px;line-height: 16px;'>This email was sent to <a href="mailto:${mailSender.getUserName(recipient)}" target=\\"_blank\\">${mailSender.getUserName(recipient)}</a> when you signed up on technocracy.com Please add us to your contacts to ensure the newsletters land in your inbox.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
        
                                        </td>
                                        <td valign="top" width="20" class="spechide">&nbsp;</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            </tbody>
        </table>
        
        </body>
        </html>
    `;

    return content;
};