package com.cmcc.mockcmcc.response;

import com.cmcc.mockcmcc.generator.UserBinding;
import com.cmcc.mockcmcc.generator.UserBindingDao;
import com.cmcc.mockcmcc.generator.UserBindingExample;
import com.cmcc.mockcmcc.util.MD5Util;
import com.cmcc.mockcmcc.util.SpringContextUtil;
import org.springframework.stereotype.Component;

import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

@Component
public class CMCCBindingResponse extends CMCCResponse {


    private String mobileUrl;

    private String thirdAccount;

    private String callbackUrl;

    public String getCallbackUrl() {
        return callbackUrl;
    }

    public void setCallbackUrl(String callbackUrl) {
        this.callbackUrl = callbackUrl;
    }

    public String getThirdAccount() {
        return thirdAccount;
    }

    public void setThirdAccount(String thirdAccount) {
        this.thirdAccount = thirdAccount;
    }

    public String getMobileUrl() {
        return mobileUrl;
    }

    public void setMobileUrl(String mobileUrl) {
        this.mobileUrl = mobileUrl;
    }

    public static String defaultMoblieUrl = "http://10.1.102.101:9093/index";

    public LinkedHashMap<String, String> responseString() throws InvocationTargetException, IllegalAccessException {
        LinkedHashMap<String, String> linkedHashMap = super.responseString();


            UserBindingDao userBindingDao=SpringContextUtil.getBean(UserBindingDao.class);

            UserBindingExample userBindingExample = new UserBindingExample();
            UserBindingExample.Criteria user = userBindingExample.createCriteria();
            user.andUserIdEqualTo(this.thirdAccount);
//            user.andStateEqualTo("1");
            List<UserBinding> userList = userBindingDao.selectByExample(userBindingExample);

            if (userList.size() > 0  &&userList.get(0).getState().equals("1")) {
                linkedHashMap.put("returnCode", "D002");
                linkedHashMap.put("message", "绑定关系已存在");
                linkedHashMap.put("mobileUrl", "");
            } else if(userList.size()>0){
                UserBinding userBinding=userList.get(0);
                userBinding.setCreateTime(new Date());
                userBinding.setCallBackUrl(callbackUrl);
                userBindingDao.updateByPrimaryKey(userBinding);
                linkedHashMap.put("returnCode", "0000");
                linkedHashMap.put("message", "操作成功");
                linkedHashMap.put("mobileUrl", defaultMoblieUrl+"?id="+thirdAccount);
            }else{
                UserBinding userBinding = new UserBinding();
                userBinding.setUserId(thirdAccount);
                userBinding.setState("0");
                userBinding.setCreateTime(new Date());
                userBinding.setCallBackUrl(callbackUrl);
                userBindingDao.insert(userBinding);
                linkedHashMap.put("returnCode", "0000");
                linkedHashMap.put("message", "操作成功");
                linkedHashMap.put("mobileUrl", defaultMoblieUrl+"?id="+thirdAccount);
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
