<%@ WebHandler Language="C#" Class="UploadHandler" %>

using System;
using System.IO;
using System.Web;

public class UploadHandler : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        if (context.Request.Files.Count > 0)
        {
            HttpPostedFile file = context.Request.Files[0];
            string filePath = context.Server.MapPath("~/uploads/") + file.FileName;
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            file.SaveAs(filePath);

                        context.Response.Write("<script>alert('文件上传成功！'); window.location.href='upload.html';</script>");
        }
        else
        {
                        context.Response.Write("<script>alert('未选择文件！'); window.location.href='upload.html';</script>");
        }
    }

    public bool IsReusable
    {
        get { return false; }
    }
}