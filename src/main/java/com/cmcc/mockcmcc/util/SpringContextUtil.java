package com.cmcc.mockcmcc.util;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component("springContextUtils")
public class SpringContextUtil implements ApplicationContextAware {
    private static ApplicationContext applicationContext = null;
    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }
    public static <T> T getBean(String beanId) {
        return (T) applicationContext.getBean(beanId);
    }
    public static <T> T getBean(Class<T> requiredType) {
        return (T) applicationContext.getBean(requiredType);
    }
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        SpringContextUtil.applicationContext = applicationContext;
    }

    public static void main(String[] args) {
       String asd="11123";
       Integer i =46760978;
       System.out.println(i.hashCode());
       System.out.println(asd.hashCode());
       System.out.println(i.hashCode()==asd.hashCode());
       System.out.println(asd.equals(i));
    }
}