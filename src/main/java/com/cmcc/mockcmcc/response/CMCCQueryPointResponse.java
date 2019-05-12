package com.cmcc.mockcmcc.response;

import com.cmcc.mockcmcc.generator.*;
import com.cmcc.mockcmcc.util.MD5Util;
import com.cmcc.mockcmcc.util.SpringContextUtil;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
public class CMCCQueryPointResponse extends CMCCResponse{
    private String thirdAccount;
    private String mobile;
    private String andPoint;

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
    public LinkedHashMap<String, String> responseString() throws InvocationTargetException, IllegalAccessException{
        LinkedHashMap<String, String> linkedHashMap=super.responseString();
        UserBindingDao userBindingDao= SpringContextUtil.getBean(UserBindingDao.class);
        UserDao userDao= SpringContextUtil.getBean(UserDao.class);

        UserBindingExample userBindingExample = new UserBindingExample();
        UserBindingExample.Criteria user = userBindingExample.createCriteria();
        user.andUserIdEqualTo(this.thirdAccount);
        user.andStateEqualTo("1");
        List<UserBinding> list =userBindingDao.selectByExample(userBindingExample);

        if(list.size()>0){
            UserExample userExample = new UserExample();
            userExample.createCriteria().andTelphoneEqualTo(mobile);
            List<User> userList=userDao.selectByExample(userExample);
            if(userList.size()>0){
                User u =userList.get(0);
                linkedHashMap.put("returnCode", "0000");
                linkedHashMap.put("message", "操作成功");
                linkedHashMap.put("thirdAccount",this.thirdAccount);
                linkedHashMap.put("mobile",mobile);
                linkedHashMap.put("andPoint",u.getPoint());
            }else{
                linkedHashMap.put("returnCode", "D404");
                linkedHashMap.put("message", "绑定关系不存在");
                linkedHashMap.put("thirdAccount",this.thirdAccount);
            }
        }else{
            linkedHashMap.put("returnCode", "D404");
            linkedHashMap.put("message", "绑定关系不存在");
            linkedHashMap.put("thirdAccount",this.thirdAccount);
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
