package com.cmcc.mockcmcc.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;

public class MockCmccUtil {
    private static Logger logger = LoggerFactory.getLogger(MockCmccUtil.class);
    public static boolean validateSign(HttpServletRequest request) {
        Enumeration enumd = request.getParameterNames();
        String hmac = "";
        String valuesStr = "";
        while (enumd.hasMoreElements()) {
            String paramName = (String) enumd.nextElement();
            String[] values = request.getParameterValues(paramName);
            for (int i = 0; i < values.length; i++) {
                if (paramName.equals("hmac")) {
                    hmac = values[i];
                    continue;
                }
                valuesStr += values[i];
            }
        }
        logger.info("去加签的参数:"+valuesStr);
        return MD5Util.md5(valuesStr+"123456").equals(hmac);
    }

}
