package com.cmcc.mockcmcc.builder;

import com.cmcc.mockcmcc.util.MockCmccUtil;

import javax.servlet.http.HttpServletRequest;

public class CMCCBindingBuilder extends CMCCBuilder{


    private String thirdAccount;
    private String callbackUrl;

    private String reserved1;
    private String reserved2;


    public String getThirdAccount() {
        return thirdAccount;
    }

    public void setThirdAccount(String thirdAccount) {
        this.thirdAccount = thirdAccount;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }

    public void setCallbackUrl(String callbackUrl) {
        this.callbackUrl = callbackUrl;
    }

    public String getReserved1() {
        return reserved1;
    }

    public void setReserved1(String reserved1) {
        this.reserved1 = reserved1;
    }

    public String getReserved2() {
        return reserved2;
    }

    public void setReserved2(String reserved2) {
        this.reserved2 = reserved2;
    }
    public String volidate(HttpServletRequest request){
        if(request.getParameter("thirdAccount")==null){
            return "thirdAccount 为空";
        }
         if(request.getParameter("callbackUrl")==null){
            return "callbackUrl  为空";
        }
        String url = request.getParameter("callbackUrl");
         if(!url.startsWith("http://")){
             return "url 必须以 http://   开头";
         }
        if(!MockCmccUtil.validateSign(request)){
            return "mac 校验未通过";
        }

        return "0000";
    }

    public void builder(HttpServletRequest request){
       this.thirdAccount=request.getParameter("thirdAccount");
       this.callbackUrl=request.getParameter("callbackUrl");
    }



}
