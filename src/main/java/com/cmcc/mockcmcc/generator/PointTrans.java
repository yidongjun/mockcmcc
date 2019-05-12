package com.cmcc.mockcmcc.generator;

import java.io.Serializable;
import java.util.Date;

/**
 * point_trans
 * @author 
 */
public class PointTrans implements Serializable {
    private Integer id;

    /**
     * 积分
     */
    private Integer point;

    /**
     * 交易类型
     */
    private String type;

    /**
     * 状态
     */
    private String status;

    private String userId;

    private String mobile;

    private String thirdPoint;

    /**
     * 交易订单号
     */
    private String transId;

    /**
     * 交易日期
     */
    private Date createTime;

    /**
     * 原交易流水号
     */
    private String orgTransId;

    private static final long serialVersionUID = 1L;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPoint() {
        return point;
    }

    public void setPoint(Integer point) {
        this.point = point;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getThirdPoint() {
        return thirdPoint;
    }

    public void setThirdPoint(String thirdPoint) {
        this.thirdPoint = thirdPoint;
    }

    public String getTransId() {
        return transId;
    }

    public void setTransId(String transId) {
        this.transId = transId;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getOrgTransId() {
        return orgTransId;
    }

    public void setOrgTransId(String orgTransId) {
        this.orgTransId = orgTransId;
    }

    @Override
    public boolean equals(Object that) {
        if (this == that) {
            return true;
        }
        if (that == null) {
            return false;
        }
        if (getClass() != that.getClass()) {
            return false;
        }
        PointTrans other = (PointTrans) that;
        return (this.getId() == null ? other.getId() == null : this.getId().equals(other.getId()))
            && (this.getPoint() == null ? other.getPoint() == null : this.getPoint().equals(other.getPoint()))
            && (this.getType() == null ? other.getType() == null : this.getType().equals(other.getType()))
            && (this.getStatus() == null ? other.getStatus() == null : this.getStatus().equals(other.getStatus()))
            && (this.getUserId() == null ? other.getUserId() == null : this.getUserId().equals(other.getUserId()))
            && (this.getMobile() == null ? other.getMobile() == null : this.getMobile().equals(other.getMobile()))
            && (this.getThirdPoint() == null ? other.getThirdPoint() == null : this.getThirdPoint().equals(other.getThirdPoint()))
            && (this.getTransId() == null ? other.getTransId() == null : this.getTransId().equals(other.getTransId()))
            && (this.getCreateTime() == null ? other.getCreateTime() == null : this.getCreateTime().equals(other.getCreateTime()))
            && (this.getOrgTransId() == null ? other.getOrgTransId() == null : this.getOrgTransId().equals(other.getOrgTransId()));
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((getId() == null) ? 0 : getId().hashCode());
        result = prime * result + ((getPoint() == null) ? 0 : getPoint().hashCode());
        result = prime * result + ((getType() == null) ? 0 : getType().hashCode());
        result = prime * result + ((getStatus() == null) ? 0 : getStatus().hashCode());
        result = prime * result + ((getUserId() == null) ? 0 : getUserId().hashCode());
        result = prime * result + ((getMobile() == null) ? 0 : getMobile().hashCode());
        result = prime * result + ((getThirdPoint() == null) ? 0 : getThirdPoint().hashCode());
        result = prime * result + ((getTransId() == null) ? 0 : getTransId().hashCode());
        result = prime * result + ((getCreateTime() == null) ? 0 : getCreateTime().hashCode());
        result = prime * result + ((getOrgTransId() == null) ? 0 : getOrgTransId().hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", point=").append(point);
        sb.append(", type=").append(type);
        sb.append(", status=").append(status);
        sb.append(", userId=").append(userId);
        sb.append(", mobile=").append(mobile);
        sb.append(", thirdPoint=").append(thirdPoint);
        sb.append(", transId=").append(transId);
        sb.append(", createTime=").append(createTime);
        sb.append(", orgTransId=").append(orgTransId);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}