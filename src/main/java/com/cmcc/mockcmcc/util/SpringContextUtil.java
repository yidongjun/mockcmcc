package com.cmcc.mockcmcc.util;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
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
}