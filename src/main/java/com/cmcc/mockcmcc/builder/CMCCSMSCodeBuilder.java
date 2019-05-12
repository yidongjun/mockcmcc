package com.cmcc.mockcmcc.builder;

import com.cmcc.mockcmcc.util.MockCmccUtil;

import javax.servlet.http.HttpServletRequest;

public class CMCCSMSCodeBuilder extends CMCCBuilder {
    private String thirdAccount;
    private String mobile;
    private String otpType;

    public String getThirdAccount() {
        return thirdAccount;
    }

    public void setThirdAccount(String thirdAccount) {
        this.thirdAccount = thirdAccount;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getOtpType() {
        return otpType;
    }

    public void setOtpType(String otpType) {
        this.otpType = otpType;
    }
    public String volidate(HttpServletRequest request){
        if(request.getParameter("thirdAccount")==null ||request.getParameter("thirdAccount").equals("")){
            return "thirdAccount 不能为空";
        }
        if(request.getParameter("mobile")==null ||request.getParameter("mobile").equals("")){
            return "mobile 不能为空";
        }
        if(request.getParameter("otpType")==null || request.getParameter("otpType").equals("")){
            return  "otpType 不能为空";
        }
        if(!MockCmccUtil.validateSign(request)){
            return "mac 校验未通过";
        }
        return "0000";
    }
    public void builder(HttpServletRequest request){
        this.mobile=request.getParameter("mobile");
        this.thirdAccount=request.getParameter("thirdAccount");
        this.otpType=request.getParameter("otpType");
    }
}
