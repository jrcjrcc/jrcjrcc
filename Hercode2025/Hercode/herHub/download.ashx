<%@ WebHandler Language="C#" Class="DownloadHandler" %>

using System;
using System.IO;
using System.Web;
using System.Text.RegularExpressions;

public class DownloadHandler : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        string fileName = context.Request.QueryString["file"];
        if (string.IsNullOrEmpty(fileName))
        {
            context.Response.Write("<script>alert('no file '); window.location.href='upload.html';</script>");
            return;
        }

        
        if (!Regex.IsMatch(fileName, @"^[\w\s\-.(){}[\]#&$%@!~^+=_]*$"))
        {
            context.Response.Write("<script>alert('invalid file name '); window.location.href='upload.html';</script>");
            return;
        }

        string filePath = context.Server.MapPath("~/uploads/") + fileName;

        if (!File.Exists(filePath))
        {
            context.Response.Write("<script>alert('file not found '); window.location.href='upload.html';</script>");
            return;
        }

        
        string mimeType = GetMimeType(fileName);
        context.Response.ContentType = mimeType;
        context.Response.AddHeader("Content-Disposition", string.Format("attachment; filename*=UTF-8''{0}", HttpUtility.UrlEncode(fileName, System.Text.Encoding.UTF8)));
        context.Response.AddHeader("Content-Length", new FileInfo(filePath).Length.ToString());

        
        context.Response.TransmitFile(filePath);
        context.Response.Flush();
        context.Response.End();
    }

    public bool IsReusable
    {
        get { return false; }
    }

    private string GetMimeType(string fileName)
    {
        string extension = Path.GetExtension(fileName).ToLower();
        var mimeTypes = new System.Collections.Hashtable
        {
            { ".pdf", "application/pdf" },
            { ".doc", "application/msword" },
            { ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
            { ".xls", "application/vnd.ms-excel" },
            { ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
            { ".ppt", "application/vnd.ms-powerpoint" },
            { ".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
            { ".txt", "text/plain" },
            { ".jpg", "image/jpeg" },
            { ".jpeg", "image/jpeg" },
            { ".png", "image/png" },
            { ".gif", "image/gif" },
            { ".zip", "application/zip" },
            { ".rar", "application/x-rar-compressed" },
            { ".mp3", "audio/mpeg" },
            { ".mp4", "video/mp4" },
            { ".avi", "video/x-msvideo" },
            { ".exe", "application/octet-stream" }
        };

        return mimeTypes.ContainsKey(extension) ? (string)mimeTypes[extension] : "application/octet-stream";
    }
}