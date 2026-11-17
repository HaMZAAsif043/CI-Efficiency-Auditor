Add-Type -AssemblyName System.Speech
$ErrorActionPreference='Stop'
$voiceDirectory=Join-Path (Get-Location) '.cache/voiced-demo'
New-Item -ItemType Directory -Path $voiceDirectory -Force | Out-Null
$lines=Get-Content -Raw 'marketing/linkedin/narration.json' | ConvertFrom-Json
for($index=0;$index -lt $lines.Count;$index++){
 $speaker=New-Object System.Speech.Synthesis.SpeechSynthesizer
 try {
  $speaker.SelectVoice('Microsoft Zira Desktop')
  $speaker.Rate=0
  $speaker.Volume=100
  $speaker.SetOutputToWaveFile((Join-Path $voiceDirectory ('part-'+$index+'.wav')))
  $speaker.Speak([string]$lines[$index])
 } finally {$speaker.Dispose()}
}
Write-Output 'Generated five narration segments using the installed Microsoft Zira voice.'
