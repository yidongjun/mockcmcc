package com.cmcc.mockcmcc.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ReturnCodeUtil {
    public static Map<String,String> returnCodeMap =new ConcurrentHashMap<>();
    static{
        returnCodeMap.put("001","可用积分不足");
        returnCodeMap.put("002","验证码不存在");
        returnCodeMap.put("003","验证码错误");
        returnCodeMap.put("004","订单号重复!");
        returnCodeMap.put("00","交易成功!");
    }
}
