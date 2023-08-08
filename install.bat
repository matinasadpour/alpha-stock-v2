@ECHO OFF
robocopy "%cd%\alpha-stock" "c:\Alpha-Stock" /E /NFL /NDL

set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"

echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%USERPROFILE%\Desktop\Alpha Stock.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "c:\Alpha-Stock\alpha-stock.exe" >> %SCRIPT%
echo oLink.IconLocation = "c:\Alpha-Stock\resources\app\dist\img\logo4.ico" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%

mkdir "c:\Alpha-Stock\data"
copy /y NUL "c:\Alpha-Stock\data\db" >NUL
copy /y NUL "c:\Alpha-Stock\data\error" >NUL

PAUSE