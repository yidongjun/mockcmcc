package com.cmcc.mockcmcc.builder;

import com.cmcc.mockcmcc.util.MockCmccUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.LinkedHashMap;

public class CMCCQueryPointBuilder extends CMCCBuilder{
    private String thirdAccount;
    private String mobile;

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
    public String volidate(HttpServletRequest request){
        if(request.getParameter("thirdAccount")==null ||request.getParameter("thirdAccount").equals("")){
                return "thirdAccount 不能为空";
        }
        if(request.getParameter("mobile")==null ||request.getParameter("mobile").equals("")){
            return "mobile 不能为空";
        }
        if(!MockCmccUtil.validateSign(request)){
            return "mac 校验未通过";
        }
        return "0000";
    }
    public void builder(HttpServletRequest request){
        this.mobile=request.getParameter("mobile");
        this.thirdAccount=request.getParameter("thirdAccount");
    }
}
