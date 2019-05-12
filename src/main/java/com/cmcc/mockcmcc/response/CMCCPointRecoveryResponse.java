package com.cmcc.mockcmcc.response;

import com.cmcc.mockcmcc.generator.*;
import com.cmcc.mockcmcc.util.SpringContextUtil;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

public class CMCCPointRecoveryResponse  extends  CMCCResponse{
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

    public LinkedHashMap<String, String> responseString() throws InvocationTargetException, IllegalAccessException {
        LinkedHashMap<String,String> linkedHashMap=super.responseString();
        PointTransDao pointTransDao= SpringContextUtil.getBean(PointTransDao.class);
        PointTransExample pointTransExample = new PointTransExample();
        pointTransExample.createCriteria().andTransIdEqualTo(this.deTradeID).andStatusEqualTo("00");
        List<PointTrans> list=pointTransDao.selectByExample(pointTransExample);
        if(list.size()<=0){
            linkedHashMap.put("returnCode", "B203");
            linkedHashMap.put("message", "原流水号不存在，受理失败");
            super.getBuilderMd5(linkedHashMap);
            return linkedHashMap;
        }
        PointTransExample newpointTransExpamle = new PointTransExample();
        newpointTransExpamle.createCriteria().andTransIdEqualTo(reTradeID);
        List<PointTrans> newList =pointTransDao.selectByExample(newpointTransExpamle);
        if(newList.size()>0){
            linkedHashMap.put("returnCode", "D001");
            linkedHashMap.put("message", "交易流水号重复!");
            super.getBuilderMd5(linkedHashMap);
            return linkedHashMap;
        }


        PointTrans oldPointTrans = list.get(0);
        Integer newPoint = Integer.parseInt(this.andPoint);
        if(newPoint!=oldPointTrans.getPoint() ){
            linkedHashMap.put("returnCode", "B203");
            linkedHashMap.put("message", "原交易与冲正交易积分不匹配");
            super.getBuilderMd5(linkedHashMap);
            return linkedHashMap;
        }
        UserDao userDao= SpringContextUtil.getBean(UserDao.class);
        UserExample userExample = new UserExample();
        userExample.createCriteria().andTelphoneEqualTo(mobile);
        List<User> userList=userDao.selectByExample(userExample);
        if(userList.size()<0){
            linkedHashMap.put("returnCode", "B203");
            linkedHashMap.put("message", "冲正积分不能大于原扣减积分");
            super.getBuilderMd5(linkedHashMap);
            return linkedHashMap;
        }

        PointTrans pointTrans=new PointTrans();
        pointTrans.setMobile(this.mobile);
        pointTrans.setPoint(Integer.parseInt(this.andPoint));
        pointTrans.setTransId(this.getReTradeID());
        pointTrans.setUserId(this.thirdAccount);
        pointTrans.setThirdPoint(this.thirdPoint);
        pointTrans.setCreateTime(new Date());
        pointTrans.setType("02");
        pointTrans.setStatus("00");
        pointTrans.setOrgTransId(oldPointTrans.getTransId());
        pointTransDao.insert(pointTrans);

        User user=userList.get(0);
        Integer point = Integer.parseInt(user.getPoint())+newPoint;
        user.setPoint(point+"");
        userDao.updateByPrimaryKeySelective(user);
        linkedHashMap.put("returnCode", "0000");
        linkedHashMap.put("message", "操作成功");
        super.getBuilderMd5(linkedHashMap);
        return linkedHashMap;
    }
}
