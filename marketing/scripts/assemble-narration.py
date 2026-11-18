import json,wave,pathlib
root=pathlib.Path('.cache/voiced-demo')
texts=json.loads(pathlib.Path('marketing/linkedin/narration.json').read_text())
parts=[];timings=[];position=0
for i,text in enumerate(texts):
 with wave.open(str(root/f'part-{i}.wav'),'rb') as f:
  params=(f.getnchannels(),f.getsampwidth(),f.getframerate())
  frames=f.readframes(f.getnframes())
 if i==0: base=params
 assert params==base
 silence=bytes(int(.3*base[2])*base[0]*base[1])
 duration=(len(frames)+len(silence))/(base[0]*base[1]*base[2])
 parts.append(frames+silence)
 timings.append({'scene':i,'start':position,'end':position+duration,'duration':duration,'text':text})
 position+=duration
with wave.open(str(root/'narration.wav'),'wb') as f:
 f.setnchannels(base[0]);f.setsampwidth(base[1]);f.setframerate(base[2]);f.writeframes(b''.join(parts))
def stamp(s):
 ms=round(s*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
srt='\n\n'.join(f'{i+1}\n{stamp(t["start"])} --> {stamp(t["end"])}\n{t["text"]}' for i,t in enumerate(timings))+'\n'
pathlib.Path('marketing/assets/linkedin-voiced-captions.srt').write_text(srt,encoding='utf-8')
(root/'timings.json').write_text(json.dumps({'duration':position,'voice':'Microsoft Zira Desktop','timings':timings},indent=2))
concat=['ffconcat version 1.0']
for i,t in enumerate(timings):
 path=(pathlib.Path('marketing/voiced')/f'scene-{i+1}.png').resolve().as_posix()
 concat.extend([f"file '{path}'",f'duration {t["duration"]:.6f}'])
concat.append(f"file '{path}'")
(root/'frames.ffconcat').write_text('\n'.join(concat)+'\n')
print(json.dumps({'duration':position,'scenes':[round(t['duration'],2) for t in timings]}))
