package com.cmcc.mockcmcc.selector;

import com.cmcc.mockcmcc.builder.CMCCBindingBuilder;
import com.cmcc.mockcmcc.builder.CMCCBuilder;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ActionSelector {
    public static Map<String,String> requestMap=new ConcurrentHashMap<>();
    public static Map<String,String> responseMap=new ConcurrentHashMap<>();
    static {
        requestMap.put("jf0001","com.cmcc.mockcmcc.builder.CMCCBindingBuilder");
        responseMap.put("jf0001","com.cmcc.mockcmcc.response.CMCCBindingResponse");


        requestMap.put("jf0002","com.cmcc.mockcmcc.builder.CMCCUnbindingBuilder");
        responseMap.put("jf0002","com.cmcc.mockcmcc.response.CMCCUnBindingResponse");

        requestMap.put("jfd001","com.cmcc.mockcmcc.builder.CMCCSMSCodeBuilder");
        responseMap.put("jfd001","com.cmcc.mockcmcc.response.CMCCSMSCodeResponse");


        requestMap.put("jf0005","com.cmcc.mockcmcc.builder.CMCCQueryPointBuilder");
        responseMap.put("jf0005","com.cmcc.mockcmcc.response.CMCCQueryPointResponse");


        requestMap.put("jf0006","com.cmcc.mockcmcc.builder.CMCCPointCutBuilder");
        responseMap.put("jf0006","com.cmcc.mockcmcc.response.CMCCPointCutResponse");

        requestMap.put("jf0007","com.cmcc.mockcmcc.builder.CMCCTransQueryBuilder");
        responseMap.put("jf0007","com.cmcc.mockcmcc.response.CMCCTransQueryResponse");

        requestMap.put("jf0009","com.cmcc.mockcmcc.builder.CMCCPointRecoveryBuilder");
        responseMap.put("jf0009","com.cmcc.mockcmcc.response.CMCCPointRecoveryResponse");
    }



}
