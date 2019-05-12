package com.cmcc.mockcmcc.builder;

import com.cmcc.mockcmcc.util.MockCmccUtil;

import javax.servlet.http.HttpServletRequest;

public class CMCCUnbindingBuilder extends  CMCCBuilder{
    private String role;
    private String thirdAccount;
    private String mobile;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

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
        if(request.getParameter("thirdAccount")==null){
            return "thirdAccount 不能为空";
        }else if(request.getParameter("mobile")==null){
            return "mobile 不能为空";
        }else if(request.getParameter("role")==null){
            return "role 不能为空";
        }
        if(!MockCmccUtil.validateSign(request)){
            return "mac 校验未通过";
        }
        return "0000";
    }
    public void builder(HttpServletRequest request){
        this.role=request.getParameter("role");
        this.mobile=request.getParameter("mobile");
        this.thirdAccount=request.getParameter("thirdAccount");
    }

}
