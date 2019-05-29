package com.cmcc.mockcmcc.sftp;

import com.cmcc.mockcmcc.generator.PointTrans;
import com.jcraft.jsch.*;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

public class SftpUtil {
    private static String userName = "root";
    private static String host = "10.1.102.102";
    private static String passWord = "123456";

    public static void main(String[] args) throws Exception {

        Date date = new Date();
        String dir = "C:\\reconfile\\";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy_MM_dd");
        String fileName = dir + "Deduct_AccessID_" + simpleDateFormat.format(date);
        String lastFileName = ".csv";
        System.out.println(fileName + lastFileName);
        PointTrans pointTrans = new PointTrans();
        pointTrans.setPoint(111);
        pointTrans.setTransId("test");
        pointTrans.setMobile("13999");

        PointTrans pointTrans2 = new PointTrans();
        pointTrans2.setPoint(222);
        pointTrans2.setTransId("333");
        pointTrans2.setMobile("666");
        List<PointTrans> list = new ArrayList<>();
        list.add(pointTrans);
        list.add(pointTrans2);
        createFile(fileName, list);
    }

    public static void createFile(String fileName, List<PointTrans> list) throws Exception {
        File file = new File(fileName);
        try {
            FileOutputStream fout = new FileOutputStream(file, false);
            StringBuilder stringBuilder = new StringBuilder();
            for (PointTrans pointTrans : list) {
                stringBuilder.append(pointTrans.getTransId()).append("|").append(pointTrans.getMobile()).append("|").append(pointTrans.getPoint()).append("\n");
            }
            String msg = stringBuilder.toString();
            byte[] bytes = msg.getBytes();
            for (int i = 0; i < bytes.length; i++) {
                fout.write(bytes[i]);//逐字节写文件
            }
            fout.flush();//强制刷新输出流
            fout.close();//关闭输出流
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void mkDir(List<PointTrans> list) throws JSchException, SftpException {
        JSch jsch = new JSch();
        Session session = jsch.getSession(userName, host);
        session.setPassword(passWord);
        Properties config = new Properties();
        config.put("StrictHostKeyChecking", "no");
        session.setConfig(config);
        session.connect();
        ChannelSftp channelSftp = (ChannelSftp) session.openChannel("sftp");
        channelSftp.connect();
        Vector vector = channelSftp.ls("/data");
        try {
            for (Object obj : vector) {
                if (obj instanceof com.jcraft.jsch.ChannelSftp.LsEntry) {
                    String fileName = ((com.jcraft.jsch.ChannelSftp.LsEntry) obj).getFilename();
                    System.out.println("filename ===" + fileName);
                    if (list.size() > 0) {
                        for (PointTrans pointTrans2 : list) {
                            if (pointTrans2.getAppId().equals(fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length()))) {
                                list.remove(pointTrans2);
                                break;
                            }
                        }
                    }
                }
            }
            for (PointTrans pointTrans : list) {
                String dir = "C:\\reconfile\\";
                Date date = new Date();
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy_MM_dd");
                String localFileName = dir + "Deduct_AccessID_" + simpleDateFormat.format(date) + "." + pointTrans.getAppId();
                channelSftp.mkdir("/data/" + pointTrans.getAppId());
            }
        } finally {
            channelSftp.quit();
            session.disconnect();
        }
    }

    public static void createFile(List<PointTrans> list) throws JSchException, SftpException {
        JSch jsch = new JSch();
        Session session = jsch.getSession(userName, host);
        session.setPassword(passWord);
        Properties config = new Properties();
        config.put("StrictHostKeyChecking", "no");
        session.setConfig(config);
        session.connect();
        ChannelSftp channelSftp = (ChannelSftp) session.openChannel("sftp");
        channelSftp.connect();
        try{
            for(PointTrans pointTrans:list){

                Date date = new Date();
                String dir = "C:\\reconfile\\";
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy_MM_dd");
                String fileName = dir + "Deduct_AccessID_" + simpleDateFormat.format(date)+"."+pointTrans.getAppId();
                File file = new File(fileName);
               String result= uploadFile(channelSftp,"/data/"+pointTrans.getAppId(),file);

               System.out.println(result);
            }

        } finally {
            channelSftp.quit();
            session.disconnect();
        }
    }

    public static String uploadFile(ChannelSftp sftp, String dir, File file) {
            String result = "";
             try {
         sftp.cd(dir);
         // File file = new File("D://34.txt"); //要上传的本地文件
         if (file != null) {
                 sftp.put(new FileInputStream(file), file.getName());
                 result = "上传成功！";
             } else {
                 result = "文件为空！不能上传！";
             }
     } catch (Exception e) {
         result = "上传失败！";
     }
             return result;
         }



}
