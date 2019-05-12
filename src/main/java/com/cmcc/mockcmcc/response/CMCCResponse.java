package com.cmcc.mockcmcc.response;

import com.cmcc.mockcmcc.generator.UserBinding;
import com.cmcc.mockcmcc.generator.UserBindingDao;
import com.cmcc.mockcmcc.generator.UserBindingExample;
import com.cmcc.mockcmcc.util.MD5Util;
import com.cmcc.mockcmcc.util.SpringContextUtil;
import org.springframework.beans.BeanUtils;

import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.LinkedHashMap;
import java.util.List;

public class CMCCResponse {
    private String interCode;
    private String partnerId;
    private String requestId;
    private String returnCode;
    private String message;
    private String signType;
    private String type;
    private String version;
    private String hmac;
    public String getInterCode() {
        return interCode;
    }

    public void setInterCode(String interCode) {
        this.interCode = interCode;
    }

    public String getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(String partnerId) {
        this.partnerId = partnerId;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getReturnCode() {
        return returnCode;
    }

    public void setReturnCode(String returnCode) {
        this.returnCode = returnCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSignType() {
        return signType;
    }

    public void setSignType(String signType) {
        this.signType = signType;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getHmac() {
        return hmac;
    }

    public void setHmac(String hmac) {
        this.hmac = hmac;
    }

    public LinkedHashMap<String, String> responseString() throws InvocationTargetException, IllegalAccessException {
        PropertyDescriptor[] p = BeanUtils.getPropertyDescriptors(this.getClass());
        LinkedHashMap<String, String> linkedHashMap = new LinkedHashMap<>();
        linkedHashMap.put("interCode", null);
        linkedHashMap.put("partnerId", null);
        linkedHashMap.put("requestId", null);
        linkedHashMap.put("returnCode", null);
        linkedHashMap.put("message", null);
        linkedHashMap.put("signType", null);
        linkedHashMap.put("version", null);
        for (PropertyDescriptor pp : p) {
            Method method = pp.getReadMethod();
            Object value = method.invoke(this, null);
            if (pp.getName().equals("interCode") && value != null) {
                linkedHashMap.put("interCode", value.toString());
            } else if (pp.getName().equals("version") && value != null) {
                linkedHashMap.put("version", value.toString());
            } else if (pp.getName().equals("partnerId") && value != null) {
                linkedHashMap.put("partnerId", value.toString());
            } else if (pp.getName().equals("signType") && value != null) {
                linkedHashMap.put("signType", value.toString());
            } else if (pp.getName().equals("requestId") && value != null) {
                linkedHashMap.put("requestId", value.toString());
            }
        }
        return linkedHashMap;
    }

    public boolean isBingding(String thirdAccount,String moblie) {
        UserBindingDao userBindingDao = SpringContextUtil.getBean(UserBindingDao.class);
        UserBindingExample userBindingExample = new UserBindingExample();
        UserBindingExample.Criteria user = userBindingExample.createCriteria();
        user.andUserIdEqualTo(thirdAccount).andStateEqualTo("1").andTelphoneEqualTo(moblie);
        List<UserBinding> list = userBindingDao.selectByExample(userBindingExample);
        return list.size()>0;
    }
    public String getBuilderMd5(LinkedHashMap<String,String> linkedHashMap) {
        String builderMd5 = "";
        for (String key : linkedHashMap.keySet()) {
            if (linkedHashMap.get(key) != null) {
                builderMd5 += linkedHashMap.get(key);
            }
        }
        linkedHashMap.put("hmac", MD5Util.md5(builderMd5 + "123456"));
        return builderMd5;
    }

}
