package com.cmcc.mockcmcc.builder;

import com.cmcc.mockcmcc.util.MockCmccUtil;
import javax.servlet.http.HttpServletRequest;

public class CMCCPointRecoveryBuilder extends CMCCBuilder{
    private String reTradeID;
    private String deTradeID;
    private String thirdAccount;
    private String mobile;

    public String getReTradeID() {
        return reTradeID;
    }

    public void setReTradeID(String reTradeID) {
        this.reTradeID = reTradeID;
    }

    private String andPoint;



    private String thirdPoint;



    public String getDeTradeID() {
        return deTradeID;
    }

    public void setDeTradeID(String deTradeID) {
        this.deTradeID = deTradeID;
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

    public String volidate(HttpServletRequest request){
        if(request.getParameter("reTradeID")==null ||request.getParameter("reTradeID").equals("")){
            return "reTradeID 不能为空";
        }
        if(request.getParameter("deTradeID")==null ||request.getParameter("deTradeID").equals("")){
            return "deTradeID 不能为空";
        }
        if(request.getParameter("thirdAccount")==null ||request.getParameter("thirdAccount").equals("")){
            return "thirdAccount 不能为空";
        }
        if(request.getParameter("mobile")==null ||request.getParameter("mobile").equals("")){
            return "mobile 不能为空";
        }
        if(request.getParameter("andPoint")==null ||request.getParameter("andPoint").equals("")){
            return "andPoint 不能为空";
        }
        if(request.getParameter("thirdPoint")==null ||request.getParameter("thirdPoint").equals("")){
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
        this.reTradeID=request.getParameter("reTradeID");
        this.deTradeID=request.getParameter("deTradeID");
        this.thirdAccount=request.getParameter("thirdAccount");
        this.mobile=request.getParameter("mobile");
        this.andPoint=request.getParameter("andPoint");
        this.thirdPoint=request.getParameter("thirdPoint");
    }
}
