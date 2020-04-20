set packfolder=%appdata%\..\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\

set behavior=%packfolder%\development_behavior_packs\elevator\
if exist %behavior% (
	echo Deleting old behaviour copy
	rmdir /q /s %behavior%
)
xcopy /e behavior %behavior%

set resources=%packfolder%\development_resource_packs\elevator\
if exist %resources% (
	echo Deleting old resources copy
	rmdir /q /s %resources%
)
xcopy /e resources %resources%

pause
