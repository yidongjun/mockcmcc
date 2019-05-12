package com.cmcc.mockcmcc.generator;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;
@Mapper
@Component
public interface UserBindingDao {
    long countByExample(UserBindingExample example);

    int deleteByExample(UserBindingExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(UserBinding record);

    int insertSelective(UserBinding record);

    List<UserBinding> selectByExample(UserBindingExample example);

    UserBinding selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") UserBinding record, @Param("example") UserBindingExample example);

    int updateByExample(@Param("record") UserBinding record, @Param("example") UserBindingExample example);

    int updateByPrimaryKeySelective(UserBinding record);

    int updateByPrimaryKey(UserBinding record);
}