$nugetContent = "content"

$mvcJs = $nugetContent + "/Scripts"

if(Test-Path $nugetContent) { Remove-Item -Recurse -Force $nugetContent }
mkdir $nugetContent
mkdir $mvcJs

copy-item -Force ../collections.* $mvcJs

.\nuget pack Package.nuspec