package com.cmcc.mockcmcc.response;

import com.cmcc.mockcmcc.generator.PointTrans;
import com.cmcc.mockcmcc.generator.PointTransDao;
import com.cmcc.mockcmcc.generator.PointTransExample;
import com.cmcc.mockcmcc.util.DateUtil;
import com.cmcc.mockcmcc.util.ReturnCodeUtil;
import com.cmcc.mockcmcc.util.SpringContextUtil;
import java.util.List;
import java.lang.reflect.InvocationTargetException;
import java.util.LinkedHashMap;

public class CMCCTransQueryResponse extends CMCCResponse{
    private String deTradeID;
    private String mobile;
    private String andPoint;
    private String transStatus;
    private String transTime;
    private String transDes;

    public String getTransTime() {
        return transTime;
    }

    public void setTransTime(String transTime) {
        this.transTime = transTime;
    }

    public String getTransDes() {
        return transDes;
    }

    public void setTransDes(String transDes) {
        this.transDes = transDes;
    }

    public String getDeTradeID() {
        return deTradeID;
    }

    public void setDeTradeID(String deTradeID) {
        this.deTradeID = deTradeID;
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

    public String getTransStatus() {
        return transStatus;
    }

    public void setTransStatus(String transStatus) {
        this.transStatus = transStatus;
    }
    public LinkedHashMap<String, String> responseString() throws InvocationTargetException, IllegalAccessException{
        LinkedHashMap linkedHashMap =super.responseString();
        PointTransDao pointTransDao= SpringContextUtil.getBean(PointTransDao.class);
        PointTransExample pointTransExample = new PointTransExample();
        pointTransExample.createCriteria().andTransIdEqualTo(this.deTradeID);
        List<PointTrans> pointTransList=pointTransDao.selectByExample(pointTransExample);
        boolean flag =true;
        if(pointTransList.size()<=0){
            flag=false;
            linkedHashMap.put("returnCode", "C001");
            linkedHashMap.put("message", "查询内容不存在!");
        }
        if(flag){
            PointTrans pointTrans =pointTransList.get(0);
            String message = ReturnCodeUtil.returnCodeMap.get(pointTrans.getStatus());
            linkedHashMap.put("returnCode","0000");
            linkedHashMap.put("message","操作成功");
            linkedHashMap.put("andPoint",pointTrans.getPoint()+"");
            linkedHashMap.put("mobile",pointTrans.getMobile());
            linkedHashMap.put("transStatus",pointTrans.getStatus());
            linkedHashMap.put("transTime", DateUtil.getStringDate(pointTrans.getCreateTime()));
            linkedHashMap.put("transDesc",ReturnCodeUtil.returnCodeMap.get(pointTrans.getStatus()));
        }

        super.getBuilderMd5(linkedHashMap);
        return linkedHashMap;

    }
}
