<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %> <!-- kimi:引入 System.IO 命名空间 -->
<!DOCTYPE html>
<html>
<head>
    <title>文件列表 download list</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="all.min.css">
    <style>
        
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #0b063d, #440257, #001eff);
            background-size: 600% 600%;
            animation: gradient 15s ease infinite;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: #fff;
        }
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        h1 {
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            max-width: 600px;
            width: 100%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
        
        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            transition: background-color 0.3s ease;
        }
        li:last-child {
            border-bottom: none;
        }
        li:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }
        
        a {
            color: #fff;
            text-decoration: none;
            font-size: 1.1em;
            display: flex;
            align-items: center;
        }
        a:hover {
            text-decoration: underline;
        }
        
        .icon {
            margin-right: 10px;
        }
        
        .file-size {
            font-size: 0.9em;
            opacity: 0.8;
        }
        button:hover {
            transform: scale(1.05);
        }
        .icon {
            margin-right: 10px;
        }
        button {
            display: block;
            margin: 20px auto;
            background: linear-gradient(45deg, #48dbfb, #3b82f6);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1em;
            box-shadow: 0 4px 8px rgba(72, 219, 251, 0.5);
            transition: transform 0.3s ease;
        }
    </style>
</head>
<body>
    <h1>可下载的文件列表click to download</h1>
    <ul>
        <%
            string uploadPath = Server.MapPath("~/uploads/");
            if (Directory.Exists(uploadPath))
            {
                string[] files = Directory.GetFiles(uploadPath);
                foreach (string filePath in files)
                {
                    string fileName = Path.GetFileName(filePath);
                    long fileSize = new FileInfo(filePath).Length;
                    string fileSizeFormatted = fileSize / 1024.0 > 1024 ? (fileSize / 1024.0 / 1024.0).ToString("0.00") + " MB" : (fileSize / 1024.0).ToString("0.00") + " KB";
                    %>
                    <li>
                        <a href="download.ashx?file=<%= fileName %>">
                            <i class="fas fa-file-download icon"></i> <%= fileName %>
                        </a>
                        <span class="file-size">(<%= fileSizeFormatted %>)</span>
                    </li>
                    <%
                }
            }
            else
            {
                %>
                <li>文件夹不存在或为空。 file folder does not exist or is empty.</li>
                <%
            }
        %>
    </ul>
    <button onclick="location.href='upload.html'">
         <i class="fas fa-upload icon"></i>返回 back to upload page
    </button>
</body>
</html>