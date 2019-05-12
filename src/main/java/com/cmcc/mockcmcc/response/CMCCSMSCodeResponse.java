package com.cmcc.mockcmcc.response;

import com.cmcc.mockcmcc.generator.*;
import com.cmcc.mockcmcc.util.MD5Util;
import com.cmcc.mockcmcc.util.SpringContextUtil;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Random;

public class CMCCSMSCodeResponse extends CMCCResponse{
        private String thirdAccount;
        private String mobile;
        private String smsCodeId;
        private String otpType;

    public String getOtpType() {
        return otpType;
    }

    public void setOtpType(String otpType) {
        this.otpType = otpType;
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

    public String getSmsCodeId() {
        return smsCodeId;
    }

    public void setSmsCodeId(String smsCodeId) {
        this.smsCodeId = smsCodeId;
    }
    public LinkedHashMap<String, String> responseString() throws InvocationTargetException, IllegalAccessException{
        LinkedHashMap<String, String> linkedHashMap = super.responseString();
        if( super.isBingding(this.thirdAccount,this.mobile)) {
            SmsInfoDao smsInfoDao = SpringContextUtil.getBean(SmsInfoDao.class);
            SmsInfo smsInfo = new SmsInfo();
            smsInfo.setMobile(this.mobile);
            smsInfo.setCreateTime(new Date());
            smsInfo.setOtpType(this.getOtpType());
            smsInfo.setState("0");
            smsInfo.setSmsCode((int) (Math.random() * (9999 - 1000 + 1)) + 1000+"");
            if(smsInfoDao.selectOneMinuteRecoreByNameAndmobile(smsInfo) ==null) {
                smsInfoDao.insert(smsInfo);
                linkedHashMap.put("returnCode", "0000");
                linkedHashMap.put("message", "操作成功");
                linkedHashMap.put("thirdAccount", this.thirdAccount);
                linkedHashMap.put("mobile", mobile);
                linkedHashMap.put("smsCodeId", this.otpType);
            }else{
                linkedHashMap.put("returnCode", "D0002");
                linkedHashMap.put("message", "1个手机号一分钟只能发送一次记录");
                linkedHashMap.put("thirdAccount", this.thirdAccount);
                linkedHashMap.put("mobile", mobile);
                linkedHashMap.put("smsCodeId", this.otpType);
            }
        }else{
            linkedHashMap.put("returnCode", "D001");
            linkedHashMap.put("message", "该手机号未绑定:"+this.thirdAccount);
            linkedHashMap.put("thirdAccount", this.thirdAccount);
            linkedHashMap.put("mobile", mobile);
            linkedHashMap.put("smsCodeId", this.otpType);
        }
        String builderMd5 = "";
        for (String key : linkedHashMap.keySet()) {
            if (linkedHashMap.get(key) != null) {
                builderMd5 += linkedHashMap.get(key);
            }
        }
        linkedHashMap.put("hmac", MD5Util.md5(builderMd5 + "123456"));
        return linkedHashMap;
    }


}
