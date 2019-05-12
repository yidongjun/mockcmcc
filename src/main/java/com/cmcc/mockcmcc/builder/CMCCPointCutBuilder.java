package com.cmcc.mockcmcc.builder;

import com.cmcc.mockcmcc.util.MockCmccUtil;

import javax.servlet.http.HttpServletRequest;

public class CMCCPointCutBuilder extends CMCCBuilder {
    private String thirdAccount;
    private String mobile;
    private String optCode;
    private String smsCodeId;
    private String deTradeID;
    private String andPoint;
    private String thirdPoint;
    private String reserved1;
    private String reserved2;

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

    public String getOptCode() {
        return optCode;
    }

    public void setOptCode(String optCode) {
        this.optCode = optCode;
    }

    public String getSmsCodeId() {
        return smsCodeId;
    }

    public void setSmsCodeId(String smsCodeId) {
        this.smsCodeId = smsCodeId;
    }

    public String getDeTradeID() {
        return deTradeID;
    }

    public void setDeTradeID(String deTradeID) {
        this.deTradeID = deTradeID;
    }

    public String getAndPoint() {
        return andPoint;
    }

    public void setAndPoint(String andPoint) {
        this.andPoint = andPoint;
    }

    public String getThirdPoint() {
        return thirdPoint;
    }

    public void setThirdPoint(String thirdPoint) {
        this.thirdPoint = thirdPoint;
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
            return "thirdAccount 不能为空";
        }else  if(request.getParameter("mobile")==null){
            return "mobile 不能为空";
        }else  if(request.getParameter("optCode")==null){
            return "optCode 不能为空";
        }else  if(request.getParameter("smsCodeId")==null){
            return "smsCodeId 不能为空";
        }else  if(request.getParameter("deTradeID")==null){
            return "deTradeID 不能为空";
        }else  if(request.getParameter("andPoint")==null){
            return "andPoint 不能为空";
        }else  if(request.getParameter("thirdPoint")==null){
            return "thirdPoint 不能为空";
        }
        try {
            Integer point =Integer.parseInt(request.getParameter("andPoint"));
            if(point<=0){
                return "andpoint 必须大于0";
            }
        }catch (Exception ex){
            ex.printStackTrace();;
            return "andpoint 格式不正确";
        }
        if(!MockCmccUtil.validateSign(request)){
            return "mac 校验未通过";
        }
        return "0000";
    }
    public void builder(HttpServletRequest request){
        this.thirdAccount=request.getParameter("thirdAccount");
        this.mobile=request.getParameter("mobile");
        this.optCode=request.getParameter("optCode");
        this.smsCodeId=request.getParameter("smsCodeId");
        this.deTradeID=request.getParameter("deTradeID");
        this.andPoint=request.getParameter("andPoint");
        this.thirdPoint=request.getParameter("thirdPoint");
    }

}
