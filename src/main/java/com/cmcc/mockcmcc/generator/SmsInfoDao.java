package com.cmcc.mockcmcc.generator;

import com.cmcc.mockcmcc.generator.SmsInfo;
import com.cmcc.mockcmcc.generator.SmsInfoExample;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface SmsInfoDao {
    long countByExample(SmsInfoExample example);

    int deleteByExample(SmsInfoExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(SmsInfo record);

    int insertSelective(SmsInfo record);

    List<SmsInfo> selectByExample(SmsInfoExample example);

    SmsInfo selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") SmsInfo record, @Param("example") SmsInfoExample example);

    int updateByExample(@Param("record") SmsInfo record, @Param("example") SmsInfoExample example);

    int updateByPrimaryKeySelective(SmsInfo record);

    int updateByPrimaryKey(SmsInfo record);

    SmsInfo selectOneMinuteRecoreByNameAndmobile(@Param("record") SmsInfo record);

}