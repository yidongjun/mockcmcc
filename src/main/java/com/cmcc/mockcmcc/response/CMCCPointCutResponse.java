package com.cmcc.mockcmcc.response;

import com.cmcc.mockcmcc.generator.*;
import com.cmcc.mockcmcc.util.DateUtil;
import com.cmcc.mockcmcc.util.MD5Util;
import com.cmcc.mockcmcc.util.SpringContextUtil;

import javax.swing.*;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.UUID;

public class CMCCPointCutResponse extends CMCCResponse{

    private String thirdAccount;
    private String mobile;
    private String deTradeID;
    private String andPoint;
    private String transTime;
    private String optCode;
    private String thirdPoint;

    public String getThirdPoint() {
        return thirdPoint;
    }

    public void setThirdPoint(String thirdPoint) {
        this.thirdPoint = thirdPoint;
    }

    public String getOptCode() {
        return optCode;
    }

    public void setOptCode(String optCode) {
        this.optCode = optCode;
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

    public String getTransTime() {
        return transTime;
    }

    public void setTransTime(String transTime) {
        this.transTime = transTime;
    }

    public LinkedHashMap<String, String> responseString() throws InvocationTargetException, IllegalAccessException{
        LinkedHashMap<String, String> linkedHashMap=super.responseString();
        PointTransDao pointTransDao= SpringContextUtil.getBean(PointTransDao.class);
        boolean flag=true;
        if(!super.isBingding(this.thirdAccount,this.getMobile())){
            flag=false;
            linkedHashMap.put("returnCode", "绑定关系不存在");
            linkedHashMap.put("message", "D004");
        }
        PointTrans pointTrans=new PointTrans();
        pointTrans.setMobile(this.mobile);
        pointTrans.setPoint(Integer.parseInt(this.andPoint));
        pointTrans.setTransId(this.getDeTradeID());
        pointTrans.setUserId(this.thirdAccount);
        pointTrans.setThirdPoint(this.thirdPoint);
        pointTrans.setCreateTime(new Date());
        pointTrans.setType("01");

        UserDao userDao= SpringContextUtil.getBean(UserDao.class);
        UserExample userExample = new UserExample();
        userExample.createCriteria().andTelphoneEqualTo(this.mobile);
        User user=userDao.selectByExample(userExample).get(0);
        if(Integer.parseInt(user.getPoint()) -Integer.parseInt(this.andPoint) <0){
            flag=false;
            pointTrans.setStatus("001");
            linkedHashMap.put("returnCode", "D0001");
            linkedHashMap.put("message", "可用积分不足");
        }
        SmsInfo smsInfo = new SmsInfo();
        smsInfo.setMobile(this.mobile);
        smsInfo.setOtpType(this.getInterCode());
        SmsInfoDao smsInfoDao =SpringContextUtil.getBean(SmsInfoDao.class);
        SmsInfo oneSmsInfo =smsInfoDao.selectOneMinuteRecoreByNameAndmobile(smsInfo);
       if(oneSmsInfo==null){
           flag=false;
           pointTrans.setStatus("002");
           linkedHashMap.put("returnCode", "D0002");
           linkedHashMap.put("message", "验证码不存在");
       }else if(!oneSmsInfo.getSmsCode().equals(this.getOptCode())){
           flag=false;
           pointTrans.setStatus("003");
           linkedHashMap.put("returnCode", "D0003");
           linkedHashMap.put("message", "验证码错误");
       }
            PointTransExample pointTransExample = new PointTransExample();
            pointTransExample.createCriteria().andTransIdEqualTo(deTradeID);
            List<PointTrans> list= pointTransDao.selectByExample(pointTransExample);
            if(list.size()>0){
                flag=false;
                pointTrans.setStatus("004");
                linkedHashMap.put("returnCode", "D0004");
                linkedHashMap.put("message", "订单号重复!");
            }

        if(flag) {
            oneSmsInfo.setState("01");
            smsInfoDao.updateByPrimaryKey(oneSmsInfo);
            Integer userpoint = Integer.parseInt(user.getPoint()) -Integer.parseInt(this.andPoint) ;
            user.setPoint(userpoint+"");
            userDao.updateByPrimaryKey(user);
            pointTrans.setStatus("00");

            pointTransDao.insert(pointTrans);
            linkedHashMap.put("returnCode", "0000");
            linkedHashMap.put("message", "操作成功");
            linkedHashMap.put("thirdAccount", this.thirdAccount);
            linkedHashMap.put("mobile", mobile);
            linkedHashMap.put("andPoint",andPoint);
            linkedHashMap.put("transTime", DateUtil.getStringDate());
            linkedHashMap.put("deTradeID",deTradeID);
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
