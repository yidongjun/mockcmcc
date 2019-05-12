package com.cmcc.mockcmcc.response;

import com.cmcc.mockcmcc.generator.UserBinding;
import com.cmcc.mockcmcc.generator.UserBindingDao;
import com.cmcc.mockcmcc.generator.UserBindingExample;
import com.cmcc.mockcmcc.generator.UserDao;
import com.cmcc.mockcmcc.util.MD5Util;
import com.cmcc.mockcmcc.util.SpringContextUtil;

import java.lang.reflect.InvocationTargetException;
import java.util.LinkedHashMap;
import java.util.List;

public class CMCCUnBindingResponse extends CMCCResponse{
    private String thirdAccount;
    private String mobile;

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
    public LinkedHashMap<String, String> responseString() throws InvocationTargetException, IllegalAccessException{
        LinkedHashMap<String, String> linkedHashMap = super.responseString();
        UserBindingDao userBindingDao= SpringContextUtil.getBean(UserBindingDao.class);
        UserBindingExample userBindingExample = new UserBindingExample();
        UserBindingExample.Criteria user = userBindingExample.createCriteria();
        user.andUserIdEqualTo(thirdAccount).andStateEqualTo("1");
        List<UserBinding> list = userBindingDao.selectByExample(userBindingExample);
        if(list.size()<=0){
            String builderMd5 = "";
            linkedHashMap.put("returnCode", "1111");
            linkedHashMap.put("message", "查询不到该用户："+thirdAccount);
            linkedHashMap.put("thirdAccount",this.thirdAccount);
            linkedHashMap.put("mobile",mobile);
            linkedHashMap.put("hmac", MD5Util.md5(builderMd5 + "123456"));
        }else {
            linkedHashMap.put("returnCode", "0000");
            linkedHashMap.put("message", "操作成功");
            linkedHashMap.put("thirdAccount",this.thirdAccount);
            linkedHashMap.put("mobile",mobile);
            UserBinding userBinding = list.get(0);
            userBinding.setState("0");
            userBindingDao.updateByPrimaryKey(userBinding);
            String builderMd5 = "";
            for (String key : linkedHashMap.keySet()) {
                if (linkedHashMap.get(key) != null) {
                    builderMd5 += linkedHashMap.get(key);
                }

            }


            linkedHashMap.put("hmac", MD5Util.md5(builderMd5 + "123456"));
        }

        return linkedHashMap;
    }
}
