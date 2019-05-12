package com.cmcc.mockcmcc.builder;

import org.springframework.scheduling.annotation.Scheduled;

import javax.servlet.http.HttpServletRequest;

public class CMCCBuilder {
    private String interCode;
    private String character;
    private String ipAddress;
    private String partnerId;
    private String requestId;
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

    public String getCharacter() {
        return character;
    }

    public void setCharacter(String character) {
        this.character = character;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
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
    public String volidate(HttpServletRequest request){
        throw new NullPointerException();
    }
    public void builder(HttpServletRequest request){
        throw new NullPointerException();
    }

}
