package com.cmcc.mockcmcc.util;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5Util {
    public static String md5(String plainText) {
        byte[] secretBytes = null;
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(plainText.getBytes());
            secretBytes = md.digest();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("没有md5这个算法！");
        }
        String md5code = new BigInteger(1, secretBytes).toString(16);
        for (int i = 0; i < 32 - md5code.length(); i++) {
            md5code = "0" + md5code;
        }
        return md5code;
    }

    public static void main(String[] args) {
        String md5=MD5Util.md5("jf000201201905071542401111查询不到该用户：1124469315823738880md51.0.0112446931582373888018337168075123456");
        System.out.println(md5);
    }
}
