const dateUtil = require("../../utils/data-time-util");

module.exports.getWelcomeTemplate=(recipient) => {

    let content = `
        <div id=":ew" class="ii gt adP adO"><div id=":ct" class="a3s aXjCH m15fe77696438a8b7"><u></u>

    <div bgcolor="#F7F7F7">
        <div id="m_2760232353335187221body_style" style="background-color:#f7f7f7">
            <table width="100%" bgcolor="#F7F7F7" cellpadding="0" cellspacing="0" border="0" style="text-align:center">
                <tbody>
                <tr>
                    <td>
                        <table bgcolor="#F7F7F7" cellpadding="0" cellspacing="0" border="0" width="600" class="m_2760232353335187221tableCollapse2" align="center" style="margin:0px auto">

                            <tbody>
                            <tr>
                                <td bgcolor="#F7F7F7" align="center">
                                    <table width="100%" align="center" cellspacing="0" cellpadding="0" border="0" class="m_2760232353335187221devicewidth">
                                        <tbody>
                                        <tr>
                                            <td width="100%" align="center" height="1" style="font-size:1px;line-height:1px">
                                                <div class="m_2760232353335187221mktEditable" id="m_2760232353335187221Preview-Text" style="display:none;font-size:1px;color:#f7f7f7;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden">
                                                    &nbsp;
                                                </div></td>
                                        </tr>
                                        </tbody>
                                    </table></td>
                            </tr>

                            <tr>
                                <td bgcolor="#F7F7F7" align="right" valign="top">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="right" class="m_2760232353335187221tableCollapse">
                                        <tbody>
                                        <tr>
                                            <td valign="top" width="100%">
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0" class="m_2760232353335187221devicewidth" align="right">
                                                    <tbody>
                                                    <tr>
                                                        <td class="m_2760232353335187221H29" height="39" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                    </tr>
                                                    </tbody>
                                                </table> </td>
                                        </tr>
                                        </tbody>
                                    </table> </td>
                            </tr>

                            <tr>
                                <td align="center">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0" class="m_2760232353335187221devicewidth">
                                        <tbody>
                                        <tr>
                                            <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            <td class="m_2760232353335187221mktEditable m_2760232353335187221headline m_2760232353335187221mktEditable m_2760232353335187221headline" id="m_2760232353335187221headline_text" style="font-family:'Proxima Nova',Calibri,Helvetica,sans-serif;font-size:36px;color:#444444;text-align:center;line-height:55px;font-weight:100"><p><a href="https://www.tecknocracy.com/" style="text-decoration: none;">Welcome to Technocracy Blog Community!</a></p></td>
                                            <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                        </tr>

                                        <tr>
                                            <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            <td height="50" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                        </tr>

                                        </tbody>
                                    </table></td>
                            </tr>

                            <tr>
                                <td bgcolor="#FFFFFF" align="center" valign="top">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" class="m_2760232353335187221tableCollapse">
                                        <tbody>
                                        <tr>
                                            <td valign="top" width="100%">
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0" class="m_2760232353335187221devicewidth" align="center">
                                                    <tbody>
                                                    <tr>
                                                        <td align="center" class="m_2760232353335187221mktEditable" id="m_2760232353335187221headline_image" style="font-size:1px;line-height:1px">
                                                            <div>
                                                                <a href="https://www.tecknocracy.com/">
                                                                    <img border="0" alt="" style="display:block;border:none;outline:none;text-decoration:none;width:100%!important;" src="${process.env.CLOUD_IMAGE_PATH}/images/tech-blog-logo.jpg" data-max-width="560" height='200' width='560' class="CToWUd a6T" tabindex="0">
                                                                </a>
                                                                <div class="a6S" dir="ltr" style="opacity: 0.01; left: 748px; top: 603px;"><div id=":fo" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " data-tooltip-class="a1V" data-tooltip="Download"><div class="aSK J-J5-Ji aYr"></div></div></div>
                                                            </div></td>
                                                    </tr>

                                                    <tr>
                                                        <td class="m_2760232353335187221h26" height="36" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                    </tr>

                                                    </tbody>
                                                </table></td>
                                        </tr>
                                        </tbody>
                                    </table></td>
                            </tr>

                            <tr>
                                <td bgcolor="#FFFFFF" align="center">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0" class="m_2760232353335187221devicewidth">
                                        <tbody>
                                        <tr>
                                            <td class="m_2760232353335187221w22" width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            <td class="m_2760232353335187221mktEditable m_2760232353335187221content m_2760232353335187221mktEditable m_2760232353335187221content" id="m_2760232353335187221edit_text_1" style="font-family:'Proxima Nova',Calibri,Helvetica,sans-serif;font-size:16px;color:#505050;text-align:left;line-height:25.6px;font-weight:normal;text-transform:none">
                                                <p>Join your hand with active developers around the world. You'll find many ways to learn, grow,and contribute to the Technocracy developer blog community.
                                                    <br><br>
                                                    <span style="color:#101d69;font-size:25px;font-family:'Proxima Nova Light','Open Sans','Helvetica Neue',Calibri,Helvetica,sans-serif">Join the online community forum</span>
                                                    <br> <br>Get the most out of your Technocracy account by getting involved in our online community, where you'll find an active Q&amp;A and 1000+ blogs.
                                                    <br><br>
                                                    Meet software developers of all skill levels to share resources, learn and form discussions around the world.
                                                    <span>If you have any question in your mind...??</span><br>
                                                    <a href="https://www.tecknocracy.com/#/question/ask/new" target="_blank"><strong>Ask here</strong></a>


                                                    <br><br><span style="color:#101d69;font-size:25px;font-family:'Proxima Nova Light','Open Sans','Helvetica Neue',Calibri,Helvetica,sans-serif">Become a community author</span>
                                                    <br><br>If you have a knack for explaining things and the drive to help other software developers and new technical guys, our editorial team would love to work with you to publish your content.<br>
                                                    <a href="https://www.tecknocracy.com/#/profile?p=new" target="_blank"><strong>Apply here</strong></a>
                                                    <br><br><span style="color:#101d69;font-size:25px;font-family:'Proxima Nova Light','Open Sans','Helvetica Neue',Calibri,Helvetica,sans-serif">Or, just watch and listen!</span>
                                                    <br> <br>Subscribe to Technocracy blog community as a user to get our roundup of whatever happenings and new blog be delivered to your inbox every weeks.
                                                    <br><strong><a href="https://www.tecknocracy.com/#/subscribe" target="_blank">Subscribe here</a></strong>
                                                    <br><br> Take a look around and join the conversation.</p> </td>
                                            <td class="m_2760232353335187221w22" width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                        </tr>

                                        <tr>
                                            <td class="m_2760232353335187221w22" width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            <td height="30" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            <td class="m_2760232353335187221w22" width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                        </tr>

                                        </tbody>
                                    </table></td>
                            </tr>

                            <tr>
                                <td bgcolor="#FFFFFF" align="center" class="m_2760232353335187221mktEditable" id="m_2760232353335187221edit_cta_button">
                                    <div></div></td>
                            </tr>


                            <tr>
                                <td bgcolor="#FFFFFF" align="center">
                                    <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0" class="m_2760232353335187221devicewidth">
                                        <tbody>
                                        <tr>
                                            <td class="m_2760232353335187221w22" width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            <td class="m_2760232353335187221mktEditable m_2760232353335187221content m_2760232353335187221mktEditable m_2760232353335187221content" id="m_2760232353335187221edit_signature" style="font-family:'Proxima Nova',Calibri,Helvetica,sans-serif;font-size:16px;color:#505050;text-align:left;line-height:25.6px;font-weight:normal;text-transform:none"><p>Happy Coding,<br>Team Technocracy Blog</p></td>
                                            <td class="m_2760232353335187221w22" width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                        </tr>

                                        <tr>
                                            <td class="m_2760232353335187221w22" width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            <td class="m_2760232353335187221h20" height="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            <td class="m_2760232353335187221w22" width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                        </tr>

                                        </tbody>
                                    </table></td>
                            </tr>

                            <tr>
                                <td bgcolor="#F7F7F7" align="center">
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" class="m_2760232353335187221devicewidth">
                                        <tbody>
                                        <tr>
                                            <td align="center">
                                                <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0" class="m_2760232353335187221devicewidth">
                                                    <tbody>
                                                    <tr>
                                                        <td class="m_2760232353335187221m_3623822720450084279h24" height="40" style="font-family:'Proxima Nova',Calibri,Helvetica,sans-serif;font-size:13px;color:#505050;text-align:left;line-height:20px;font-weight:normal;background:#e6e6e6;" colspan="3">
                                                            <div style="float:left;margin-right:12px">
                                                                <u></u>
                                                                <u></u>
                                                                <u></u><u></u>
                                                                <u></u>
                                                                <u></u>
                                                            </div>

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

                                                    <tr>
                                                        <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                        <td height="20" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                        <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                    </tr>

                                                    <tr>
                                                        <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                        <td height="20" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                        <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                    </tr>



                                                    <tr>
                                                        <td width="25" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                        <td class="m_2760232353335187221mktEditable m_2760232353335187221footer m_2760232353335187221mktEditable m_2760232353335187221footer" id="m_2760232353335187221edit_text_3" style="font-family:'Proxima Nova',Calibri,Helvetica,sans-serif;font-size:12px;color:#808080;font-weight:normal;text-align:center;line-height:150%">
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
                                                        <td width="25" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                    </tr>

                                                    <tr>
                                                        <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                        <td height="20" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                        <td width="41" style="font-size:1px;line-height:1px">&nbsp;</td>
                                                    </tr>
                                                    </tbody>
                                                </table></td>
                                        </tr>
                                        </tbody>
                                    </table></td>
                            </tr>

                            </tbody>
                        </table></td>
                </tr>
                </tbody>
            </table>
        </div>

        <p style="text-align:center"><font face="'Proxima Nova', 'Open Sans', 'Helvetica Neue', Calibri, Helvetica, sans-serif" size="1">
            This email was sent to <a href="${recipient}" target="_blank">${recipient}</a>. If you no longer wish to receive these emails you may <a href="https://www.tecknocracy.com/#/unsubscribe" target="_blank">unsubscribe</a> at any time.
        </font> </p><div class="yj6qo"></div><div class="adL">
    </div></div><div class="adL">
    </div></div></div>
    `;

    return content;
};