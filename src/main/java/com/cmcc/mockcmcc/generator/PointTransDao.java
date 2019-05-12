package com.cmcc.mockcmcc.generator;

import com.cmcc.mockcmcc.generator.PointTrans;
import com.cmcc.mockcmcc.generator.PointTransExample;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface PointTransDao {
    long countByExample(PointTransExample example);

    int deleteByExample(PointTransExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(PointTrans record);

    int insertSelective(PointTrans record);

    List<PointTrans> selectByExample(PointTransExample example);

    PointTrans selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") PointTrans record, @Param("example") PointTransExample example);

    int updateByExample(@Param("record") PointTrans record, @Param("example") PointTransExample example);

    int updateByPrimaryKeySelective(PointTrans record);

    int updateByPrimaryKey(PointTrans record);
}