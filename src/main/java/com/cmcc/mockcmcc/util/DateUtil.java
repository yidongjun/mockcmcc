package com.cmcc.mockcmcc.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {

    public static String getStringDate(){
        SimpleDateFormat sm = new SimpleDateFormat("yyyyMMddhhmmss");
        return sm.format(new Date());
    }
    public static String getStringDate(Date date){
        SimpleDateFormat sm = new SimpleDateFormat("yyyyMMddhhmmss");
        return sm.format(date);
    }
}
