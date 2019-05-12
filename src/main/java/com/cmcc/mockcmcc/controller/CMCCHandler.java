package com.cmcc.mockcmcc.controller;

import com.cmcc.mockcmcc.builder.CMCCBuilder;
import com.cmcc.mockcmcc.generator.*;
import com.cmcc.mockcmcc.response.CMCCResponse;
import com.cmcc.mockcmcc.selector.ActionSelector;
import com.cmcc.mockcmcc.util.MD5Util;
import com.cmcc.mockcmcc.util.SpringContextUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.InvocationTargetException;
import java.util.*;

@RestController
public class CMCCHandler {
  private  Logger logger = LoggerFactory.getLogger(this.getClass());
    private String defaultSmsCode = "1111";
    @Autowired
    UserBindingDao userBindingDao;

    @Autowired
    UserDao userDao;

    @RequestMapping("/index")
    public ModelAndView index(HttpServletRequest request) {
        UserBindingExample userBindingExample = new UserBindingExample();
        UserBindingExample.Criteria user = userBindingExample.createCriteria();
        user.andUserIdEqualTo(request.getParameter("id"));
        List<UserBinding> list = userBindingDao.selectByExample(userBindingExample);
        String viewStr = "fail";
        if (list.size() > 0) {
            UserBinding userBinding = list.get(0);
            if (!userBinding.getState().equals("1")) {
                viewStr = "index";
            }
        } else {
            viewStr = "index";
        }
        ModelAndView modelAndView = new ModelAndView(viewStr);
        request.setAttribute("id", request.getParameter("id"));
        return modelAndView;
    }

    @RequestMapping("/butler")
    public ModelAndView butler(HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView("butler");
        return modelAndView;
    }

    @RequestMapping("/binding")
    public String callBack(HttpServletRequest request) {
        String password = request.getParameter("password");
        String telphoneNumber = request.getParameter("telphoneNumber");
        String smsCode = request.getParameter("smsCode");
        String accountId = request.getParameter("accountId");


        if (password == null || password.equals("")) {
            return "密碼不能未空!";
        }
        if (smsCode == null || smsCode.equals("")) {
            return "验证码不能未空!";
        }
        if (telphoneNumber == null || telphoneNumber.equals("")) {
            return "手机号码不能未空";
        }

        UserBindingExample userBindingExample = new UserBindingExample();
        UserBindingExample.Criteria user = userBindingExample.createCriteria();
        user.andTelphoneEqualTo(telphoneNumber);
        user.andStateEqualTo("1");
        List<UserBinding> list = userBindingDao.selectByExample(userBindingExample);
        if (list.size() > 0) {
            return "该手机号码绑定关系已存在";
        }


        userBindingExample = new UserBindingExample();
        UserBindingExample.Criteria user2 = userBindingExample.createCriteria();
        user2.andStateEqualTo("1");
        user2.andUserIdEqualTo(accountId);
        List<UserBinding> list2 = userBindingDao.selectByExample(userBindingExample);
        if (list2.size() > 0) {
            return "该账号绑定关系已存在";
        }

        UserExample userExample = new UserExample();
        UserExample.Criteria u = userExample.createCriteria();
        u.andTelphoneEqualTo(telphoneNumber);
        u.andPasswordEqualTo(password);

        List<User> userList = userDao.selectByExample(userExample);
        if (userList.size() <= 0) {
            return "手机号或者密碼错误";
        }
        if (!smsCode.equals(defaultSmsCode)) {
            return "验证码错误";
        }
        UserBindingExample exp3 = new UserBindingExample();
        exp3.createCriteria().andUserIdEqualTo(accountId);
        List<UserBinding> bindingList = userBindingDao.selectByExample(exp3);
        if (bindingList.size() <= 0) {
            return "其他错误,请联系管理员";
        }
        UserBinding b = bindingList.get(0);
        b.setState("1");
        b.setTelphone(telphoneNumber);
        b.setCreateTime(new Date());
        userBindingDao.updateByPrimaryKey(b);
        String hmac = MD5Util.md5(b.getUserId() + telphoneNumber + "123456");
        String callUrl = b.getCallBackUrl() + "?thirdAccount=" + b.getUserId() + "&mobile=" + telphoneNumber + "&hmac=" + hmac;
        return "0000|" + callUrl;
    }
    @Autowired SmsInfoDao smsInfoDao;

    @RequestMapping("/getSmsCode/{moblie}/{intercode}")
    public String getSmsCode (@PathVariable String moblie,@PathVariable String intercode){
        SmsInfo smsInfo  =new SmsInfo();
        smsInfo.setMobile(moblie);
        smsInfo.setOtpType(intercode);
        smsInfo=smsInfoDao.selectOneMinuteRecoreByNameAndmobile(smsInfo);
        if(smsInfo!=null){
            System.out.println("code=="+smsInfo.getSmsCode());
            return smsInfo.getSmsCode();
        }
        return "未查询到短信";

    }
    @RequestMapping("/exchange")
    public ModelAndView test(){
        return  new ModelAndView("exchange");
    }
    @RequestMapping("/jfInter")
    public String jfInter(HttpServletRequest request) {
        String interCode = request.getParameter("interCode");
        String character = request.getParameter("character");
        if (character == null) {
            character = "00";
        }

        String ipAddress = request.getParameter("ipAddress");
        String parentId = request.getParameter("partnerId");
        String requestId = request.getParameter("requestId");
        String signType = request.getParameter("signType");
        String type = request.getParameter("type");
        String version = request.getParameter("version");
        String hmac = request.getParameter("hmac");
        if (interCode == null) {
            return "interCode 不能为空";
        }
        if (ipAddress == null) {
            return "ipAddress 不能为空";
        }
        if (requestId == null) {
            return "requestId 不能为空";
        }
        if (signType == null) {
            return "signType 不能为空";
        }
        if (type == null) {
            return "type 不能为空";
        }
        if (version == null) {
            return "version 不能为空";
        }
        if (hmac == null) {
            return "hmac 不能为空";
        }
        if (parentId == null) {
            return "parentId 不能为空";
        }
        String retrunStr = "";

        CMCCBuilder cmccBuilder = new CMCCBuilder();
        cmccBuilder.setCharacter(character);
        cmccBuilder.setIpAddress(ipAddress);
        cmccBuilder.setPartnerId(parentId);
        cmccBuilder.setSignType(signType);
        cmccBuilder.setInterCode(interCode);
        cmccBuilder.setVersion(version);
        cmccBuilder.setType(type);
        cmccBuilder.setHmac(hmac);
        cmccBuilder.setRequestId(requestId);


        String invokeClass = ActionSelector.requestMap.get(interCode);
        String responseClass = ActionSelector.responseMap.get(interCode);

        try {
            CMCCBuilder cm = (CMCCBuilder) Class.forName(invokeClass).newInstance();
            String volidateMessage = cm.volidate(request);
            if (!volidateMessage.equals("0000")) {
                return volidateMessage;
            }
            cm.builder(request);
            BeanUtils.copyProperties(cmccBuilder, cm);
            CMCCResponse response = (CMCCResponse) Class.forName(responseClass).newInstance();
            BeanUtils.copyProperties(cm, response);
            try {
                LinkedHashMap<String, String> responseStr = response.responseString();
                for (String key : responseStr.keySet()) {
                    retrunStr += "&" + key + "=" + responseStr.get(key);
                }
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            return "interCode 错误";
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        }catch (NullPointerException e){
          this.logger.info("interCode 无法识别:"+interCode);
            return "interCode 无法识别:"+interCode;
        }
        this.logger.info("返回消息:"+retrunStr);
        return retrunStr;


    }


}
