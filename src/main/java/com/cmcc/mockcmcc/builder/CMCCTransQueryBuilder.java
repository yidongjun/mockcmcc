package com.cmcc.mockcmcc.builder;

import com.cmcc.mockcmcc.util.MockCmccUtil;

import javax.servlet.http.HttpServletRequest;

public class CMCCTransQueryBuilder extends CMCCBuilder{
    private String deTradeID;

    public String getDeTradeID() {
        return deTradeID;
    }

    public void setDeTradeID(String deTradeID) {
        this.deTradeID = deTradeID;
    }

    public String volidate(HttpServletRequest request){
        if(request.getParameter("deTradeID")==null){
            return "deTradeID 不能为空";
        }
        if(!MockCmccUtil.validateSign(request)){
            return "mac 校验未通过";
        }
        return "0000";
    }
    public void builder(HttpServletRequest request){
        this.deTradeID=request.getParameter("deTradeID");
    }

}
